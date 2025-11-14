<template>
<view class="page-box li_page">
  <template v-if="_showPage">
    <view class="login-content">
      <image class="lang-switch" @tap="_bindChangeLang" :src="lang === 'zh' ? zhImg : enImg" mode="aspectFit" />
      <view class="li_form">
        <view class="li_form__fields">
          <view class="li_line">
            <image class="li_li_icon" :src="IconUser" mode="aspectFit" />
            <input
              type="number"
              maxlength="8"
              inputmode="numeric"
              @input="onInputName"
              minlength="4"
              class="li_li_input login"
              @keyup.enter="_bindLogin(false)"
              @confirm="_bindLogin(false)"
              :placeholder='t("login.account")'
              v-model="_form.name"
              :disabled="_submitLoading"
            />
          </view>

          <view class="li_line">
            <image class="li_li_icon" :src="IconLock" mode="aspectFit" />
            <input
              class="li_li_input login"
              @keyup.enter="_bindLogin(false)"
              @confirm="_bindLogin(false)"
              :placeholder='t("login.password")'
              :password="_isPassword"
              v-model="_form.pass"
              :disabled="_submitLoading"
              autocomplete="off"
            />
            <image
              :src="_isPassword ? userStore.getImageBase + 'bgs/ycmm.png' : userStore.getImageBase + 'bgs/zxmm.png'"
              v-if="_form.pass.length > 0"
              @click="_togglePassword"
              class="li_img"
            />
          </view>

          <!-- <view class="li_line">
            <image class="li_li_icon" :src="IconAuth" mode="aspectFit" />
            <input
              class="li_li_input login"
              @keyup.enter="_bindLogin(false)"
              @confirm="_bindLogin(false)"
              :placeholder="verifyPlaceholder"
              v-model="_form.verifyCode"
              :disabled="_submitLoading"
            />
          </view> -->
        </view>

        <view class="li_netword">
          <view class="li_netword__item">
            <checkbox class="li_checkbox" @click="_clickRemember" :checked="_isRemember" multiple></checkbox>
            <text class="li_span">{{ t("login.remember") }}</text>
          </view>
          <view class="li_netword__item">
            <checkbox class="li_checkbox" @click="_bindReadRuleAgr" :checked="_checkList" multiple></checkbox>
            <text class="li_span" @click="_clickPopUp">{{ t("login.aggrement") }}</text>
          </view>
        </view>

        <!-- <view class="li_netword_url">
          <template v-for="item in systemStore.netWorkList" :key="item.ident">
            <view
              :class="['li_ne_view', `_status-${item.status}`, !_autoNetWork && item.ident === systemStore.netWorkEd && '_bright']"
              :data-value="item.ident"
              @click="_bindNetWork"
            >
              <view class="li_ne_vi_point"></view>
              <view class="li_ne_vi_name">{{ item.name }}</view>
              <view class="li_ne_vi_status">({{ ({ smooth: '流畅', congestion: '拥挤' })[item.status] || '流畅' }})</view>
            </view>
          </template>
          <view
            :class="['li_ne_view', `_status-${''}`, _autoNetWork && '_bright']"
            :data-value="'autoNetWork'"
            @click="_bindNetWork"
          >
            <view class="li_ne_vi_point"></view>
            <view class="li_ne_vi_name">自动</view>
            <view class="li_ne_vi_status"></view>
          </view>

          <template v-if="systemStore.initDomainIng">
            <view :class="['li_ne_view', '_bright']" style="width: 100%;">
              <view class="li_ne_vi_point"></view>
              <view class="li_ne_vi_name">加载线路中</view>
            </view>
          </template>
        </view> -->



      </view>
      <view class="li_action">
          <button class="li_ac_button li_ac_button--gold" @tap="_bindLogin(false)">
            <span class="li_ac_bu_fill">{{ t("login.login") }}</span>
          </button>
        </view>
        <view class="li_action">
          <button class="li_ac_button li_ac_button--silver" @tap="_bindReset">
            <span class="li_ac_bu_fill">{{ t("login.reset") }}</span>
          </button>
        </view>
        <view v-if="!isSpecialAgent" class="li_action">
          <button class="li_ac_button li_ac_button--outline" @tap="_bindTryPlay">
            <span class="li_ac_bu_fill">{{ t("login.try") }}</span>
          </button>
        </view>
    </view>
  </template>
        <RulesAgreements ref="_vRulesAgreements" />

  <PageBaseImport />
  <TryItPlay ref="_vTryItPlay" />
  <ChangeLang ref="_changeLang" />
</view>
</template>
<script setup name='Login'>
import { ref, computed} from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { isSpecialAgent } from '../../utils/AgentCheck';
// import Img03 from '@front/assets/imgs/bgs/ycmm.png';
// import Img04 from '@front/assets/imgs/bgs/zxmm.png';
import zhImg from '@front/assets/cn.png';
import enImg from '@front/assets/us.png';
import IconUser from '@front/assets/login/user.png';
import IconLock from '@front/assets/login/lock.png';
import IconAuth from '@front/assets/login/auth.png';
import PageBaseImport from '@front/components/PageBaseImport.vue';
import TryItPlay from '@front/components/TryItPlay.vue';
import ChangeLang from '@front/components/ChangeLang.vue';
import RulesAgreements from '@front/components/RulesAgreements.vue';
import router from '@front/routers';
import { req_userLogin, req_userLoginByunreal, /*req_captchaCaptchaImage,*/ req_checkNetStatus } from '@front/services/login.service';
import { encryptStr } from '@front/utils/jsEncrypt';
import { md5Encrypt } from '@front/utils/tools';
import { base64Enc, base64Dec, } from '@front/utils/tools';
import { getLoginUUID, getCurrentTimeWithServer } from '@front/utils/timeline';
import { checkUpdate } from '@front/utils/hotUpdate';
import { useUserStore } from '@front/stores/modules/user.store';
import { useSystemStore } from '@front/stores/modules/system.store';
import { localSet, localGet, } from '@front/utils/localStorage';
import { listenStart } from '@front/utils/wsManager';
import { startIdle, stopIdle } from '@front/utils/idleState';
import { useI18n } from "vue-i18n";

const { t,locale } = useI18n();
	locale.value = uni.getStorageSync('l') || 'zh';
  const lang = computed(() => locale.value);
const verifyPlaceholder = computed(() => {
  const text = t('login.verifyCode');
  return text && text !== 'login.verifyCode' ? text : '请输入验证码';
});

const userStore = useUserStore(),
      systemStore = useSystemStore()
;

let _uuid = `${getLoginUUID()}`,
    _isCheckEdNetStatus = false
;

const _form = ref({
        name: '',
        pass: '',
        verifyCode: '',
      }),
      _submitLoading = ref(false),
      __tryPlayLoading = ref(false),
      _checkList = ref(true),
      _showPopup = ref(false),
      _vRulesAgreements = ref(null),
      _isRemember = ref(false),
      _isPassword = ref(true),
      _showPage = ref(false),
      // _verifyImg = ref(''),
      // _verifyLoading = ref(false),
      // _verifyLoadSuc = ref(true)
      _autoNetWork = ref(true),
      _vTryItPlay = ref(null),
      _changeLang = ref(null)
;

function _bindReset() {
  if(_submitLoading.value) return
  _form.value = {
    name: '',
    pass: '',
    verifyCode: '',
  }
}
function _bindNetWork(event) {
  const { value } = event.currentTarget.dataset;

  if (value === 'autoNetWork') {
    _autoNetWork.value = true;
    const _findNetWork = systemStore.netWorkList.find(f=> f.status === 'smooth');
    systemStore.setNetWorkEd(_findNetWork ? _findNetWork.ident : systemStore.netWorkList[0].ident);
    return;
  }

  _autoNetWork.value && (_autoNetWork.value = false);
  systemStore.setNetWorkEd(value);

  // _bindRefreshVerifyCode();
}
const onInputName = (e) => {
  let val = e.detail.value.replace(/\D/g, ''); // only digits
  _form.value.name = val.slice(0, 8); // max 8 digits
};
async function _bindLogin(isAgain=false) {
  if(_submitLoading.value) return;
  if(!_form.value.name || !_form.value.pass) return window.$msg('账号或密码不能为空');
  // if (!_form.value.verifyCode) return window.$msg('请输入验证码');
  if (!_checkList.value) return window.$msg('请先勾选用户协议与规则');

  const _nonce = 'nonce' + Math.floor(Math.random() * 99999 + 1),
        _timeStamp = getCurrentTimeWithServer()
  ;

  _submitLoading.value = true;
  uni.showLoading({ title:'登录中', mask:true, });
  const _result = await req_userLogin(
    encryptStr(_form.value.name),
    encryptStr(_form.value.pass),
    /*_form.value.verifyCode*/'',
    _uuid,
    encryptStr(_nonce),
    _timeStamp,
    md5Encrypt(`${_form.value.name}${_form.value.pass}${_nonce}${_timeStamp}`),
  )
  uni.hideLoading();
  if (_isRemember.value) {
    // 将用户信息保存到本地存储
    uni.setStorageSync('userInfo', {
      username: _form.value.name,
      // password: _form.value.pass
    });
  } else {
    // 清除保存的用户信息
    uni.removeStorageSync('userInfo');
  }
  _submitLoading.value = false;

  if (!_result.success) {
    if (!isAgain) {
      if ([10060, 10050, 10040].includes(_result.code)) {
        const _splitNetWord = (
          ['netcom', 'telecom'].includes(systemStore.netWorkEd) ? 'other' :
          ['other'].includes(systemStore.netWorkEd) ? 'telecom' :
          ''
        )
        if (!_splitNetWord) {
          // _bindRefreshVerifyCode(false);
          return window.$msg(_result.msg, 3000);
        }

        systemStore.setNetWorkEd(_splitNetWord);
        _bindLogin(true);

        return;
      } else {
        // _bindRefreshVerifyCode(false);
        return window.$msg(_result.msg, 3000);
      }
    } else {
      // _bindRefreshVerifyCode(false);
      return window.$msg(_result.msg, 3000);
    }
  }
  if (_checkList.value) {
    const _encName = base64Enc(_form.value.name)/*,
          _encPass = base64Enc(_form.value.pass)*/
    ;
    localSet('localAcc', base64Enc(JSON.stringify({ formFirst:_encName, /*formSecond:_encPass*/ })));
  }

  window.$msg(_result.msg);

  userStore.setLoginInfo({
    token: _result.data.Authorization,
    userId: _result.data.userId,
    isFirstLogin: 'firstLogin' in _result.data,
  });

  startIdle();

  _bindStart();
}

function _bindChangeLang(){
  _changeLang.value.showChange()
}
function _autoLogin(token, userId) {
  userStore.setLoginInfo({
    token: token,
    userId: userId,
    isFirstLogin: false,
  });

  startIdle();

  // _bindStart();
  window.location.href = `${window.location.origin}${window.location.pathname}#/views/Lobby/Index`;
}

async function _bindTryPlay() {
  if (new Date().getTime() > 0) {
    _vTryItPlay.value.showChange();
    return;
  }

  // EventEmitter.emit(VOICE_SEND, 'a_room');  //增加点击音效
  // _tryPlayLoading.value = true;

  if (!_form.value.verifyCode) return window.$msg('请输入验证码');

  uni.showLoading({ title:'登录中', mask:true, });
  const _result = await req_userLoginByunreal(_form.value.verifyCode, _uuid);
  // _tryPlayLoading.value = false;
  uni.hideLoading();

  if (!_result.success) {
    // _bindRefreshVerifyCode(false);
    return window.$msg(_result.msg, 3000);
  }

  window.$msg(_result.msg);

  userStore.setLoginInfo({
    token: _result.data.Authorization,
    userId: _result.data.userId,
    isFirstLogin: false,
    isPhoneBet: false,
  });

  startIdle();

  _bindStart();
}
function _togglePassword(){
   _isPassword.value = !_isPassword.value
}
function _bindReadRuleAgr(){
  _checkList.value = !_checkList.value
}
function _clickPopUp(){
  _vRulesAgreements.value.showChange()
}
function _clickRemember(){
  _isRemember.value = !_isRemember.value
}
function _bindStart() {
  listenStart();
  setTimeout(()=> {
    router.replace('/views/Lobby/Index');
  }, 1000);
}

// async function _bindRefreshVerifyCode(autoReSwitchNetLoad) {
//   if (_verifyLoading.value) return;
//   _verifyLoading.value = true;
//   _verifyLoadSuc.value = false;

//   _uuid = `${getLoginUUID()}`;

//   const _currentNetIdent = systemStore.netWorkEd;
//   const _result = await req_captchaCaptchaImage(_uuid);
//   if (!_result.success) {
//     _isCheckEdNetStatus = true;
//     _verifyLoading.value = false;
//     _verifyLoadSuc.value = false;
//     systemStore.setNetWorkStatus(_currentNetIdent, 'congestion');

//     if (autoReSwitchNetLoad) {
//       systemStore.aotuSwitchOtherNetwork();
//       _bindRefreshVerifyCode(false);
//     }
//     return;
//   }

//   _verifyImg.value = typeof _result.data === 'string' ? _result.data : '';
//   // _form.value.verifyCode = '';

//   _verifyLoading.value = false;
//   _verifyLoadSuc.value = true;

//   !_isCheckEdNetStatus && _checkNetListStatus();
// }

async function _checkNetListStatus() {
  if (_isCheckEdNetStatus) return;

  _isCheckEdNetStatus = true;

  // const _splitNetWord = (
  //   ['netcom', 'telecom'].includes(systemStore.netWorkEd) ? 'other' :
  //   ['other'].includes(systemStore.netWorkEd) ? 'telecom' :
  //   ''
  // )
  // if (!_splitNetWord) return;

  // let _timeNetStatus =
  let _count = systemStore.netWorkList.map(()=> 0);
  const _runCheck = (ident, index)=> {
    _count[index] += 1;
    req_checkNetStatus(/*`${getLoginUUID()}`, */ident)
      .then(res=> {
        if (!res.success) {
          systemStore.setNetWorkStatus(ident, 'congestion');
          if (_count[index] < 3) _runCheck(ident, index);
        } else {
          systemStore.setNetWorkStatus(ident, 'smooth');
        }
      })
  }
  systemStore.netWorkList.forEach((f,i)=> {
    setTimeout(()=> {
      _runCheck(f.ident, i);
    }, (Number(i) * 500));
  })
  // const _result = await req_checkNetStatus(/*`${getLoginUUID()}`, */_splitNetWord);
  // if (!_result.success) {
  //   systemStore.setNetWorkStatus(_splitNetWord, 'congestion');
  // }
}

onLoad((event)=> {

  _isCheckEdNetStatus = false;

  // systemStore.randomSelectNetwordEd();

  // _bindRefreshVerifyCode();

  // if (!systemStore.isDomainLoadEd) {
  //   systemStore.autoInitDomainConfig().then(()=> {
  //     // systemStore.netWorkEd && _bindRefreshVerifyCode(true);
  //    _checkNetListStatus();
  //   });
  // } else {
  //   // _bindRefreshVerifyCode(true);
  //   _checkNetListStatus();
  // }

  let _winParams = false;
  // #ifdef APP-PLUS
    _winParams = {
      get: ()=> '',
    }
  // #endif
  // #ifndef APP-PLUS
    _winParams = new URLSearchParams(window.location.search)
  // #endif
  const /*_winParams = new URLSearchParams(window.location.search),
        */_token = _winParams.get('authorization') || '',
        _userId = _winParams.get('userId') || ''
  ;

  // tempcode
  // if (_token && _userId) return _autoLogin(_token, _userId);
  if (_token && _userId) return _autoLogin(_token, _userId);

  _showPage.value = true;

  stopIdle();

  // 页面加载时检查是否记住了密码
  const userInfo = uni.getStorageSync('userInfo');
  if (userInfo) {
    _form.value.name = userInfo.username;
    // _form.value.pass = userInfo.password;
    _isRemember.value = true;
  }
})

onShow(()=> {

  setTimeout(()=> {
    checkUpdate();
  }, 500);
})
</script>
<style lang='less' src='@front/zstyles/views/Login/Index.less' scoped></style>
