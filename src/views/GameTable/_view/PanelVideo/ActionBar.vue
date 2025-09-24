<template>
<view class='ac_model'>

  <view class='ab_view' data-ident='video-verify' @click='_bindAction'>
    <SvgIcon class='ab_vi_icon' name='video-verify' size='22' />
    <!-- <view class='ab_vi_name' v-show="_count <= 0">视频验真</view>
    <view class='ab_vi_name' v-show="_count > 0" >&nbsp;&nbsp;&nbsp;{{ _count }}&nbsp;&nbsp;&nbsp;</view> -->
  </view>

  <!-- <view class='ab_view' v-loading='_loadingRefresh' data-ident='video-refresh' @click='_bindAction'> -->
  <view class='ab_view' data-ident='video-refresh' @click='_bindAction'>
    <SvgIcon class='ab_vi_icon' name='video-refresh' size='22' />
    <!-- <view class='ab_vi_name'>视频刷新</view> -->
  </view>

  <VideoVerify ref='_vVideoVerify' />

</view>
</template>
<script setup name='ActionBar'>
import { ref } from 'vue';
import VideoVerify from '@front/components/VideoVerify.vue';
import { EventEmitter, } from '@front/eventBus/index';
import { VIDEO_REFRESH, } from '@front/eventBus/actions';

const _vVideoVerify = ref(null),
      _loadingRefresh = ref(false),
      _count = ref(null)
;

function _bindAction(event) {
  const { ident } = event.currentTarget.dataset;
  if (ident === 'video-verify') {
      _vVideoVerify.value.showChange();
  } else if (ident === 'video-refresh') {
    if (_loadingRefresh.value) return;
    _loadingRefresh.value = true;
    EventEmitter.emit(VIDEO_REFRESH, ()=> {
      _loadingRefresh.value = false;
    });
  }
}

</script>
<style lang='less' src='@front/zstyles/views/GameTable/_view/PanelVideo/ActionBar.less' scoped></style>
