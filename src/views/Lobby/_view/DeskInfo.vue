<template>
<div>

  <div class='di_model'>

    <div
      class='di_dew'
      :style='{
        "--viewSize01":"36px",
        "--viewSize02":"18px",
        "--viewSize03":"9px",
        "--iconSize":"92%",
        "--iconMargin":"4% 0 0 4%",
      }'
    >
      <div class='di_de_first'>
        <PanelFirst :list='(deskStore.list.find(f=> f.deskId === deskStore.useDesk) || {dewList:{dewListFirst:[]}}).dewList.dewListFirst' />
      </div>
      <div class='di_de_second'>
        <PanelSecond :list='(deskStore.list.find(f=> f.deskId === deskStore.useDesk) || {dewList:{dewListSecond:[]}}).dewList.dewListSecond' />
      </div>
      <div class='di_de_third'>
        <PanelThird :list='(deskStore.list.find(f=> f.deskId === deskStore.useDesk) || {dewList:{dewListThird:[]}}).dewList.dewListThird' />
      </div>
      <div class='di_de_fourth'>
        <PanelFourth :list='(deskStore.list.find(f=> f.deskId === deskStore.useDesk) || {dewList:{dewListFourth:[]}}).dewList.dewListFourth' />
      </div>
      <div class='di_de_fifth'>
        <PanelFifth :list='(deskStore.list.find(f=> f.deskId === deskStore.useDesk) || {dewList:{dewListFifth:[]}}).dewList.dewListFifth' />
      </div>
    </div>

    <template v-if='deskStore.loading'>
      <div class='di_button'>加载中</div>
    </template>
    <template v-else>
      <div class='di_button' @click='_bindOpen'>进入<br />游戏</div>
    </template>

  </div>

</div>
</template>
<script setup name='DeskInfo'>
// import { ref, } from 'vue';
import PanelFirst from './PanelFirst.vue';
import PanelSecond from './PanelSecond.vue';
import PanelThird from './PanelThird.vue';
import PanelFourth from './PanelFourth.vue';
import PanelFifth from './PanelFifth.vue';
import { useDeskStore } from '@front/stores/modules/desk.store';
import routers from '@front/routers/index';

const deskStore = useDeskStore();

function _bindOpen() {
  if (!deskStore.useDesk) return;
  routers.push(`/GameTable/${deskStore.useDesk}`);
}

</script>
<style lang='less' src='@front/zstyles/views/Lobby/_view/DeskInfo.less' scoped></style>
