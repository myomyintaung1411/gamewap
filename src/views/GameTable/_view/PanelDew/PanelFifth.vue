<template>
<view class='pf_box'>

  <DewCanvas ident='PanelFifth' :boxItemWidth='size' :dewItemWidth='size / 2' :backColNum='4' :pointColumn='4' :isAsk='_isAskList' :blingIndex='_blingIndex' :list='_list' />

</view>
</template>
<script setup name='PanelFifth'>
import { ref, computed } from 'vue';
import DewCanvas from '@front/components/DewCanvas.vue';
import { useGameStore } from '@front/stores/modules/game.store';

defineProps({
  size: Number,
})

const gameStore = useGameStore();

const _blingIndex = computed(()=> {
        if (!_isAskList.value) return -1;

        const _fDiff = findDifferentElements(gameStore.dewListFifth, gameStore.askDewListFifth);
        return _fDiff > -1 ? _fDiff : undefined;
      }),
      _isAskList = computed(()=> gameStore.askDewListFifth.length > 0),
      _list = computed(()=> (
        gameStore.askDewListFifth.length > 0
          ? gameStore.askDewListFifth
          : gameStore.dewListFifth
      ))
;

function findDifferentElements(arr1, arr2) {
  let diffIndexes = -1;

  for (let i = 0; i < arr2.length; i++) {
    if (arr1[i] !== arr2[i]) {
      diffIndexes = i;
      continue;
    }
  }

  return diffIndexes;
}

</script>
<style lang='less' src='@front/zstyles/views/GameTable/_view/PanelDew/PanelFifth.less' scoped></style>
