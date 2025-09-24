<template>
<view class='vm_model'>

  <!-- <video
    id='video-id' class='vv_video'
    object-fit='fill' :autoplay='true' :muted='true' :show-fullscreen-btn='false' :show-play-btn='false' :show-center-play-btn='false' :enable-progress-gesture='false' :controls='false' :is-live='true'
  ></video> -->
  <!-- <template v-if='systemStore.platform === "APP"'> -->
    <div v-html='_vHtml' style='width:100%; height:100%;'></div>
    <!-- <view
      style='dipslay:none;'
      :change:detail='renderJs._play' :detail='gameStore.videoUrl'
      :change:isios='renderJs._setPlatform' :isios='_isIos'
      :change:videoRefresh='renderJs._videoRefresh' :videoRefresh='_videoRefresh'
    ></view> -->
    <view
      style='dipslay:none;'
      :change:detail='renderJs._play' :detail='gameStore.videoUrl'
      :change:videoRefresh='renderJs._videoRefresh' :videoRefresh='_destoryCount'
      :change:reRun='renderJs._reRun' :reRun='_runCount'
    ></view>
  <!-- </template> -->
  <!-- <template v-else>
    222222
  </template> -->

</view>
</template>
<script setup name='ViewMpegts'>
import { ref } from 'vue';
import { useGameStore } from '@front/stores/modules/game.store';
// import { useSystemStore } from '@front/stores/modules/system.store';

const gameStore = useGameStore()/*,
      systemStore = useSystemStore()*/
;

const _vHtml = `
  <video
    id='video-id' class='vv_video'
    object-fit='fill' :autoplay='true' :muted='true' :show-fullscreen-btn='false' :show-play-btn='false' :show-center-play-btn='false' :enable-progress-gesture='false' :controls='false' :is-live='true' poster='none' webkit-playsinline='true' playsinline='true'
    style='width:100%; height:100%; background:#2b5a45; object-fit:fill;'
  ></video>
`;

const _destoryCount = ref(0),
      _runCount = ref(0)
;

defineExpose({
  destroyPlayer: _destroyPlayer,
  runPlayer: _runPlayer,
})

function _destroyPlayer() {
  _destoryCount.value += 1;
}

function _runPlayer() {
  _runCount.value += 1;
}

/*import { watch } from 'vue';
import MpegtsHlsPlayer from 'mpegts.js';

MpegtsHlsPlayer.LoggingControl.enableVerbose = false;

const _props = defineProps({
  url: String,
})

defineExpose({
  destroyPlayer: _destroyPlayer,
  runPlayer: _runPlayer,
})

let _jessibucaClient = false,
    _jessibucaDestoryIng = false
;

function _destroyPlayer() {
  if (_jessibucaDestoryIng) return;

  _jessibucaDestoryIng = true;
  _jessibucaClient.destroy();
  _jessibucaClient = null;
  _jessibucaDestoryIng = false;
}

async function _runPlayer() {
  const _URL = _props.url;

  _jessibucaClient = MpegtsHlsPlayer.createPlayer(
    {
      type: 'flv',
      isLive: true,
      hasAudio: false,
      cors: true,
      url: _URL,
    },
    {
      enableWorker: true,
      enableStashBuffer: false,
      liveBufferLatencyChasing: true,
      liveBufferLatencyMaxLatency: 1,
      liveBufferLatencyMinRemain: 0.3,
    },
  )
  _jessibucaClient.attachMediaElement(document.getElementById('video-id').children[0].getElementsByTagName('video')[0]);
  _jessibucaClient.load();
  _jessibucaClient.play();
}

watch(()=> _props.url, (newVal)=> {
  if (!newVal) return _destroyPlayer();

  _runPlayer();
})*/

</script>
<script module='renderJs' lang='renderjs'>
// import vConsole from 'vconsole';
// new vConsole();
import MpegtsHlsPlayer from 'mpegts.js';

let _IS_IOS = false,
    _videoUrl = '',
    _jessibucaDestoryIng = false,
    _jessibucaClient = null,
    _reTryCount = 0
;

export default {
  methods: {
    _setPlatform(value) {
      _IS_IOS = value;
      // if (!_jessibucaClient) {
      //   _jessibucaClient = new window.Jessibuca(_JESSIBUCA_CONFIG());
      // }
    },
    _play(value) {
      if (!value) {
        if (_jessibucaClient) {
          // _jessibucaClient.destroy();
          if (_jessibucaDestoryIng) return;

          _jessibucaDestoryIng = true;
          _jessibucaClient.destroy();
          _jessibucaClient = null;
          _jessibucaDestoryIng = false;
          _jessibucaClient = null;
        }
        return;
      }

      // _jessibucaClient = new window.Jessibuca(_JESSIBUCA_CONFIG());
      // _videoUrl = value;
      // _jessibucaClient.play(_videoUrl);
      // const _URL = value;
      _videoUrl = value;

      _jessibucaClient = MpegtsHlsPlayer.createPlayer(
        {
          type: 'flv',
          isLive: true,
          hasAudio: false,
          cors: true,
          url: _videoUrl,
        },
        {
          enableWorker: true,
          enableStashBuffer: false,
          liveBufferLatencyChasing: true,
          liveBufferLatencyMaxLatency: 1.2,
          liveBufferLatencyMinRemain: 1,
        },
      )

      _jessibucaClient.attachMediaElement(document.getElementById('video-id'));
      _jessibucaClient.on(MpegtsHlsPlayer.Events.ERROR, (e)=> {
        if (_reTryCount > 5) return;
        _reTryCount += 1;
        if (e === MpegtsHlsPlayer.ErrorTypes.NETWORK_ERROR) {
          this._videoRefresh(-100);
          this._reRun();
        }
      });
      // _jessibucaClient.on(MpegtsHlsPlayer.Events.STATISTICS_INFO, (e)=> {
      //   console.log('player STATISTICS_INFO', e);
      // });
      _jessibucaClient.load();
      _jessibucaClient.play();
    },
    _videoRefresh(value) {
      value !== -100 && (_reTryCount = 0);
      if (_jessibucaDestoryIng || !_jessibucaClient) return;

      _jessibucaDestoryIng = true;
      _jessibucaClient.destroy();
      _jessibucaClient = null;
      _jessibucaDestoryIng = false;
    },
    _reRun() {
      if (!_videoUrl) return;

      // _jessibucaClient = new window.Jessibuca(_JESSIBUCA_CONFIG());
      // _videoUrl = value;
      // _jessibucaClient.play(_videoUrl);
      // const _URL = value;

      _jessibucaClient = MpegtsHlsPlayer.createPlayer(
        {
          type: 'flv',
          isLive: true,
          hasAudio: false,
          cors: true,
          url: _videoUrl,
        },
        {
          enableWorker: true,
          enableStashBuffer: false,
          liveBufferLatencyChasing: true,
          liveBufferLatencyMaxLatency: 1.2,
          liveBufferLatencyMinRemain: 1,
        },
      )

      _jessibucaClient.attachMediaElement(document.getElementById('video-id'));
      _jessibucaClient.on(MpegtsHlsPlayer.Events.ERROR, (e)=> {
        if (_reTryCount > 5) return;
        _reTryCount += 1;
        if (e === MpegtsHlsPlayer.ErrorTypes.NETWORK_ERROR) {
          this._videoRefresh(-100);
          this._reRun();
        }
      });
      _jessibucaClient.load();
      _jessibucaClient.play();
    },
  },
  mounted() {
  }
}
</script>
<style lang='less' src='@front/zstyles/components/VideoPlayer/ViewMpegts.less' scoped></style>
