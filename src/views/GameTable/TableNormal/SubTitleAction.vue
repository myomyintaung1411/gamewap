<template>
<view class='sta_model' :style='{ top:"calc(var(--status-bar-height) + 100rpx)" }'>

  <view class='sta_view' data-ident='voice' @tap='_bindAction'>
    <SvgIcon class='sta_vi_icon' :name='systemStore.playVoice ? "game-table-voice-allow-white" : "game-table-voice-disable-white"' />
  </view>

  <SwitchDesk />

  <view class='sta_ph01'></view>

  <view class='sta_bottom'>
    <!-- <view class='sta_bo_view' data-ident='chip-setting' @tap='_bindAction'>
      <SvgIcon class='sta_bo_vi_icon' name='chip-setting-white' />
    </view> -->
    <!-- <view class='sta_bo_switch'>
      <view class='sta_bo_sw_name'>开牌缩放</view>
      <switch class='sta_bo_sw_content' :checked='_zoomVideo' color='#75bc2a' @change='_changeZoomVideo(!_zoomVideo)' />
    </view> -->
    <!-- <view class='sta_bo_view' data-ident='video-verify' @tap='_changeZoomVideo(!_zoomVideo)'>
      <SvgIcon class='sta_bo_vi_icon' :name='_zoomVideo ? "game-table-video-zoom-open" : "game-table-video-zoom-close"' />
    </view> -->

    <view class='sta_bo_view' data-ident='video-verify' @tap='_bindAction'>
      <SvgIcon class='sta_bo_vi_icon' name='game-table-eyes-white' />
    </view>

    <view class='sta_bo_view _size01' data-ident='video-refresh' @tap='_bindAction'>
      <!-- <SvgIcon class='sta_bo_vi_icon' name='game-table-video-refresh-white' /> -->
      <SvgIcon class='sta_bo_vi_icon' name='video-refresh' />
    </view>
  </view>

  <!-- <view class='sta_view' data-ident='switch-desk' @tap='_bindAction'>
    <SvgIcon class='sta_vi_icon' name='game-table-sub-switch' />
  </view> -->

  <!-- <view class='sta_view'>
    <SvgIcon class='sta_vi_icon' name='game-table-sub-record' />
  </view> -->

  <PerfComponent :componentUrl='PCompVideoVerify' ref='_vVideoVerify' />
  <!-- <ChipsSetting ref='_vChipsSetting' /> -->

</view>
</template>
<script setup name='SubTitleAction'>
import { ref, /*inject,*/ onMounted, } from 'vue';
  import { onUnload } from '@dcloudio/uni-app';
import PerfComponent from '@front/components/PerfComponent.vue';
// import ChipsSetting from '@front/components/ChipsSetting.vue';
import SwitchDesk from './SwitchDesk/Index.vue';
import { EventEmitter, } from '@front/eventBus/index';
import { VIDEO_REFRESH, VOICE_SEND, VIDEO_RECONNECT_REFRESH } from '@front/eventBus/actions';
import { useSystemStore } from '@front/stores/modules/system.store';

// #ifdef APP-PLUS
  import PCompVideoVerify from '@front/components/VideoVerify.vue';
// #endif
// #ifndef APP-PLUS
  const PCompVideoVerify = ()=> import('@front/components/VideoVerify.vue');
// #endif

const systemStore = useSystemStore();

const _vVideoVerify = ref(null),
      _loadingRefresh = ref(false)/*,
      _vChipsSetting = ref(null)*/
      /*_zoomVideo = inject('zoomVideo'),
      _changeZoomVideo = inject('changeZoomVideo')*/
;

function _bindAction(event) {
  EventEmitter.emit(VOICE_SEND, 'a_room');

  const { ident } = event.currentTarget.dataset;

  if (ident === 'voice') {
    systemStore.setPlayVoiceAuto();

  }/* else if (ident === 'chip-setting') {
    _vChipsSetting.value.showChange();

  }*/ else if (ident === 'video-verify') {
    _vVideoVerify.value.showChange();

  } else if (ident === 'video-refresh') {
    if (_loadingRefresh.value) return;
    _loadingRefresh.value = true;

    EventEmitter.emit(VIDEO_REFRESH, ()=> {
      _loadingRefresh.value = false;
    });
  }
}

function _bindVideoRefresh() {
  _bindAction({
    currentTarget: {
      dataset: {
        ident: 'video-refresh'
      },
    }
  })
}

onMounted(()=> {
  EventEmitter.add(VIDEO_RECONNECT_REFRESH, _bindVideoRefresh);
})

onUnload(()=> {
  EventEmitter.remove(VIDEO_RECONNECT_REFRESH, _bindVideoRefresh);
})

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableNormal/SubTitleAction.less' scoped></style>
