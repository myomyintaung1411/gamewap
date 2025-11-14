<template>
  <view>
    <view v-if="_show">
      <!-- mask -->
      <view class="sd_mask" @tap="_bindClose" @touchmove.stop.prevent="_moveHandle"></view>

      <!-- dialog -->
      <view class="sd_model" @touchmove.stop.prevent="_moveHandle">
        <!-- header -->
        <view class="cp_header">
          <text class="cp_title">修改密码</text>
          <text class="cp_close" @tap="_bindClose">✕</text>
        </view>

        <!-- tabs -->
        <view class="cp_tabs">
          <view
            class="cp_tab"
            :class="activeTab === 'login' ? 'is-active' : ''"
            @click="tabChange('login')"
          >登陆密码</view>
          <view
            class="cp_tab"
            :class="activeTab === 'withdraw' ? 'is-active' : ''"
            @click="tabChange('withdraw')"
          >提现密码</view>
        </view>

        <!-- form -->
        <view v-if="activeTab === 'login'" class="cp_body">
          <view class="cp_field">
            <text class="cp_label">原密码</text>
            <input
              class="cp_input"
              :password="true"
              v-model="_form.originPass"
              placeholder="请输入原密码"
              placeholder-class="cp_ph"
            />
          </view>

          <view class="cp_field">
            <text class="cp_label">新密码</text>
            <input
              class="cp_input"
              :password="true"
              v-model="_form.newPass"
              placeholder="请输入新密码"
              placeholder-class="cp_ph"
            />
          </view>

          <view class="cp_field">
            <text class="cp_label">确认新密码</text>
            <input
              class="cp_input"
              :password="true"
              v-model="_form.confirmPass"
              placeholder="请输入确认新密码"
              placeholder-class="cp_ph"
            />
          </view>
        </view>

        <view v-else class="cp_body">
          <view class="cp_field">
            <text class="cp_label">登录密码</text>
            <input
              class="cp_input"
              :password="true"
              v-model="_form.originPass"
              placeholder="请输入登录密码"
              placeholder-class="cp_ph"
            />
          </view>

          <view class="cp_field">
            <text class="cp_label">提现密码</text>
            <input
              class="cp_input"
              :password="true"
              v-model="_form.newPass"
              placeholder="请输入提现密码"
              placeholder-class="cp_ph"
            />
          </view>

          <view class="cp_field">
            <text class="cp_label">确认密码</text>
            <input
              class="cp_input"
              :password="true"
              v-model="_form.confirmPass"
              placeholder="请再次输入密码"
              placeholder-class="cp_ph"
            />
          </view>
        </view>

        <!-- footer buttons -->
        <view class="cp_footer">
          <button :disabled='_loading'  class="cp_btn cp_btn_primary" @tap="_bindConfirm">确认设置</button>
          <button class="cp_btn cp_btn_ghost" @tap="_bindReset">重置</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive,computed } from 'vue'
import { EventEmitter } from '@front/eventBus/index'
import { VOICE_SEND } from '@front/eventBus/actions'
import { md5Encrypt } from '@front/utils/tools';
import { encryptStr } from '@front/utils/jsEncrypt';
import { req_userUpdatePassword } from '@front/services/login.service';
import { req_userUpdateWithdrawalPassword } from '@front/services/user.service';

import TheMsg from '@front/components/TheMsg.vue';
import { useUserStore } from '@front/stores/modules/user.store';
const userStore = useUserStore();

const _show = ref(false)
const  _loading = ref(false)
const activeTab = ref('login') // 'login' or 'withdraw'
const _form = ref({originPass: '',newPass: '',confirmPass: ''})
const _emits = defineEmits(['perfComponentClose', 'confirm'])
    const  _canSubmit  = computed(()=> (
        _form.value.originPass &&
        _form.value.newPass &&
        _form.value.confirmPass &&
        ( _form.value.newPass === _form.value.confirmPass )
      ));
function _bindClose () {
  EventEmitter.emit(VOICE_SEND, 'a_room') // 点击音效
  _show.value = false
  _bindReset()
  _emits('perfComponentClose')
}

async function _submitWithdrawPass() {
  EventEmitter.emit(VOICE_SEND, 'a_room');  //增加点击音效
  if (_form.value.newPass.length < 6 || _form.value.newPass.length > 8) return window.$dialogue('提示', '提现密码长度需要6-8位字符');
  if(!_canSubmit.value){
      return window.$msg('密码输入有误，请检查', 2000);
  }
  _loading.value = true;
  uni.showLoading({ mask:true, title:'请求中' });
  try {
        const _nonce = 'nonce' + Math.floor(Math.random() * 99999 + 1),
            _timeStamp = Date.now();
        const _result = await req_userUpdateWithdrawalPassword(
        encryptStr(_form.value.originPass),
        encryptStr(_form.value.newPass),
        encryptStr(_nonce),
        _timeStamp,
        md5Encrypt(`${_form.value.originPass}${_form.value.newPass}${_nonce}${_timeStamp}`),
    );
    console.log('_result',_result);
    _loading.value = false;
    uni.hideLoading();
    if (!_result.success) return window.$msg(_result.msg, 3000);

    window.$msg(_result.msg, 3000);
    _bindClose();
  } catch (error) {
      window.$msg('请求失败，请稍后重试', 2000);
  } finally {
      _loading.value = false;
  }
}

async function _bindConfirm () {


    if(!_form.value.originPass){
        return window.$msg('请输入验证原登录密码', 2000);
    }
   if (activeTab.value === 'withdraw') return _submitWithdrawPass();
    if(!_form.value.newPass){
        return window.$msg('请输入新登录密码', 2000);
    }
    if(!_form.value.confirmPass){
        return window.$msg('请确认新登录密码', 2000);
    }
    const regex = /^[A-Za-z0-9]{6,16}$/;
    if(!regex.test(_form.value.newPass) || !regex.test(_form.value.confirmPass)){
        return window.$msg('请输入6-20位登录密码(大小写字母、数字或组合)', 2000);
    }
  if(!_canSubmit.value){
      return window.$msg('密码输入有误，请检查', 2000);
  }
  _loading.value = true;
    uni.showLoading({ mask:true, title:'请求中' });
  try {
        const _nonce = 'nonce' + Math.floor(Math.random() * 99999 + 1),
            _timeStamp = Date.now();
        const _result = await req_userUpdatePassword(
        encryptStr(_form.value.originPass),
        encryptStr(_form.value.newPass),
        encryptStr(_nonce),
        _timeStamp,
        md5Encrypt(`${_form.value.originPass}${_form.value.newPass}${_nonce}${_timeStamp}`),
    );
    _loading.value = false;
    uni.hideLoading();
    if (!_result.success) return window.$msg(_result.msg, 3000);

    window.$msg(_result.msg, 3000);
    userStore.userLoginOut();
  } catch (error) {
      window.$msg('请求失败，请稍后重试', 2000);
  } finally {
      _loading.value = false;
  }
}

function tabChange (tab) {
    _bindReset()
  EventEmitter.emit(VOICE_SEND, 'a_room') // 点击音效
  activeTab.value = tab
}

function _bindReset () {
  _form.value.originPass = ''
  _form.value.newPass = ''
  _form.value.confirmPass = ''
}

function _moveHandle () {} // 阻止背景滚动

// 给父级打开弹窗
defineExpose({
  showChange: () => {
    // activeTab.value = tab
    _show.value = true
  },
})
</script>

<style lang="less" scoped src="@/zstyles/components/ChangePassword.less"></style>
