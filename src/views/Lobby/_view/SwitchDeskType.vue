<template>
<view class='sdt_model'>

  <view class='sdt_switch'>
    <template v-for='(item,index) in _switchList' :key='item.id'>
      <view
        :class='["sdt_sw_view", index === _switchIndex && "_bright"]'
        :data-ident='item.ident' @tap='_bindSwitchType'
      >
        <view class='sdt_sw_vi_name'>{{t(item.name)}}</view>
      </view>
    </template>

    <view class='sdt_sw_bright' :style='{ left:`calc((160rpx * ${_switchIndex}) - 50rpx)` }'></view>
  </view>

</view>
</template>
<script setup name='SwitchDeskType'>
import { computed, /*nextTick*/ } from 'vue';
import { useDeskStore } from '@front/stores/modules/desk.store';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const deskStore = useDeskStore();

const _switchList = [
        { name:"multiTable.all", ident:'', },
        { name:"multiTable.bjl", ident:'百家乐', },
        { name:"multiTable.lh", ident:'龙虎', },
      ],
      _switchIndex = computed(()=> (
        _switchList.findIndex(f=> f.ident === deskStore.queryType)
      ))
;

function _bindSwitchType(event) {
  const { ident } = event.currentTarget.dataset;

  deskStore.switchQueryList(250, ident);

  /*deskStore.setQueryType(ident);

  nextTick(()=> {
    deskStore.cleanList();

    // nextTick(()=> {
    //   deskStore.initList();
    // })
  })*/
}

</script>
<style lang='less' src='@front/zstyles/views/Lobby/_view/SwitchDeskType.less' scoped></style>
