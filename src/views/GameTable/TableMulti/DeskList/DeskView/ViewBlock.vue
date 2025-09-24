<template>
<view
  :class='[
    "vb_model",
    (["bet-longdan", "bet-hudan", "bet-longshuang", "bet-hushuang"].includes(ident) && _deskItem.disableBetLhDS()) && "_disable",
    color
  ]'
  :data-ident='ident' @tap='_deskItem.addBet(ident, operaStore.chipsBjlEd)'
>

  <template v-if='!_deskItem.isPrivateIng && _deskItem.winBetList.includes(ident)'>
    <div class='vb_animation'></div>
  </template>

  <view class='vb_name'>{{name}}</view>

  <view class='vb_rate'>{{rate}}</view>

  <ViewAmount :hasWaitAmount='_hasWaitNum(ident)' :amount='_getTotalAmount(ident)' />

</view>
</template>
<script setup name='ViewBlock'>
import { inject } from 'vue';
import ViewAmount from './ViewAmount.vue';
import { useOperaStore } from '@front/stores/modules/opera.store';

defineProps({
  ident: String,
  rate: String,
  name: String,
  color: String,
})

const operaStore = useOperaStore();

const _deskItem = inject('deskItem');

function _hasWaitNum(ident) {
  if (!ident || !_deskItem.value) return '';
  return !isNaN(_deskItem.value.getWaitBetAmountAll()[ident]);
}

function _getTotalAmount(ident) {
  if (!ident || !_deskItem.value) return '';

  const __getAffirmBetAmountAll = _deskItem.value.getAffirmBetAmountAll(),
        __getWaitBetAmountAll = _deskItem.value.getWaitBetAmountAll()
  ;

  const _isAffirmNum = isNaN(__getAffirmBetAmountAll[ident]) ? NaN : __getAffirmBetAmountAll[ident],
        _waitAffirmNum = isNaN(__getWaitBetAmountAll[ident]) ? NaN : __getWaitBetAmountAll[ident]
  ;

  return (
    (isNaN(_isAffirmNum) && isNaN(_waitAffirmNum)) ? '' :
    (!isNaN(_isAffirmNum) && !isNaN(_waitAffirmNum)) ? (_isAffirmNum + _waitAffirmNum) :
    (_isAffirmNum || _waitAffirmNum)
  )
}

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableMulti/DeskList/DeskView/ViewBlock.less' scoped></style>
