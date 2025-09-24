import { isGetString, isGetNumber, isGetFunction } from '@front/utils/is';

class WsListenItem {

  constructor(type, status, callback) {
    /**
     * String
     * websocket.type
     */
    this.type = isGetString(type, '');
    /**
     * Number
     * 状态 [0=未连接成功过, 1=连接失败, 2=已连接成功过一次]
     */
    this.status = isGetNumber(status, 0);
    /**
     * Function
     * 消息通知回调函数
     */
    this.callback = isGetFunction(callback, ()=> {});
  }

  callback() {
  }
}

export default WsListenItem;
