<template>
<view>

  <view v-if='_show'>

    <view class='tip_mask' @tap='_bindClose' @touchmove.stop.prevent='_moveHandle'></view>

    <view class='tip_model' @touchmove.stop.prevent='_moveHandle'>

      <SvgIcon class='tip_close' name='popup-close' @tap='_bindClose' />

      <view class='tip_ph'></view>

      <view class='tip_title'>
        <view class='tip_ti_text'><!-- 提现申请 --></view>
      </view>

      <div class='tip_form'>
        <div class='tip_fo_item'>
          <div class='tip_fo_it_name'>{{t("login.code")}}</div>
          <div class='tip_fo_it_content'>
            <input class='tip_fo_it_co_input' :placeholder='t("login.code_error")' @keyup.enter="_bindLogin(false)" @confirm='_bindLogin(false)' v-model='_verifyCode' :disabled='_loading' />
          </div>
          <image class='tip_fo_it_img' :src='_verifyImg' @click='_bindRefreshVerifyCode(false)' />
          <div :class='["tip_fo_it_suffix", _verifyLoading && "_loading"]' @click='_bindRefreshVerifyCode(false)'>
            <SvgIcon class='tip_fo_it_su_fill' name='verify-code-refresh' size='20' />
          </div>
        </div>

        <div class='tip_fo_action'>
          <TheButton
            class='tip_fo_ac_button'
            :loading='_loading'
            :taps='_bindLogin'
          >
            {{t("login.confirm")}}
          </TheButton>
        </div>
      </div>

    </view>

  </view>

</view>
</template>
<script setup name='TryItPlay'>
import { ref, } from 'vue';
import TheButton from '@front/components/TheButton/Index.vue';
import { useUserStore } from '@front/stores/modules/user.store';
import { useSystemStore } from '@front/stores/modules/system.store';
import { listenStart } from '@front/utils/wsManager';
import { getLoginUUID, } from '@front/utils/timeline';
import { req_captchaCaptchaImage, req_userLoginByunreal, } from '@front/services/login.service';
import router from '@front/routers';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const _emits = defineEmits(['perfComponentClose']);

const userStore = useUserStore(),
      systemStore = useSystemStore()
;

defineExpose({
  showChange:()=> {
    _show.value = true;
    _verifyCode.value = '';
    _verifyImg.value = '';
    _verifyLoading.value = '';
    _loading.value = false;

    _bindRefreshVerifyCode();
  }
})

let _uuid = `${getLoginUUID()}`;

const _show = ref(false),
      _verifyCode = ref(''),
      _verifyImg = ref(''),
      _verifyLoading = ref(false),
      _loading = ref(false)
;

function _bindClose() {
  _show.value = false;
  _verifyCode.value = '';
  _verifyImg.value = '';
  _verifyLoading.value = '';
  _loading.value = false;

  _emits('perfComponentClose');
}

async function _bindRefreshVerifyCode() {
  if (_verifyLoading.value) return;

  _uuid = `${getLoginUUID()}`;

  _verifyLoading.value = true;

  const _result = await req_captchaCaptchaImage(_uuid);
  _verifyLoading.value = false;
  if (!_result.success) return;

  _verifyImg.value = typeof _result.data === 'string' ? _result.data : '';
  _verifyCode.value = '';
}

async function _bindLogin() {
  if (!_verifyCode.value) return window.$msg('请输入验证码');

  _loading.value = true;
  uni.showLoading({ title:'登录中', mask:true, });
  const _result = await req_userLoginByunreal(_verifyCode.value, _uuid);
  uni.hideLoading();
  _loading.value = false;

  if (!_result.success) {
    _bindRefreshVerifyCode();
    return window.$msg(_result.msg, 3000);
  }

  window.$msg(_result.msg);

  userStore.setLoginInfo({
    token: _result.data.Authorization,
    userId: _result.data.userId,
    isFirstLogin: false,
    isPhoneBet: false,
  });

  // startIdle();

  _bindStart();
}

function _bindStart() {
  listenStart();
  setTimeout(()=> {
    router.replace('/views/Lobby/Index');
  }, 1000);
}

function _moveHandle() {}

</script>
<style lang='less' src='@front/zstyles/components/TryItPlay.less' scoped></style>
