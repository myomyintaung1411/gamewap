<template>
<view>

  <view :class='["pd_model", systemStore.isPhoneSmall && "_isPhoneSmall"]'>

    <view class='pd_left'>
      <view class='pd_first'>
        <PanelFirst :size='systemStore.isPhoneSmall ? 16 : 24' />
      </view>
    </view>

    <view class='pd_right'>
      <view class='pd_second'>
        <PanelSecond :size='systemStore.isPhoneSmall ? 8 : 12' />
      </view>

      <view class='pd_third'>
        <PanelThird :size='systemStore.isPhoneSmall ? 8 : 12' />
      </view>

      <view class='pd_fourth'>
        <PanelFourth :size='systemStore.isPhoneSmall ? 8 : 12' />
      </view>

      <view class='pd_fifth'>
        <PanelFifth :size='systemStore.isPhoneSmall ? 8 : 12' />
      </view>

      <view class='pd_sixth'>
        <PanelSixth :size='systemStore.isPhoneSmall ? 8 : 12' />
      </view>
    </view>

    <template v-if='userStore.isTrialUser'>
      <StampTryPlay />
    </template>

  </view>

</view>
</template>
<script setup name='PanelDew'>
import StampTryPlay from '@front/components/StampTryPlay.vue';
import PanelFirst from './PanelFirst.vue';
import PanelSecond from './PanelSecond.vue';
import PanelThird from './PanelThird.vue';
import PanelFourth from './PanelFourth.vue';
import PanelFifth from './PanelFifth.vue';
import PanelSixth from './PanelSixth.vue';
import { useUserStore } from '@front/stores/modules/user.store';
import { useSystemStore } from '@front/stores/modules/system.store';

const userStore = useUserStore(),
      systemStore = useSystemStore()
;

</script>
<style lang='less' src='@front/zstyles/views/GameTable/_view/PanelDew/Index.less' scoped></style>
