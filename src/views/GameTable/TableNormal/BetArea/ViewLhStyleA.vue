<!-- <template>
<view class='vlsa_model'>

  <view class='vlsa_ph01'></view>
  <view class='vlsa_ph02'></view>
  <view class='vlsa_ph03'></view>
  <view class='vlsa_ph04'></view>
  <view class='vlsa_ph05'></view>
  <view class='vlsa_ph06'></view>

  <ViewBlock class='vlsa_view _view01' color='colorB' :rate='gameStore.betRate.notCommission.longDan' ident='bet-longdan' :name='t("lh_short.longdan")' />
  <ViewBlock class='vlsa_view _view01' color='colorB' :rate='gameStore.betRate.notCommission.longShuang' ident='bet-longshuang' :name='t("lh_short.longshuang")' />
  <ViewBlock class='vlsa_view _view01' color='colorA' :rate='gameStore.betRate.notCommission.huDan' ident='bet-hudan' :name='t("lh_short.hudan")' />
  <ViewBlock class='vlsa_view _view01' color='colorA' :rate='gameStore.betRate.notCommission.huShuang' ident='bet-hushuang' :name='t("lh_short.hushuang")' />

  <ViewBlock class='vlsa_view _view02' color='colorB' :rate='gameStore.betRate.notCommission.long' ident='bet-long' :name='t("lh_short.long")' />
  <ViewBlock class='vlsa_view _view02' color='colorC' :rate='gameStore.betRate.notCommission.he' ident='bet-he' :name='t("lh_short.he")' />
  <ViewBlock class='vlsa_view _view02' color='colorA' :rate='gameStore.betRate.notCommission.hu' ident='bet-hu':name='t("lh_short.hu")' />

</view>
</template> -->
<template>
  <view class="vlsa_model">
    <!-- Top row: 4 equal tiles -->
    <ViewBlock
      class="vh_cell top top-1"
      color="colorB"
      :rate="gameStore.betRate.notCommission.longDan"
      ident="bet-longdan"
      :name='t("lh_short.longdan")'
    />
    <ViewBlock
      class="vh_cell top top-2"
      color="colorB"
      :rate="gameStore.betRate.notCommission.longShuang"
      ident="bet-longshuang"
      :name='t("lh_short.longshuang")'
    />
    <ViewBlock
      class="vh_cell top top-3"
      color="colorA"
      :rate="gameStore.betRate.notCommission.huDan"
      ident="bet-hudan"
      :name='t("lh_short.hudan")'
    />
    <ViewBlock
      class="vh_cell top top-4"
      color="colorA"
      :rate="gameStore.betRate.notCommission.huShuang"
      ident="bet-hushuang"
      :name='t("lh_short.hushuang")'
    />

    <!-- Bottom row: 3 equal tiles -->
    <ViewBlock
      class="vh_cell bottom bottom-1"
      color="colorB"
      :rate="gameStore.betRate.notCommission.long"
      ident="bet-long"
      :name='t("lh_short.long")'
    />
    <ViewBlock
      class="vh_cell bottom bottom-2"
      color="colorC"
      :rate="gameStore.betRate.notCommission.he"
      ident="bet-he"
      :name='t("lh_short.he")'
    />
    <ViewBlock
      class="vh_cell bottom bottom-3"
      color="colorA"
      :rate="gameStore.betRate.notCommission.hu"
      ident="bet-hu"
      :name='t("lh_short.hu")'
    />
  </view>
</template>

<script setup name='ViewLhStyleA'>
import ViewBlock from './ViewBlock.vue';
import { useGameStore } from '@front/stores/modules/game.store';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const gameStore = useGameStore();

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableNormal/BetArea/ViewLhStyleA.less' scoped></style>
