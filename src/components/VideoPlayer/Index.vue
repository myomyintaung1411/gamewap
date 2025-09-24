<template>
<view class='vp_model'>

  <!-- <ViewOldJessibuca :url='url' ref='_vViewOldJessibuca' /> -->
  <template v-if='_supportMpegts === "wait"'>
  </template>
  <template v-else-if='_supportMpegts'>

    <ViewMpegts :url='url' :video-id="videoId" ref='_vViewMpegts' />

  </template>
  <template v-else>

    <ViewJessibuca :url='url' ref='_vViewJessibuca' />

  </template>

  <div id='is-support-media-source' style='dipslay:none;'></div>

</view>
</template>
<script setup name='VideoPlayer'>
import { ref, onMounted,watch,onUnmounted } from 'vue';
import ViewMpegts from './ViewMpegts.vue';
// import ViewJessibuca from './ViewJessibuca.vue';
// import ViewOldJessibuca from './ViewOldJessibuca.vue';
// import MpegtsHlsPlayer from 'mpegts.js';
import { useSystemStore } from '@front/stores/modules/system.store';
import { EventEmitter } from '@front/eventBus/index'
import { registerVideo, unregisterVideo } from '@front/utils/videoController';

// #ifdef APP-PLUS
  import ViewJessibuca from './ViewJessibuca.vue';
// #endif
// #ifndef APP-PLUS
  import ViewJessibuca from './ViewJessibuca.vue';
  import MpegtsHlsPlayer from 'mpegts.js';
// #endif

const _props = defineProps({
  url: String,
   videoId: String
})

const systemStore = useSystemStore();

// #ifdef APP-PLUS
  const _supportMpegts = ref('wait');
// #endif
// #ifndef APP-PLUS
  const _supportMpegts = ref(MpegtsHlsPlayer.isSupported() === true);
// #endif

const /*_supportMpegts = ref(MpegtsHlsPlayer.isSupported() === true),*/
      // _supportMpegts = ref(true),
      _vViewMpegts = ref(null),
      _vViewJessibuca = ref(null)/*,
      _vViewOldJessibuca = ref(null)*/
;

defineExpose({
  destroyPlayer: _destroyPlayer,
  runPlayer: _runPlayer,
})

// async function _destroyPlayer() {
//   if (_supportMpegts.value) {
//     _vViewMpegts.value.destroyPlayer();
//   } else {
//     _vViewJessibuca.value.destroyPlayer();
//   }
//   // await _vViewOldJessibuca.value.destroyPlayer();
// }

async function _destroyPlayer() {
  try {
    if (_supportMpegts.value) {
      await _vViewMpegts.value?.destroyPlayer();
    } else if (_vViewJessibuca.value?.destroyPlayer) {
      await _vViewJessibuca.value?.destroyPlayer();
    }
    console.log("Video destroyed!");
  } catch (err) {
    console.warn("Failed to destroy video:", err);
  }
}

async function _runPlayer() {
  if (_supportMpegts.value) {
    _vViewMpegts.value.runPlayer();
  } else {
    _vViewJessibuca.value.runPlayer();
  }
  // _vViewOldJessibuca.value.runPlayer();
}

watch(() => _props.url, async (newUrl, oldUrl) => {
  if (newUrl !== oldUrl) {
    await _destroyPlayer();
    await _runPlayer();
  }
});


onUnmounted(() => {
    // unregister on destroy
  unregisterVideo({ destroyPlayer: _destroyPlayer, runPlayer: _runPlayer });

});

onMounted(()=> {
 // register this VideoPlayer globally
   registerVideo({ destroyPlayer: _destroyPlayer, runPlayer: _runPlayer });


  // #ifdef APP-PLUS
    uni.createSelectorQuery().select(`#is-support-media-source`)
      .fields({dataset:true})
      .exec(resBox=> {

        _supportMpegts.value = resBox[0].dataset.supportmediasource == 'true'
      })
  // #endif
  // #ifndef APP-PLUS
  // #endif
})

</script>
<script module='renderJs' lang='renderjs'>
import MpegtsHlsPlayer from 'mpegts.js';

export default {
  mounted() {
    // document.getElementById('is-support-media-source').setAttribute('data-supportMediaSource', 'MediaSource' in window ? 'true' : 'false');
    document.getElementById('is-support-media-source').setAttribute('data-supportMediaSource', MpegtsHlsPlayer.isSupported() === true ? 'true' : 'false');
  },
}

</script>
<style lang='less' src='@front/zstyles/components/VideoPlayer/Index.less' scoped></style>
