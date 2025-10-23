import { useUserStore } from '@front/stores/modules/user.store';
import i18n from '@front/config/index'   // ✅ import global i18n instance

let USER_STORE = null;
const _userStore = ()=> {
        !USER_STORE && (USER_STORE = new useUserStore());
        return USER_STORE;
      }
;

let _timerId = '',
    lastClickTime = ''
;


function getLangParam() {
  const lang = i18n.global.locale.value || 'zh';
  return lang 
}

function _startTimeOut() {
   const langParam = getLangParam();

  clearInterval(_timerId);
  _timerId = setInterval(()=> {
    const _lastClickTime = Number(lastClickTime || new Date().getTime()) * 1;
    const _nowTime = new Date().getTime();

    if (_nowTime - _lastClickTime > (1000 * /*600*/900)) {
      clearInterval(_timerId);

      /*window.$loading(true, '自动退出登录');
      _userStore().userLoginOut().then(()=> {
        // 自动退出时，清空上次登录获取的时间
        lastClickTime = ''
        window.$loading(false);
      });*/

      /*uni.showModal({
        title: '',
        content: '您已长时间未下注, 系统帮您退出到登录界面',
        showCancel: false,
        confirmText: '知道了',
        success: ()=> {
          window.$loading(true, '自动退出登录');
          _userStore().userLoginOut().then(()=> {
            // 自动退出时，清空上次登录获取的时间
            lastClickTime = ''
            window.$loading(false);
          });
        },
      })*/
      window.$loading(true, langParam == 'zh' ? '自动退出登录' : 'Automatic logout');
      _userStore().userLoginOut().then(()=> {
        // 自动退出时，清空上次登录获取的时间
        lastClickTime = ''
        window.$loading(false);
        setTimeout(()=> {
          uni.showModal({
            title: '',
            content: langParam == 'zh' ? '您已长时间未下注, 系统帮您退出到登录界面' : 'You have not bet for a long time, the system helps you log out to the login interface',
            showCancel: false,
            confirmText: '知道了',
            success: ()=> {},
          })
        }, 500);
      });

    } else if (
      (_nowTime - _lastClickTime > (1000 * (/*600*/900 - (60 * 2))))
      &&
      (_nowTime - _lastClickTime < (1000 * (/*600*/900 - ((60 * 2) - 10))))
    ) {
      window.$msg( langParam == 'zh' ?  '已经长时间未押注，两分钟后将自动退出' : "If you haven't placed any bets for a long time, you will be automatically logged out after two minutes.", 3000);

    }
  }, 10000);
}

function _mouseClick() {
  lastClickTime = new Date().getTime();
}

export function startIdle() {
  // 屏蔽 使用ws推送逻辑
  if (new Date().getTime() > 1) return;

  // #ifdef APP-PLUS
    !window.addEventListener && ( window.addEventListener = ()=> {} )
  // #endif
  window.addEventListener(
    'click',
    _mouseClick,
    true,
  );

  _startTimeOut();
  // 登录之后重新获取时间
  _mouseClick();
}

export function stopIdle() {
  // 屏蔽 使用ws推送逻辑
  if (new Date().getTime() > 1) return;

  // #ifdef APP-PLUS
    !window.removeEventListener && ( window.removeEventListener = ()=> {} )
  // #endif
  window.removeEventListener(
    'click',
    _mouseClick,
    true,
  );

  clearInterval(_timerId);
}
