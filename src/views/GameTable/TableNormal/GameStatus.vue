<template>
  <view class="gs_model" :style="{ top: 'calc(var(--status-bar-height) + 24rpx)' }">

    <!-- 正常计时 / 倒计时：同一渲染，区别只是外观类名 -->
    <template v-if="_curStatus === 'timing' || _curStatus === 'countDown'">
      <view :class="[_curStatus === 'timing' ? 'gs_jishizhong' : 'gs_daojishi', '_view_normal']">
        <svg class="gs_ring" viewBox="0 0 100 100" aria-label="timer">
          <circle cx="50" cy="50" r="50" fill="rgba(0,0,0,.55)" />
          <g transform="rotate(-90 50 50)">
            <circle cx="50" cy="50" :r="r" :stroke="trackColor" stroke-width="8" fill="none"
                    :stroke-dasharray="circumference" :stroke-dashoffset="0" />
            <circle cx="50" cy="50" :r="r" :stroke="progressColor" stroke-width="8" stroke-linecap="round" fill="none"
                    :stroke-dasharray="circumference" :stroke-dashoffset="dashOffset" />
          </g>
        </svg>

        <!-- 👇 HTML overlay for digits (reliable in all modes) -->
        <view class="gs_num" :style="{ color: textColor }">{{ displaySec }}</view>

      </view>
    </template>

    <template v-else-if="_curStatus === 'stopBetting'">
      <view class="gs_tingzhixiahu _view_normal">
        {{ t('time_status.stop_bet') }}
      </view>
    </template>

    <template v-else-if="_curStatus === 'opening'">
      <view class="gs_kaipaizhong _view_normal">
        {{ t('time_status.open') }}
      </view>
    </template>

    <template v-else-if="_curStatus === 'settlement'">
      <view class="gs_jiesuanzhong _view_normal">
        {{ t('time_status.settle') }}
      </view>
    </template>

    <template v-else-if="_curStatus === 'comeStart'">
      <view class="gs_jijiangkaiju _view_normal">
        {{ t('time_status.about_start') }}
      </view>
    </template>

    <template v-else-if="_curStatus === 'shuffle'">
      <view class="gs_xipaizhong _view_normal">
        {{ t('time_status.shuffle') }}
      </view>
    </template>

    <template v-else-if="_curStatus === 'repeal'">
      <view class="gs_feichupaiju _view_normal">
        {{ t('time_status.Abolition') }}
      </view>
    </template>

    <template v-else-if="_curStatus === 'stopDesk'">
      <view class="gs_tingtaizhong _view_normal">
        {{ t('time_status.stop') }}
      </view>
    </template>

  </view>
</template>

<script setup name="GameStatus">
import { computed } from 'vue'
import { useGameStore } from '@front/stores/modules/game.store'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const gameStore = useGameStore()

const _curStatus = computed(() =>
  gameStore.gameStatus === 'comeStart' ? 'comeStart' :
  gameStore.gameStatus === 'timing'
    ? (!isNaN(gameStore.timming.value) && gameStore.timming.value <= 10 ? 'countDown' : 'timing')
    : gameStore.gameStatus === 'stopBetting' ? 'stopBetting'
    : gameStore.gameStatus === 'opening' ? 'opening'
    : gameStore.gameStatus === 'settlement' ? 'settlement'
    : gameStore.gameStatus === 'repeal' ? 'repeal'
    : gameStore.gameStatus === 'shuffle' ? 'shuffle'
    : gameStore.gameStatus === 'stopDesk' ? 'stopDesk'
    : ''
)

const total = computed(() => isNaN(gameStore.timming.totalTime) ? 60 : Math.max(1, gameStore.timming.totalTime))
const remain = computed(() => {
  const v = isNaN(gameStore.timming.value) ? total.value : gameStore.timming.value
  return Math.min(total.value, Math.max(0, v))
})

const r = 42
const circumference = 2 * Math.PI * r
const ratio = computed(() => remain.value / total.value)
const dashOffset = computed(() => (1 - ratio.value) * circumference)
const displaySec = computed(() => Math.floor(remain.value))

/** dynamic colors */
const progressColor = computed(() => {
  if (_curStatus.value === 'countDown' || remain.value <= 10) return '#ff0000'
  return '#f6c028'
})

const textColor = computed(() => {
  if (_curStatus.value === 'countDown' || remain.value <= 10) return '#ff0000'
  return '#f6c028'
})

const trackColor = 'rgba(255,255,255,.25)'
</script>

<!-- <style lang='less' src='@front/zstyles/views/GameTable/TableNormal/GameStatus.less' scoped></style> -->

<style lang="less" scoped>
.gs_model {
  width: 120rpx; height: 120rpx;
  position: absolute; top: 24rpx; right: 100rpx;
}

._view_normal {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  box-sizing: border-box; border-radius: 50%;
  position: relative; /* for overlay positioning */
}

.gs_ring { width: 100%; height: 100%; display: block; }

/* overlay digits */
.gs_num {
  position: absolute;
  inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 34px;          /* looks like your screenshot */
  font-weight: 700;
  color: #f6c028;           /* yellow */
  line-height: 1;
  z-index: 1;
}
.gs_jishizhong { .bg-green(.6);  box-shadow:@box-shadow-green; }
.gs_daojishi  { .bg-red02(.6);   box-shadow:@box-shadow-red; }
.gs_tingzhixiahu { .bg-red02(.6); font-size:@font-12;  }
.gs_kaipaizhong  { .bg-mask(.6); font-size:26rpx;  }
.gs_jiesuanzhong { .bg-red02(.6); font-size:26rpx;  }
.gs_jijiangkaiju { .bg-mask(.6); font-size:@font-12;  }
.gs_xipaizhong   { .bg-mask(.6); font-size:26rpx;  }
.gs_feichupaiju  { .bg-mask(.6); font-size:@font-12;  }
.gs_tingtaizhong { .bg-red02(.6); font-size:26rpx;  }

/* SVG & number */
.gs_ring { width: 100%; height: 100%; display: block; }
.gs_digits { font-size: 34px; font-weight: 700; dominant-baseline: middle; }
</style>
