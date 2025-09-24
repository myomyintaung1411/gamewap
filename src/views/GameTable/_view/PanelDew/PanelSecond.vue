<template>
<view class='ps_box'>

  <DewCanvas ident='PanelSecond' :boxItemWidth='size' :dewItemWidth='size' :backColNum='2' :pointColumn='2' :isAsk='_isAskList' :blingIndex='_blingIndex' :list='_list' />

</view>
</template>
<script setup name='PanelSecond'>
import { ref, computed, } from 'vue';
import DewCanvas from '@front/components/DewCanvas.vue';
import { useGameStore } from '@front/stores/modules/game.store';

defineProps({
  size: Number,
})

const gameStore = useGameStore();

const _blingIndex = computed(()=> {
        /*if (!_isAskList.value) return -1;
        let _index = -1,
            _xyCountMax = -1;
        for (let i = gameStore.askDewListSecond.length-1; i >= 0; i-=1) {
          gameStore.askDewListSecond[i].xyCount > _xyCountMax && (
            _index = i,
            _xyCountMax = gameStore.askDewListSecond[i].xyCount
          )
        }
        return _index;*/
        if (!_isAskList.value) return -1;

        const _fDiff = findDifferentElements(gameStore.dewListSecond, gameStore.askDewListSecond);
        return _fDiff > -1 ? _fDiff : undefined;
      }),
      _isAskList = computed(()=> gameStore.askDewListSecond.length > 0),
      _list = computed(()=> (
        gameStore.askDewListSecond.length > 0
          ? gameStore.askDewListSecond
          : gameStore.dewListSecond
      ))
;

function findDifferentElements(arr1, arr2) {
  let diffIndexes = -1;

  for (let i = 0; i < arr2.length; i++) {
    if (
      (
        (typeof arr1[i] !== typeof arr2[i])
      ) ||
      (
        (typeof arr1[i] === typeof arr2[i]) &&
        (arr1[i].img !== arr2[i].img) &&
        (arr1[i].heCount !== arr2[i].heCount)
      )
    ) {
      diffIndexes = i;
      continue;
    }
  }

  return diffIndexes;
}

</script>
<style lang='less' src='@front/zstyles/views/GameTable/_view/PanelDew/PanelSecond.less' scoped></style>
