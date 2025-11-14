<template>
  <view class="fb">
    <!-- Date range -->
    <view class="fb_row">
      <picker class="fb_picker" mode="date" :value="start" @change="e=>emit('update:start', e.detail.value)">
        <view class="fb_item">
          <text class="fb_label">{{t('bet_rec.start')}}:</text>
          <text class="fb_value">{{start}}</text>
        </view>
      </picker>
      <picker class="fb_picker" mode="date" :value="end" @change="e=>emit('update:end', e.detail.value)">
        <view class="fb_item">
          <text class="fb_label">{{t('bet_rec.end')}}:</text>
          <text class="fb_value">{{end}}</text>
        </view>
      </picker>
    </view>

    <!-- Kind (flow only) -->
    <view v-if="showKind" class="fb_row">
      <picker class="fb_picker" mode="selector" :range="kinds" @change="e=>emit('update:kind', kinds[e.detail.value])">
        <view class="fb_item">
          <text class="fb_label">{{t('bet_rec.current')}}:</text>
          <view class="fb_select"><text>{{kind}}</text></view>
        </view>
      </picker>
    </view>

    <!-- quick buttons -->
    <view class="fb_quick">
      <button v-for="b in quickBtns" :key="b.key"
        class="fb_btn"
        :class="quick===b.key && 'is-on'"
        :disabled="loading"
        @tap="$emit('quick', b.key)">{{b.text}}</button>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
  agentType: String,
  showKind: Boolean,
  kind: String,
  start: String,
  end: String,
  quick: String,
  loading: Boolean
})
const emit = defineEmits(['update:kind','update:start','update:end','quick'])

const kinds = ['全部','上下分','结算','提现记录']

const quickBtns = computed(()=>[
  { key:'today',     text:t('lobby.date_t') },
  { key:'yesterday', text:t('lobby.date_y') },
  { key:'thisweek',  text:t('lobby.date_tw') },
  { key:'laseweek',  text:t('lobby.date_lw') },
  { key:'thismonth', text:t('lobby.date_tm') },
])
</script>

<style scoped lang="less">
.fb{ padding: 14rpx 16rpx 6rpx; color:#d7f1ff; }
.fb_row{ display:flex; gap: 10rpx; margin: 8rpx 0; }
.fb_picker{ flex:1; }
.fb_item{
  display:flex; align-items:center; gap:10rpx; height:70rpx; padding:0 12rpx;
  border:2rpx solid #1e6282; border-radius: 14rpx; background: rgba(2,33,50,.45);
}
.fb_label{ color:#8bd8ff; font-size: 24rpx; }
.fb_value{
  min-width: 210rpx; text-align:center; background:#06283a; border:2rpx solid #1e6282;
  border-radius: 10rpx; padding: 8rpx 16rpx; color:#fff; font-size: 26rpx;
}
.fb_select{
  min-width: 150rpx; text-align:center; background:#06283a; border:2rpx solid #1e6282;
  border-radius: 10rpx; padding: 8rpx 16rpx; color:#fff;
}
.fb_quick{ display:flex; justify-content:space-between; padding: 10rpx 0 4rpx; }
.fb_btn{
  flex:1 1 auto; margin: 0 6rpx; height:56rpx; line-height:56rpx;
  font-size: 24rpx; color:#e7f7ff; border-radius: 999rpx; border: 2rpx solid #1e6282;
  background: rgba(3,43,63,.7);
}
.fb_btn.is-on{
  background: linear-gradient(180deg, #22bef0, #0a88b5);
  color:#01273a; font-weight:700; border-color: transparent;
}
</style>
