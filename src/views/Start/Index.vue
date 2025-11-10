<template>
  <view class="start">
    <image class="start__bg" :src="bgImg" mode="aspectFill" />
    <view class="start__shade"></view>

    <!-- <view class="start__content">
      <view class="start__title">Royal International Entertainment</view>
      <view class="start__tagline">Win more, play carefree</view>
    </view> -->

    <view class="start__progress-area">
      <view class="start__progress-bar">
        <view class="start__progress-fill" :style="{ width: progressWidth }"></view>
      </view>
      <text class="start__progress-text">Loading...{{ displayProgress }}%</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import bgImg from '@/assets/splash/splash.png'
import { useUserStore } from '@front/stores/modules/user.store';
import { useSystemStore } from '@front/stores/modules/system.store';

const PROGRESS_DURATION = 3000 // 3 seconds
const progress = ref(0)
const displayProgress = computed(() => Math.min(100, Math.round(progress.value)))
const progressWidth = computed(() => `${displayProgress.value}%`)

let progressTimer = null
let redirectTimer = null
let hasNavigated = false

const userStore =  useUserStore(),
	  systemStore = useSystemStore()
;

const clearTimers = () => {
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
  if (redirectTimer) {
    clearTimeout(redirectTimer)
    redirectTimer = null
  }
}

const goToLogin = () => {

  if (hasNavigated) return
  hasNavigated = true
  clearTimers()
  if(!userStore.getUserId || !userStore.token){
    uni.reLaunch({
        url: '/views/Login/Index',
    })
  } else {
    uni.reLaunch({
      url: '/views/Lobby/Index',
    })
  }

}

onMounted(() => {
  const stepMs = 100
  const step = 100 / (PROGRESS_DURATION / stepMs)

  progressTimer = setInterval(() => {
    progress.value = Math.min(100, progress.value + step)
  }, stepMs)

  redirectTimer = setTimeout(() => {
    progress.value = 100
    goToLogin()
  }, PROGRESS_DURATION)
})

onBeforeUnmount(() => {
  clearTimers()
})
</script>

<style scoped lang="less">
.start {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #0e1632 0%, #051027 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.start__bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.start__shade {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 20%, rgba(15, 31, 73, 0), rgba(5, 8, 16, 0.9));
  z-index: 1;
}

.start__content {
  position: absolute;
  top: 120rpx;
  width: 100%;
  text-align: center;
  z-index: 2;
  color: #fff;
}

.start__title {
  font-size: 60rpx;
  font-weight: 700;
  letter-spacing: 6rpx;
  text-shadow: 0 6rpx 16rpx rgba(3, 6, 14, 0.65);
}

.start__tagline {
  margin: 28rpx auto 0;
  display: inline-flex;
  padding: 0 40rpx;
  height: 68rpx;
  border-radius: 68rpx;
  background: linear-gradient(90deg, #3f6bff 0%, #00f0ff 100%);
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  letter-spacing: 4rpx;
}

.start__progress-area {
  position: absolute;
  bottom: 120rpx;
  width: 90%;
  padding: 0 80rpx;
  z-index: 2;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.start__progress-bar {
  width: 100%;
  height: 20rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.start__progress-fill {
  height: 100%;
  border-radius: 20rpx;
  background: linear-gradient(90deg, #f6e593 0%, #ffd86a 100%);
  transition: width 0.2s linear;
}

.start__progress-text {
  margin-top: 20rpx;
  font-size: 26rpx;
  text-align: center;
  letter-spacing: 2rpx;

}
</style>
