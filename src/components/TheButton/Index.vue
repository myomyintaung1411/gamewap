<template>
<view class='tb_model' @tap='_bindTaps'>

  <slot></slot>

  <template v-if='loading'>
    <view class='tb_loading'>
      <SvgIcon class='tb_lo_fill' name='button-loading' />
    </view>
  </template>

</view>
</template>
<script setup name='TheButton'>
import { computed } from 'vue';

const _props = defineProps({
  loading: Boolean,
  disabled: Boolean,
  taps: Function,
})

function _bindTaps() {
  if (_props.disabled) return;
  _props.taps();
}

</script>
<style lang='less' src='@front/zstyles/components/TheButton/Index.less' scoped></style>
