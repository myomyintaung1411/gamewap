<template>
<view class='vv_model'>

  <VideoPlayer :url='gameStore.videoUrl' ref='_vVideoPlayer' />

</view>
</template>
<script setup name='ViewVideo'>
import { ref, onMounted, onUnmounted } from 'vue';
import VideoPlayer from '@front/components/VideoPlayer/Index.vue';
import { useGameStore } from '@front/stores/modules/game.store';
import { EventEmitter, } from '@front/eventBus/index';
import { VIDEO_REFRESH, } from '@front/eventBus/actions';

const gameStore = useGameStore();

const _vVideoPlayer = ref(null);

function _destroyPlayer() {
  _vVideoPlayer.value.destroyPlayer();
}

async function _runPlayer() {
  _vVideoPlayer.value.runPlayer();
}

async function _bindRefresh(callFunc) {
  await _destroyPlayer();
  _runPlayer();

  setTimeout(()=> {
    callFunc(true);
  }, 500);
}

onMounted(()=> {
  EventEmitter.add(VIDEO_REFRESH, _bindRefresh);
})

onUnmounted(()=> {
  EventEmitter.remove(VIDEO_REFRESH, _bindRefresh);
})

</script>
<style lang='less' src='@front/zstyles/views/GameTable/_view/PanelVideo/ViewVideo.less' scoped></style>
