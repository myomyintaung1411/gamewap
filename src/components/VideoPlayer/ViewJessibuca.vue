<template>
<view class='vj_model'>

  <div id='video-id' class='vj_video'></div>
  <view
    style='dipslay:none;'
    :change:detail='renderJs._play' :detail='url'
    :change:videoRefresh='renderJs._videoRefresh' :videoRefresh='_destoryCount'
    :change:reRun='renderJs._reRun' :reRun='_runCount'
  ></view>

</view>
</template>
<script setup name='ViewJessibuca'>
import { ref,onMounted,onUnmounted } from 'vue';
import { EventEmitter } from '@front/eventBus/index'

const _props = defineProps({
  url: String,
})
let _jessibucaClient = null;

const _destoryCount = ref(0),
      _runCount = ref(0)
;

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
    // trigger renderJs._play(null) to fully destroy Jessibuca
    EventEmitter.emit('destroy-video');
    resolve();
  });
}



// function _runPlayer() {
//   if (_jessibucaClient) _destroyPlayer(); // destroy previous
//   _jessibucaClient = new Player({
//     id: 'video-id',
//     url: props.url.replace('.flv', '.m3u8'),
//     isLive: true,
//     autoplay: true,
//     playsinline: true,
//     autoplayMuted: true,
//     plugins: [HlsJsPlayer],
//     controls: false,
//   });
// }

function _runPlayer() {
  _runCount.value += 1;
}

onMounted(() => {
  EventEmitter.add('destroy-video', _destroyPlayer);
});

onUnmounted(() => {
  EventEmitter.remove('destroy-video', _destroyPlayer);
});


</script>
<script module='renderJs' lang='renderjs'>
import Player from 'xgplayer';
import HlsJsPlayer from 'xgplayer-hls.js';
// import "xgplayer/dist/index.min.css";

let _IS_IOS = false,
    _videoUrl = '',
    _jessibucaDestoryIng = false,
    _jessibucaClient = null
;

const _JESSIBUCA_CONFIG = (playerUrl)=> (Object.assign(
        {
          id: 'video-id',
          url: playerUrl.replace('.flv', '.m3u8'),
          isLive: true,
          autoplay: true,
          playsinline: true,
          autoplayMuted: true,
          plugins: [HlsJsPlayer],
          controls: false,
          hlsJsPlugin: {
            maxBufferLength: 1,
            backBufferLength: 0,
            liveDurationInfinity: true,
            maxLoadingDelay: 1,
            liveSyncDurationCount: 0, // 直播延迟的边缘，以 EXT-X-TARGETDURATION 的倍数表示。如果设置为 3，播放将从片段 N-3 开始，N 是直播播放列表的最后一个片段。降低此值可能会导致播放停顿。
            maxLiveSyncPlaybackRate: 2,
            liveMaxLatencyDurationCount: 1,
          },
        }
      ))
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
          return new Promise((resolve)=> {

            if (_jessibucaClient) {
              _jessibucaClient.destroy();
              _jessibucaDestoryIng = false;
              _jessibucaClient = null;
              resolve();
            } else {
              resolve();
            }
          })
        }
        return;
      }

      _videoUrl = value;

      _jessibucaClient = new Player(_JESSIBUCA_CONFIG(_videoUrl));

      let _count = 0;
      const _timeID = setInterval(()=> {
        _count += 1;

        if (_count > 30) return clearInterval(_timeID);

        else if (document.getElementById('video-id').children[0].tagName === 'VIDEO') {
          clearInterval(_timeID);
          this._autoPlayer();
        }

      }, 100)
    },
    async _autoPlayer() {
      let _count = 0;
      const _video = document.getElementById('video-id').children[0];

      _video.addEventListener('click', function (event) {
        event.preventDefault();
      }, false);

      _video.addEventListener('timeupdate', function (event) {
        _count += 1;
        if (_count > 1 && (_count % 5 !== 0)) return;

        const _buffered = _video.buffered;
        if (_buffered.length > 0) {
          const _bufferedEnd = _buffered.end(_buffered.length - 1);

          (_bufferedEnd - 1 > 0) && (_bufferedEnd - _video.currentTime > 0.8) && (
            _video.pause(),
            _video.currentTime = _bufferedEnd - 1,
            _video.play()
          )
        }
      });

      _video.addEventListener('ended', function (event) {
        _video.play();
      });
    },
    _videoRefresh(value) {
      if (_jessibucaDestoryIng || !_jessibucaClient) return;

      _jessibucaDestoryIng = true;
      _jessibucaClient.destroy();
      _jessibucaClient = null;
      _jessibucaDestoryIng = false;
    },
    _reRun() {
      if (!_videoUrl) return;

      _jessibucaClient = new Player(_JESSIBUCA_CONFIG(_videoUrl));

      let _count = 0;
      const _timeID = setInterval(()=> {
        _count += 1;

        if (_count > 30) return clearInterval(_timeID);

        else if (document.getElementById('video-id').children[0].tagName === 'VIDEO') {
          clearInterval(_timeID);
          this._autoPlayer();
        }

      }, 100)
    },
  },
  mounted() {
  }
}
</script>
<style lang='less' src='@front/zstyles/components/VideoPlayer/ViewJessibuca.less' scoped></style>
