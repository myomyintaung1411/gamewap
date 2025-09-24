<template>
<view
  :class='[
    "vb_model",
    (["bet-longdan", "bet-hudan", "bet-longshuang", "bet-hushuang"].includes(ident) && gameStore.disableBetLhDS) && "_disable",
    color,
  ]'
  :data-ident='ident' @click='operaStore.addBet(ident)'
>

  <template v-if='gameStore.winBetList.includes(ident)'>
    <div class='vb_animation'></div>
  </template>

  <view class='vb_name'>{{name}}</view>

  <view class='vb_rate'>{{rate}}</view>

  <ViewAmount :hasWaitAmount='_hasWaitNum(ident)' :amount='_getTotalAmount(ident)' />

  <ViewPool
    :count='gameStore.bothBet ? (gameStore.bothBet[_shortIdent] ? gameStore.bothBet[_shortIdent].count : NaN) : NaN'
    :amount='gameStore.bothBet ? (gameStore.bothBet[_shortIdent] ? gameStore.bothBet[_shortIdent].value : NaN) : NaN'
  />

</view>
</template>
<script setup name='ViewBlock'>
import ViewAmount from './ViewAmount.vue';
import ViewPool from './ViewPool.vue';
import { useOperaStore } from '@front/stores/modules/opera.store';
import { useGameStore } from '@front/stores/modules/game.store';

const _props = defineProps({
  ident: String,
  rate: String,
  name: String,
  color: String,
})

const operaStore = useOperaStore(),
      gameStore = useGameStore()
;

const _shortIdent = _props.ident.substring(4);

function _hasWaitNum(ident) {
  if (!ident) return '';
  return !isNaN(operaStore.getWaitBetAmountAll[ident]);
}

function _getTotalAmount(ident) {
  if (!ident) return '';
  const _isAffirmNum = isNaN(operaStore.getAffirmBetAmountAll[ident]) ? NaN : operaStore.getAffirmBetAmountAll[ident],
        _waitAffirmNum = isNaN(operaStore.getWaitBetAmountAll[ident]) ? NaN : operaStore.getWaitBetAmountAll[ident]
  ;

  return (
    (isNaN(_isAffirmNum) && isNaN(_waitAffirmNum)) ? '' :
    (!isNaN(_isAffirmNum) && !isNaN(_waitAffirmNum)) ? (_isAffirmNum + _waitAffirmNum) :
    (_isAffirmNum || _waitAffirmNum)
  )
}

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableNormal/BetArea/ViewBlock.less' scoped></style>
