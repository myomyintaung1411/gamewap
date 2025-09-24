<template>
<div class='dn_box'>

  <div class='dn_ph01'></div>

  <div class='dn_model'>

    <div class='dn_title'>

      <div class='dn_ti_logo'>
        <SvgIcon class='dn_ti_lo_fill' name='logo-01' />
      </div>

      <div class='dn_ti_action'>
        <div class='dn_ti_ac_view' @tap='systemStore.setPlayVoiceAuto()'>
          <SvgIcon class='dn_ti_ac_vi_fill' :name='systemStore.playVoice ? "game-table-voice-allow" : "game-table-voice-disable"' style='width:120%; height:120%; margin:-6rpx 0 0 0;' />
        </div>

        <div class='dn_ti_ac_view' @click='_clickSidePopup'><SvgIcon class='dn_ti_ac_vi_fill' name='desk-navbar-expand' /></div>
      </div>

    </div>

    <div class='dn_info'>

      <div class='dn_in_view'>
        <SvgIcon class='dn_in_vi_icon' name='user-name' />
        <div class='dn_in_vi_name'>{{ userStore.userName || '--' }}</div>
      </div>

      <div class='dn_in_view'>
        <SvgIcon class='dn_in_vi_icon' name='user-balance' />
        <div class='dn_in_vi_name'>{{ userStore.getBalanceStr || '--' }}</div>
      </div>

      <div class='dn_in_ph01'></div>

      <template v-if='systemStore.onlineServicesUrl'>
        <div class='dn_in_btn' @tap='_clickOnlineService'><SvgIcon class='dn_in_bt_fill' name='online-services' /></div>
      </template>

    </div>

  </div>

  <PerfComponent :componentUrl='PCompSidePopup' ref='_vSidePopupWindow' />

</div>
</template>
<script setup name='DeskNavbar'>
import { ref } from 'vue';
import PerfComponent from '@front/components/PerfComponent.vue';
import { useUserStore } from '@front/stores/modules/user.store';
import { useSystemStore } from '@front/stores/modules/system.store';
import { EventEmitter, } from '@front/eventBus/index';
import { VOICE_SEND, } from '@front/eventBus/actions';

// #ifdef APP-PLUS
  import PCompSidePopup from '@front/components/SidePopup.vue';
// #endif
// #ifndef APP-PLUS
  const PCompSidePopup = ()=> import('@front/components/SidePopup.vue');
// #endif

const userStore = useUserStore(),
      systemStore = useSystemStore()
;

const _vSidePopupWindow = ref(null);

function _clickSidePopup() {
  EventEmitter.emit(VOICE_SEND, 'a_room');
  _vSidePopupWindow.value.showChange();
}

function _clickOnlineService() {
  uni.navigateTo({
    url: '/views/SideContent/OnlineService'
  })
}

</script>
<style lang='less' src='@front/zstyles/views/Lobby/_view/DeskNavbar.less' scoped></style>
