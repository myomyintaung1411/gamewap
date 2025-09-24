<template>
<view class='ps_box'>

  <DewCanvas ident='PanelSecond' :boxItemWidth='16' :dewItemWidth='16' :backColNum='2' :pointColumn='2' :isAsk='isAskList' :list='list' />

</view>
</template>
<script setup name='PanelSecond'>
import DewCanvas from '@front/components/DewCanvas.vue';

defineProps({
  isAskList: Boolean,
  list: Array,
})

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableMulti/DeskList/DeskView/PanelSecond.less' scoped></style>
