<template>
<div class='gs_model'>

  <template v-if='_curStatus === "timing"'><!-- 正常计时 -->

    <div class='gs_jishizhong _view_normal'>
      {{isNaN(gameStore.timming.value) ? '' : gameStore.timming.value}}
    </div>

  </template>
  <template v-else-if='_curStatus === "countDown"'><!-- 倒计时 -->

    <div class='gs_daojishi _view_normal'>
      {{isNaN(gameStore.timming.value) ? '' : gameStore.timming.value}}
    </div>

  </template>
  <template v-else-if='_curStatus === "stopBetting"'>

    <div class='gs_tingzhixiahu _view_normal'>
      停止下注
    </div>

  </template>
  <template v-else-if='_curStatus === "opening"'>

    <div class='gs_kaipaizhong _view_normal'>
      开牌中
    </div>

  </template>
  <template v-else-if='_curStatus === "settlement"'>

    <div class='gs_jiesuanzhong _view_normal'>
      结算中
    </div>

  </template>
  <template v-else-if='_curStatus === "comeStart"'>

    <div class='gs_jijiangkaiju _view_normal'>
      即将开局
    </div>

  </template>
  <template v-else-if='_curStatus === "shuffle"'>

    <div class='gs_xipaizhong _view_normal'>
      洗牌中
    </div>

  </template>
  <template v-else-if='_curStatus === "repeal"'>

    <div class='gs_feichupaiju _view_normal'>
      废除牌局
    </div>

  </template>
  <template v-else-if='_curStatus === "stopDesk"'>

    <div class='gs_tingtaizhong _view_normal'>
      停台中
    </div>

  </template>

</div>
</template>
<script setup name='GameStatus'>
import { computed } from 'vue';
import { useGameStore } from '@front/stores/modules/game.store';

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
<style lang='less' src='@front/zstyles/views/GameTable/_view/PanelVideo/GameStatus.less' scoped></style>
