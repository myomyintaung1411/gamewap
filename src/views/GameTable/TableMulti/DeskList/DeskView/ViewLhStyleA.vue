<template>
<view class='vlsa_model'>

  <view class='vlsa_ph01'></view>
  <view class='vlsa_ph02'></view>

  <ViewBlock class='vlsa_view _view01' color='colorB' :rate='_deskItem ? _deskItem.betRate.notCommission.long : ""' ident='bet-long' :name='t("lh_short.long")' />

  <ViewBlock class='vlsa_view _view01' color='colorC' :rate='_deskItem ? _deskItem.betRate.notCommission.he : ""' ident='bet-he' :name='t("lh_short.he")'/>

  <ViewBlock class='vlsa_view _view01' color='colorA' :rate='_deskItem ? _deskItem.betRate.notCommission.hu : ""' ident='bet-hu' :name='t("lh_short.hu")' />

</view>
</template>
<script setup name='ViewLhStyleA'>
import { inject } from 'vue';
import ViewBlock from './ViewBlock.vue';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const _deskItem = inject('deskItem');

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableMulti/DeskList/DeskView/ViewLhStyleA.less' scoped></style>
