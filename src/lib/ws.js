import { base64WsEnc, base64WsDec, binaryWsEncrypt, binaryWsDecrypt } from '@front/utils/tools';

export default class WS {
	constructor(connectCallback, receiveMessageCallback, unConnectCallback, connectErrCallback) {
		this.PLATFORM = '';
		this.SEND_TIME_OBJ = null; // 发送信息给服务端的重复调用的时间定时器
		this.RECONNECT_TIME_OBJ = null; // 尝试链接的宏观定时器
		this.RECONNECT_TIME_DISTANCE = 5000; // 重连间隔，单位：毫秒
		this.MAX_RECONNECT_ATTEMPTS = 1; // 最大重连尝试次数
		this.RECONNECT_ATTEMPTS = 0; // 当前重连尝试次数
		this.HEARTBEAT_TIME = (1000 * 50); // 心跳定时

		this.socket = null; // WebSocket 对象
		this.url = ''; // WebSocket 连接地址
		this.connectCallback = typeof connectCallback === 'function' ? connectCallback : () => {}; // 连接成功回调
		this.receiveMessageCallback = receiveMessageCallback; // 接收消息回调函数
		this.unConnectCallback = unConnectCallback;
		this.connectErrCallback = connectErrCallback;
		this.heartBeatTimerId = ''; // 心跳定时器id

		this.lastConnectSucTime = NaN;
	}

	/**
	 * 开启WebSocket
	 * platform=[APP-PLUS, H5]
	 */
	async startRunning(platform, url) {
		this.PLATFORM = platform || 'H5';

		this._cleanTimer(true);
		this.url = url;
		this.RECONNECT_ATTEMPTS = 0;

		if (this.url) {
			// 连接WebSocket
			this._connectWebSocket();
		} else {
			console.error('Error WsManager start: miss url');
		}
	}

	/**
	 * 关闭连接
	 */
	closeRunning(disableAutoReConnect=false) {
		disableAutoReConnect && (this.RECONNECT_ATTEMPTS = this.MAX_RECONNECT_ATTEMPTS)

		this.socket.close();

		// close 有延迟 手动立即清除前端socket
    disableAutoReConnect && this._immediateCleanSocket();
    this.unConnectCallback && this.unConnectCallback(this.RECONNECT_ATTEMPTS < this.MAX_RECONNECT_ATTEMPTS);

		// 清除定时器 重置重连次数
		this._cleanTimer(disableAutoReConnect ? false : true);
		this._stopHeadBeat();
	}

	changeUrl(url) {
    this.url = url;
  }

	/**
	 * 发送消息
	 * @param {String} message 消息内容
	 */
	sendMessage(message) {
		if (this.PLATFORM === 'APP-PLUS') {
			// this.socket.send({ data:message });
			this.socket.send({ data:binaryWsEncrypt(base64WsEnc(message)) })
		} else if (this.PLATFORM === 'H5') {
			if (this.socket.readyState === WebSocket.OPEN) {
				// this.socket.send(message);
				typeof message === 'string'
	        ? this.socket.send(binaryWsEncrypt(base64WsEnc(message)))
	        : console.error(`Error WsManager sendMessage: message type error ${typeof message}`);
			} else {
				console.error('Error WsManager sendMessage: WebSocket connection is not open. Unable to send message.');
			}
		} else {
			throw new Error(`Error sendMessage: PLATFORM not match ${this.PLATFORM}`);

		}
	}

	_immediateCleanSocket() {
    if (!this.socket) return;

    this.socket.onopen = ()=> {};
    this.socket.onmessage = ()=> {};
    this.socket.onclose = ()=> {};
    this.socket.onerror = ()=> {};
    this.socket = null;
  }

	/**
	 * 创建WebSocket连接
	 */
	_connectWebSocket() {
		// 创建 WebSocket 对象
		if (this.PLATFORM === 'APP-PLUS') {
			this.socket = uni.connectSocket({
				url: this.url,
				success:()=> {}
			});

		} else if (this.PLATFORM === 'H5') {
			this.socket = new WebSocket(this.url); // WebSocket连接实例

		} else {
			throw new Error(`Error _connectWebSocket: PLATFORM not match ${this.PLATFORM}`);

		}

		if (this.PLATFORM === 'APP-PLUS') {
			this.socket.onOpen(()=> {
				this._skOnOpen();
			})
			this.socket.onClose(()=> {
				this._skOnClose();
			})
			this.socket.onError((event)=> {
			})
			this.socket.onMessage((event)=> {
				this._receiveMessage(event);
			})

		} else if (this.PLATFORM === 'H5') {
			// 处理连接打开事件
			this.socket.onopen = event => {
				this._skOnOpen();
			}

			// 处理接收到消息事件
			this.socket.onmessage = event => {
				this._receiveMessage(event);
			}

			// 处理连接关闭事件
			this.socket.onclose = event => {
				this._skOnClose();
			}

			// 处理 WebSocket 错误事件
			this.socket.onerror = event => {
				this._skOnError();
				console.error('Error WsManager onerror:', event);
			}

		}
	}

	_skOnOpen() {
		const _lastConnectSucTime = this.lastConnectSucTime;
    const _currentConnectSucTime = new Date().getTime();
    if (
      !isNaN(_lastConnectSucTime) &&
      (parseInt( (_currentConnectSucTime / 1000) - (_lastConnectSucTime / 1000) ) > (10 * 3))
    ) {
      this.RECONNECT_ATTEMPTS = 0;
    }
    this.lastConnectSucTime = _currentConnectSucTime;

		this.connectCallback(this.RECONNECT_ATTEMPTS > 0);
		// 给服务端发送第一条反馈信息
		this._startSendServe();
		this._startHeadBeat();
	}

	_skOnClose() {
		// 清除定时器
		this._cleanTimer(false);
		this.unConnectCallback && this.unConnectCallback(this.RECONNECT_ATTEMPTS < this.MAX_RECONNECT_ATTEMPTS);
		this._stopHeadBeat();
		// 尝试重连
		if (this.RECONNECT_ATTEMPTS < this.MAX_RECONNECT_ATTEMPTS) {
		  this.RECONNECT_ATTEMPTS += 1;

		  this.RECONNECT_TIME_OBJ = setTimeout(()=> {
		    this._connectWebSocket();
		  }, this.RECONNECT_TIME_DISTANCE)
		} else {
		  // 重置重连次数
		  this.RECONNECT_ATTEMPTS = 0;
		  console.error('Error WsManager erros: Max reconnect attempts reached. Unable to reconnect.');
		}
	}

	_skOnError() {
		// 清除定时器
		// this._cleanTimer(false);
		// this.connectErrCallback && this.connectErrCallback();
		// this._stopHeadBeat();
	}

	_startHeadBeat() {
		this.heartBeatTimerId = setInterval(() => {
			this.sendMessage(JSON.stringify({
				type: 'ping'
			}))
		}, this.HEARTBEAT_TIME);
	}

	_stopHeadBeat() {
		clearInterval(this.heartBeatTimerId);
	}

	/**
	 * 发送给服务器的第一条信息，测试链接打开
	 */
	_startSendServe() {
		// this.sendMessage(new Date().getTime().toString());
		this.sendMessage(JSON.stringify({
      type: 'ping'
    }));
	}

	/**
	 * 接收到消息
	 */
	_receiveMessage(event) {
		// 根据业务自行处理
		// #ifdef APP-PLUS
			// this.receiveMessageCallback && this.receiveMessageCallback('message', event.data);
			if (this.receiveMessageCallback) {
	      // this.receiveMessageCallback('message', base64WsDec(event.data));
	      binaryWsDecrypt(event.data).then((res)=> {
					this.receiveMessageCallback('message', base64WsDec(res));
				})
	    }
		// #endif
		// #ifndef APP-PLUS
			// this.receiveMessageCallback && this.receiveMessageCallback(event.type, event.data);
			if (this.receiveMessageCallback) {
	      // this.receiveMessageCallback('message', base64WsDec(event.data));
	      binaryWsDecrypt(event.data).then((res)=> {
					this.receiveMessageCallback('message', base64WsDec(res));
				})
	    }
		// #endif
	}

	/**
	 * 
	 */
	_cleanTimer(reset) {
		clearTimeout(this.SEND_TIME_OBJ);
		clearTimeout(this.RECONNECT_TIME_OBJ);

		reset && (this.RECONNECT_ATTEMPTS = 0);
	}
}