<template>
<view class='gs_model'>

  <template v-if='_deskItem.isPrivateIng'><!-- 包台中 -->

    <view class='gs_baotaizhong _view_normal'>
      <div class='gs_ba_line'></div>
      <div class='gs_ba_name'>{{t("time_status.reversed")}}</div>
      <div class='gs_ba_line'></div>
    </view>

  </template>
  <template v-else-if='_curStatus === "timing"'><!-- 正常计时 -->

    <view class='gs_jishizhong _view_normal'>
      <!-- <SvgIcon class='dr_de_ti_icon' name='lobby-desk-lock-stroke' size='30' /> -->
      {{isNaN(_deskItem.timming.value) ? '' : _deskItem.timming.value}}
    </view>

  </template>
  <template v-else-if='_curStatus === "countDown"'><!-- 倒计时 -->

    <view class='gs_daojishi _view_normal'>
      <!-- <SvgIcon class='dr_de_ti_icon' name='lobby-desk-lock-stroke' size='30' /> -->
      {{isNaN(_deskItem.timming.value) ? '' : _deskItem.timming.value}}
    </view>

  </template>
  <template v-else-if='_curStatus === "stopBetting"'>

    <view class='gs_tingzhixiahu _view_normal'>
      {{t("time_status.stop_bet")}}
    </view>

  </template>
  <!-- <template v-else-if='_curStatus === "opening"'>

    <view class='gs_kaipaizhong _view_normal'>
      开牌中
    </view>

  </template> -->
  <!-- <template v-else-if='_curStatus === "settlement"'>

    <view class='gs_jiesuanzhong _view_normal'>
      结算中
    </view>

  </template> -->
  <!-- <template v-else-if='_curStatus === "comeStart"'>

    <view class='gs_jijiangkaiju _view_normal'>
      即将开局
    </view>

  </template> -->
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
import { inject, computed } from 'vue';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const _deskItem = inject('deskItem');

const _curStatus = computed(()=> (
  !_deskItem.value
    ? ''
    :
  _deskItem.value.gameStatus === 'comeStart' ? 'comeStart' :
  _deskItem.value.gameStatus === 'timing'
    ? (
        (!isNaN(_deskItem.value.timming.value) && _deskItem.value.timming.value <= 10)
          ? 'countDown'
          : 'timing'
      )
    :
  _deskItem.value.gameStatus === 'stopBetting' ? 'stopBetting' :
  _deskItem.value.gameStatus === 'opening' ? 'opening' :
  _deskItem.value.gameStatus === 'settlement' ? 'settlement' :
  _deskItem.value.gameStatus === 'repeal' ? 'repeal' :
  _deskItem.value.gameStatus === 'shuffle' ? 'shuffle' :
  _deskItem.value.gameStatus === 'stopDesk' ? 'stopDesk' :
  ''
));

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableMulti/DeskList/DeskView/GameStatus.less' scoped></style>
