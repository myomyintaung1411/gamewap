<template>
  <view class="vm_model">
    <div v-html="_vHtml" style="width:100%; height:100%;background-color:#2b5a45 ;"></div>
    <view
      :change:detail="renderJs._play"
      :detail="{ url: currentUrl, id: videoId }"
      :change:videoRefresh="renderJs._videoRefresh"
      :videoRefresh="_destoryCount"
      :change:reRun="renderJs._reRun"
      :reRun="_runCount"
    ></view>
  </view>
</template>

<script setup name="ViewMpegts">
import { ref, watch, computed,onMounted, onUnmounted } from 'vue'
import { EventEmitter } from '@front/eventBus/index'

const props = defineProps({
  url: String,
  videoId: String
})

/**
 * Use computed so each instance renders its own unique <video id="">
 * (ids coming from VideoPlayer -> ViewMpegts)
 */
const _vHtml = computed(() => `
  <video
    id='${props.videoId}'
    class='vv_video'
    object-fit='fill'
    :autoplay='true'
    :muted='true'
    :show-fullscreen-btn='false'
    :show-play-btn='false'
    :show-center-play-btn='false'
    :enable-progress-gesture='false'
    :controls='false'
    :is-live='true'
    poster='none'
    webkit-playsinline='true'
    playsinline='true'
    style='width:100%; height:100%; background:#2b5a45;'
  ></video>
`)

const _destoryCount = ref(0)
const _runCount = ref(0)
const currentUrl = ref(props.url)
const _player = ref(null);

  // destroyPlayer: () => { _destoryCount.value += 1 },


// defineExpose({
//   destroyPlayer: () => { _destoryCount.value += 1 },
//   runPlayer: () => { _runCount.value += 1 }
// })
defineExpose({
  destroyPlayer: _destroyPlayer,
  runPlayer: _runPlayer,
})

// function _destroyPlayer() {
//   _destoryCount.value += 1;
// }

function _destroyPlayer() {
  return new Promise((resolve) => {
    _destoryCount.value += 1;

    // call renderJs destroy
    if (typeof uni !== 'undefined') {
      // trigger change:videoRefresh to invoke renderJs._videoRefresh
      _destoryCount.value += 1;
    }

    resolve();
  });
}



function _runPlayer() {
  _runCount.value += 1;
}

// function _runPlayer() {
//   _runCount.value += 1;
//   _destroyPlayer(); // Ensure old player is gone first
//   const el = document.getElementById(props.videoId);
//   if (!el) return;

//   const player = MpegtsHlsPlayer.createPlayer(
//     { type: 'flv', isLive: true, url: currentUrl.value },
//     { enableWorker: true, enableStashBuffer: false }
//   );
//   _player.value = player;
//   player.attachMediaElement(el);
//   player.load();
//   player.play().catch(() => {});
// }

onMounted(() => {
  EventEmitter.add('destroy-video', _destroyPlayer);
});

onUnmounted(() => {
  EventEmitter.remove('destroy-video', _destroyPlayer);
});

watch(
  () => props.url,
  (val) => { currentUrl.value = val },
  { immediate: true }
)
</script>

<script module="renderJs" lang="renderjs">
import MpegtsHlsPlayer from 'mpegts.js'

let _videoUrl = ''
let _videoId = ''
let _player = null
let _destroying = false
let _retryCount = 0
let _gen = 0 // generation token to ignore late events

function _teardown() {
  if (!_player) return
  _destroying = true
  const p = _player
  _player = null

  // Stop playback first
  try { p.pause && p.pause() } catch (e) {}

  // Graceful MSE shutdown: unload -> detach -> destroy
  try { p.unload && p.unload() } catch (e) {}
  try { p.detachMediaElement && p.detachMediaElement() } catch (e) {}
  try { p.destroy && p.destroy() } catch (e) {}

  // Also clear the <video> element to drop the MediaSource cleanly
  try {
    const el = document.getElementById(_videoId)
    if (el) {
      el.removeAttribute('src')
      el.load && el.load()
    }
  } catch (e) {}

  _destroying = false
}

export default {
  methods: {
    _play(payload) {
      const url = payload && payload.url
      const id = payload && payload.id

      if (!url || !id) {
        _teardown()
        return
      }

      _videoUrl = url
      _videoId  = id
      _gen += 1
      const myGen = _gen

      // Ensure previous player is fully gone
      _teardown()

      const el = document.getElementById(_videoId)
      if (!el) return

      const player = MpegtsHlsPlayer.createPlayer(
        {
          type: 'flv',
          isLive: true,
          hasAudio: false,
          cors: true,
          url: _videoUrl
        },
        {
          enableWorker: true,
          enableStashBuffer: false,
          liveBufferLatencyChasing: true,
          liveBufferLatencyMaxLatency: 1.2,
          liveBufferLatencyMinRemain: 1
        }
      )

      _player = player

      player.attachMediaElement(el)

      player.on(MpegtsHlsPlayer.Events.ERROR, (e) => {
        // Ignore events from an obsolete player instance
        if (myGen !== _gen) return
        if (_retryCount > 5) return
        _retryCount += 1

        if (e === MpegtsHlsPlayer.ErrorTypes.NETWORK_ERROR) {
          this._videoRefresh(-100)
          // small async gap to ensure MSE is fully released before re-create
          setTimeout(() => {
            if (myGen === _gen) this._reRun()
          }, 60)
        }
      })

      try {
        player.load()
        player.play()
      } catch (e) {
        // If play() throws, clean up to avoid half-initialized state
        if (myGen === _gen) _teardown()
      }
    },

    _videoRefresh(val) {
      if (val !== -100) _retryCount = 0
      _teardown()
    },

    _reRun() {
      if (!_videoUrl || !_videoId) return
      // Reuse the same stored url/id for this instance
      this._play({ url: _videoUrl, id: _videoId })
    }
  }
}
</script>
