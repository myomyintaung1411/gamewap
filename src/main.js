import 'virtual:svg-icons-register';
import { createSSRApp ,watch} from 'vue';
import './index.less';
import App from './App.vue';
import lazyPlugin from 'vue3-lazy';
import pinia from '@front/stores/index.store';
import SvgIcon from '@front/components/SvgIcon.vue';
import '@front/utils/FeedBack.js';
import i18n from './config/index'
import { useOperaStore } from '@front/stores/modules/opera.store';

// import vConsole from 'vconsole';
// new vConsole();

export function createApp() {
	const app = createSSRApp(App);

	app.component('SvgIcon', SvgIcon);
	  app.use(i18n);
	app.use(lazyPlugin, {});

	app.use(pinia);
	// ⚡ Setup watcher **after Pinia is installed**
	const operaStore = useOperaStore();

	watch(
		() => i18n.global.locale.value,
		(newLang) => {
		operaStore.updateChipIcons(newLang);
		},
		{ immediate: true }
	);

	return {
		app,
	};
}
