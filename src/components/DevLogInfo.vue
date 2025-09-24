<template>
<view>

  <view class='dli_point' @tap='_bindShow'>Log</view>

  <template v-if='_showModel'>
    <view class='dli_mask' @tap='_bindClose' @touchmove.stop.prevent='_moveHandle'></view>

    <view class='dli_model'>

      <view class='dli_list'>
        <template v-for='item in logStore.list' :key='item.id'>

          <view class='dli_li_line'>
            <view class='dli_li_li_text'>{{item.name}}{{item.content}}</view>
            <view class='dli_li_li_datetime'>{{item.dateTime}}</view>
          </view>

        </template>
      </view>

      <button @tap='logStore.cleanLog'>clean</button>

    </view>
  </template>

</view>
</template>
<script setup name='DevLogInfo'>
import { ref } from 'vue';
import { useLogStore } from '@front/stores/modules/log.store';

const logStore = useLogStore();

const _showModel = ref(false);

function _moveHandle() {
}

function _bindShow() {
  _showModel.value = true;
}

function _bindClose() {
  _showModel.value = false;
}

</script>
<style lang='less' src='@front/zstyles/components/DevLogInfo.less' scoped></style>
