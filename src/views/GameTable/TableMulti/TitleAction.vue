<template>
<div class='dn_box'>

  <div class='dn_ph01'></div>

  <div class='dn_model'>
    <div class="dn_navbar">
      <div class="dn_navbar__logo">
        <image class="dn_navbar__logo-img" src="@front/assets/login/logo.png" mode="heightFix" />
        <!-- <div class="dn_navbar__logo-text">皇家国际</div> -->
      </div>

      <div class="dn_navbar__info">
        <div class="dn_navbar__info-item">
          <image class="dn_navbar__info-icon" :src="personIcon" mode="widthFix" />
          <span class="dn_navbar__info-text">{{ userStore.userName || '--' }}</span>
        </div>
        <div class="dn_navbar__info-item">
          <image class="dn_navbar__info-icon" :src="serverIcon" mode="widthFix" />
          <span class="dn_navbar__info-text">{{ userStore.getBalanceStr || '0.00' }}</span>
          <image class="dn_navbar__info-icon" :src="chipsIcon" mode="widthFix" />

        </div>
      </div>

      <div class="dn_navbar__actions">
        <div
          v-if="systemStore.onlineServicesUrl"
          class="dn_navbar__action"
          @tap="_clickOnlineService"
        >
          <image class="dn_navbar__action-icon" :src="serviceIcon" mode="widthFix" />
        </div>
        <div class="dn_navbar__action" @tap="systemStore.setPlayVoiceAuto()">
          <image
            class="dn_navbar__action-icon"
            :src="systemStore.playVoice ? soundIcon : soundOff"
            mode="widthFix"
          />
        </div>
        <div class="dn_navbar__action" @tap='_clickSidePopup'>
          <image class="dn_navbar__action-icon" :src="menuIcon" mode="widthFix" />
        </div>
      </div>
    </div>
  </div>

  <PerfComponent :componentUrl='PCompSidePopup' ref='_vSidePopupWindow' />

</div>
</template>
<script setup name='DeskNavbar'>
import { ref } from 'vue';
import personIcon from '@front/assets/lobby/person.png';
import chipsIcon from '@front/assets/lobby/reload.png';
import serviceIcon from '@front/assets/lobby/service.png';
import soundIcon from '@front/assets/lobby/sound.png';
import serverIcon from '@front/assets/lobby/server.png';
import soundOff from '@front/assets/lobby/sound_off.png'
import menuIcon from '@front/assets/lobby/menu.png';
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
