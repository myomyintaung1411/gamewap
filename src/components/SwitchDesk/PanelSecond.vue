<template>
<div class='ps_box'>

  <DewCanvas ident='PanelSecond' :boxItemWidth='12' :dewItemWidth='12' :backColNum='2' :pointColumn='2' :list='list' />

</div>
</template>
<script setup name='PanelSecond'>
import DewCanvas from '@front/components/DewCanvas.vue';

const _props = defineProps({
  list: Array,
})

</script>
<style lang='less' src='@front/zstyles/components/SwitchDesk/PanelSecond.less'></style>
