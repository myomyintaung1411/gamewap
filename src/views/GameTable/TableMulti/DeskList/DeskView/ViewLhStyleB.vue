<template>
<view class='vlsb_model'>

  <view class='vlsb_ph01'></view>
  <view class='vlsb_ph02'></view>

  <ViewBlock class='vlsb_view _view01' color='colorB' :rate='_deskItem ? _deskItem.betRate.isCommission.long : ""' ident='bet-long' :name='t("lh_short.long")' />

  <ViewBlock class='vlsb_view _view01' color='colorC' :rate='_deskItem ? _deskItem.betRate.isCommission.he : ""' ident='bet-he' :name='t("lh_short.he")' />

  <ViewBlock class='vlsb_view _view01' color='colorA' :rate='_deskItem ? _deskItem.betRate.isCommission.hu : ""' ident='bet-hu' :name='t("lh_short.hu")' />

</view>
</template>
<script setup name='ViewLhStyleB'>
import { inject } from 'vue';
import ViewBlock from './ViewBlock.vue';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const _deskItem = inject('deskItem');

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableMulti/DeskList/DeskView/ViewLhStyleB.less' scoped></style>
