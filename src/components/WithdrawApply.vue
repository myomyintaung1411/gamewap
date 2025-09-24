<template>
<view>

  <view v-if='_show'>

    <view class='sd_mask' @tap='_bindClose' @touchmove.stop.prevent='_moveHandle'></view>

    <view class='sd_model' @touchmove.stop.prevent='_moveHandle'>

      <SvgIcon class='sd_close' name='popup-close' @tap='_bindClose' />

      <view class='sd_ph'></view>

      <view class='sd_title'>
        <view class='sd_ti_text'>{{t("sideList.withdraw")}}</view>
      </view>

      <div class='wa_form'>
        <template v-if='userStore.hasWithdrawPass'>
          <div class='wa_fo_item'>
            <div class='wa_fo_it_name'>{{t("withdraw.with_pass")}}</div>
            <div class='wa_fo_it_content'>
              <input class='wa_fo_it_co_input' placeholder='' v-model='_form.withdrawPass' :disabled='_loading' />
            </div>
          </div>
        </template>

        <div class='wa_fo_item'>
          <div class='wa_fo_it_name'>{{t("withdraw.name")}}</div>
          <div class='wa_fo_it_content'>
            <input class='wa_fo_it_co_input' placeholder='' v-model='_form.userName' :disabled='_loading' />
          </div>
        </div>

        <div class='wa_fo_item'>
          <div class='wa_fo_it_name'>{{t("withdraw.with_amount")}}</div>
          <div class='wa_fo_it_content'>
            <input class='wa_fo_it_co_input _isNumber' type='number' placeholder='' v-model='_form.withdrawAmount' :disabled='_loading' :controls='false' />
          </div>
        </div>

        <div class='wa_fo_item'>
          <div class='wa_fo_it_name'>{{t("withdraw.pay_method")}}</div>
          <div class='wa_fo_it_content'>
            <view class='wa_fo_it_co_select' @tap='_bindSelectType'>{{ ({ 'bankCard':'银行卡', 'alipay':'支付宝', 'wechat':'微信', 'usdt':'USDT', })[_form.type] }}</view>
          </div>
        </div>

        <template v-if='_form.type === "bankCard"'>
          <div class='wa_fo_item'>
            <div class='wa_fo_it_name'>{{t("withdraw.bank_name")}}</div>
            <div class='wa_fo_it_content'>
              <input class='wa_fo_it_co_input' placeholder='' v-model='_form.targetBankName' :disabled='_loading' />
            </div>
          </div>

          <div class='wa_fo_item'>
            <div class='wa_fo_it_name'>{{t("withdraw.bank_card")}}</div>
            <div class='wa_fo_it_content'>
              <input class='wa_fo_it_co_input _isNumber' type='number' placeholder='' v-model='_form.targetBankNo' :disabled='_loading' :controls='false' />
            </div>
          </div>
        </template>

        <template v-else-if='_form.type === "alipay"'>
          <div class='wa_fo_item'>
            <div class='wa_fo_it_name'>{{t("withdraw.acc_name")}}</div>
            <div class='wa_fo_it_content'>
              <input class='wa_fo_it_co_input' placeholder='' v-model='_form.targetAlipayAccount' :disabled='_loading' />
            </div>
          </div>

          <div class='wa_fo_item'>
            <div class='wa_fo_it_name'>{{t("withdraw.qr")}}</div>
            <div class='wa_fo_it_content'>
              <div class='wa_fo_it_co_upload'>
                <div class='wa_fo_it_co_view'>
                  <template v-if='_uploadWAliPayCodeIng'>
                    <div class='wa_fo_it_co_up_vi_status'>{{t("withdraw.uploading")}}</div>
                  </template>
                  <template v-else-if='_previewAliPayCode'>
                    <img class='wa_fo_it_co_up_vi_preview' :src='_previewAliPayCode' />
                  </template>
                  <template v-else>
                    <!-- <ElsIcon icon='Plus' /> -->
                    <!-- <input class='wa_fo_it_co_up_vi_fill' type='file' accept='image/*' @change='_bindWFileAliPayUpload'> -->
                    <view class='wa_fo_it_co_up_vi_fill' @tap='_bindWFileAliPayUpload'>{{t("withdraw.upload")}}</view>
                  </template>
                </div>
                <template v-if='_previewAliPayCode'>
                  <div class='wa_fo_it_co_action'>
                    <div class='wa_fo_it_co_ac_view' data-opera='delete' @click='_bindAliPayAction'>{{t("withdraw.delete")}}</div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </template>

        <template v-else-if='_form.type === "wechat"'>
          <div class='wa_fo_item'>
            <div class='wa_fo_it_name'>{{t("withdraw.pay_qr")}}</div>
            <div class='wa_fo_it_content'>
              <div class='wa_fo_it_co_upload'>
                <div class='wa_fo_it_co_view'>
                  <template v-if='_uploadWWxCodeIng'>
                    <div class='wa_fo_it_co_up_vi_status'>{{t("withdraw.uploading")}}</div>
                  </template>
                  <template v-else-if='_previewWechatCode'>
                    <img class='wa_fo_it_co_up_vi_preview' :src='_previewWechatCode' />
                  </template>
                  <template v-else>
                    <!-- <ElsIcon icon='Plus' /> -->
                    <!-- <input class='wa_fo_it_co_up_vi_fill' type='file' accept='image/*' @change='_bindWFileWxCodeUpload'> -->
                    <view class='wa_fo_it_co_up_vi_fill' @tap='_bindWFileWxCodeUpload'>{{t("withdraw.upload")}}</view>
                  </template>
                </div>
                <template v-if='_previewWechatCode'>
                  <div class='wa_fo_it_co_action'>
                    <div class='wa_fo_it_co_ac_view' data-opera='delete' @click='_bindWxCodeAction'>{{t("withdraw.delete")}}</div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </template>

        <template v-if='_form.type === "usdt"'>
          <div class='wa_fo_item'>
            <div class='wa_fo_it_name'>{{t("withdraw.u_add")}}</div>
            <div class='wa_fo_it_content'>
              <input class='wa_fo_it_co_input' placeholder='' v-model='_form.usdtAddress' :disabled='_loading' />
            </div>
          </div>
        </template>

        <div class='wa_fo_action'>
          <!-- <TheButton
            class='wa_fo_ac_button'
            :disabled='!_canSubmit'
            :loading='_loading'
            :taps='_bindSubmit'
          > -->
          <TheButton
            class='wa_fo_ac_button'
            :loading='_loading'
            :taps='_bindSubmit'
          >
            {{t("withdraw.confirm_w")}}
          </TheButton>
          <TheButton
            class='wa_fo_ac_button'
            :taps='_bindReset'
          >
             {{t("withdraw.reset")}}
          </TheButton>
        </div>
      </div>

    </view>

  </view>

</view>
</template>
<script setup name='WithdrawApply'>
import { ref, computed, } from 'vue';
import TheButton from '@front/components/TheButton/Index.vue';
import { req_userWithdrawal } from '@front/services/user.service';
import { req_commonUpload } from '@front/services/system.service';
import { md5Encrypt } from '@front/utils/tools';
import { encryptStr } from '@front/utils/jsEncrypt';
import { useUserStore } from '@front/stores/modules/user.store';
import { EventEmitter } from "@front/eventBus";
import { VOICE_SEND } from "@front/eventBus/actions";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const _emits = defineEmits(['perfComponentClose']);

const userStore = useUserStore();

const _show = ref(false),
      _form = ref({
        type: 'bankCard', // [bankCard, alipay, wechat, usdt]
        withdrawPass: '',
        userName: '',
        withdrawAmount: NaN,
        targetBankName: '',
        targetBankNo: NaN,
        targetAlipayAccount: '',
        targetWechatCode: '',
        targetAliPayCode: '',
        usdtAddress: '',
      }),
      _loading = ref(false),
      _uploadWWxCodeIng = ref(false),
      _uploadWAliPayCodeIng = ref(false),
      _canSubmit = computed(()=> (
        (userStore.hasWithdrawPass && !_form.value.withdrawPass)
          ? false
          :
        _form.value.type === 'bankCard'
          ? (
              // _form.value.withdrawPass &&
              _form.value.userName &&
              _form.value.withdrawAmount &&
              _form.value.targetBankName &&
              _form.value.targetBankNo
            )
          :
        _form.value.type === 'alipay'
          ? (
              // _form.value.withdrawPass &&
              _form.value.userName &&
              _form.value.withdrawAmount &&
              _form.value.targetAlipayAccount
            )
          :
        _form.value.type === 'wechat'
          ? (
              // _form.value.withdrawPass &&
              _form.value.userName &&
              _form.value.withdrawAmount &&
              _form.value.targetWechatCode
            )
          :
        _form.value.type === 'usdt'
          ? (
              // _form.value.withdrawPass &&
              _form.value.userName &&
              _form.value.withdrawAmount &&
              _form.value.usdtAddress
            )
          :
        false
      )),
      _previewWechatCode = ref(''),
      _previewAliPayCode = ref('')
;

defineExpose({
  showChange:()=> {
    _show.value = true;
  }
})

function _bindClose() {
  EventEmitter.emit(VOICE_SEND, 'a_room');  //增加点击音效
  _show.value = false;

  _bindReset();

  _emits('perfComponentClose');
}

async function _bindSubmit() {
  if (!_canSubmit.value) {
    window.$msg('请补充内容', 2000);
    return;
  }

  EventEmitter.emit(VOICE_SEND, 'a_room');  //增加点击音效
  _loading.value = true;
  const _nonce = 'nonce' + Math.floor(Math.random() * 99999 + 1),
        _timeStamp = Date.now()
  ;

  let _result = false;
  if (_form.value.type === 'bankCard') {
    _result = await req_userWithdrawal(
      encryptStr(_form.value.type),
      _form.value.withdrawPass ? encryptStr(_form.value.withdrawPass) : null,
      encryptStr(_form.value.userName),
      encryptStr(_form.value.withdrawAmount.toString()),
      encryptStr(_form.value.targetBankName),
      encryptStr(_form.value.targetBankNo.toString()),
      '',
      encryptStr(_nonce),
      _timeStamp,
      md5Encrypt(`${_form.value.userName}${_form.value.targetBankName}${_form.value.targetBankNo}${_form.value.withdrawAmount}${_form.value.type}${_form.value.withdrawPass}${_nonce}${_timeStamp}`),
    );
  } else if (_form.value.type === 'alipay') {
    _result = await req_userWithdrawal(
      encryptStr(_form.value.type),
      _form.value.withdrawPass ? encryptStr(_form.value.withdrawPass) : null,
      encryptStr(_form.value.userName),
      encryptStr(_form.value.withdrawAmount.toString()),
      _form.value.targetBankName ? encryptStr(_form.value.targetBankName) : null,
      encryptStr(_form.value.targetAlipayAccount),
      _form.value.targetAliPayCode ? encryptStr(_form.value.targetAliPayCode) : null,
      encryptStr(_nonce),
      _timeStamp,
      md5Encrypt(`${_form.value.userName}${_form.value.targetBankName}${_form.value.targetAlipayAccount}${_form.value.targetAliPayCode}${_form.value.withdrawAmount}${_form.value.type}${_form.value.withdrawPass}${_nonce}${_timeStamp}`),
    );
  } else if (_form.value.type === 'wechat') {
    _result = await req_userWithdrawal(
      encryptStr(_form.value.type),
      _form.value.withdrawPass ? encryptStr(_form.value.withdrawPass) : null,
      encryptStr(_form.value.userName),
      encryptStr(_form.value.withdrawAmount.toString()),
      _form.value.targetBankName ? encryptStr(_form.value.targetBankName) : null,
      encryptStr(_form.value.targetBankNo.toString()),
      _form.value.targetWechatCode ? encryptStr(_form.value.targetWechatCode) : null,
      encryptStr(_nonce),
      _timeStamp,
      md5Encrypt(`${_form.value.userName}${_form.value.targetBankName}${_form.value.targetBankNo}${_form.value.targetWechatCode}${_form.value.withdrawAmount}${_form.value.type}${_form.value.withdrawPass}${_nonce}${_timeStamp}`),
    );
  } else if (_form.value.type === 'usdt') {
    _result = await req_userWithdrawal(
      encryptStr(_form.value.type),
      _form.value.withdrawPass ? encryptStr(_form.value.withdrawPass) : null,
      encryptStr(_form.value.userName),
      encryptStr(_form.value.withdrawAmount.toString()),
      _form.value.targetBankName ? encryptStr(_form.value.targetBankName) : null,
      _form.value.usdtAddress ? encryptStr(_form.value.usdtAddress) : null,
      null,
      encryptStr(_nonce),
      _timeStamp,
      md5Encrypt(`${_form.value.userName}${_form.value.targetBankName}${_form.value.usdtAddress}${''}${_form.value.withdrawAmount}${_form.value.type}${_form.value.withdrawPass}${_nonce}${_timeStamp}`),
    );
  } else return;

  _loading.value = false;
  if (!_result.success) return window.$msg(_result.msg, 3000);

  window.$msg(_result.msg, 3000);
  _bindClose();
}

function _bindType() {
  _form.value.targetBankName = '';
  _form.value.targetBankNo = NaN;
  _form.value.targetAlipayAccount = '';
  _form.value.targetWechatCode = '';
  _form.value.targetAliPayCode = '';
  _form.value.usdtAddress = '';

  _previewWechatCode.value = '';
  _previewAliPayCode.value = '';
}

function _bindReset() {
  EventEmitter.emit(VOICE_SEND, 'a_room');  //增加点击音效
  _form.value.type = 'bankCard';
  _form.value.withdrawPass = '';
  _form.value.userName = '';
  _form.value.withdrawAmount = NaN;
  _form.value.targetBankName = '';
  _form.value.targetBankNo = NaN;
  _form.value.targetAlipayAccount = '';
  _form.value.targetWechatCode = '';
  _form.value.targetAliPayCode = '';
  _form.value.usdtAddress = '';

  _previewWechatCode.value = '';
  _previewAliPayCode.value = '';
}

async function _bindWFileWxCodeUpload(event) {
  uni.chooseImage({
    count: 1,
    success: async res=> {
      const _file = res.tempFiles[0];
      if (!_file) return;

      const _formData = new FormData();
      _formData.append('file', _file);
      _uploadWWxCodeIng.value = true;
      const _result = await req_commonUpload(_formData);
      _uploadWWxCodeIng.value = false;
      if (!_result.success) return window.$msg(_result.msg, 3000);
      if (!_result.data.url) return window.$msg('miss url', 3000);

      _form.value.targetWechatCode = _result.data.url;

      const reader = new FileReader();
      reader.onload = function(e) {
        _previewWechatCode.value = e.target.result;
      };
      reader.readAsDataURL(_file);

    },
    error: err=> {
      console.log('err', err);
    },
  })
}

function _bindWxCodeAction(event) {
  const { opera } = event.currentTarget.dataset;
  if (opera === 'delete') {
    _form.value.targetWechatCode = '';
    _previewWechatCode.value = '';
  }
}

function _bindWFileAliPayUpload() {
  uni.chooseImage({
    count: 1,
    success: async res=> {
      const _file = res.tempFiles[0];
      if (!_file) return;

      const _formData = new FormData();
      _formData.append('file', _file);
      _uploadWAliPayCodeIng.value = true;
      const _result = await req_commonUpload(_formData);
      _uploadWAliPayCodeIng.value = false;
      if (!_result.success) return window.$msg(_result.msg, 3000);
      if (!_result.data.url) return window.$msg('miss url', 3000);

      _form.value.targetAliPayCode = _result.data.url;

      const reader = new FileReader();
      reader.onload = function(e) {
        _previewAliPayCode.value = e.target.result;
      };
      reader.readAsDataURL(_file);

    },
    error: err=> {
      console.log('err', err);
    },
  })
}

function _bindAliPayAction(event) {
  const { opera } = event.currentTarget.dataset;
  if (opera === 'delete') {
    _form.value.targetAliPayCode = '';
    _previewAliPayCode.value = '';
  }
}

function _bindSelectType() {
  const _configList = {
    bankCard: '银行卡',
    alipay: '支付宝',
    wechat: '微信',
    usdt: 'USDT',
  }
  uni.showActionSheet({
    title: '',
    itemList: Object.values(_configList),
    success: ({ tapIndex })=> {
      _form.value.type = Object.keys(_configList)[tapIndex];
    },
  })
}

function _moveHandle() {}

</script>
<style lang='less' src='@front/zstyles/components/WithdrawApply.less' scoped></style>
