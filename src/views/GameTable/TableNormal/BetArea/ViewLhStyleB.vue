<!-- <template>
<view class='vlsb_model'>

  <view class='vlsb_ph01'></view>
  <view class='vlsb_ph02'></view>
  <view class='vlsb_ph03'></view>
  <view class='vlsb_ph04'></view>
  <view class='vlsb_ph05'></view>
  <view class='vlsb_ph06'></view>

  <ViewBlock class='vlsb_view _view01' color='colorB' :rate='gameStore.betRate.isCommission.longDan' ident='bet-longdan' :name='t("lh_short.longdan")' />
  <ViewBlock class='vlsb_view _view01' color='colorB' :rate='gameStore.betRate.isCommission.longShuang' ident='bet-longshuang' :name='t("lh_short.longshuang")' />
  <ViewBlock class='vlsb_view _view01' color='colorA' :rate='gameStore.betRate.isCommission.huDan' ident='bet-hudan' :name='t("lh_short.hudan")' />
  <ViewBlock class='vlsb_view _view01' color='colorA' :rate='gameStore.betRate.isCommission.huShuang' ident='bet-hushuang' :name='t("lh_short.hushuang")' />

  <ViewBlock class='vlsb_view _view02' color='colorB' :rate='gameStore.betRate.isCommission.long' ident='bet-long' :name='t("lh_short.long")' />
  <ViewBlock class='vlsb_view _view02' color='colorC' :rate='gameStore.betRate.isCommission.he' ident='bet-he' :name='t("lh_short.he")' />
  <ViewBlock class='vlsb_view _view02' color='colorA' :rate='gameStore.betRate.isCommission.hu' ident='bet-hu' :name='t("lh_short.hu")' />

</view>
</template> -->
<template>
<view class='vlsb_model'>

  <ViewBlock class='vh_cell top top-1' color='colorB' :rate='gameStore.betRate.isCommission.longDan' ident='bet-longdan' :name='t("lh_short.longdan")' />
  <ViewBlock class='vh_cell top top-2' color='colorB' :rate='gameStore.betRate.isCommission.longShuang' ident='bet-longshuang' :name='t("lh_short.longshuang")' />
  <ViewBlock class='vh_cell top top-3' color='colorA' :rate='gameStore.betRate.isCommission.huDan' ident='bet-hudan' :name='t("lh_short.hudan")' />
  <ViewBlock class='vh_cell top top-4' color='colorA' :rate='gameStore.betRate.isCommission.huShuang' ident='bet-hushuang' :name='t("lh_short.hushuang")' />

  <ViewBlock class='vh_cell bottom bottom-1' color='colorB' :rate='gameStore.betRate.isCommission.long' ident='bet-long' :name='t("lh_short.long")' />
  <ViewBlock class='vh_cell bottom bottom-2' color='colorC' :rate='gameStore.betRate.isCommission.he' ident='bet-he' :name='t("lh_short.he")' />
  <ViewBlock class='vh_cell bottom bottom-3' color='colorA' :rate='gameStore.betRate.isCommission.hu' ident='bet-hu' :name='t("lh_short.hu")' />

</view>
</template>
<script setup name='ViewLhStyleB'>
import ViewBlock from './ViewBlock.vue';
import { useGameStore } from '@front/stores/modules/game.store';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const gameStore = useGameStore();

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableNormal/BetArea/ViewLhStyleB.less' scoped></style>
