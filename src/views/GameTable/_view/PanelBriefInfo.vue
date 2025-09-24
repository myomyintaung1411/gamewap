<template>
<view>

  <view class='pbi_model'>

    <view class='pbi_view'>台号: {{ deskNo }} 局: {{ isNaN(gameStore.roundInfo.roundNum) ? '--' : gameStore.roundInfo.roundNum }} 口: {{ isNaN(gameStore.roundInfo.slotNum) ? '--' : (gameStore.roundInfo.slotNum < 0 ? 0 : gameStore.roundInfo.slotNum) }}</view>

    <view class='pbi_view'>赢额: {{ isNaN(gameStore.winAmount) ? 0 : gameStore.winAmount }}</view>

    <view class='pbi_view'>
      游戏限红: {{
        gameStore.limitArea[0]
          ? (
              (isNaN(gameStore.limitRedTotal.min) ? '' : _transNumToK(gameStore.limitRedTotal.min)) +
              ' - ' +
              (isNaN(gameStore.limitRedTotal.max) ? '' : _transNumToK(gameStore.limitRedTotal.max))
            )
          : '--'
      }}
    </view>

  </view>

</view>
</template>
<script setup name='PanelBriefInfo'>
import { computed, } from 'vue';
import { useGameStore } from '@front/stores/modules/game.store';
import { useDeskStore } from '@front/stores/modules/desk.store';

const gameStore = useGameStore(),
      deskStore = useDeskStore()
;

const deskNo = computed(()=> {
  return ({
    '10184': '百1',
    '10185': '百2',
    '10186': '百3',
    '10187': '百4',
    '10188': '龙5',
    '10189': '龙6',
  })[deskStore.useDesk] || '--';
});

function _transNumToK(value){
  if (value >= 1000) {
    return (value / 1000) + 'K';
  }
  return value.toString();
}

</script>
<style lang='less' src='@front/zstyles/views/GameTable/_view/PanelBriefInfo.less' scoped></style>
