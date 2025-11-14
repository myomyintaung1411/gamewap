<template>
  <view class="pg">
    <button class="pg_btn" :disabled="disabled || page<=1" @tap="$emit('prev')">‹ 上一页</button>
    <text class="pg_info">{{ page }} / {{ totalPages }}</text>
    <button class="pg_btn" :disabled="disabled || page>=totalPages" @tap="$emit('next')">下一页 ›</button>
  </view>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  page: Number,
  pageSize: Number,
  total: Number,
  disabled: Boolean
})
const totalPages = computed(()=> Math.max(1, Math.ceil((props.total||0) / (props.pageSize||10))))
</script>

<style scoped lang="less">
.pg{ display:flex; align-items:center; justify-content:center; gap: 18rpx; }
.pg_btn{ border:2rpx solid #1e6282; background:#06283a; color:#e7f7ff; border-radius:999rpx; padding: 8rpx 18rpx; }
.pg_info{ color:#8bd8ff; font-size: 26rpx; }
</style>
