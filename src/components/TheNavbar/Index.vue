<template>
<view class='tni_box'>

  <view class='tni_status'></view>

  <view class='tni_model'>
    <view class='tni_back' @tap='_navigateBack'>
      <SvgIcon name='back-lobby' size='24' />
    </view>

    <view class='tni_name'>{{title}}</view>

    <view class='tni_action'></view>
  </view>

</view>
</template>
<script setup name='TheNavbar'>
import router from '@front/routers';

defineProps({
  title: String,
})

function _navigateBack(){
  router.back();
}

</script>
<style lang='less' src='@front/zstyles/components/TheNavbar/Index.less' scoped></style>
