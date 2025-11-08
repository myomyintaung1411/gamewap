<template>
<view class='ta_model' :style='{ top:"var(--status-bar-height)" }'>

  <view class='ta_view' data-ident='back' @tap='_bindAction'>
    <!-- <SvgIcon class='ta_vi_icon' name='game-table-back-white' /> -->
    <SvgIcon class='ta_vi_icon' name='back' />
    <view class='ta_vi_name'>{{t("table.return")}}</view>
    <!-- <view class='ta_vi_name'>返回</view> -->
  </view>

  <view class='ta_action'>
    <!-- <view class='ta_ac_view'>
      <SvgIcon class='ta_ac_vi_icon' name='game-table-record' />
    </view> -->

    <!-- <view class='ta_ac_view' data-ident='video-verify' @tap='_bindAction'>
      <SvgIcon class='ta_ac_vi_icon' name='game-table-eyes' />
    </view>

    <view class='ta_ac_view'>
      <SvgIcon class='ta_ac_vi_icon' name='game-table-limit-red' />
    </view>

    <view class='ta_ac_view'>
      <SvgIcon class='ta_ac_vi_icon' name='game-table-video' />
    </view>

    <view class='ta_ac_view' @tap='systemStore.setPlayVoiceAuto()'>
      <SvgIcon class='ta_ac_vi_icon' :name='systemStore.playVoice ? "game-table-voice-allow" : "game-voice-disable"' />
    </view> -->

    <view class='ta_ac_view _view_bg _user_balance'>
      <!-- <SvgIcon class='ta_ac_vi_icon' name='user-info-white' /> -->
      <view class='ta_ac_vi_name'>¥ {{ userStore.getBalanceStr || '--' }}</view>
    </view>

    <view class='ta_ac_view' data-ident='menu' @tap='_bindAction'>
      <SvgIcon class='ta_ac_vi_icon' name='game-table-menu-white' />
    </view>
  </view>

  <view style='width:0; height:0;'>
    <PerfComponent :componentUrl='PCompSidePopup' ref='_vSidePopupWindow' />
  </view>

</view>
</template>
<script setup name='TitleAction'>
import { ref,nextTick } from 'vue';
import PerfComponent from '@front/components/PerfComponent.vue';
import router from '@front/routers';
import { useSystemStore } from '@front/stores/modules/system.store';
import { useUserStore } from '@front/stores/modules/user.store';
import { EventEmitter, } from '@front/eventBus/index';
import { VOICE_SEND, } from '@front/eventBus/actions';
import { destroyAllVideos } from '@front/utils/videoController';

// #ifdef APP-PLUS
  import PCompSidePopup from '@front/components/SidePopup.vue';
// #endif
// #ifndef APP-PLUS
  const PCompSidePopup = ()=> import('@front/components/SidePopup.vue');
// #endif

import { useI18n } from "vue-i18n";

const { t } = useI18n();

const systemStore = useSystemStore(),
      userStore = useUserStore()
;

const _vSidePopupWindow = ref(null);

async function _bindAction(event) {
  EventEmitter.emit(VOICE_SEND, 'a_room');

  const { ident } = event.currentTarget.dataset;

  // if (ident === 'back') {
  //   // Tell anyone listening to destroy the video
  //   //  EventEmitter.emit('destroy-video');
  //    nextTick(() => {
  //     destroyAllVideos(); // safely destroy after DOM update
  //     EventEmitter.emit('destroy-video');
  //   });

  //     // Check if there's navigation history
  //   const pages = getCurrentPages();

  //   if (pages.length > 1) {
  //     // ✅ We have a previous page in stack, normal back works
  //     uni.navigateBack({ delta: 1 });
  //   } else {
  //     // 🚨 This happens after a browser refresh (no page stack)
  //     // So manually navigate back to Lobby
  //     uni.navigateTo({
  //       url: '/views/Lobby/Index'
  //     });
  //   }
  // } 
  if (ident === 'back') {
  // Clean up first
  await destroyAllVideos();
  EventEmitter.emit('destroy-video');

  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack({ delta: 1 });
  } else {
    // mark that next page shouldn't destroy again immediately
    sessionStorage.setItem('skipVideoDestroyOnce', 'true');
    uni.navigateTo({ url: '/views/Lobby/Index' });
  }
}  else if (ident === 'menu') {
    _vSidePopupWindow.value.showChange();

  }
}

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableNormal/TitleAction.less' scoped></style>
