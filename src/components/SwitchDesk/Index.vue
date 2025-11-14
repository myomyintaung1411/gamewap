<template>
<view>

  <template v-if='_showModel'>
    <view class='sd_mask' @tap='_bindClose' @touchmove.stop.prevent='_moveHandle'></view>

    <div class='sd_model_' :style='{ height:`${_windowHeight}px` }' @scroll='handleScroll' ref='_vScrollWrapper'>

      <view class='sd_ph01'></view>

      <template v-for='item in ((!_showList || _list.length === 0) ? _listPh : _list)' :key='item.id'>
        <view
          class='sd_card'
          :data-id='item.id' :data-is-private-ing='item.isPrivateIng' :data-can-join-private='item.canJoinPrivate' @tap='_bindAction'
        >

          <view class='sd_ca_title'>
            <view class='sd_ca_ti_name'>
              <view class='sd_ca_ti_na_text'>{{ item.name }}</view>
              <view class='sd_ca_ti_na_round'>{{t("lobby.slot")}}: {{ item.round }}-{{ item.slot }}</view>
              <template v-if='item.id === deskStore.useDesk'>
                <view class='sd_ca_ti_na_prompt'>({{t("table.current_table")}})</view>
              </template>
            </view>

            <view class='sd_ca_ti_time'>
              	<img v-if="item?.timming?.value > 10" src="@/assets/lobby/time1.png" alt=""
									class='sd_ca_ti_ti_icon'>
								<img v-else src="@/assets/lobby/time2.png" alt="" class='sd_ca_ti_ti_icon'>
              <!-- <SvgIcon class='sd_ca_ti_ti_icon' name='lobby-desk-lock' size='13' /> -->
              <template v-if='["timing"].includes(item.gameStatus)'>
                <view :class="{
										'time-high': item?.timming?.value > 10,
										'time-low': item?.timming?.value <= 10
									}" class='sd_ca_ti_ti_ic_num'>{{isNaN(item.timming.value) ? '-' : item.timming.value}}</view>
              </template>
              <template v-else>
                <view class='sd_ca_ti_ti_ic_text'>{{t(MATCH_GAME_STATUS_NAME[item.gameStatus] || 'time_status.unknown')}}</view>
              </template>
            </view>
          </view>

          <view class='sd_ca_dew'>
            <PanelSecond :list='item.dewList.dewListSecond' />

            <template v-if='item.isPrivateIng'><!-- 包台中 -->
              <view class='sd_ca_de_private'>
                <div class='sd_ca_de_pr_line'></div>
                <div class='sd_ca_de_pr_name'>{{t("time_status.reversed")}}</div>
                <div class='sd_ca_de_pr_line'></div>
              </view>
            </template>
          </view>
        </view>
      </template>

      <view class='sd_ph02'></view>

    </div>
  </template>

</view>
</template>
<script setup name='SwitchDesk'>
import { ref, computed } from 'vue';
import PanelSecond from './PanelSecond.vue';
import { useDeskStore } from '@front/stores/modules/desk.store';
import { useGameStore } from '@front/stores/modules/game.store';
import { useOperaStore } from '@front/stores/modules/opera.store';
import { debounce } from 'lodash';
import { MATCH_GAME_STATUS_NAME } from '@front/constants';
import routers from '@front/routers/index';
import { EventEmitter, } from '@front/eventBus/index';
import { VOICE_SEND, } from '@front/eventBus/actions';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const _emits = defineEmits(['perfComponentClose']);

defineExpose({
  showChange:()=> {
    _showModel.value = true;
    setTimeout(()=> _showList.value = true, 300);

    deskStore.setQueryType('');
    deskStore.initList();

    _setWindowHeight();
  },
})

const deskStore = useDeskStore(),
      gameStore = useGameStore(),
      operaStore = useOperaStore()
;

const _windowHeight = ref(-1),
      _showModel = ref(false),
      _showList = ref(false),
      _listPh = ref(Array.from({ length:6 }, ()=> ({ dewList:{dewListFirst:[], dewListSecond:[], dewListThird:[], dewListFourth:[], dewListFifth:[],} }))),
      _list = computed(()=> (
        _showModel.value
          ? (
              deskStore.list.map(f=> ({
                id: f.deskId.toString(),
                name: f.deskShortName || '--',
                time: NaN,
                round: f.deskRoundNum,
                slot: f.deskSlotNum,
                dewList: f.dewList,
                timming: f.timming,
                gameStatus: f.gameStatus,
                limitAreaStr: `${_transNumToK(f.limitAreaStr.min)}-${_transNumToK(f.limitAreaStr.max)}`,
                isPrivateIng: f.isPrivateIng,
                canJoinPrivate: f.canJoinPrivate,
              }))
            )
          : []
      )),
      _vScrollWrapper = ref(false)
;

function _moveHandle() {}

function _bindAction(event) {
  EventEmitter.emit(VOICE_SEND, 'a_room');

  const { id:deskId, isPrivateIng, canJoinPrivate } = event.currentTarget.dataset;
  if (!deskId) return;
  if (isPrivateIng && !canJoinPrivate) return window.$msg('该桌台为包台', 3000);

  deskStore.switchUseDesk(deskId);
  gameStore.cleanGameFull();
  operaStore.cleanOperaFull();

  // routers.push(`/views/GameTable/Index?deskId=${deskStore.useDesk}`);
  routers.push(`/views/GameTable/TableNormal/Index?deskId=${deskStore.useDesk}`);
  _bindClose();
}

function _bindClose() {
  EventEmitter.emit(VOICE_SEND, 'a_room');

  _showModel.value = false;
  _showList.value = false;

  deskStore.cleanList();

  _emits('perfComponentClose');
}

function _transNumToK(value){
  if (value >= 1000) {
    return (value / 1000) + 'K';
  }
  return value.toString();
}

function _setWindowHeight() {
  const vh = window.innerHeight;
  _windowHeight.value = vh;
}

function handleScroll() {
  const _scrollWrapper = _vScrollWrapper.value;
  const { scrollTop, clientHeight, scrollHeight } = _scrollWrapper;

  (scrollTop + clientHeight >= scrollHeight - 10) && _loadNextPage();
}

const _loadNextPage = debounce(async function() {
  if (deskStore.loading) return;

  window.$loading(true, '加载中');
  await deskStore.updateList();
  window.$loading(false);
}, 200)

</script>
<style lang='less' src='@front/zstyles/components/SwitchDesk/Index.less'></style>
