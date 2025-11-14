<template>
<view>

  <template v-if='_showModel'>
    <view class='gl_mask' @tap='_bindClose' @touchmove.stop.prevent='_moveHandle'></view>

    <view class='gl_model'>

      <view class='gl_ph'></view>

      <!-- <template v-for='item in ((!_showList || _list.length === 0) ? _listPh : _list)' :key='item.id'> -->
      <template v-for='item in (!_showList ? [] : _list)' :key='item.id'>
        <view
          class='gl_card'
          :data-id='item.id' @tap='_bindAction'
        >

          <view class='gl_ca_title'>
            <view class='gl_ca_ti_name'>
              <view class='gl_ca_ti_na_text'>{{item.name}}</view>
              <template v-if='item.id === deskStore.useDesk'>
                <view class='gl_ca_ti_na_prompt'>({{t("table.current_table")}})</view>
              </template>
            </view>

            <view class='gl_ca_ti_time'>
                <img v-if="item?.timming?.value > 10" src="@/assets/lobby/time1.png" alt=""
									class='gl_ca_ti_ti_icon'>
								<img v-else src="@/assets/lobby/time2.png" alt="" class='gl_ca_ti_ti_icon'>

              <!-- <SvgIcon class='gl_ca_ti_ti_icon' name='lobby-desk-lock' size='13' /> -->
              <template v-if='["timing"].includes(item.gameStatus)'>
                <view :class="{
										'time-high': item?.timming?.value > 10,
										'time-low': item?.timming?.value <= 10
									}" class='gl_ca_ti_ti_ic_num'>{{isNaN(item.timming.value) ? '-' : item.timming.value}}</view>
              </template>
              <template v-else>
                <view class='gl_ca_ti_ti_ic_text'>{{t(MATCH_GAME_STATUS_NAME[item.gameStatus] || 'time_status.unknown')}}</view>
              </template>
            </view>
          </view>

          <view class='gl_ca_dew'>
            <PanelSecond :list='item.dewList.dewListSecond' />
          </view>

          <view class='gl_ca_goodTitle'>{{item.goodTitle}}</view>
        </view>
      </template>

      <template v-if='_showList && deskStore.list.length > 0 && _list.length < 1'>
        <DataEmpty />
      </template>

    </view>
  </template>

</view>
</template>
<script setup name='GoodList'>
import { ref, computed, /*defineAsyncComponent*/ } from 'vue';
import PanelSecond from './PanelSecond.vue';
import { useDeskStore } from '@front/stores/modules/desk.store';
import { useGameStore } from '@front/stores/modules/game.store';
import { useOperaStore } from '@front/stores/modules/opera.store';
import { MATCH_GAME_STATUS_NAME } from '@front/constants';
import routers from '@front/routers/index';
import { EventEmitter, } from '@front/eventBus/index';
import { VOICE_SEND, } from '@front/eventBus/actions';
import { nativeDefineAsyncComponent } from '@front/utils/replaceUniNative';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
// #ifdef APP-PLUS
  import DataEmpty from '@front/components/DataEmpty.vue';
// #endif
// #ifndef APP-PLUS
  const DataEmpty = nativeDefineAsyncComponent(()=> import('@front/components/DataEmpty.vue'));
// #endif

defineExpose({
  showChange:()=> {
    _showModel.value = true;
    setTimeout(()=> _showList.value = true, 300);

    if (deskStore.list.length < 1) {
      deskStore.setQueryType('');
      deskStore.initList();
    }
  },
})

const deskStore = useDeskStore(),
      gameStore = useGameStore(),
      operaStore = useOperaStore()
;

const _showModel = ref(false),
      _showList = ref(false),
      // _listPh = ref(Array.from({ length:6 }, ()=> ({ dewList:{dewListFirst:[], dewListSecond:[], dewListThird:[], dewListFourth:[], dewListFifth:[],} }))),
      _list = computed(()=> (
        _showModel.value
          ? (
              deskStore.list.filter(f=> f.isGood && !f.isPrivateIng).map(f=> ({
                id: f.deskId.toString(),
                name: f.deskShortName || '--',
                time: NaN,
                round: f.deskRoundNum,
                slot: f.deskSlotNum,
                dewList: f.dewList,
                timming: f.timming,
                gameStatus: f.gameStatus,
                limitAreaStr: `${_transNumToK(f.limitAreaStr.min)}-${_transNumToK(f.limitAreaStr.max)}`,
                goodTitle: f.goodTitle,
                isPrivateIng: f.isPrivateIng,
              }))
            )
          : []
      ))
;

function _moveHandle() {}

function _bindAction(event) {
  EventEmitter.emit(VOICE_SEND, 'a_room');

  const { id:deskId } = event.currentTarget.dataset;
  if (!deskId) return;

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

  const _pages = getCurrentPages();
  if (_pages.length > 0 && _pages[_pages.length - 1].route !== 'views/GameTable/TableMulti/Index') {
    deskStore.cleanList();
  }
}

function _transNumToK(value){
  if (value >= 1000) {
    return (value / 1000) + 'K';
  }
  return value.toString();
}

</script>
<style lang='less' src='@front/zstyles/components/SwitchDesk/GoodList.less'></style>
