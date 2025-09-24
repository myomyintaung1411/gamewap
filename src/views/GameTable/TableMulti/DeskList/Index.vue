<template>
<view class='dl_model'>

  <template
    v-for='item in (
      deskStore.list.length === 0
        ? Array.from({ length:6 }, ()=> ({ dewList:{dewListFirst:[], dewListSecond:[], dewListThird:[], dewListFourth:[], dewListFifth:[],} }))
        :
      _goodFilter
        ? deskStore.list.filter(f=> f.isGood)
        :
      deskStore.list
    )'
    :key='item.id'
  >
    <view class='dl_view'>
      <DeskView :deskId='item.deskId' />
    </view>
  </template>

</view>
</template>
<script setup name='DeskList'>
import { inject } from 'vue';
import DeskView from './DeskView/Index.vue';
import { useDeskStore } from '@front/stores/modules/desk.store';

const deskStore = useDeskStore();

const _goodFilter = inject('goodFilter');

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableMulti/DeskList/Index.less' scoped></style>
