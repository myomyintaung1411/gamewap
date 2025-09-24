<template>
<view class='po_box'>

  <!-- <DewCanvas ident='PanelSecond' :boxItemWidth='16' :dewItemWidth='16' :backColNum='2' :pointColumn='2' :isAsk='isAskList' :list='list' /> -->
  <view class='po_third'>
    <DewCanvas ident='PanelThird' :boxItemWidth='16' :dewItemWidth='8' :backColNum='2' :pointColumn='2' :isAsk='isAskList' :list='listThird' />
  </view>

  <view class='po_fourth'>
    <DewCanvas ident='PanelFourth' :boxItemWidth='16' :dewItemWidth='8' :backColNum='2' :pointColumn='2' :isAsk='isAskList' :list='listFourth' />
  </view>

  <view class='po_fifth'>
    <DewCanvas ident='PanelFifth' :boxItemWidth='16' :dewItemWidth='8' :backColNum='2' :pointColumn='2' :isAsk='isAskList' :list='listFifth' />
  </view>

</view>
</template>
<script setup name='PanelOther'>
import DewCanvas from '@front/components/DewCanvas.vue';

defineProps({
  isAskList: Boolean,
  listThird: Array,
  listFourth: Array,
  listFifth: Array,
})

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableMulti/DeskList/DeskView/PanelOther.less' scoped></style>
