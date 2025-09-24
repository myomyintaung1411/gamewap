<template>
<view :class='["vc_model", (needZoom && ["opening", "settlement", "stopBetting"].includes(gameStore.gameStatus)) && "_zoom"]'>

  <VideoPlayer :url='gameStore.videoUrl' ref='_vVideoPlayer' />

</view>
</template>
<script setup name='VideoContent'>
import { ref, onMounted, onUnmounted } from 'vue';
import VideoPlayer from '@front/components/VideoPlayer/Index.vue';
import { useGameStore } from '@front/stores/modules/game.store';
import { EventEmitter, } from '@front/eventBus/index';
import { VIDEO_REFRESH, } from '@front/eventBus/actions';

defineProps({
  needZoom: Boolean,
})

const gameStore = useGameStore();

const _vVideoPlayer = ref(null);

async function _destroyPlayer() {
  await _vVideoPlayer.value.destroyPlayer();
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
<style lang='less' src='@front/zstyles/views/GameTable/TableNormal/VideoContent.less' scoped></style>
