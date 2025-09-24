<template>
<view class='vbsb_model'>

  <view class='vbsb_ph01'></view>
  <view class='vbsb_ph02'></view>
  <view class='vbsb_ph03'></view>
  <view class='vbsb_ph04'></view>
  <view class='vbsb_ph05'></view>

  <ViewBlock class='vbsb_view _view01' color='colorA' :rate='gameStore.betRate.isCommission.xianDui' ident='bet-xiandui' :name='t("bjl_short.xiandui")'  />

  <ViewBlock class='vbsb_view _view01' color='colorC' :rate='`${gameStore.betRate.isCommission.xingYun}/${gameStore.betRate.isCommission.xingYun6}`' ident='bet-xingyun' :name='t("bjl_short.xingyun")' />

  <ViewBlock class='vbsb_view _view01' color='colorB' :rate='gameStore.betRate.isCommission.zhuangDui' ident='bet-zhuangdui' :name='t("bjl_short.zhuangdui")' />

  <ViewBlock class='vbsb_view _view02' color='colorA' :rate='gameStore.betRate.isCommission.xian' ident='bet-xian' :name='t("bjl_short.xian")' />

  <ViewBlock class='vbsb_view _view02' color='colorC' :rate='gameStore.betRate.isCommission.he' ident='bet-he' :name='t("bjl_short.he")' />

  <ViewBlock class='vbsb_view _view02' color='colorB' :rate='gameStore.betRate.isCommission.zhuang' ident='bet-zhuang' :name='t("bjl_short.zhuang")' />

</view>
</template>
<script setup name='ViewBjlStyleB'>
import ViewBlock from './ViewBlock.vue';
import { useGameStore } from '@front/stores/modules/game.store';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const gameStore = useGameStore();

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableNormal/BetArea/ViewBjlStyleB.less' scoped></style>
