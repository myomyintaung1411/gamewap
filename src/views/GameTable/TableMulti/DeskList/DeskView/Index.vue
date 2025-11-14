<template>
<view class='dv_model'>

  <view class='dv_left' @tap='_bindJoin'>

    <view class='dv_le_title'>
      <view class='dv_le_ti_name'>{{_deskItem ? (_deskItem.deskShortName || '--') : '--'}}</view>

      <view class='dv_le_ti_limit'>
        限红: {{
          _deskItem && _deskItem.limitAreaStr
            ? (
                (isNaN(_deskItem.limitAreaStr.min) ? '' : _transNumToK(_deskItem.limitAreaStr.min)) +
                ' - ' +
                (isNaN(_deskItem.limitAreaStr.max) ? '' : _transNumToK(_deskItem.limitAreaStr.max))
              )
            : '--'
        }}
      </view>

      <template v-if='_deskItem && !_deskItem.isNoCommissionDesk'>
        <view class='dv_le_ti_commission' @tap='_moveHandle'>
          <view class='dv_le_ti_co_name'>免佣</view>
          <switch class='dv_le_ti_co_content' :disabled='!_deskItem || (_deskItem.isNoCommissionDesk) || (_deskItem.getSelfStatus() !== "opening") || (_deskItem.isPrivateIng)' :checked='_isNotCommission' color='#75bc2a' @change='_changeIsNotCommission(!_isNotCommission)' />
        </view>
      </template>
      <template v-else>
        <view class='dv_le_ti_commission'>
        </view>
      </template>
    </view>

    <view class='dv_le_dew'>
      <template v-if='_routeType === "PanelSecond"'>
        <PanelSecond
          :isAskList='_deskItem && _deskItem.dewList.askDewListSecond.length > 0'
          :list='(
            !_deskItem
              ? []
              :
            _deskItem.dewList.askDewListSecond.length > 0
              ? _deskItem.dewList.askDewListSecond
              :
            _deskItem.dewList.dewListSecond
          )'
        />
      </template>
      <template v-else>
        <PanelOther
          :isAskList='_deskItem && _deskItem.dewList.askDewListSecond.length > 0'
          :listThird='(
            !_deskItem
              ? []
              :
            _deskItem.dewList.askDewListThird.length > 0
              ? _deskItem.dewList.askDewListThird
              :
            _deskItem.dewList.dewListThird
          )'
          :listFourth='(
            !_deskItem
              ? []
              :
            _deskItem.dewList.askDewListFourth.length > 0
              ? _deskItem.dewList.askDewListFourth
              :
            _deskItem.dewList.dewListFourth
          )'
          :listFifth='(
            !_deskItem
              ? []
              :
            _deskItem.dewList.askDewListFifth.length > 0
              ? _deskItem.dewList.askDewListFifth
              :
            _deskItem.dewList.dewListFifth
          )'
        />
      </template>

      <GameStatus />
    </view>

    <view class='dv_le_total'>
      <template
        v-for='item in (
          !_deskItem
              ? []
              :
            _deskItem.deskTypeIdent === "bjl"
              ? [
                  { ident:"zhuang", name:"庄", value:()=> _deskItem.deskZhuangNum, },
                  { ident:"xian", name:"闲", value:()=> _deskItem.deskXianNum, },
                  { ident:"he", name:"和", value:()=> _deskItem.deskHeNum, },
                  { ident:"zhuangdui", name:"庄对", value:()=> _deskItem.deskZhuangDuiNum, },
                  { ident:"xiandui", name:"闲对", value:()=> _deskItem.deskXianDuiNum, },
                ]
              :
            _deskItem.deskTypeIdent === "lh"
              ? [
                  { ident:"long", name:"龙", value:()=> _deskItem.deskLongNum, },
                  { ident:"hu", name:"虎", value:()=> _deskItem.deskHuNum, },
                  { ident:"he", name:"和", value:()=> _deskItem.deskHeNum, },
                ]
              :
            []
        )'
        :key='item.id'
      >
      <view :class="['dv_le_to_view', `_ident-${item.ident}`]">
        <image
          class="dv_le_to_icon"
          :src="getDeskIcon(item.ident)"
          mode="aspectFit"
        />
        <view class="dv_le_to_vi_value">{{ item.value() }}</view>
      </view>
      </template>
    </view>

    <PokerInfo />
  </view>

  <view class='dv_right'>

    <view class='dv_ri_bet'>
      <template v-if='_deskItem.deskTypeIdent === "bjl"'>

        <template v-if='!_isNotCommission'>
          <ViewBjlStyleA />
        </template>
        <template v-else>
          <ViewBjlStyleB />
        </template>

      </template>
      <template v-else-if='_deskItem.deskTypeIdent === "lh"'>

        <template v-if='!_isNotCommission'>
          <ViewLhStyleA />
        </template>
        <template v-else>
          <ViewLhStyleB />
        </template>

      </template>
    </view>

    <view class='dv_ri_action'>
      <TheButton
        class='dv_ri_ac_view _affirm'
        :loading='_deskItem ? _deskItem.loading.submitWaitBet : false'
        :disabled='_btnDisableAffirm'
        :taps='_bindAction.bind(null, "affirm")'
      >
        <!-- <SvgIcon class='dv_ri_ac_vi_icon' name='table-multi-bet-affirm' /> -->
        <image class='img-normal' :src='confirmBtn' />
      </TheButton>

      <TheButton
        class='dv_ri_ac_view _revoke'
        :loading='_deskItem ? _deskItem.loading.cancelIsAffirmBet : false'
        :disabled='_btnDisableCancel'
        :taps='_bindAction.bind(null, "cancel")'
      >
        <!-- <SvgIcon class='dv_ri_ac_vi_icon' name='table-multi-bet-revoke' /> -->
        <image class='img-normal' :src='revokeBtn' />
      </TheButton>

      <TheButton
        class='dv_ri_ac_view _cancel'
        :disabled='_btnDisableRevoke'
        :taps='_bindAction.bind(null, "revoke")'
      >
        <!-- <SvgIcon class='dv_ri_ac_vi_icon' name='table-multi-bet-cancel' /> -->
        <image class='img-normal' :src='cancelBtn' />
      </TheButton>
    </view>

  </view>

</view>
</template>
<script setup name='DeskView'>
import { ref, computed, provide, inject, /*defineAsyncComponent*/ } from 'vue';
import TheButton from '@front/components/TheButton/Index.vue';
import PanelSecond from './PanelSecond.vue';
import confirmBtn from '@front/assets/multi/confirm.png'
import cancelBtn from '@front/assets/multi/cancel.png'
import revokeBtn from '@front/assets/multi/revoke.png'
import totalImg from '@front/assets/lobby/all.png';
import bankerImg from '@front/assets/lobby/banker.png';
import playerImg from '@front/assets/lobby/player.png';
import dragonImg from '@front/assets/lobby/dragon.png';
import tigerImg from '@front/assets/lobby/tiger.png';
import tieImg from '@front/assets/lobby/tie.png';
import bPairImg from '@front/assets/lobby/bPair.png';
import pPairImg from '@front/assets/lobby/pPair.png';
// import PanelOther from './PanelOther.vue';
// import ViewBjlStyleA from './ViewBjlStyleA.vue';
// import ViewBjlStyleB from './ViewBjlStyleB.vue';
// import ViewLhStyleA from './ViewLhStyleA.vue';
// import ViewLhStyleB from './ViewLhStyleB.vue';
import PokerInfo from './PokerInfo.vue';
import GameStatus from './GameStatus.vue';
import { useDeskStore } from '@front/stores/modules/desk.store';
import { useUserStore } from '@front/stores/modules/user.store';
import routers from '@front/routers/index';
import { EventEmitter, } from '@front/eventBus/index';
import { VOICE_SEND, } from '@front/eventBus/actions';
import { nativeDefineAsyncComponent } from '@front/utils/replaceUniNative';

// #ifdef APP-PLUS
  import PanelOther from './PanelOther.vue';
  import ViewBjlStyleA from './ViewBjlStyleA.vue';
  import ViewBjlStyleB from './ViewBjlStyleB.vue';
  import ViewLhStyleA from './ViewLhStyleA.vue';
  import ViewLhStyleB from './ViewLhStyleB.vue';
// #endif
// #ifndef APP-PLUS
  const PanelOther = nativeDefineAsyncComponent(()=> import('./PanelOther.vue')),
        ViewBjlStyleA = nativeDefineAsyncComponent(()=> import('./ViewBjlStyleA.vue')),
        ViewBjlStyleB = nativeDefineAsyncComponent(()=> import('./ViewBjlStyleB.vue')),
        ViewLhStyleA = nativeDefineAsyncComponent(()=> import('./ViewLhStyleA.vue')),
        ViewLhStyleB = nativeDefineAsyncComponent(()=> import('./ViewLhStyleB.vue'))
  ;
// #endif

const deskStore = useDeskStore();
const userStore = useUserStore();
const _props = defineProps({
  deskId: String,
})

const _deskItem = computed(()=> (
          !_props.deskId
            ? false
            : (deskStore.list.find(f=> f.deskId === _props.deskId) || false)
      )),
      _btnDisableAffirm = computed(()=> (
        !_deskItem.value
          ? true
          :
        _deskItem.value.gameStatus !== 'timing' || (_deskItem.value.timming.value === 0)
          ? true
          :
        _deskItem.value.waitBetList.length < 1
      )),
      _btnDisableCancel = computed(()=> (
        !_deskItem.value
          ? true
          :
        _deskItem.value.gameStatus !== 'timing' || (_deskItem.value.timming.value === 0)
          ? true
          :
        (
          (_deskItem.value.affirmBetList.length < 1) ||
          (_deskItem.value.waitBetList.length < 1 && _deskItem.value.gameStatus !== "timing")
        )
      )),
      _btnDisableRevoke = computed(()=> (
        !_deskItem.value
          ? true
          :
        _deskItem.value.gameStatus !== 'timing' || (_deskItem.value.timming.value === 0)
          ? true
          :
        (
          (_deskItem.value.waitBetList.length < 1) ||
          (_deskItem.value.waitBetList.length < 1 && _deskItem.value.gameStatus !== "timing")
        )
      )),
      _isNotCommission = ref(false),
      _routeType = inject('routeType')
;
provide('deskItem', _deskItem);
provide('isNotCommission', _isNotCommission);

// map local idents -> actual icons
const DV_ICONS = {
  total: totalImg,

  // bjl
  zhuang: bankerImg,
  xian: playerImg,
  he: tieImg,
  zhuangdui: bPairImg,
  xiandui: pPairImg,

  // lh
  long: dragonImg,
  hu: tigerImg,
};

function getDeskIcon(ident) {
  return DV_ICONS[ident] || totalImg; // fallback
}

function _changeIsNotCommission(value) {
  _isNotCommission.value = value;
}
provide('changeIsNotCommission', _changeIsNotCommission);

function _transNumToK(value){
  if (value >= 1000) {
    return (value / 1000) + 'K';
  }
  return value.toString();
}

function _bindAction(ident) {
  EventEmitter.emit(VOICE_SEND, 'a_room');

  // EventEmitter.emit(VOICE_SEND, 'a_room');  //增加点击音效
  if (ident === 'affirm') {
    _deskItem.value.submitWaitBet(_isNotCommission.value);

  }else if (ident === 'cancel') {
    _deskItem.value.cancelIsAffirmBet();

  }  else if (ident === 'revoke') {
    _deskItem.value.cancelWaitBet();

  }
}

function _bindJoin() {
  EventEmitter.emit(VOICE_SEND, 'a_room');

  if (!_deskItem.value) return;

  const { deskId, isPrivateIng, canJoinPrivate } = _deskItem.value;

  if (!deskId) return;
  if (isPrivateIng && !canJoinPrivate) return window.$msg('该桌台为包台', 1500);

  deskStore.switchUseDesk(deskId);
  routers.push(`/views/GameTable/TableNormal/Index?deskId=${deskStore.useDesk}`);
}

function _moveHandle(event) {
  event.stopPropagation();
}

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableMulti/DeskList/DeskView/Index.less' scoped></style>
