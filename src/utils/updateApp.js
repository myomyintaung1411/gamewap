import Respons from '@front/entitys/respons.entity';
import {
	req_apiIndexCheckupdate
} from '@front/services/system.service';
import {
	useSystemStore
} from '@front/stores/modules/system.store';
import {
	EventEmitter,
} from '@front/eventBus/index';
import {
	PAGE_REFRESH_LOGIN,
} from '@front/eventBus/actions';

let SYSTEM_STORE = null;
const _systemStore = () => {
	!SYSTEM_STORE && (SYSTEM_STORE = new useSystemStore());
	return SYSTEM_STORE;
};

export function autoCheck(appVersion) {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (resolve) => {
		// req_apiIndexCheckupdate('32.2.8');
		// if (navigator.userAgent.toLowerCase().indexOf(' electron/') > -1) {

		// window.$loading(true, '检查版本中');
		_systemStore().updateList.push({
			name: 'step 1',
			value: ''
		});
		// window.electron.ipcRenderer.send('message', 'get-app-version');
		// window.electron.on('app-version', async (event, appVersion)=> {
		// window.$loading(false);
		_systemStore().updateList.push({
			name: 'step 2',
			value: appVersion
		});
		if (!appVersion) return resolve(Respons.setMsg('获取版本号失败'));

		// window.$loading(true, '检查更新中');
		uni.showLoading({
			title: '检查更新中'
		})
		_systemStore().updateList.push({
			name: 'step 3',
			value: ''
		});
		const _result = await req_apiIndexCheckupdate(appVersion);
		_systemStore().updateList.push({
			name: 'step 4',
			value: _result
		});
		// window.$loading(false);
		uni.hideLoading()
		if (!_result.success) return resolve(Respons.setMsg(_result.msg));
		_systemStore().newPackageUrl =
			`${_result.data.url}/leno-admin-electron-setup-${_result.data.version}.exe.zip`;
		_systemStore().updateList.push({
			name: 'check request',
			value: _result.data.url
		});
		_systemStore().setUpdateNewVersion(_result.data.version);
		if (!_result.data.url) return resolve(Respons.setData({
			hasNew: false,
		}));

		_systemStore().updatePromptList.splice(0, _systemStore().updatePromptList.length, ...(_result.data
			.content || []));

		if (_result.data.mandatory) {
			_updateAction(_result.data.url);
		} else {
			window.$confirm('有更新内容，是否立即更新', '', () => {
				// return resolve(Respons.setData({ hasNew:false, }));
				// EventEmitter.emit(PAGE_REFRESH_LOGIN);
				resolve(Respons.setData({
					hasNew: false,
				}));
			}, () => {
				resolve(Respons.setData({
					hasNew: true,
				}));
				_updateAction(_result.data.url);
			}, {
				affirm: '更新',
				cancel: '忽略',
			})
		}

		// });

		// } else {
		// return resolve(Respons.setMsg('未检测到版本号'));
		// }
	})
}

function _updateAction(url) {
	window.electron.on('message', (event, args) => {
		_systemStore().updateList.push({
			name: 'message',
			value: args
		});
		if (args && args.toString().startsWith('Error')) {
			// window.$dialogue('下载失败', args);
			window.$confirm('下载失败', args, () => {
				EventEmitter.emit(PAGE_REFRESH_LOGIN);
			}, () => {
				window.electron.ipcRenderer.send('message',
					`downloadPackage-${_systemStore().newPackageUrl}`);
			}, {
				affirm: '去下载最新包',
				cancel: '忽略更新',
			})
		}
	});
	window.electron.on('downloadProgress', (event, args) => {
		// _systemStore().updateList.push({ name:`downloadProgress ${typeof args}`, value:args });
		// window.$loading(false);
		_systemStore().setUpdateProcess(args.percent);
		// window.$loading(true, '下载更新中');
	});
	window.electron.on('isUpdateNow', (event, args) => {
		_systemStore().updateList.push({
			name: 'isUpdateNow',
			value: args
		});
		// window.$loading(false);
		window.$dialogue('下载完成, 请退出应用以安装', '', () => {
			window.electron.ipcRenderer.send('message', 'quit-and-updateNow');
		}, '退出并安装', {
			showClose: false,
		})
	});

	// window.$dialogue('请更新最新应用', '', ()=> {
	//   window.electron.ipcRenderer.send('message', `checkUpdate-${_result.data.url}/`);
	//   window.$loading(true, '请求更新中');
	// }, '立即更新', { showClose:false, })
	window.electron.ipcRenderer.send('message', `checkUpdate-${url}/`);
	// window.$loading(true, '请求更新中');
	return;
}