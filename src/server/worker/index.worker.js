import WS from '@front/lib/ws';
import WsListenItem from '@front/entitys/WsListenItem.entity';
import { isString, isArray } from '@front/utils/is';
import DtGame from '@front/dataTrans/DtGame.dt';
import { jsonrepair } from 'jsonrepair';

const _wsEntity = new WS(_wsConnectEd, _wsReceiveMessage, _wsUnConnect, _wsConnectError), // websocket实例
      _listenEdMap = new Map(), // 已连接的单条消息通道 {key:自定义id, value:WsListenItem}
      _listenMapAide = new Map() // 辅助_listenEdMap {key:websocket.type, value:Array<_listenEdMap.ids>}
;
let _useDesk = '';

function _wsConnectEd(isReConnect) {
  self.postMessage([
    'server-connectEd', // reqId
    isReConnect,
  ])
}

function _wsUnConnect(willReConnect) {
  self.postMessage([
    'server-unConnect', // reqId
    willReConnect,
  ])
}

function _wsConnectError() {
  self.postMessage([
    'server-connectError', // reqId
  ])
}

function _wsReceiveMessage(type, data) {

  if (type !== 'message') return;
  if (!data) return;

  // const _data = JSON.parse(data),
  //       _type = _data.type
  // ;
  let _data = false,
      _type = ''
  ;
  try {
    _data = JSON.parse(data);
    _type = _data.type;
  } catch {
    // _data = JSON.parse(data.replace(/(\d+)(?=\s*:)/g, '"\$1"'));
    _data = JSON.parse(jsonrepair(data));
    _type = _data.type;
  }


  // (
  //   _data.stageId && _data.stageId === _useDesk &&
  //   !['addCard', 'betOrder', 'betOrderStats', 'playerBalance'].includes(_type)
  // ) && console.log('_type', _type, _data.stageId);
  delete _data.type;

  if (!_type) return;

  _receiveStageFlow(_type, _data);

  if (_data.stageId && _useDesk && (_data.stageId === _useDesk)) {
    _receiveGameing(_type, _data);
    return;
  } else if (_type === 'playerBalance') {
    // _receiveGameing(_type, _data);

    self.postMessage([ 'self-userBalanceFlow', '', _data ])

    return;
  } else if (_type === 'bet') {
    _receiveGameing(_type, _data);
  }

  if (!_listenMapAide.has(_type)) return;

  if (_type === 'stageInfo') {
    _data.code === 0 && (
      _data.data = DtGame.stageInfo(_data.data)
    )

    self.postMessage([
      'server-receiveMessage', // reqId
      _type,
      _data,
    ])
  } else if (_type === 'stageList') {
    _data.code === 0 && (
      _data.data.list = _data.data.list.map(f=> DtGame.stageList(f))
    )

    self.postMessage([
      'server-receiveMessage', // reqId
      _type,
      _data,
    ])
  } else {
    self.postMessage([
      'server-receiveMessage', // reqId
      _type,
      _data,
    ])
  }
}

function _receiveGameing(type, data) {
  // ['readyOpenCards', 'addCard', startBet]
  // type === 'gambleSettle' && console.log('_receiveGameing', type, JSON.parse(JSON.stringify(data)));
  if (type === 'readyOpenCards') {
    self.postMessage([ `self-gameing-${_useDesk}`, type, DtGame.type.readyOpenCards(data), ]);

  } else if (type === 'startBet') {
    self.postMessage([ `self-gameing-${_useDesk}`, type, DtGame.type.startBet(data), ]);

  } else if (type === 'addCard') {
    self.postMessage([ `self-gameing-${_useDesk}`, type, DtGame.type.addCard(data), ]);

  } else if (type === 'gambleSettle') {
    self.postMessage([ `self-gameing-${_useDesk}`, type, DtGame.type.gambleSettle(data), ]);

  } else if (type === 'playerBetResult') {
    self.postMessage([ `self-gameing-${_useDesk}`, type, DtGame.type.playerBetResult(data), ]);

  } else {
    self.postMessage([ `self-gameing-${_useDesk}`, type, data, ]);
  }
}

function _receiveStageFlow(type, data) {

  // !['readyOpenCards', 'gambleSettle', 'startBet', 'addCard', 'betOrderStats', 'betOrder'].includes(type) && console.log('type', type, data.stageId ? data.stageId : '--', JSON.parse(JSON.stringify(data)));
  type === 'readyOpenCards' ? self.postMessage([ 'self-stageFlow', 'changeGameStatus', { stageId:data.stageId, gameStatus:'opening', } ]) :
  type === 'gambleSettle' ? self.postMessage([ 'self-stageFlow', 'changeGameStatus', { stageId:data.stageId, gameStatus:'settlement', } ]) :
  type === 'startBet' ? self.postMessage([ 'self-stageFlow', 'changeGameStatus', { stageId:data.stageId, gameStatus:'timing', } ]) :
  type === 'increaseBoots' ? self.postMessage([ 'self-stageFlow', 'changeGameStatus', { stageId:data.stageId, gameStatus:'shuffle', } ]) :
  data.stageState === 1 ? self.postMessage([ 'self-stageFlow', 'changeGameStatus', { stageId:data.stageId, gameStatus:'stopDesk', } ]) :
  data.stageState === 0 ? self.postMessage([ 'self-stageFlow', 'changeGameStatus', { stageId:data.stageId, gameStatus:'comeStart', } ]) :
  type === 'cancelGamble' ? self.postMessage([ 'self-stageFlow', 'changeGameStatus', { stageId:data.stageId, gameStatus:'repeal', } ]) :
  ''

  if (type === 'gambleSettle') {
    self.postMessage([
      'self-stageFlow',
      type,
      Object.assign(DtGame.type.gambleSettle(data), {
        stageId: data.stageId,
      })
    ]);

  } else if (type === 'startBet') {
    self.postMessage([
      'self-stageFlow',
      type,
      Object.assign(DtGame.type.startBet(data), {
        stageId: data.stageId,
      })
    ]);

  } else if (type === 'cancelGamble') {
    self.postMessage([
      'self-stageFlow',
      type,
      Object.assign({}, {
        bootsNum: data.bootsNum,
        paveNum: data.paveNum,
      })
    ]);

  } else if (type === 'playerBetResult') {
    self.postMessage([
      'self-stageFlow',
      type,
      Object.assign(DtGame.type.playerBetResult(data), {
        stageId: data.stageId,
      })
    ]);

  } else if (type === 'bet') {
    self.postMessage([
      'self-stageFlow',
      type,
      data
    ]);

  } else if (type === 'addCard') {
    self.postMessage([
      'self-stageFlow',
      type,
      Object.assign(DtGame.type.addCard(data), {
        stageId: data.stageId,
      })
    ]);

  } else if (type === 'logout') {
    self.postMessage([
      'self-stageFlow',
      type,
      data,
    ]);

  } else if (type === 'user_return_stage_list') {
    self.postMessage([
      'self-stageFlow',
      type,
      data,
    ]);

  } else if (type === 'withdraw_audit') {
    self.postMessage([
      'self-stageFlow',
      type,
      data,
    ]);

  } else if (type === 'privateStage') {
    self.postMessage([
      'self-stageFlow',
      type,
      data,
    ]);
  }
}

/**
 * 开启链接
 */
function listenStart(platform, url) {
  _wsEntity.startRunning(platform, url);
}

/**
 * 接收一个消息
 * 1. 消息未链接过则创建
 * 2. 已连接则共享 但仅响应到'生成的唯一标识符'
 * @param {String} type 业务逻辑中指定type
 * @param {*} data 参数
 * @return {String} 该条消息通道唯一标识符
 */
function listenAdd(listenId, type, data) {
  if (!isString(type) || !type) return;

  const _genId = listenId;

  // special
  if (type.startsWith('self-gameing-')) {
    _useDesk = Number(type.split('self-gameing-')[1]);
    return _genId;
  } else if (type === 'self-stageFlow') {
    return _genId;
  } else if (type === 'self-userBalanceFlow') {
    return _genId;
  }

  _listenEdMap.set(_genId, new WsListenItem(type, 0));
  if (_listenMapAide.has(type)) {
    _listenMapAide.get(type).push(_genId);
  } else {
    _listenMapAide.set(type, [_genId]);
  }

  _wsEntity.sendMessage(JSON.stringify({
    ...(data || {}),
    type: type,
  }));

  return _genId;
}

/**
 * 关闭一个消息接收
 * @param {String | Array<String>} ids
 */
function listenRemove(ids) {
  if (isString(ids) && !_listenEdMap.has(ids)) return;

  const _arr = isString(ids) ? [ids] : isArray(ids) ? ids : [];

  for (let i in _arr) {
    const _id = _arr[i],
          _item = _listenEdMap.get(_id)
    ;

    if (_listenMapAide.has(_item.type)) {
      const _arrAide = _listenMapAide.get(_item.type);
      _arrAide.splice(_arrAide.indexOf(_id), 1);
      _arrAide.length < 1 && (_listenMapAide.delete(_item.type))
    }

    _listenEdMap.delete(_id);
  }
}

function listenStop(disableAutoReConnect) {
  _wsEntity.closeRunning(disableAutoReConnect);
}

function wsUrlChange(url) {
  _wsEntity.changeUrl(url);
}

function _onMessage({ data:event=[] }) {
  const [ route='', reqId='' ] = event;
  if (!route || !reqId) return;

  if (route === '/listenStart') {
    const [,, platform, url] = event;
    listenStart(platform, url);
  } else if (route === '/listenAdd') {
    const [,, listenId, type, data] = event;
    listenAdd(listenId, type, data);
  } else if (route === '/listenRemove') {
    const [,, ids] = event;
    listenRemove(ids);
  } else if (route === '/listenStop') {
    const [,, disableAutoReConnect] = event;
    listenStop(disableAutoReConnect);
  } else if (route === '/wsUrlChange') {
    const [,, url] = event;
    wsUrlChange(url);
  }
}

(function() {

  // #ifdef APP-PLUS
    if (!self) {
      self = {};
    }
  // #endif
  self.onmessage = _onMessage;

})()

// #ifdef APP-PLUS
  export function appPostMessage(args) {
    _onMessage({ data:args });
  }

  export function appOnMessage(func) {
    self.postMessage = func;
  }
// #endif
