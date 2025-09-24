<template>
<view>

  <template v-if='_show'>

    <view class='plr_mask' @tap='_bindClose' @touchmove.stop.prevent='_moveHandle'></view>

    <view class='plr_model' @touchmove.stop.prevent='_moveHandle'>

      <view class='plr_ph'></view>

      <view class='plr_list'>
        <template v-for='item in gameStore.limitArea' :key='item.id'>
          <view class='plr_li_line'>
            <view class='plr_li_li_name'>{{item.name}}:</view>
            <view class='plr_li_li_value'>{{isNaN(item.minAmount) ? '??' : _transNumToK(item.minAmount)}} - {{isNaN(item.maxAmount) ? '??' : _transNumToK(item.maxAmount)}}</view>
          </view>
        </template>
      </view>

    </view>

  </template>

</view>
</template>
<script setup name='PopupLimitRed'>
import { ref } from 'vue';
import { useGameStore } from '@front/stores/modules/game.store';
import { EventEmitter, } from '@front/eventBus/index';
import { VOICE_SEND, } from '@front/eventBus/actions';

defineExpose({
  showChange:()=> {
    _show.value = true;
  }
})

const gameStore = useGameStore();

const _show = ref(false);

function _moveHandle() {}

function _bindClose() {
  EventEmitter.emit(VOICE_SEND, 'a_room');

  _show.value = false;
}

function _transNumToK(value){
  if (value >= 1000) {
    return (value / 1000) + 'K';
  }
  return value.toString();
}

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableNormal/PopupLimitRed.less' scoped></style>
