/***
use

window.$msg('');
*/

import { createApp, } from 'vue';
import { showFullScreenLoading, tryHideFullScreenLoading } from '@front/lib/serviceLoading';
import TheMsg from '@front/components/TheMsg.vue';
import TheMsgWithGame from '@front/components/TheMsgWithGame.vue';

if (!window) window = {};

let _gametableBody = false;

window.$loading = (show, title) => {
	if (!show) return tryHideFullScreenLoading();
	showFullScreenLoading(title);
}

window.$msg = (content, duration = 1500) => {
	/*const _newDiv = document.createElement('div');

	_newDiv.id = `$msg-${Date.now()}`;

	document.body.appendChild(_newDiv);

	createApp(TheMsg, {
		content: content
	}).mount(_newDiv);

	setTimeout(() => {
		document.body.removeChild(_newDiv);
	}, duration || 3000);*/
}

window.$msgWithGame = (content, duration = 1500) => {
	/*// if (!_gametableBody) _gametableBody = document.getElementById('gametable-body');
	_gametableBody = document.getElementById('gametable-body');

	const _newDiv = document.createElement('div');

	_newDiv.id = `$msgWithGame-${Date.now()}`;

	// document.body.appendChild(_newDiv);
	_gametableBody.appendChild(_newDiv);

	createApp(TheMsgWithGame, {
		content: content
	}).mount(_newDiv);

	setTimeout(() => {
		_gametableBody.removeChild(_newDiv);
	}, duration || 3000);*/
}

window.$dialogue = (title = '', content = '', success = false, btn = '', options = {}) => {
	// eslint-disable-next-line no-undef
	ElMessageBox.alert(
		content,
		title, {
			...options,
			confirmButtonText: btn || '知道了',
			callback: function() {
				typeof success === 'function' && success();
			},
		},
	)
}

window.$confirm = (title = '', content = '', cancel = false, success = false, btn = '', options = {}) => {
	// eslint-disable-next-line no-undef
	ElMessageBox.confirm(
		content,
		title, {
			...options,
			customClass: 'confirm-model',
			cancelButtonText: btn && btn.cancel ? btn.cancel : '取消',
			confirmButtonText: btn && btn.affirm ? btn.affirm : '确定',
			callback: function(res) {
				if (res === 'confirm') return typeof success === 'function' && success();
				if (res === 'cancel') return typeof cancel === 'function' && cancel();
			},
		},
	)
}