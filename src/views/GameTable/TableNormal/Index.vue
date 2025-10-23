<template>
<!-- <view class='page-box tn_page' :style='{ height:`${_windowHeight}px` }' style='--status-bar-height: 40px'> -->
<view class='page-box tn_page' :style='{ height:`${_windowHeight}px` }'>

  <!-- <view style='width:100%; height:80rpx; flex-shrink:0; background:gray;'></view> -->

  <view style='width:100%; height:var(--status-bar-height)'></view>

  <view class='tn_video'>
    <VideoContent :needZoom='_zoomVideo' />
  </view>

  <view class='tn_bg' :style='{ top:`calc(420rpx + var(--status-bar-height))`, height:`calc(${_windowHeight}px - (var(--status-bar-height) + 420rpx))` }'></view>

  <view class='tn_betarea'>
    <BetArea />
  </view>

  <view class='tn_poker'>
    <ChipsArea />

    <RouteOpera />

    <PokerInfo />
  </view>

  <view class='tn_dew'>
    <PanelDew />
  </view>

  <!-- <view style='width:100%; height:100rpx; flex-shrink:0; background:gray;'></view> -->

  <TitleAction />
  <GameStatus />
  <SubTitleAction />

  <template v-if='gameStore.gameStatus && !gameStore.isNoCommissionDesk'>
    <ViewCommission />
  </template>

  <PerfComponent :componentUrl='PCompPopupLimitRed' ref='_vPopupLimitRed' />
  <PageBaseImport />

</view>
</template>
<script setup name='TableNormal'>
import { ref, nextTick, provide, computed } from 'vue';
import { onLoad, onShow, onHide, onUnload } from '@dcloudio/uni-app';
import PageBaseImport from '@front/components/PageBaseImport.vue';
import PerfComponent from '@front/components/PerfComponent.vue';
import TitleAction from './TitleAction.vue';
import ViewCommission from './ViewCommission.vue';
import GameStatus from './GameStatus.vue';
import SubTitleAction from './SubTitleAction.vue';
import VideoContent from './VideoContent.vue';
import BetArea from './BetArea/Index.vue';
import ChipsArea from './ChipsArea.vue';
import RouteOpera from './RouteOpera.vue';
import PokerInfo from './PokerInfo.vue';
import PanelDew from '../_view/PanelDew/Index.vue';
// import { EventEmitter, } from '@front/eventBus/index';
// import { OPEN_SWITCH_DESK, } from '@front/eventBus/actions';
import { listenStart, listenConnectEd, } from '@front/utils/wsManager';
import { useDeskStore } from '@front/stores/modules/desk.store';
import { useGameStore } from '@front/stores/modules/game.store';
import { useUserStore } from '@front/stores/modules/user.store';
import { useSystemStore } from '@front/stores/modules/system.store';
import { useOperaStore } from '@front/stores/modules/opera.store';
import { useLogStore } from '@front/stores/modules/log.store';
import { localGet, } from '@front/utils/localStorage';
import { EventEmitter, } from '@front/eventBus/index';
import { VOICE_SEND, } from '@front/eventBus/actions';

// #ifdef APP-PLUS
  import PCompPopupLimitRed from './PopupLimitRed.vue';
// #endif
// #ifndef APP-PLUS
  const PCompPopupLimitRed = ()=> import('./PopupLimitRed.vue');
// #endif

const deskStore = useDeskStore(),
      gameStore = useGameStore(),
      userStore = useUserStore(),
      systemStore = useSystemStore(),
      operaStore = useOperaStore(),
      logStore = useLogStore()
;

const _deskId = ref(null),
      _isNotCommission = ref(false),
      _chipsUseList = ref(localGet('table-multi-chips-use') || []),
      _windowHeight = ref(-1),
      _vPopupLimitRed = ref(null),
      _zoomVideo = computed(()=> systemStore.zoomVideo)
;
provide('isNotCommission', _isNotCommission);
provide('chipsUseList', _chipsUseList);
provide('zoomVideo', _zoomVideo);

function _changeIsNotCommission(value) {
  _isNotCommission.value = value;
}
provide('changeIsNotCommission', _changeIsNotCommission);

function _changeChipsUseList(value) {
  console.log('changeChipsUseList', value);
  if (value.length >= 1) {
    if (!value.includes(operaStore.chipsBjlEd)) {
      operaStore.setChipsBjlEd(value[0]);
    }
  }
  _chipsUseList.value.splice(0, _chipsUseList.value.length, ...value);
}
provide('changeChipsUseList', _changeChipsUseList);

function _showPopupLimitRed() {
  _vPopupLimitRed.value.showChange();
}
provide('showPopupLimitRed', _showPopupLimitRed);

function _changeZoomVideo(value) {
  systemStore.setZoomVideo(value);
  window.$msgWithGame(`${_zoomVideo.value ? '开启' : '关闭'}开牌缩放`);
}
provide('changeZoomVideo', _changeZoomVideo);

function _setWindowHeight() {
  // const vh = window.innerHeight;
  const vh = uni.getSystemInfoSync().windowHeight;
  _windowHeight.value = vh;
}

onLoad((event)=> {
  const { deskId } = event;
  if (!deskId) return;

  _deskId.value = deskId;

  _setWindowHeight();
})

onShow(()=> {

  // window.addEventListener('resize', _setWindowHeight);
  uni.onWindowResize(_setWindowHeight);

  if (!_deskId.value) return;

  nextTick(()=> {
    EventEmitter.emit(VOICE_SEND, (
      ['10184', '10185', '10186', '10187',].includes(_deskId.value) ? 'into-game-bjl' :
      ['10188', '10189',].includes(_deskId.value) ? 'into-game-lh' :
      ''
    ));
  })

  if (deskStore.list.length < 1) {
    deskStore.switchUseDesk(_deskId.value);
    listenStart();
  }
  listenConnectEd(async ()=> {
    // if (deskStore.list.length < 1) {
    //   deskStore.initList().then(()=> {
    //     deskStore.switchUseDesk(_deskId.value);
    //     deskStore.listFlow();
    //   });
    // }
    deskStore.setQueryMulti('n');
    deskStore.switchUseDesk(_deskId.value);
    deskStore.listFlow();
    userStore.updateUserInfo();
    userStore.flowUserBalance();
    await gameStore.getGameInfo();
    gameStore.listenGame();
    systemStore.updateNoticeList();
  });
})

onHide(()=> {
  deskStore.cleanList();

  logStore.addLog('', `GameTable onHide`);
  gameStore.cleanGameFull();
  operaStore.cleanOperaFull();

  // window.removeEventListener('resize', _setWindowHeight, true,);
  uni.offWindowResize(_setWindowHeight);
})

onUnload(()=> {
  logStore.addLog('', `GameTable onUnload`);
  gameStore.cleanGameFull();
  operaStore.cleanOperaFull();

  // window.removeEventListener('resize', _setWindowHeight, true,);
  uni.offWindowResize(_setWindowHeight);
})

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableNormal/Index.less' scoped></style>
