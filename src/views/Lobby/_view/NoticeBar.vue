<template>
<div class='nb_model'>

  <SvgIcon class='nb_icon' name='lobby-notice' size='18' />
  <div class='nb_textarea'>
    <div :class='["nb_te_fill", systemStore.noticeList.length > 0 && "_running"]'>
      {{systemStore.noticeList.find(f=> f.type === 'roll')?.content || ''}}
    </div>
  </div>

</div>
</template>
<script setup name='NoticeBar'>
import { useSystemStore } from '@front/stores/modules/system.store';

const systemStore = useSystemStore();

</script>
<style lang='less' src='@front/zstyles/views/Lobby/_view/NoticeBar.less' scoped></style>
