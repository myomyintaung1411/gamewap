<template>
<view class='ta_model'>

  <view class='ta_view' data-ident='back' @tap='_bindAction'>
    <SvgIcon class='ta_vi_icon' name='game-table-back-white' />
    <view class='ta_vi_name'>{{t("table.return")}}</view>
  </view>

  <view class='ta_action'>

    <view class='ta_ac_left'>
      <view class='ta_ac_le_view'>
        <SvgIcon class='ta_ac_le_vi_icon' name='user-info-white' />
      </view>

      <view class='ta_ac_le_view'>
        <view class='ta_ac_le_vi_name'>{{ userStore.getBalanceStr || '--' }}</view>
      </view>

      <!-- <view class='ta_ac_le_view'>
        <SvgIcon class='ta_ac_le_vi_icon' name='game-table-record' />
      </view>

      <view class='ta_ac_le_view' data-ident='video-verify' @tap='_bindAction'>
        <SvgIcon class='ta_ac_le_vi_icon' name='game-table-eyes' />
      </view> -->
    </view>

    <view class='ta_ac_right'>
      <view class='ta_ac_ri_view' @tap='systemStore.setPlayVoiceAuto()'>
        <SvgIcon class='ta_ac_ri_vi_icon' :name='systemStore.playVoice ? "game-table-voice-allow-white" : "game-table-voice-disable-white"' />
      </view>

      <view class='ta_ac_ri_view' data-ident='menu' @tap='_bindAction'>
        <SvgIcon class='ta_ac_ri_vi_icon' name='game-table-menu-white' />
      </view>
    </view>

  </view>

  <view style='width:0; height:0;'>
    <PerfComponent :componentUrl='PCompSidePopup' ref='_vSidePopupWindow' />
  </view>

</view>
</template>
<script setup name='TitleAction'>
import { ref } from 'vue';
import PerfComponent from '@front/components/PerfComponent.vue';
import router from '@front/routers';
import { useSystemStore } from '@front/stores/modules/system.store';
import { useUserStore } from '@front/stores/modules/user.store';
import { EventEmitter, } from '@front/eventBus/index';
import { VOICE_SEND, } from '@front/eventBus/actions';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
// #ifdef APP-PLUS
  import PCompSidePopup from '@front/components/SidePopup.vue';
// #endif
// #ifndef APP-PLUS
  const PCompSidePopup = ()=> import('@front/components/SidePopup.vue');
// #endif

const systemStore = useSystemStore(),
      userStore = useUserStore()
;

const _vSidePopupWindow = ref(null);

function _bindAction(event) {
  EventEmitter.emit(VOICE_SEND, 'a_room');

  const { ident } = event.currentTarget.dataset;

  if (ident === 'back') {
      // Check if there's navigation history
    const pages = getCurrentPages();

    if (pages.length > 1) {
      // ✅ We have a previous page in stack, normal back works
      uni.navigateBack({ delta: 1 });
    } else {
      // 🚨 This happens after a browser refresh (no page stack)
      // So manually navigate back to Lobby
      uni.navigateTo({
        url: '/views/Lobby/Index'
      });
    }
  } else if (ident === 'menu') {
    _vSidePopupWindow.value.showChange();

  }
}

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableMulti/TitleAction.less' scoped></style>
