<template>
<view>

  <template v-if='_show'>
    <view class='videoverify_mask' @tap='_bindClose'></view>

    <view class='videoverify_model'>

      <view class='videoverify_title'>{{t("video.title")}}</view>
      <view class='videoverify_border'></view>

      <view class='videoverify_line'>
        <view class='videoverify_li_name'><span>*</span>{{t("video.verfy_title")}}</view>
        <input class='videoverify_li_input' :placeholder='t("video.placeholder")' :value='_value' @input='_bindInput' />
      </view>

      <view class='videoverify_button'>
        <view class='videoverify_bu_view' @tap='_bindClose'>{{t("video.confirm")}}</view>
        <view class='videoverify_bu_view' :loading='_loadingSubmit' @tap='_bindSubmit'>{{t("video.submit")}}</view>
      </view>

    </view>
  </template>

</view>
</template>
<script setup name='VideoVerify'>
import { ref, computed, defineProps, } from 'vue';
// import axios from 'axios';
import { req_postMsg } from '@front/services/game.service';
// import { useDeskStore } from '@front/stores/modules/desk.store';
import { useGameStore } from '@front/stores/modules/game.store';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const _emits = defineEmits(['perfComponentClose']);

const props = defineProps({
  fatherTimer: {
    type: Function,
    default: null
  }
})
defineExpose({
  showChange:()=> {
    if(_verify.value){
      // window.$msg('请勿频繁操作', 1500);
      return 
    }
    _show.value = true;
  }
})

// const deskStore = useDeskStore();
const gameStore = useGameStore();

const _show = ref(false),
      _value = ref(''),
      _canSubmit = computed(()=> _value.value.length === 4),
      _loadingSubmit = ref(false),
      _verify = ref(false),
      _timedNumber = ref(8)
;
function _getVerify(){
  _verify.value = true
  setTimeout(() => {
    _verify.value = false
  }, _timedNumber.value)
}
function _bindInput(event) {
  const value = event.detail.value;
  if (value === '') return _value.value = value;
  if (value.length > 4) return;
  if (!(/^[0-9]+$/.test(value))) return;

  _value.value = value;
}

function _bindClose() {
  _show.value = false;

  _value.value = '';
  _loadingSubmit.value = false;

  _emits('perfComponentClose');
}
function _getTower(val){
      // if(val === 'bjl1'){
      if(val === 'VIP1'){
        return '30'
      // } else if(val === 'bjl2'){
      } else if(val === 'VIP2'){
        return 'vip31'
      // } else if(val === 'bjl3'){
      } else if(val === 'VIP3'){
        return 'vip33'
      // } else if(val === 'bjl4'){
      } else if(val === 'VIP5'){
        return 'vip35'
      // } else if(val === 'lh5'){
      } else if(val === 'VIP6'){
        return 'vip38'
      // } else if(val === 'lh6'){
      } else if(val === 'VIP7'){
        return 'vip39'
      }
    }
async function _bindSubmit() {
  if (!_canSubmit.value) return;
  window.$loading(true);
  _loadingSubmit.value = true;
  // const isTower = _getTower(deskStore.getDeskName)
  const isTower = _getTower(gameStore.gameShortName);
  // const _result = await req_postMsg(deskStore.getDeskName, _value.value);
  // const _result = await axios.post('https://www.spyz1.shop/api/portal/Index/postMsg',{deskname: isTower,code: _value.value})
  const _result = await req_postMsg(isTower, _value.value);
  _loadingSubmit.value = false;
  window.$loading(false);
  // if (_result.data.code !== 1) return window.$msg(_result.data.msg, 3000);
  if(props.fatherTimer){
    props.fatherTimer(_timedNumber.value)
  }
  // window.$msg(_result.data.msg, 1500);
  window.$msgWithGame('操作成功', 1500);
  // 
  _getVerify();
  _bindClose();
}

</script>
<style lang='less' src='@front/zstyles/components/VideoVerify.less'></style>
