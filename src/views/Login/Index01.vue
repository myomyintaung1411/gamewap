<template>
<view class='page-box'>

  <template v-if='_showPage'>

    <view class='li_ph01'></view>

    <view class='li_logo'>
      <image class='img-normal' src='@front/assets/imgs/logo-short.png' />
    </view>

    <view class='li_form'>
      <view class='li_fo_line'>
        <view class='li_fo_li_prefix'><SvgIcon class='li_fo_li_pr_fill' name='login-line-name' /></view>
        <view class='li_fo_li_content'>
          <input class='li_fo_li_co_input' placeholder='请输入账号' v-model='_formData.userName' :disabled='_submitLoading' @confirm='_bindLogin(false)' />
          <template v-if='_formData.userName'>
            <view class='li_fo_li_co_clean' @tap='()=> _formData.userName = ""'><SvgIcon class='li_fo_li_co_cl_fill' name='login-line-clear' /></view>
          </template>
        </view>
      </view>

      <view class='li_fo_line'>
        <view class='li_fo_li_prefix'><SvgIcon class='li_fo_li_pr_fill' name='login-line-name' /></view>
        <view class='li_fo_li_content'>
          <input class='li_fo_li_co_input' placeholder='请输入密码' :password='!_showUserPass' v-model='_formData.userPass' :disabled='_submitLoading' @confirm='_bindLogin(false)' />
          <template v-if='_formData.userPass'>
            <view class='li_fo_li_co_clean' @tap='()=> _formData.userPass = ""'><SvgIcon class='li_fo_li_co_cl_fill' name='login-line-clear' /></view>
          </template>
        </view>
        <view class='li_fo_li_suffix' @tap='()=> _showUserPass = !_showUserPass'><SvgIcon class='li_fo_li_su_fill' :name='_showUserPass ? "login-line-pass-show" : "login-line-pass-hide"' /></view>
      </view>

      <view class='li_fo_line'>
        <view class='li_fo_li_prefix'><SvgIcon class='li_fo_li_pr_fill' name='login-line-verify-code' /></view>
        <view class='li_fo_li_content'>
          <input class='li_fo_li_co_input' placeholder='验证码' v-model='_formData.verifyCode' :disabled='_submitLoading' @confirm='_bindLogin(false)' />
          <template v-if='_formData.verifyCode'>
            <view class='li_fo_li_co_clean' @tap='()=> _formData.verifyCode = ""'><SvgIcon class='li_fo_li_co_cl_fill' name='login-line-clear' /></view>
          </template>
        </view>
        <view class='li_fo_li_code' @tap='_bindRefreshVerifyCode(false)'>
          <image class='img-normal' :src='_verifyImg' />
        </view>
        <div :class='["li_fo_li_refresh", _verifyLoading && "_loading"]' @tap='_bindRefreshVerifyCode(false)'>
          <SvgIcon class='li_fo_li_re_fill' name='verify-code-refresh' size='20' />
        </div>
      </view>
    </view>

    <view class='li_check'>
      <view class='li_ch_view' data-ident='remember' @tap='_bindCheckAciton'>
        <view :class='["li_ch_vi_point", _checkAction.rememberAccount && "_bright"]'></view>
        <view class='li_ch_vi_name'>记住账号</view>
      </view>

      <view class='li_ch_view' data-ident='agreements' @tap='_bindCheckAciton'>
        <view :class='["li_ch_vi_point", _checkAction.readEdAgreements && "_bright"]'></view>
        <view class='li_ch_vi_name'>用户协议与规则</view>
      </view>
    </view>

    <view class='li_net'>
      <template v-for='item in systemStore.netWorkList' :key='item.ident'>
        <view
          class='li_ne_view'
          :data-value='item.ident' @tap='_bindNetWork'
        >
          <view class='li_ne_vi_content'>
            <view :class='["li_ne_vi_co_point", item.ident === systemStore.netWorkEd && "_bright"]'></view>
            <view class='li_ne_vi_co_name'>{{item.name}}</view>
          </view>
          <view class='li_ne_vi_process'>(流畅)</view>
        </view>
      </template>

      <template v-if='systemStore.initDomainIng'>
        <view></view>
        <view class='li_ne_view'>
          <view class='li_ne_vi_content'>
            <view class='li_ne_vi_co_point _bright'></view>
            <view class='li_ne_vi_co_name'>加载线路中</view>
          </view>
        </view>
        <view></view>
      </template>
    </view>

    <view class='li_ph02'></view>

    <view class='li_button' data-ident='login' @tap='_bindAction'>
      <view class='li_bu_text'>登 录</view>
    </view>

    <view class='li_button' data-ident='reset' @tap='_bindAction'>
      <view class='li_bu_text'>重 置</view>
    </view>

    <view class='li_button' data-ident='tryPlay' @tap='_bindAction'>
      <view class='li_bu_text'>试 玩</view>
    </view>

    <view class='li_ph03'></view>

  </template>

  <PageBaseImport />

</view>
</template>
<script setup name='Login'>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import PageBaseImport from '@front/components/PageBaseImport.vue';
import { req_userLogin, req_userLoginByunreal, req_captchaCaptchaImage } from '@front/services/login.service';
import { useUserStore } from '@front/stores/modules/user.store';
import { useSystemStore } from '@front/stores/modules/system.store';
import { encryptStr } from '@front/utils/jsEncrypt';
import { md5Encrypt } from '@front/utils/tools';
import { base64Enc, base64Dec, } from '@front/utils/tools';
import { getLoginUUID, getCurrentTimeWithServer } from '@front/utils/timeline';
import { startIdle, stopIdle } from '@front/utils/idleState';
import { listenStart } from '@front/utils/wsManager';
import { localSet, localGet, } from '@front/utils/localStorage';
import router from '@front/routers';

const userStore = useUserStore(),
      systemStore = useSystemStore()
;

let _uuid = '';

const _showPage = ref(false),
      _formData = ref({
        userName: '',
        userPass: '',
        verifyCode: '',
      }),
      _showUserPass = ref(false),
      _submitLoading = ref(false),
      _checkAction = ref({
        rememberAccount: false,
        readEdAgreements: true,
      }),
      _verifyImg = ref(''),
      _verifyLoading = ref(false),
      _verifyLoadSuc = ref(true)
;

function _bindNetWork(event) {
  const { value } = event.currentTarget.dataset;
  systemStore.setNetWorkEd(value);
}

function _bindCheckAciton(event) {
  const { ident } = event.currentTarget.dataset;
  if (ident === 'remember') {
    _checkAction.value.rememberAccount = !_checkAction.value.rememberAccount;
  } else if (ident === 'agreements') {
    _checkAction.value.readEdAgreements = !_checkAction.value.readEdAgreements;
  }
}

async function _bindRefreshVerifyCode(autoReSwitchNetLoad) {
  if (_verifyLoading.value) return;

  _verifyImg.value = '';
  _verifyLoading.value = true;
  _verifyLoadSuc.value = false;

  _uuid = `${getLoginUUID()}`;

  const _result = await req_captchaCaptchaImage(_uuid);
  if (!_result.success) {
    _verifyLoading.value = false;
    _verifyLoadSuc.value = false;

    if (autoReSwitchNetLoad) {
      systemStore.aotuSwitchOtherNetwork();
      _bindRefreshVerifyCode(false);
    }
    return;
  }

  _verifyImg.value = typeof _result.data === 'string' ? _result.data : '';
  _formData.value.verifyCode = '';

  _verifyLoading.value = false;
  _verifyLoadSuc.value = true;
}

function _bindAction(event) {
  const { ident } = event.currentTarget.dataset;

  if (ident === 'login') {
    _bindLogin();

  } else if (ident === 'reset') {
    _formData.value.userName = '';
    _formData.value.userPass = '';
    _formData.value.verifyCode = '';

  } else if (ident === 'tryPlay') {
    _bindTryPlay();

  }
}

async function _bindLogin(isAgain=false) {
  if(_submitLoading.value) return;
  if(!_formData.value.userName || !_formData.value.userPass) return window.$msg('账号或密码不能为空');
  if (!_formData.value.verifyCode) return window.$msg('请输入验证码');
  if (!_checkAction.value.readEdAgreements) return window.$msg('请先勾选用户协议与规则');

  const _nonce = 'nonce' + Math.floor(Math.random() * 99999 + 1),
        _timeStamp = getCurrentTimeWithServer()
  ;

  _submitLoading.value = true;
  uni.showLoading({ title:'登录中', mask:true, });
  const _result = await req_userLogin(
    encryptStr(_formData.value.userName),
    encryptStr(_formData.value.userPass),
    _formData.value.verifyCode,
    _uuid,
    encryptStr(_nonce),
    _timeStamp,
    md5Encrypt(`${_formData.value.userName}${_formData.value.userPass}${_nonce}${_timeStamp}`),
  )
  uni.hideLoading();
  if (_checkAction.value.rememberAccount) {
    // 将用户信息保存到本地存储
    uni.setStorageSync('userInfo', {
      username: _formData.value.userName,
    });
  } else {
    // 清除保存的用户信息
    uni.removeStorageSync('userInfo');
  }
  _submitLoading.value = false;

  if (!_result.success) {

    if (_result.code === 1003) {
      _bindRefreshVerifyCode(false);
      window.$msg(_result.msg, 3000);
      return;
    }

    if (!isAgain) {
      if ([10060, 10050, 10040].includes(_result.code)) {
        const _splitNetWord = (
          ['netcom', 'telecom'].includes(systemStore.netWorkEd) ? 'other' :
          ['other'].includes(systemStore.netWorkEd) ? 'telecom' :
          ''
        )
        if (!_splitNetWord) {
          _bindRefreshVerifyCode(false);
          return window.$msg(_result.msg, 3000);
        }

        systemStore.setNetWorkEd(_splitNetWord);
        _bindLogin(true);

        return;
      } else {
        _bindRefreshVerifyCode(false);
        return window.$msg(_result.msg, 3000);
      }
    } else {
      _bindRefreshVerifyCode(false);
      return window.$msg(_result.msg, 3000);
    }
  }
  if (_checkAction.value.rememberAccount) {
    const _encName = base64Enc(_formData.value.userName)/*,
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

async function _bindTryPlay() {
  // EventEmitter.emit(VOICE_SEND, 'a_room');  //增加点击音效
  // _tryPlayLoading.value = true;

  if (!_formData.value.verifyCode) return window.$msg('请输入验证码');

  uni.showLoading({ title:'登录中', mask:true, });
  const _result = await req_userLoginByunreal(_formData.value.verifyCode, _uuid);
  // _tryPlayLoading.value = false;
  uni.hideLoading();

  if (!_result.success) {
    _bindRefreshVerifyCode(false);
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

function _bindStart() {
  listenStart();
  setTimeout(()=> {
    router.replace('/views/Lobby/Index');
  }, 1000);
}

onLoad(()=> {

  if (!systemStore.isDomainLoadEd) {
    systemStore.autoInitDomainConfig().then(()=> {
      systemStore.netWorkEd && _bindRefreshVerifyCode(true);
    });
  } else {
    _bindRefreshVerifyCode(true);
  }

  const _winParams = new URLSearchParams(window.location.search),
        _token = _winParams.get('authorization') || '',
        _userId = _winParams.get('userId') || ''
  ;
  if (_token && _userId) return _autoLogin(_token, _userId);

  _showPage.value = true;

  // 页面加载时检查是否记住了密码
  const userInfo = uni.getStorageSync('userInfo');
  if (userInfo) {
    _formData.value.userName = userInfo.username;
    // _form.value.pass = userInfo.password;
    _checkAction.value.rememberAccount = true;
  }
})

</script>
<style lang='less' src='@front/zstyles/views/Login/Index.less' scoped></style>
