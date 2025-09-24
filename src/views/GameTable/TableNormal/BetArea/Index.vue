<template>
<view class='ba_model'>

  <view class='ba_title'>
    <view class='ba_ti_name'>{{ gameStore.gameShortName || '--' }} {{t("lobby.slot")}}: {{ isNaN(gameStore.roundInfo.roundNum) ? '' : gameStore.roundInfo.roundNum }}-{{ isNaN(gameStore.roundInfo.slotNum) ? '' : gameStore.roundInfo.slotNum }}</view>

    <view class='ba_ti_commission'>
      <view class='ba_ti_co_co_name'>{{t("table.win")}}: {{ isNaN(gameStore.winAmount) ? 0 : gameStore.winAmount }}</view>
      <!-- <switch class='ba_ti_co_content' :checked='_isNotCommission' color='#75bc2a' @change='_changeIsNotCommission(!_isNotCommission)' /> -->
    </view>

    <view class='ba_ti_limit' @tap='_showPopupLimitRed'>
      {{t("time_status.limit")}}: {{

        gameStore.limitArea[0]
          ? (
              (isNaN(gameStore.limitRedTotal.min) ? '' : _transNumToK(gameStore.limitRedTotal.min)) +
              '-' +
              (isNaN(gameStore.limitRedTotal.max) ? '' : _transNumToK(gameStore.limitRedTotal.max))
            )
          : '--'
      }}
    </view>
  </view>

  <view class='ba_bet'>
    <template v-if='gameStore.gameType === "bjl"'>

      <template v-if='!_isNotCommission'>
        <ViewBjlStyleA />
      </template>
      <template v-else>
        <ViewBjlStyleB />
      </template>

    </template>
    <template v-else-if='gameStore.gameType === "lh"'>

      <template v-if='!_isNotCommission'>
        <ViewLhStyleA />
      </template>
      <template v-else>
        <ViewLhStyleB />
      </template>

    </template>
  </view>

  <view class='ba_action'>
    <TheButton
      class='ba_ac_view _affirm'
      :disabled='(
        gameStore.gameStatus !== "timing" ||
        operaStore.waitBetList.length < 1
      )'
      :loading='operaStore.loading.submitWaitBet'
      :taps='_bindAffirm'
    >
      <SvgIcon class='ba_ac_vi_icon' name='game-table-bet-affirm' />
      <view class='ba_ac_vi_name'>{{t("poker.confirm")}}</view>
    </TheButton>

    <TheButton
      class='ba_ac_view _revoke'
      :disabled='(
        (operaStore.affirmBetList.length < 1) ||
        (operaStore.waitBetList.length < 1 && gameStore.gameStatus !== "timing")
      )'
      :loading='operaStore.loading.cancelIsAffirmBet'
      :taps='_bindCancel'
    >
      <SvgIcon class='ba_ac_vi_icon' name='game-table-bet-revoke' />
      <view class='ba_ac_vi_name'>{{t("poker.revoke")}}</view>
    </TheButton>

    <TheButton
      class='ba_ac_view _cancel'
      :disabled='(
        (operaStore.waitBetList.length < 1) ||
        (operaStore.waitBetList.length < 1 && gameStore.gameStatus !== "timing")
      )'
      :taps='_bindRevoke'
    >
      <SvgIcon class='ba_ac_vi_icon' name='game-table-bet-cancel' />
      <view class='ba_ac_vi_name'>{{t("poker.cancel")}}</view>
    </TheButton>
  </view>

</view>
</template>
<script setup name='BetArea'>
import { computed, inject, /*defineAsyncComponent*/ } from 'vue';
import TheButton from '@front/components/TheButton/Index.vue';
import { useOperaStore } from '@front/stores/modules/opera.store';
import { useGameStore } from '@front/stores/modules/game.store';
import { useDeskStore } from '@front/stores/modules/desk.store';
import { EventEmitter, } from '@front/eventBus/index';
import { VOICE_SEND, } from '@front/eventBus/actions';
import { nativeDefineAsyncComponent } from '@front/utils/replaceUniNative';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
// #ifdef APP-PLUS
  import ViewBjlStyleA from './ViewBjlStyleA.vue';
  import ViewBjlStyleB from './ViewBjlStyleB.vue';
  import ViewLhStyleA from './ViewLhStyleA.vue';
  import ViewLhStyleB from './ViewLhStyleB.vue';
// #endif
// #ifndef APP-PLUS
  const ViewBjlStyleA = nativeDefineAsyncComponent(()=> import('./ViewBjlStyleA.vue')),
        ViewBjlStyleB = nativeDefineAsyncComponent(()=> import('./ViewBjlStyleB.vue')),
        ViewLhStyleA = nativeDefineAsyncComponent(()=> import('./ViewLhStyleA.vue')),
        ViewLhStyleB = nativeDefineAsyncComponent(()=> import('./ViewLhStyleB.vue'))
  ;
// #endif

const operaStore = useOperaStore(),
      gameStore = useGameStore(),
      deskStore = useDeskStore()
;

const _isNotCommission = inject('isNotCommission'),
      _changeIsNotCommission = inject('changeIsNotCommission'),
      _showPopupLimitRed = inject('showPopupLimitRed')
;

function _bindAffirm() {
  EventEmitter.emit(VOICE_SEND, 'a_room');
  operaStore.submitWaitBet(_isNotCommission.value);
}

function _bindCancel() {
  EventEmitter.emit(VOICE_SEND, 'a_room');
  operaStore.cancelIsAffirmBet();
}

function _bindRevoke() {
  EventEmitter.emit(VOICE_SEND, 'a_room');
  operaStore.cancelWaitBet();
}

function _transNumToK(value){
  if (value >= 1000) {
    return (value / 1000) + 'K';
  }
  return value.toString();
}

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableNormal/BetArea/Index.less' scoped></style>
