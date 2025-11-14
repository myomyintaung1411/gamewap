<template>
  <view class='sdt_model'>
    <view class='sdt_switch'>
      <image class='sdt_switch_bg' src='@front/assets/lobby/bg_swtich.png' mode='scaleToFill' />
      <view class="sdt_sw_track">

      <view
        class="sdt_sw_bright"
        :class="{
          'sdt_sw_bright--first': _switchIndex === 0,
          'sdt_sw_bright--other': _switchIndex > 0
        }"
        :style="_brightStyle"
      ></view>

      <template v-for="(item, index) in _switchList" :key="item.ident || index">
        <view
          :class="['sdt_sw_view', index === _switchIndex && '_bright']"
          :data-ident="item.ident"
          @tap="_bindSwitchType"
        >
          <view class="sdt_sw_vi_cn">{{ t(item.name) }}</view>
          <view class="sdt_sw_vi_en">{{ item.en }}</view>
        </view>
      </template>
    </view>

    </view>


<!-- 
        <view class="sdt_switch_extra">

        <view class="ui-action-item" @click="_refreshRoutes" @tap="_refreshRoutes">
            <image class="item-icon" :src="reloadIcon" mode="widthFix" />
            <text class="item-text">好路刷新</text>
        </view>

        <view class="ui-action-item" @click="toggleSort" @tap="toggleSort">
          <image class="item-icon" :src="listIcon" mode="widthFix" />
            <text class="item-text">好路排序</text>
            <text class="arrow">▼</text>
        </view>

        <view class="ui-action-item" @click="toggleMode" @tap="toggleMode">
           <image class="item-icon" :src="mapIcon" mode="widthFix" />
            <text class="item-text">现场模式</text>
            <text class="arrow">▼</text>
        </view>

    </view> -->
  </view>



</template>

<script setup name='SwitchDeskType'>
import { computed, /*nextTick*/ } from 'vue';
import { useDeskStore } from '@front/stores/modules/desk.store';
import { useI18n } from 'vue-i18n';
import mapIcon from '@front/assets/lobby/map.png';
import listIcon from '@front/assets/lobby/list.png';
import reloadIcon from '@front/assets/lobby/reload.png';

const { t } = useI18n();
const deskStore = useDeskStore();
const emit = defineEmits(['openRouteMap']);

const _switchList = [
        { name:'multiTable.all', ident:'', en:'HALL' },
        { name:'multiTable.bjl', ident:'百家乐', en:'BACCARAT' },
        { name:'multiTable.lh', ident:'龙虎', en:'DRAGON TIGER' },
      ],
      _switchIndex = computed(()=> {
        const index = _switchList.findIndex(f=> f.ident === deskStore.queryType);

        return index < 0 ? 0 : index;
      }),
      _brightStyle = computed(()=> {
        const percent = 94 / _switchList.length;

        return {
         
                  // use left instead of translateX
          left: `${_switchIndex.value * percent}%`,
        };
      })
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

function _openRouteMap() {
  emit('openRouteMap');
}

function toggleSort() {}

function toggleMode() {}

function _refreshRoutes() {
  console.log('refreshRoutes');
  deskStore.switchQueryList(250, deskStore.queryType);
}

</script>

<style lang='less' src='@front/zstyles/views/Lobby/_view/SwitchDeskType.less' scoped></style>
