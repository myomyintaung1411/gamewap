<template>
<view class='vp_model'>

  <view class='vp_view _size01'>
    <!-- <SvgIcon class='vp_vi_icon' name='betarea-pool-people' /> -->
    <view class='vp_vi_value'>{{isNaN(count) ? 0 : formatAmount(count)}}</view>
  </view>

  <view class='vp_view _size02'>
    <SvgIcon class='vp_vi_icon' name='betarea-pool-amount' />
    <view class='vp_vi_value'>{{isNaN(amount) ? 0 : formatAmount(amount)}}</view>
  </view>

</view>
</template>
<script setup name='ViewPool'>
import { formatAmount } from '@front/utils/tools';

defineProps({
  count: Number,
  amount: Number,
})

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableNormal/BetArea/ViewPool.less' scoped></style>
