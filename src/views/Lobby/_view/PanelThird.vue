<template>
<view class='pt_box'>

	<DewCanvas ident='PanelThird' :boxItemWidth='8' :dewItemWidth='4' :backColNum='2' :pointColumn='2' :isAsk='false' :list='list' />

</view>
</template>
<script setup name='PanelThird'>
import DewCanvas from '@front/components/DewCanvas.vue';

const _props = defineProps({
	id: String,
	list: Array,
})

</script>
<style lang='less' src='@front/zstyles/views/Lobby/_view/PanelThird.less' scoped></style>
