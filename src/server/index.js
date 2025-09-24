import WK from './worker/index';
import { generateID } from '@front/utils/tools';
import { useDeskStore } from '@front/stores/modules/desk.store';
import { useLogStore } from '@front/stores/modules/log.store';

let DESK_STORE = null,
    LOG_STORE = null
;
const _deskStore = ()=> {
        !DESK_STORE && (DESK_STORE = new useDeskStore());
        return DESK_STORE;
      },
      _logStore = ()=> {
        !LOG_STORE && (LOG_STORE = new useLogStore());
        return LOG_STORE;
      }
;

let map = new Map();

WK.onmessage = e=> {
  const [ reqId, type, data ] = e.data;
  _logStore().addLog('', `server.index onmessage reqId-${reqId} type-${type}`);
  if (['server-receiveMessage', 'server-connectEd', 'server-unConnect', 'server-connectError'].includes(reqId)) {
    map.get(reqId)(type, data);
  } else if (reqId === `self-gameing-${_deskStore().useDesk}`) {
    map.get('server-receiveMessage')(reqId, {type, data});
  } else if (reqId === 'self-stageFlow') {
    map.get('server-receiveMessage')(reqId, {type, data});
  } else if (reqId === 'self-userBalanceFlow') {
    map.get('server-receiveMessage')(reqId, {type, data});
  }
}

const PM = {
  connectEd(reqId, callback) {
    map.set(reqId, callback);
  },
  unConnect(reqId, callback) {
    map.set(reqId, callback);
  },
  receiveMessage(reqId, callback) {
    map.set(reqId, callback);
  },
  listenStart(reqId, platform, url) {
    WK.postMessage(['/listenStart', reqId, platform, url]);
  },
  listenAdd(reqId, listenId, type, data) {
    _logStore().addLog('', `server.index listenAdd send ${reqId}-${listenId}-${type}`);
    WK.postMessage(['/listenAdd', reqId, listenId, type, data]);

    if (reqId === `self-gameing-${_deskStore().useDesk}`) {
      map.set(reqId, map.get('server-receiveMessage'));
    } else if (reqId === 'self-stageFlow') {
      map.set(reqId, map.get('server-receiveMessage'));
    } else if (reqId === 'self-userBalanceFlow') {
      map.set(reqId, map.get('server-receiveMessage'));
    }
  },
  listenRemove(reqId, ids) {
    WK.postMessage(['/listenRemove', reqId, ids]);
  },
  listenStop(reqId, disableAutoReConnect) {
    WK.postMessage(['/listenStop', reqId, disableAutoReConnect]);
  },
  wsUrlChange(reqId, url) {
    WK.postMessage(['/wsUrlChange', reqId, url]);
  },
}

const Route = {
  /**
   * 接收连接成功通知
   * @returns 
   */
  '/ws/connectEd': async function(callback) {
    PM.connectEd('server-connectEd', callback);
  },
  /**
   * 断开连接
   * @returns 
   */
  '/ws/unConnect': async function(callback) {
    PM.connectEd('server-unConnect', callback);
  },
  /**
   * 连接异常
   * @returns 
   */
  '/ws/connectError': async function(callback) {
    PM.connectEd('server-connectError', callback);
  },
  /**
   * 接收消息通知
   * @returns 
   */
  '/ws/receiveMessage': async function(callback) {
    PM.receiveMessage('server-receiveMessage', callback);
  },
  /**
   * 建立连接
   * @returns 
   */
  '/ws/listenStart': async function(url) {
    // #ifdef APP-PLUS
      PM.listenStart(generateID('server'), 'APP-PLUS', url);
    // #endif
    // #ifndef APP-PLUS
      PM.listenStart(generateID('server'), 'H5', url);
    // #endif
  },
  /**
   * 发送消息
   * @returns 
   */
  '/ws/listenAdd': async function(listenId, type, data) {
    PM.listenAdd(generateID('server'), listenId, type, data);
  },
  /**
   * 关闭消息
   * @returns 
   */
  '/ws/listenRemove': async function(ids) {
    PM.listenRemove(generateID('server'), ids);
  },
  /**
   * 停止连接
   * @returns 
   */
  '/ws/listenStop': async function(disableAutoReConnect) {
    PM.listenStop(generateID('server'), disableAutoReConnect);
  },
  /**
   * 切换连接地址
   * @returns 
   */
  '/ws/wsUrlChange': async function(url) {
    PM.wsUrlChange(generateID('server'), url);
  },
}

export default {
  $route: Route,
}
