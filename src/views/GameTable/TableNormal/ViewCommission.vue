<template>
<view class='vc_commission'>

  <view class='vc_co_name'>免佣</view>
  <switch class='vc_co_content' :disabled='(gameStore.isNoCommissionDesk) || (gameStore.getSelfStatus !== "opening")' :checked='_isNotCommission' color='#75bc2a' @change='_changeIsNotCommission(!_isNotCommission)' />

</view>
</template>
<script setup name='ViewCommission'>
import { inject } from 'vue';
import { useGameStore } from '@front/stores/modules/game.store';

const gameStore = useGameStore();

const _isNotCommission = inject('isNotCommission'),
      _changeIsNotCommission = inject('changeIsNotCommission')
;

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableNormal/ViewCommission.less' scoped></style>
