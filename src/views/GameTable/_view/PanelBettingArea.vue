<template>
<view class='pba_model'>

  <!-- <view class='pba_model'> -->

    <template v-for='(item,index) in (_operaStore.betBjlList.length < 1 ? _virList : _operaStore.betBjlList)' :key='item.ident'>
      <view
        :class='[
          "pba_view",
          `_type_${gameStore.gameType}`,
          gameStore.gameStatus !== "timing" && "_disable"
        ]'
        @tap='()=> _operaStore.addBet(item.ident)'
      >
        <view
          :class='[
            "pba_vi_content",
            gameStore.winBetList.includes(item.ident) && "_blingling animation-bling",
          ]'
        >
          <view class='pba_vi_co_name'>{{item.nameZh}}</view>
          <view class='pba_vi_co_prompt'>{{item.oddsStr}}</view>
          <view :class='["pba_vi_co_amount", _hasWaitNum(item.ident) && "_hasWait"]'>{{ _getTotalAmount((item.ident)) }}</view>
        </view>
      </view>
    </template>

  <!-- </view> -->

</view>
</template>
<script setup name='PanelBettingArea'>
import { useOperaStore } from '@front/stores/modules/opera.store';
import { useGameStore } from '@front/stores/modules/game.store';

const _operaStore = useOperaStore(),
      gameStore = useGameStore()
;

const _virList = [
  { ident:'', nameZh:'', oddsStr:'', },
  { ident:'', nameZh:'', oddsStr:'', },
  { ident:'', nameZh:'', oddsStr:'', },
  { ident:'', nameZh:'', oddsStr:'', },
  { ident:'', nameZh:'', oddsStr:'', },
];

function _hasWaitNum(ident) {
  if (!ident) return '';
  return !isNaN(_operaStore.getWaitBetAmountAll[ident]);
}

function _getTotalAmount(ident) {
  if (!ident) return '';
  const _isAffirmNum = isNaN(_operaStore.getAffirmBetAmountAll[ident]) ? NaN : _operaStore.getAffirmBetAmountAll[ident],
        _waitAffirmNum = isNaN(_operaStore.getWaitBetAmountAll[ident]) ? NaN : _operaStore.getWaitBetAmountAll[ident]
  ;

  return (
    (isNaN(_isAffirmNum) && isNaN(_waitAffirmNum)) ? '' :
    (!isNaN(_isAffirmNum) && !isNaN(_waitAffirmNum)) ? (_isAffirmNum + _waitAffirmNum) :
    (_isAffirmNum || _waitAffirmNum)
  )
}

</script>
<style lang='less' src='@front/zstyles/views/GameTable/_view/PanelBettingArea.less' scoped></style>
