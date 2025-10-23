import WsListenItem from '@front/entitys/WsListenItem.entity';
import { useUserStore } from '@front/stores/modules/user.store';
import { useSystemStore } from '@front/stores/modules/system.store';
import { useLogStore } from '@front/stores/modules/log.store';
import { generateID } from '@front/utils/tools';
import { isString, isArray } from '@front/utils/is';
import DataServer from '@front/server/index';
import router from '@front/routers';
import { EventEmitter, } from '@front/eventBus/index';
import { VIDEO_RECONNECT_REFRESH, } from '@front/eventBus/actions';
import i18n from '@front/config/index'   // ✅ import global i18n instance

function getLangParam() {
  const lang = i18n.global.locale.value || 'zh';
  return lang === 'zh' ? 'zh_CN' : 'en_US';
}
let SYSTEM_STORE = null,
    LOG_STORE = null
;
const _systemStore = ()=> {
        !SYSTEM_STORE && (SYSTEM_STORE = new useSystemStore());
        return SYSTEM_STORE;
      },
      _logStore = ()=> {
        !LOG_STORE && (LOG_STORE = new useLogStore());
        return LOG_STORE;
      }
;

const _listenEdMap = new Map(), // 已连接的单条消息通道 {key:自定义id, value:WsListenItem}
      _listenMapAide = new Map() // 辅助_listenEdMap {key:websocket.type, value:Array<_listenEdMap.ids>}
;

let _isConnectEd = false,
    _isConnectReqIng = false,
    _wsReConnTry = 1,
    _stopIsManMade = false,
    _lookLogOut = false
;

DataServer.$route['/ws/connectEd'](_wsConnectEd);
DataServer.$route['/ws/receiveMessage'](_wsReceiveMessage);
DataServer.$route['/ws/unConnect'](_wsUnConnect);
DataServer.$route['/ws/connectError'](_wsConnectError);

function _wsConnectEd(isReConnect) {
  _wsReConnTry = 1;
  _logStore().addLog('', `wsManager wsConnectEd`);
  // console.log('_wsConnectEd');
  _isConnectEd = true;
  _isConnectReqIng = false;

  // EventEmitter.emit(WS_RE_CONNECT_ING, 'out');
  window.$closeWsConnectStatus && window.$closeWsConnectStatus();
  if (isReConnect) {
    window.$msg('重连成功', 1500);
    EventEmitter.emit(VIDEO_RECONNECT_REFRESH, ()=> {});
  }
}

function _wsUnConnect(willReConnect) {
   const langParam = getLangParam();
  if (_stopIsManMade) return;

  if (willReConnect) {
    // EventEmitter.emit(WS_RE_CONNECT_ING, 'in');
    window.$showWsConnectStatus && window.$showWsConnectStatus();

    _systemStore().aotuSwitchOtherNetwork();
    //  DataServer.$route['/ws/wsUrlChange'](`${_systemStore().getUrlWs}?${useUserStore().getUserId}`);
     const wsUrl = `wss://${window.location.host}${_systemStore().getUrlWs}?${useUserStore().getUserId}`;
      DataServer.$route['/ws/wsUrlChange'](wsUrl);
    return _systemStore().setWsStatus('reloading');
  }
  window.$closeWsConnectStatus && window.$closeWsConnectStatus();
  // EventEmitter.emit(WS_RE_CONNECT_ING, 'out');

  const _userStore = useUserStore();
  _logStore().addLog('', `wsManager wsUnConnect token-${!!_userStore.token} _isConnectEd-${_isConnectEd}`);
  if (!_userStore.token) return;

  /*if (!_isConnectEd) {
    router.replace('/');
  }*/

  _isConnectEd = false;
  _isConnectReqIng = false;
  router.replace('/');

  // window.$loading(true, '退出登录');
  // _userStore.userLoginOut().then(()=> {
  //   window.$loading(false);
  // });
}

function _wsConnectError() {
  _logStore().addLog('', `wsManager wsConnectError ${_wsReConnTry}`);
  // if (_wsReConnTry > 0) {
  //   _logStore().addLog('', `wsManager wsConnectError try`);
  //   _wsReConnTry -= 1;
  //   listenStart();
  // }

  /*const _userStore = useUserStore();
  if (!_userStore.token) return;

  if (!_isConnectEd) {
    router.replace('/');
  }

  _isConnectEd = false;
  _isConnectReqIng = false;*/
}

function _wsReceiveMessage(type, data) {
  if (!_listenMapAide.has(type)) {
    if (data.type === 'logout' && !_lookLogOut) {
      _lookLogOut = true;
      listenStop(false, true);
      router.replace('/');
      data.data.msg && uni.showModal({
        content: data.data.msg,
        showCancel: false,
        confirmText: '知道了',
      })
      _lookLogOut = false;
    }
    return;
  }

  const _ids = _listenMapAide.get(type);
  _ids.map(f=> {
    _listenEdMap.get(f).callback(data);
  })
}

/**
 * 开启链接
 */
export async function listenStart() {
   const langParam = getLangParam();
  _stopIsManMade = false;

  _logStore().addLog('', `wsManager listenStart _isConnectReqIng-${_isConnectReqIng} _isConnectEd-${_isConnectEd}`);
  if (_isConnectReqIng) return;
  if (_isConnectEd) return;

  _isConnectReqIng = true;

  // DataServer.$route['/ws/listenStart'](`${import.meta.env.VITE_WS_URL}?${useUserStore().getUserId}`);

  if (!_systemStore().isDomainLoadEd) {
    await _systemStore().autoInitDomainConfig();
  }

  _systemStore().setWsStatus('loading');
  _logStore().addLog('', `wsManager listenStart send a-${_systemStore().getUrlWs} b-${useUserStore().getUserId}`);
  if (!useUserStore().getUserId) {
    router.replace('/');
   }
     const wsUrl = `wss://${window.location.host}${_systemStore().getUrlWs}?${useUserStore().getUserId}`;
     DataServer.$route['/ws/listenStart'](wsUrl);
  //  DataServer.$route['/ws/listenStart'](`${_systemStore().getUrlWs}?${useUserStore().getUserId}`);
}

/**
 * 等待已链接通知
 * 注: 待优化
 */
export function listenConnectEd(callback) {
  if (_isConnectEd) return callback();
  let _count = 0;
  const _timerId = setInterval(()=> {
    // if (_count >= 20) return clearInterval(_timerId);
    if (_count >= 60) return clearInterval(_timerId);
    if (!_isConnectEd && !_isConnectReqIng) return clearInterval(_timerId);
    _count += 1;

    if (_isConnectEd) {
      clearInterval(_timerId);
      return callback();
    }
  }, 500);
}

/**
 * 接收一个消息
 * 1. 消息未链接过则创建
 * 2. 已连接则共享 但仅响应到'生成的唯一标识符'
 * @param {String} type 业务逻辑中指定type
 * @param {*} data 参数
 * @return {String} 该条消息通道唯一标识符
 */
export function listenAdd(type, data, callback) {
  _logStore().addLog('', `wsManager listenAdd type-${type} data-${data}`);
  if (!isString(type) || !type) return;
  const _genId = generateID('listen');

  _listenEdMap.set(_genId, new WsListenItem(type, 0, callback));
  if (_listenMapAide.has(type)) {
    _listenMapAide.get(type).push(_genId);
  } else {
    _listenMapAide.set(type, [_genId]);
  }

  _logStore().addLog('', `wsManager listenAdd send id${_genId}`);
  DataServer.$route['/ws/listenAdd'](_genId, type, data);

  return _genId;
}

/**
 * 关闭一个消息接收
 * @param {String | Array<String>} ids
 */
export function listenRemove(ids) {
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

  DataServer.$route['/ws/listenRemove'](ids);
}

export function listenStop(isManMade=false, disableAutoReConnect=false) {
  _stopIsManMade = !!isManMade;
  DataServer.$route['/ws/listenStop'](disableAutoReConnect);
  _isConnectEd = false;
  _isConnectReqIng = false;
}
