<template>
<div class='pf_box'>

	<DewCanvas ident='PanelFirst' :boxItemWidth='16' :dewItemWidth='16' :backColNum='2' :pointColumn='2' :isAsk='false' :list='list' />

</div>
</template>
<script setup name='PanelFirst'>
import DewCanvas from '@front/components/DewCanvas.vue';

const _props = defineProps({
	id: String,
	list: Array,
})

</script>
<style lang='less' src='@front/zstyles/views/Lobby/_view/PanelFirst.less' scoped></style>
