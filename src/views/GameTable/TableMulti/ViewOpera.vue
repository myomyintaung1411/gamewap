<template>
<view class='vo_model'>

  <!-- <view class='vo_view _view' @tap='_changeIsNotCommission(!_isNotCommission)'>
    <SvgIcon class='vo_vi_icon' name='' />
    <view class='vo_vi_name'>{{ !_isNotCommission ? '不免佣' : '免佣' }}</view>
  </view> -->

  <!-- <view class='vo_ask _view' data-ident='zhunag' :data-str='{"bjl":"庄赢,大", "lh":"龙赢,大"}[gameStore.gameType]' @tap='_bindAsk'> -->
  <view class='vo_ask _view' @tap='_bindBatchAskZhuang'>
        <view class='vo_as_name'>{{t("table.b_ask")}}</view>

    <view class='vo_as_circle'>
      <view class='vo_as_ci_view'><DewBase64 :name='"xiaoluhongse"' /></view>
      <view class='vo_as_ci_view'><DewBase64 :name='"da-lu-zhuang-ying-"' /></view>
      <view class='vo_as_ci_view'><DewBase64 :name='"xiaoqiangluhongse"' /></view>
    </view>
    <!-- <view class='vo_as_name'>{{ {'bjl':'庄问路', 'lh':'龙问路'}[gameStore.gameType] || '--' }}</view> -->
  </view>

  <!-- <view class='vo_ask _view' data-ident='xian' :data-str='{"bjl":"闲赢,大", "lh":"虎赢,大"}[gameStore.gameType]' @tap='_bindAsk'> -->
  <view class='vo_ask _view' @tap='_bindBatchAskXian'>
        <view class='vo_as_name'>{{t("table.p_ask")}}</view>
    <view class='vo_as_circle'>
      <view class='vo_as_ci_view'><DewBase64 :name='"xiaolulanse"' /></view>
      <view class='vo_as_ci_view'><DewBase64 :name='"da-lu-xian-ying-"' /></view>
      <view class='vo_as_ci_view'><DewBase64 :name='"xiaoqianglulanse"' /></view>
    </view>
    <!-- <view class='vo_as_name'>{{ {'bjl':'闲问路', 'lh':'虎问路'}[gameStore.gameType] || '--' }}</view> -->
  </view>

  <view class='vo_view _view _size01' data-ident='route-type' @tap='_bindAction'>
    <!-- <SvgIcon class='vo_vi_icon' name='table-multi-opera-chip-setting' /> -->
     <img src="@/assets/sidebar/setting.png" alt="" class="vo_vi_icon">
    <view class='vo_vi_name'>{{t("table.road")}}</view>
  </view>

  <!-- <view class='vo_view _view' data-ident='chips-setting' @tap='_bindAction'>
    <SvgIcon class='vo_vi_icon' name='table-multi-opera-chip-setting' />
    <view class='vo_vi_name'>筹码设置</view>
  </view> -->

  <!-- <view class='vo_view _view' data-ident='good-false' @tap='_bindAction'>
    <SvgIcon class='vo_vi_icon' name='table-multi-opera-all-route' />
    <view class='vo_vi_name'>全部</view>
  </view> -->

  <view class='vo_view _view' data-ident='good-desk' @tap='_bindAction'>
    <!-- <SvgIcon class='vo_vi_icon' name='route-opera-good' /> -->
      <img src="@/assets/sidebar/multi.png" alt="" class="vo_vi_icon">
    <view class='vo_vi_name'>{{t("table.good")}}</view>
  </view>

  <!-- <ChipsSetting ref='_vChipsSetting' /> -->
  <PerfComponent :componentUrl='PCompGoodList' ref='_vSwitchDesk' />

</view>
</template>
<script setup name='ViewOpera'>
import { ref, inject } from 'vue';
// import ChipsSetting from '@front/components/ChipsSetting.vue';
import PerfComponent from '@front/components/PerfComponent.vue';
import DewBase64 from '@front/components/DewBase64.vue';
import { useDeskStore } from '@front/stores/modules/desk.store';
import { EventEmitter, } from '@front/eventBus/index';
import { VOICE_SEND, } from '@front/eventBus/actions';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
// #ifdef APP-PLUS
  import PCompGoodList from '@front/components/SwitchDesk/GoodList.vue';
// #endif
// #ifndef APP-PLUS
  const PCompGoodList = ()=> import('@front/components/SwitchDesk/GoodList.vue');
// #endif

const deskStore = useDeskStore();

const /*_vChipsSetting = ref(null),
      */_changeRouteTypeAuto = inject('changeRouteTypeAuto'),
      _vSwitchDesk = ref(null)
;

function _bindBatchAskZhuang() {
  EventEmitter.emit(VOICE_SEND, 'a_room');

  for (let i in deskStore.list) {
    deskStore.list[i].reqAskPoint(
      { 'bjl':'庄赢,大', 'lh':'龙赢,大' }[deskStore.list[i].deskTypeIdent]
    );
  }
}

function _bindBatchAskXian() {
  EventEmitter.emit(VOICE_SEND, 'a_room');

  for (let i in deskStore.list) {
    deskStore.list[i].reqAskPoint(
      { 'bjl':'闲赢,大', 'lh':'虎赢,大' }[deskStore.list[i].deskTypeIdent]
    );
  }
}

function _bindAction(event) {
  EventEmitter.emit(VOICE_SEND, 'a_room');

  const { ident } = event.currentTarget.dataset;

  /*if (ident === 'chips-setting') {
    _vChipsSetting.value.showChange();

  } else *//*if (ident === 'good-false') {
    _changeGoodFilter(false);

  } else */if (ident === 'good-desk') {
    _vSwitchDesk.value.showChange();

  } else if (ident === 'route-type') {
    _changeRouteTypeAuto();

  }
}

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableMulti/ViewOpera.less' scoped></style>
