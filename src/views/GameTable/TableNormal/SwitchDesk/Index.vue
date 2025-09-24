<template>
<view>

  <view class='sd_model' @tap='_bindSwitchDesk'>
    <view class='sd_text'>{{t("table.switch_game_open")}}</view>
  </view>

  <PerfComponent :componentUrl='PCompSwitchDesk' ref='_vSwitchDesk' />

</view>
</template>
<script setup name='SwitchDesk'>
import { ref } from 'vue';
import PerfComponent from '@front/components/PerfComponent.vue';
import { EventEmitter, } from '@front/eventBus/index';
import { VOICE_SEND, } from '@front/eventBus/actions';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
// #ifdef APP-PLUS
  import PCompSwitchDesk from '@front/components/SwitchDesk/Index.vue';
// #endif
// #ifndef APP-PLUS
  const PCompSwitchDesk = ()=> import('@front/components/SwitchDesk/Index.vue');
// #endif

const _vSwitchDesk = ref(null);

function _bindSwitchDesk() {
  EventEmitter.emit(VOICE_SEND, 'a_room');
  _vSwitchDesk.value.showChange();
}

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableNormal/SwitchDesk/Index.less' scoped></style>
