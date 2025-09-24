
<template>
  <swiper
    class="video-swiper"
    :current="currentIndex"
    @change="onSwiperChange"
  >
    <swiper-item
      v-for="(url, idx) in videoUrls"
      :key="url"
      class="video-swiper"
    >
      <view :class="['vc_model', (needZoom && ['opening','settlement','stopBetting'].includes(gameStore.gameStatus)) && '_zoom']">
        <VideoPlayer :url="url"  :video-id="'video-id-' + idx" :key="url" :ref="el => setVideoRef(el, idx)" />
      </view>
    </swiper-item>
  </swiper>
</template>

<script setup name="VideoContent">
import { ref, onMounted, onUnmounted, nextTick,computed,watch } from 'vue'
import VideoPlayer from '@front/components/VideoPlayer/Index.vue'
import { useGameStore } from '@front/stores/modules/game.store'
import { EventEmitter } from '@front/eventBus/index'
import { VIDEO_REFRESH } from '@front/eventBus/actions'
import { destroyAllVideos  } from '@front/utils/videoController';

defineProps({
  needZoom: Boolean,
})

const currentIndex = ref(0)
const videoRefs = ref([])  // array of VideoPlayer component refs
const gameStore = useGameStore()

// const videoUrls = ref([
//   gameStore.videoUrl,
//  'https://pull.spphj.com/live/hbjl2.flv'
// // ]),
// ])
const videoUrls = computed(() => [
  gameStore.videoUrl, // always reactive
  // 'https://pull.spphj.com/live/hbjl2.flv'
])
console.log(videoUrls.value,"urllllllll")

// watch(() => gameStore.videoUrl, (newVal) => {
//   videoUrls.value[0] = newVal
// })

// helper to keep videoRefs in sync with v-for
function setVideoRef(el, idx) {
  if (el) {
    videoRefs.value[idx] = el
  }
}

async function _destroyPlayer() {
  if (videoRefs.value[currentIndex.value]) {
    await videoRefs.value[currentIndex.value].destroyPlayer()
  }
}

async function _runPlayer() {
  if (videoRefs.value[currentIndex.value]) {
    videoRefs.value[currentIndex.value].runPlayer()
  }
}

async function _bindRefresh(callFunc) {
  await _destroyPlayer()
  await _runPlayer()
  setTimeout(() => {
    callFunc(true)
  }, 500)
}

function onSwiperChange(e) {
  const newIndex = e.detail.current
  currentIndex.value = newIndex

nextTick(() => {
  setTimeout(() => {
    _bindRefresh(() => {
      console.log("playing video after delay")
    })
  }, 200) // 200ms delay, adjust as needed
})
}

onMounted(() => {
  EventEmitter.add(VIDEO_REFRESH, _bindRefresh)
   EventEmitter.add('destroy-video', destroyAllVideos);

  nextTick(() => {
    if (videoRefs.value[0]) {
      videoRefs.value[0].runPlayer()
    }
  })
})

onUnmounted(() => {
  EventEmitter.remove(VIDEO_REFRESH, _bindRefresh)
  EventEmitter.remove('destroy-video', destroyAllVideos);

})
</script>



<style lang='less' src='@front/zstyles/views/GameTable/TableNormal/VideoContent.less' scoped></style>
