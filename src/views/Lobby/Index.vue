<template>
<div class='page-box' style="background-color: #0e112c;">

	<view class='li_model'>

		<view style='height:var(--status-bar-height)'></view>

		<DeskNavbar />

		<NoticeBar />
		<SwitchDeskType />


		<DeskList />

	</view>

  <PageBaseImport />

</div>
</template>
<script setup name='Lobby'>
import { ref, /*onMounted*/ } from 'vue';
import { onLoad, onShow, } from '@dcloudio/uni-app';
import PageBaseImport from '@front/components/PageBaseImport.vue';
import DeskNavbar from './_view/DeskNavbar.vue';
import DeskList from './_view/DeskList.vue';
import SwitchDeskType from './_view/SwitchDeskType.vue';
import NoticeBar from './_view/NoticeBar.vue';
import { listenStart, listenConnectEd, } from '@front/utils/wsManager';
import { useDeskStore } from '@front/stores/modules/desk.store';
import { useUserStore } from '@front/stores/modules/user.store';
import { useSystemStore } from '@front/stores/modules/system.store';
import { EventEmitter, } from '@front/eventBus/index';
import { VOICE_SEND, } from '@front/eventBus/actions';
import { destroyAllVideos } from '@front/utils/videoController';

const deskStore = useDeskStore(),
			userStore = useUserStore(),
			systemStore = useSystemStore()
;

onLoad(()=> {
})

onShow(()=> {
	 EventEmitter.emit('destroy-video');
    destroyAllVideos(); // stops all video players
	/*if (deskStore.isFlowIng) {
		deskStore.initList();
		return;
	}*/

	listenStart();
	listenConnectEd(async ()=> {

		if (deskStore.list.length < 1) {
			deskStore.setQueryMulti('n');
			deskStore.initList().then(()=>
				deskStore.listFlow()
			);
		}
		userStore.updateUserInfo();
		userStore.flowUserBalance();
		systemStore.updateNoticeList();
	});
})

/*onMounted(()=> {
	if (deskStore.list.length > 0) {
		deskStore.listFlow();
		return;
	}

	listenStart();
	listenConnectEd(async () => {
		deskStore.initList().then(() =>
			deskStore.listFlow()
		);
		userStore.updateUserInfo();
		userStore.flowUserBalance();
		systemStore.updateNoticeList();
	});
})*/

</script>
<style lang='less' src='@front/zstyles/views/Lobby/Index.less' scoped>
</style>