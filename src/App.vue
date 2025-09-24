<script>
import { h, render,} from 'vue';
// import TheVoice from '@front/components/TheVoice.vue';
import { useUserStore } from '@front/stores/modules/user.store';
import { useGameStore } from '@front/stores/modules/game.store';
import { useOperaStore } from '@front/stores/modules/opera.store';
import { startIdle } from '@front/utils/idleState';
import { listenStart, listenStop } from '@front/utils/wsManager';
import router from '@front/routers';

let USER_STORE = null,
    GAME_STORE = null,
    OPERA_STORE = null
;
const _userStore = ()=> {
        !USER_STORE && (USER_STORE = new useUserStore());
        return USER_STORE;
      },
      _gameStore = () => {
        !GAME_STORE && (GAME_STORE = new useGameStore());
        return GAME_STORE;
      },
      _operaStore = ()=> {
        !OPERA_STORE && (OPERA_STORE = new useOperaStore());
        return OPERA_STORE;
      }
;

export default {
  onLaunch() {
    // const _son = document.createElement('div')
    // document
    //   .querySelector('.TheVoice')
    //   .insertBefore(_son,document.querySelector('.TheVoice').firstChild)
    // render(h(TheVoice), _son)

    if (!_userStore().token) {
      const _curPages = getCurrentPages();
      if (_curPages.length > 0 && _curPages[_curPages.length - 1].route !== 'views/Login/Index') {
        router.replace('/');
      }
    }

    if (_userStore().token) {
      startIdle();
    }

    // window.addEventListener('online', ()=> {
    // });

    // tempcode (app打包兼容问题)
    /*window.addEventListener('offline', ()=> {
      const _pages = getCurrentPages();
      if (_pages.length < 1 || _pages[_pages.length - 1].route === 'views/Login/Index') return;

      _gameStore().cleanGameFull();
      _operaStore().cleanOperaFull();

      uni.showLoading({ title:'退出登录' })
      _userStore().userLoginOut().then(()=> {
        uni.hideLoading();

        uni.showModal({
          content: '网络不稳定，请换线路或检查网络，重新登录',
          showCancel: false,
          confirmText: '知道了',
        })
      });
    });*/
  },
  onShow() {
    	if (uni.getSystemInfoSync().platform !== "devtools") {
				console.log = () => {}
			}
    const _pages = getCurrentPages();
    if (_pages.length > 0 && _pages[_pages.length - 1].route !== 'views/Login/Index') {
      listenStart();
    }
  },
  onHide() {
    // const _pages = getCurrentPages();
    // if (_pages.length > 0 && _pages[_pages.length - 1].route === 'views/GameTable/Index') {
      listenStop(true, true);
    // }
  },
}
</script>

<style>
</style>
