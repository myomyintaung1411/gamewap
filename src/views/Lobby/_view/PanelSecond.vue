<template>
<view class='ps_box'>

	<DewCanvas ident='PanelSecond' :boxItemWidth='8' :dewItemWidth='8' :backColNum='2' :pointColumn='2' :isAsk='false' :list='list' />

</view>
</template>
<script setup name='PanelSecond'>
import DewCanvas from '@front/components/DewCanvas.vue';

const _props = defineProps({
	id: String,
	list: Array,
})

</script>
<style lang='less' src='@front/zstyles/views/Lobby/_view/PanelSecond.less' scoped></style>
