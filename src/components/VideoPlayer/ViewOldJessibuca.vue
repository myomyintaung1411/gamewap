<template>
<view class='vv_model'>

  <template v-if='systemStore.platform === "APP"'>
    <view id='video-id' class='vv_video' ref='_vVideoElement'></view>
    <view
      style='dipslay:none;'
      :change:detail='renderJs._play' :detail='gameStore.videoUrl'
      :change:isios='renderJs._setPlatform' :isios='_isIos'
      :change:videoRefresh='renderJs._videoRefresh' :videoRefresh='_videoRefresh'
    ></view>
  </template>
  <template v-else>
    <view id='video-id' class='vv_video' ref='_vVideoElement'></view>
  </template>
  <view></view>

</view>
</template>
<script setup name='ViewOldJessibuca'>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useGameStore } from '@front/stores/modules/game.store';
import { useSystemStore } from '@front/stores/modules/system.store';
import { EventEmitter, } from '@front/eventBus/index';
import { VIDEO_REFRESH, } from '@front/eventBus/actions';

const _props = defineProps({
  url: String,
})

defineExpose({
  destroyPlayer: _destroyPlayer,
  runPlayer: _runPlayer,
})

const _IS_IOS = uni.getSystemInfoSync().osName === 'ios';

const gameStore = useGameStore(),
      systemStore = useSystemStore()
;

const _JESSIBUCA_CONFIG = ()=> (Object.assign(
  {
    container: new Date().getTime() > 1 ? document.getElementById('video-id') : _vVideoElement.value,
    decoder: 'static/decoder.js',
    videoBuffer: 0.1,
    isResize: false,
    text: '',
    loadingText: '',
    debug: false,
    showBandwidth: false,
    operateBtns: {
    },
    isNotMute: false,
  },
  _IS_IOS ? { useMSE:true } : { useWCS:true, wcsUseVideoRender:true, forceNoOffscreen:true, }
))

const _vVideoElement = ref(null)/*,
      _isIos = ref(uni.getSystemInfoSync().osName === 'ios'),
      _videoRefresh = ref(0)*/
;

let _jessibucaClient = false,
    _jessibucaDestoryIng = false
;

function _readyJessiibuca() {
  return new Promise(resolve=> {

    if (_jessibucaDestoryIng) return resolve(false);

    _jessibucaClient = new window.Jessibuca(_JESSIBUCA_CONFIG());
    resolve(true);
  })
}

function _destroyPlayer() {
  if (_jessibucaDestoryIng) return;

  _jessibucaDestoryIng = true;
  return new Promise((resolve)=> {

    if (_jessibucaClient) {
      _jessibucaClient.destroy().then(()=>{
        _jessibucaClient = false;
        _jessibucaDestoryIng = false;

        resolve();
      });
    } else {
      _jessibucaDestoryIng = false;
      resolve();
    }
  })
}

async function _runPlayer() {
  const _result = await _readyJessiibuca();
  _result && _jessibucaClient.play(_props.url);
}

watch(()=> _props.url, (newVal)=> {
  if (systemStore.platform === 'APP') return;

  _destroyPlayer().then(()=> {
    if (!newVal) return;

    _runPlayer();
  });
}, { immediate:true })

</script>
<script module='renderJs' lang='renderjs'>

if (!window.Jessibuca) {
  const _script = document.createElement('script');
  _script.src = 'static/jessibuca.js';
  document.body.appendChild(_script);
}

let _IS_IOS = false,
    _videoUrl = ''
;

const _JESSIBUCA_CONFIG = ()=> (Object.assign(
  {
    container: document.getElementById('video-id'),
    decoder: 'static/decoder.js',
    videoBuffer: 0.1,
    isResize: false,
    text: '',
    loadingText: '',
    debug: false,
    showBandwidth: false,
    operateBtns: {
    },
    isNotMute: false,
  },
  _IS_IOS ? { useMSE:true } : { useWCS:true, wcsUseVideoRender:true, forceNoOffscreen:true, }
))
let _jessibucaClient = null;

export default {
  methods: {
    _setPlatform(value) {
      _IS_IOS = value;
      if (!_jessibucaClient) {
        _jessibucaClient = new window.Jessibuca(_JESSIBUCA_CONFIG());
      }
    },
    _play(value) {
      if (!value) {
        if (_jessibucaClient) {
          _jessibucaClient.destroy();
          _jessibucaClient = null;
        }
        return;
      }

      if (!_jessibucaClient) {
        _jessibucaClient = new window.Jessibuca(_JESSIBUCA_CONFIG());
      }
      _videoUrl = value;
      _jessibucaClient.play(_videoUrl);
    },
    _videoRefresh(value) {
      _jessibucaClient.destroy().then(()=>{
        _jessibucaClient = new window.Jessibuca(_JESSIBUCA_CONFIG());
        _jessibucaClient.play(_videoUrl);
      });
    },
  },
  mounted() {
  }
}
</script>
<style lang='less' src='@front/zstyles/components/VideoPlayer/ViewOldJessibuca.less' scoped></style>
