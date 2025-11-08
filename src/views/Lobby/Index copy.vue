<template>
<div class='page-box' style="background-color: #0e112c;">

	<view class='li_model'>

		<view style='height:var(--status-bar-height)'></view>

		<DeskNavbar />

		<SwitchDeskType />

		<NoticeBar />

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
	listenStart();
	listenConnectEd(async ()=> {

		deskStore.setQueryMulti('n');
		deskStore.initAllQueryList("")
		userStore.updateUserInfo();
		userStore.flowUserBalance();
		systemStore.updateNoticeList();
	});
})

// onShow(()=> {
// 	 EventEmitter.emit('destroy-video');
//     destroyAllVideos(); // stops all video players
// 	// listenStart();
// 	// listenConnectEd(async ()=> {

// 	// 	if (deskStore.list.length < 1) {
// 	// 		deskStore.setQueryMulti('n');
// 	// 		deskStore.initList().then(()=>
// 	// 			deskStore.listFlow()
// 	// 		);
// 	// 	}
// 	// 	userStore.updateUserInfo();
// 	// 	userStore.flowUserBalance();
// 	// 	systemStore.updateNoticeList();
// 	// });
// })

onShow(() => {
  const skip = sessionStorage.getItem('skipVideoDestroyOnce');
  if (skip) {
    sessionStorage.removeItem('skipVideoDestroyOnce');
    console.log('Skipping duplicate video destroy on first show');
  } else {
    EventEmitter.emit('destroy-video');
    destroyAllVideos();
  }
});


</script>
<style lang='less' src='@front/zstyles/views/Lobby/Index.less' scoped>
</style>
