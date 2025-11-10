<template>
<view class='gs_model' :style='{ top:"calc(var(--status-bar-height) + 24rpx)" }'>

  <template v-if='_curStatus === "timing"'><!-- 正常计时 -->

    <view class='gs_jishizhong _view_normal'>
      {{isNaN(gameStore.timming.value) ? '' : gameStore.timming.value}}
    </view>

  </template>
  <template v-else-if='_curStatus === "countDown"'><!-- 倒计时 -->

    <view class='gs_daojishi _view_normal'>
      {{isNaN(gameStore.timming.value) ? '' : gameStore.timming.value}}
    </view>

  </template>
  <template v-else-if='_curStatus === "stopBetting"'>

    <view class='gs_tingzhixiahu _view_normal'>
      {{t("time_status.stop_bet")}}
    </view>

  </template>
  <template v-else-if='_curStatus === "opening"'>

    <view class='gs_kaipaizhong _view_normal'>
      {{t("time_status.open")}}
    </view>

  </template>
  <template v-else-if='_curStatus === "settlement"'>

    <view class='gs_jiesuanzhong _view_normal'>
       {{t("time_status.settle")}}
    </view>

  </template>
  <template v-else-if='_curStatus === "comeStart"'>

    <view class='gs_jijiangkaiju _view_normal'>
      {{t("time_status.about_start")}}
    </view>

  </template>
  <template v-else-if='_curStatus === "shuffle"'>

    <view class='gs_xipaizhong _view_normal'>
      {{t("time_status.shuffle")}}
    </view>

  </template>
  <template v-else-if='_curStatus === "repeal"'>

    <view class='gs_feichupaiju _view_normal'>
     {{t("time_status.Abolition")}}
    </view>

  </template>
  <template v-else-if='_curStatus === "stopDesk"'>

    <view class='gs_tingtaizhong _view_normal'>
     {{t("time_status.stop")}}
    </view>

  </template>

</view>
</template>
<script setup name='GameStatus'>
import { computed } from 'vue';
import { useGameStore } from '@front/stores/modules/game.store';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const gameStore = useGameStore();

const _curStatus = computed(()=> (
  gameStore.gameStatus === 'comeStart' ? 'comeStart' :
  gameStore.gameStatus === 'timing'
    ? (
        (!isNaN(gameStore.timming.value) && gameStore.timming.value <= 10)
          ? 'countDown'
          : 'timing'
      )
    :
  gameStore.gameStatus === 'stopBetting' ? 'stopBetting' :
  gameStore.gameStatus === 'opening' ? 'opening' :
  gameStore.gameStatus === 'settlement' ? 'settlement' :
  gameStore.gameStatus === 'repeal' ? 'repeal' :
  gameStore.gameStatus === 'shuffle' ? 'shuffle' :
  gameStore.gameStatus === 'stopDesk' ? 'stopDesk' :
  ''
));

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableNormal/GameStatus.less' scoped></style>
