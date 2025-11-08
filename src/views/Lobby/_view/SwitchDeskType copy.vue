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
import { computed, onMounted } from 'vue';
import { useDeskStore } from '@front/stores/modules/desk.store';
import { useI18n } from "vue-i18n";
import { debounce } from 'lodash';

const { t } = useI18n();
const deskStore = useDeskStore();

const _switchList = [
        { name:"multiTable.all", ident:'', },
        { name:"multiTable.bjl", ident:'百家乐', },
        { name:"multiTable.lh", ident:'龙虎', },
      ],
      _switchIndex = computed(()=> {
        const idx = _switchList.findIndex(f=> f.ident === deskStore.queryType);
        return idx < 0 ? 0 : idx;
      })
;

onMounted(()=>{
  deskStore.switchQueryList(true, '');
})

const _loadbindSwitchType = debounce(async function(event) {
  const { ident } = event.currentTarget.dataset;

  deskStore.switchQueryList(false, ident);
}, 500)
function _bindSwitchType(event) {
  _loadbindSwitchType(event)
}

// function _bindSwitchType(event) {
//   const { ident } = event.currentTarget.dataset;

//   deskStore.switchQueryList(250, ident);

// }

</script>
<style lang='less' src='@front/zstyles/views/Lobby/_view/SwitchDeskType.less' scoped></style>
