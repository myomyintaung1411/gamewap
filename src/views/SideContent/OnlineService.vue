<template>
	<web-view class="os_model" style="width: 100vw; height: calc(100vh - 40rpx);" :src="_url"></web-view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSystemStore } from '@front/stores/modules/system.store';

const systemStore = useSystemStore();

const _url = ref('');

// 在页面加载时，动态设置URL
onMounted(() => {
	showChange();
})

const showChange = () => {
	/*const _params = {
		name: 'user.username',
		qq: 'user.userId',
		age: '18',
		gender: '男'
	}
	// 设置URL并加载
	_url.value = `https://meiqia.bx6388.com/?metadata=${encodeURIComponent(JSON.stringify(_params))}`;*/

	_url.value = systemStore.onlineServicesUrl;
}
</script>
<style>
</style>