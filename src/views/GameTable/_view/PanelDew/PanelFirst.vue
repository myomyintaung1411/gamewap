<template>
<view class='pf_box'>

  <DewCanvas ident='PanelFirst' :boxItemWidth='size' :dewItemWidth='size' :backColNum='1' :pointColumn='1' :isAsk='_isAskList' :list='_list' />

</view>
</template>
<script setup name='PanelFirst'>
import { ref, computed } from 'vue';
import DewCanvas from '@front/components/DewCanvas.vue';
import { useGameStore } from '@front/stores/modules/game.store';

defineProps({
  size: Number,
})

const gameStore = useGameStore(),
      _isAskList = computed(()=> gameStore.askDewListFirst.length > 0),
      _list = computed(()=> (
        gameStore.askDewListFirst.length > 0
          ? gameStore.askDewListFirst
          : gameStore.dewListFirst
      ))
;

</script>
<style lang='less' src='@front/zstyles/views/GameTable/_view/PanelDew/PanelFirst.less' scoped></style>
