<template>
<view>

  <TheVoice />
  <TheMsg />
  <TheMsgWithGame />
  <WsConnectStatus />

</view>
</template>
<script setup name='PageBaseImport'>
import TheMsg from '@front/components/TheMsg.vue';
import TheMsgWithGame from '@front/components/TheMsgWithGame.vue';
import TheVoice from '@front/components/TheVoice.vue';
import WsConnectStatus from '@front/components/WsConnectStatus/Index.vue';

</script>
<style lang='less' src='@front/zstyles/components/PageBaseImport.less' scoped></style>
