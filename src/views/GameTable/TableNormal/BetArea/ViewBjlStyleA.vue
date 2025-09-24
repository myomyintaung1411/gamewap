<template>
<view class='vbsa_model'>

  <view class='vbsa_ph01'></view>
  <view class='vbsa_ph02'></view>
  <view class='vbsa_ph03'></view>
  <view class='vbsa_ph04'></view>

  <ViewBlock class='vbsa_view _view01' color='colorA' :rate='gameStore.betRate.notCommission.xianDui' ident='bet-xiandui' :name='t("bjl_short.xiandui")' />

  <ViewBlock class='vbsa_view _view01' color='colorC' :rate='gameStore.betRate.notCommission.he' ident='bet-he' :name='t("bjl_short.he")' />

  <ViewBlock class='vbsa_view _view01' color='colorB' :rate='gameStore.betRate.notCommission.zhuangDui' ident='bet-zhuangdui' :name='t("bjl_short.zhuangdui")' />

  <ViewBlock class='vbsa_view _view02' color='colorA' :rate='gameStore.betRate.notCommission.xian' ident='bet-xian' :name='t("bjl_short.xian")' />

  <ViewBlock class='vbsa_view _view02' color='colorB' :rate='gameStore.betRate.notCommission.zhuang' ident='bet-zhuang' :name='t("bjl_short.zhuang")' />

</view>
</template>
<script setup name='ViewBjlStyleA'>
import ViewBlock from './ViewBlock.vue';
import { useGameStore } from '@front/stores/modules/game.store';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const gameStore = useGameStore();

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableNormal/BetArea/ViewBjlStyleA.less' scoped></style>
