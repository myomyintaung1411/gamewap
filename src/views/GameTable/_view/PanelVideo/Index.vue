<template>
<view class='pv_model'>

  <UserInfo />

  <GameStatus />

  <ViewVideo />

  <ActionBar />

</view>
</template>
<script setup name='PanelVideo'>
import UserInfo from './UserInfo.vue';
import GameStatus from './GameStatus.vue';
import ViewVideo from './ViewVideo.vue';
import ActionBar from './ActionBar.vue';

</script>
<style lang='less' src='@front/zstyles/views/GameTable/_view/PanelVideo/Index.less' scoped></style>
