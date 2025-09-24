<template>
<div
  v-if='_show'
  class='pd_mdoel'
  :style='{
    "--viewSize01":"36px",
    "--viewSize02":"18px",
    "--viewSize03":"9px",
    "--iconSize":"92%",
    "--iconMargin":"4% 0 0 4%",
  }'
>

  <div class='pd_left'>
    <div class='pd_first'>
      <PanelFirst :list='(!isNaN(_previewDeskIndex) && _previewDeskIndex < deskStore.list.length) ? deskStore.list[_previewDeskIndex].dewList.dewListFirst : []' />
    </div>
  </div>

  <div class='pd_right'>
    <div class='pd_second'>
      <PanelSecond :list='(!isNaN(_previewDeskIndex) && _previewDeskIndex < deskStore.list.length) ? deskStore.list[_previewDeskIndex].dewList.dewListSecond : []' />
    </div>

    <div class='pd_third'>
      <PanelThird :list='(!isNaN(_previewDeskIndex) && _previewDeskIndex < deskStore.list.length) ? deskStore.list[_previewDeskIndex].dewList.dewListThird : []' />
    </div>

    <div class='pd_fourth'>
      <PanelFourth :list='(!isNaN(_previewDeskIndex) && _previewDeskIndex < deskStore.list.length) ? deskStore.list[_previewDeskIndex].dewList.dewListFourth : []' />
    </div>

    <div class='pd_fifth'>
      <PanelFifth :list='(!isNaN(_previewDeskIndex) && _previewDeskIndex < deskStore.list.length) ? deskStore.list[_previewDeskIndex].dewList.dewListFifth : []' />
    </div>
  </div>

  <div class='pd_ident'>{{_previewDeskIndex + 1}}号台</div>

</div>
</template>
<script setup name='RulesAgreements'>
import { ref, onMounted, onUnmounted } from 'vue';
import PanelFirst from '@front/views/Lobby/_view/PanelFirst.vue';
import PanelSecond from '@front/views/Lobby/_view/PanelSecond.vue';
import PanelThird from '@front/views/Lobby/_view/PanelThird.vue';
import PanelFourth from '@front/views/Lobby/_view/PanelFourth.vue';
import PanelFifth from '@front/views/Lobby/_view/PanelFifth.vue';
import { useDeskStore } from '@front/stores/modules/desk.store';
import { EventEmitter, } from '@front/eventBus/index';
import { PREVIEW_DEW, } from '@front/eventBus/actions';

const deskStore = useDeskStore();

const _show = ref(false),
      _previewDeskIndex = ref(NaN)
;

function showChange(deskId) {
  if (!deskId) return _bindClose();
  if (deskId === deskStore.useDesk) return;

  _show.value = true;
  _previewDeskIndex.value = deskStore.list.findIndex(f=> f.deskId === deskId);
}

function _bindClose() {
  _show.value = false;
  _previewDeskIndex.value = NaN;
}

onMounted(()=> {
  EventEmitter.add(PREVIEW_DEW, showChange);
})

onUnmounted(()=> {
  EventEmitter.remove(PREVIEW_DEW, showChange);
})

</script>
<style lang='less' src='@front/zstyles/components/PreviewDew/Index.less' scoped></style>
