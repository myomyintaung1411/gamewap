<template>
<view class='pt_box'>

  <DewCanvas ident='PanelThird' :boxItemWidth='size' :dewItemWidth='size / 2' :backColNum='4' :pointColumn='_calcPointColumn' :isAsk='_isAskList' :blingIndex='_blingIndex' :list='_list' />

</view>
</template>
<script setup name='PanelThird'>
import { ref, computed } from 'vue';
import DewCanvas from '@front/components/DewCanvas.vue';
import { useGameStore } from '@front/stores/modules/game.store';

defineProps({
  size: Number,
})

const gameStore = useGameStore();

const _blingIndex = computed(()=> {
        if (!_isAskList.value) return -1;

        const _fDiff = findDifferentElements(gameStore.dewListThird, gameStore.askDewListThird);
        return _fDiff > -1 ? _fDiff : undefined;
      }),
      _isAskList = computed(()=> gameStore.askDewListThird.length > 0),
      _list = computed(()=> (
        gameStore.askDewListThird.length > 0
          ? gameStore.askDewListThird
          : gameStore.dewListThird
      ))
;

const _calcPointColumn = computed(()=> {
  const [ _cFirst, _cSecond ] = (_list.value.length / 6).toString().split('.');

  const _value = (
    Number(_cFirst) +
    (_cSecond > 0 ? 1 : 0)
  );
  return (_value % 2 === 0 ? 2 : 3) + 20;
});

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
<style lang='less' src='@front/zstyles/views/GameTable/_view/PanelDew/PanelThird.less' scoped></style>
