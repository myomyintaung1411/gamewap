<template>
<view class='pf_box'>

	<DewCanvas ident='PanelFifth' :boxItemWidth='8' :dewItemWidth='4' :backColNum='2' :pointColumn='2' :isAsk='false' :list='list' />

</view>
</template>
<script setup name='PanelFifth'>
import DewCanvas from '@front/components/DewCanvas.vue';

const _props = defineProps({
	id: String,
	list: Array,
})

</script>
<style lang='less' src='@front/zstyles/views/Lobby/_view/PanelFifth.less' scoped></style>
