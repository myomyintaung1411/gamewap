<template>
  <view>
    <view v-for="(it, i) in rows" :key="i" class="card">
      <template v-if="it._withdraw">
        <view class="c_row">
          <text>状态：{{ it.status }}</text>
          <text>提现金额：{{ it.applyAmount }}</text>
        </view>
        <view class="c_row"><text>订单号：{{ it.orderNo }}</text></view>
        <view class="c_row"><text>提现时间：{{ it.applyTime }}</text></view>
        <view class="c_row"><text>备注：{{ it.remark }}</text></view>
        <view class="c_row">
          <view v-if="it._oriStatus === 1">
            <button class="btn_cancel" :loading="it._loadingRevoke" @tap="$emit('revoke', i)">撤销</button>
          </view>
        </view>
      </template>
      <template v-else>
        <view class="c_row">
          <text>类型：{{ it.type }}</text>
          <text>金额：{{ it.amount }}</text>
        </view>
        <view class="c_row"><text>交易时间：{{ it.dateTime }}</text></view>
        <view class="c_row"><text>交易前余额：{{ it.balanceBefore }}</text></view>
        <view class="c_row"><text>交易后余额：{{ it.balanceAfter }}</text></view>
      </template>
    </view>
  </view>
</template>

<script setup>
defineProps({ rows: { type:Array, default:()=>[] } })
defineEmits(['revoke'])
</script>

<style scoped lang="less">
.card{
  background:#0a1a24; border:2rpx solid #1a5c7d; border-radius: 18rpx; padding:16rpx; margin: 12rpx 8rpx;
  color:#eaf9ff;
}
.c_row{ display:flex; justify-content:space-between; padding: 6rpx 0; font-size: 26rpx; }
.btn_cancel{
  background:linear-gradient(180deg, #890300, #680a0b);
  border:0; color:#fff; font-size:26rpx; padding:6rpx 30rpx; border-radius:8rpx;
}
</style>
