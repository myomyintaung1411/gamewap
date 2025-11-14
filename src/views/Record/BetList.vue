<template>
  <view>
    <view v-for="(it, i) in rows" :key="i" class="card">
      <view class="c_row c_row--title">
        <text>台桌：{{ it.deskNo }}</text>
        <text>局：{{ it.chessboard }} 口：{{ it.opening }}</text>
      </view>
      <view class="c_row"><text>下注时间：{{ it.betTime }}</text></view>
      <view class="c_row">
        <text>投注：{{ it.downNum }}</text>
      </view>
      <view class="c_row">
        <text>类型：{{ it.openType }}</text>
        <text>洗码量：{{ it.washNum }}</text>
      </view>
      <view class="c_row">
        <text>盈利：{{ it.winJet }}</text>
        <text>余额：{{ it.currentBalance }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({ rows: { type:Array, default:()=>[] } })
</script>

<style scoped lang="less">
.card{
  background:#0a1a24; border:2rpx solid #1a5c7d; border-radius: 18rpx; padding:16rpx; margin: 12rpx 8rpx;
  color:#eaf9ff;
}
.c_row{ display:flex; justify-content:space-between; padding: 6rpx 0; font-size: 26rpx; }
.c_row--title{ font-weight:700; color:#8bd8ff; }
</style>
