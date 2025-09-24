<template>
<view class='ui_model'>

  <SvgIcon class='ui_avatar' name='user-avatar' />

  <view class='ui_content'>
    <!-- <view class='ui_co_name'>{{ userStore.userName ? userStore.userName : '--------' }}</view> -->
    <view class='ui_co_balance'>¥ {{ userStore.getBalanceStr || '--' }}</view>
  </view>

</view>
</template>
<script setup name='UserInfo'>
import { useUserStore } from '@front/stores/modules/user.store';

const userStore = new useUserStore();

</script>
<style lang='less' src='@front/zstyles/views/GameTable/_view/PanelVideo/UserInfo.less' scoped></style>
