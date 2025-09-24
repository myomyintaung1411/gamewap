<template>
<view class='ps_box'>

  <DewCanvas ident='PanelSixth' :boxItemWidth='size' :dewItemWidth='size' :backColNum='2' :pointColumn='4' :isAsk='_isAskList' :blingIndex='_blingIndex' :list='_list' />

</view>
</template>
<script setup name='PanelSixth'>
import { ref, computed } from 'vue';
import DewCanvas from '@front/components/DewCanvas.vue';
import { useGameStore } from '@front/stores/modules/game.store';

defineProps({
  size: Number,
})

const gameStore = useGameStore();

const _blingIndex = computed(()=> {
        if (!_isAskList.value) return -1;

        const _fDiff = findDifferentElements(gameStore.dewListSixth, gameStore.askDewListSixth);
        return _fDiff > -1 ? _fDiff : undefined;
      }),
      _isAskList = computed(()=> gameStore.askDewListSixth.length > 0),
      _list = computed(()=> (
        gameStore.askDewListSixth.length > 0
          ? gameStore.askDewListSixth
          : gameStore.dewListSixth
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
<style lang='less' src='@front/zstyles/views/GameTable/_view/PanelDew/PanelSixth.less' scoped></style>
