<template>
<view class='page-box'>

  <view class='gt_box'>

    <view class='gt_back' @tap='_bindBackLobby'>
      <SvgIcon name='back-lobby' size='24' />
    </view>

    <view class='gt_more' @tap='_bindOpenTools'>
      <SvgIcon name='more-desk' size='20' />
    </view>

    <view class='gt_voice' @tap='_bindVoice'>
      <SvgIcon class='bi_ri_vi_icon' :name='systemStore.playVoice ? "game-voice-allow" : "game-voice-disable"' size='22' />
    </view>

    <!-- <Vue3ScaleBox :width='1512' :height='820' :bgc='"#252733"' :delay='20' :isFlat='false'> -->

      <view
        id='gametable-body'
        class='gt_flex'
      >

        <view style='height:var(--status-bar-height)'></view>

        <view class='gt_video'>
          <PanelVideo />
        </view>

        <view class='gt_flex1'>
          <view class='gt_briefInfo'>
            <PanelBriefInfo />
          </view>

          <view class='gt_bettingArea'>
            <PanelBettingArea />
          </view>

          <view class='gt_chipsArea'>
            <PanelChipsArea />
          </view>
        </view>

        <view class='gt_roundInfo'>
          <PanelRoundInfo />
        </view>

        <view class='gt_dew'>
          <PanelDew />
        </view>

      </view>

    <!-- </Vue3ScaleBox> -->

  </view>

  <SwitchDesk ref='_vSwitchDesk' />
  <SidePopup ref="_sidePopupWindow" />

  <TheVoice ref='_vTheVoice' />
  <TheMsg />
  <TheMsgWithGame />
  <!-- <DevLogInfo /> -->

</view>
</template>
<script setup name='GameTable'>
import { ref, onMounted, /*onUnmounted,*/ nextTick } from 'vue';
import { onLoad, onShow, onHide, onUnload } from '@dcloudio/uni-app';
// import DevLogInfo from '@front/components/DevLogInfo.vue';
import TheMsg from '@front/components/TheMsg.vue';
import TheMsgWithGame from '@front/components/TheMsgWithGame.vue';
import TheVoice from '@front/components/TheVoice.vue';
import SwitchDesk from '@front/components/SwitchDesk/Index.vue';
import SidePopup from '@front/components/SidePopup.vue';
import PanelVideo from './_view/PanelVideo/Index.vue';
import PanelBriefInfo from './_view/PanelBriefInfo.vue';
import PanelBettingArea from './_view/PanelBettingArea.vue';
import PanelChipsArea from './_view/PanelChipsArea.vue';
import PanelRoundInfo from './_view/PanelRoundInfo.vue';
import PanelDew from './_view/PanelDew/Index.vue';
import { useDeskStore } from '@front/stores/modules/desk.store';
import { useGameStore } from '@front/stores/modules/game.store';
import { useUserStore } from '@front/stores/modules/user.store';
import { useSystemStore } from '@front/stores/modules/system.store';
import { useOperaStore } from '@front/stores/modules/opera.store';
import { useLogStore } from '@front/stores/modules/log.store';
import { listenStart, listenConnectEd, } from '@front/utils/wsManager';
import { EventEmitter, } from '@front/eventBus/index';
import { VOICE_SEND, OPEN_SWITCH_DESK, } from '@front/eventBus/actions';
import router from '@front/routers';

const deskStore = useDeskStore(),
      gameStore = useGameStore(),
      userStore = useUserStore(),
      systemStore = useSystemStore(),
      operaStore = useOperaStore(),
      logStore = useLogStore()
;

const _vSwitchDesk = ref(null),
      _sidePopupWindow = ref(null),
      _deskId = ref(null),
      _vTheVoice = ref(null)
;

onLoad((event)=> {
  const { deskId } = event;
  if (!deskId) return;

  _deskId.value = deskId;
})

onShow(()=> {
  logStore.addLog('', `GameTable onShow ${_deskId.value}`);
  if (!_deskId.value) return;

  nextTick(()=> {
    _vTheVoice.value.voiceSend(
      ['10184', '10185', '10186', '10187',].includes(_deskId.value) ? 'into-game-bjl' :
      ['10188', '10189',].includes(_deskId.value) ? 'into-game-lh' :
      ''
    )
  })

  EventEmitter.add(OPEN_SWITCH_DESK, _bindOpenDeskList);

  // if (new Date().getTime() > 0) return;
  if (deskStore.list.length < 1) {
    deskStore.switchUseDesk(_deskId.value);
    listenStart();
  }
  listenConnectEd(async ()=> {
    if (deskStore.list.length < 1) {
      deskStore.initList().then(()=> {
        deskStore.switchUseDesk(_deskId.value);
        deskStore.listFlow();
      });
    }
    userStore.updateUserInfo();
    userStore.flowUserBalance();
    await gameStore.getGameInfo();
    gameStore.listenGame();
    systemStore.updateNoticeList();
  });
})

onHide(()=> {
  logStore.addLog('', `GameTable onHide`);
  gameStore.cleanGameFull();
  operaStore.cleanOperaFull();
  EventEmitter.remove(OPEN_SWITCH_DESK, _bindOpenDeskList);
})

onUnload(()=> {
  logStore.addLog('', `GameTable onUnload`);
  gameStore.cleanGameFull();
  operaStore.cleanOperaFull();
  EventEmitter.remove(OPEN_SWITCH_DESK, _bindOpenDeskList);
})

function _bindBackLobby() {
  // gameStore.cleanGameFull();
  // operaStore.cleanOperaFull();
  router.replace('/views/Lobby/Index');
}

function _bindOpenDeskList() {
  _vSwitchDesk.value.showChange();
}

function _bindOpenTools() {
  _sidePopupWindow.value.showChange()
}

function _bindVoice() {
  systemStore.setPlayVoiceAuto();
}

// onUnmounted(()=> {
//   EventEmitter.remove(OPEN_SWITCH_DESK, _bindOpenDeskList);
// })

</script>
<style lang='less' src='@front/zstyles/views/GameTable/Index.less' scoped></style>
