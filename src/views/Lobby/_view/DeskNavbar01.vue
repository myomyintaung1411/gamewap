<template>
	<div class='dn_model'>

		<div class='dn_left'>
			<div style="width: 90rpx;"></div>
			<!-- <div class='dn_view' v-loading='userStore.loading.loginOut' data-ident='loginOut' @click='_bindAction'>
				<SvgIcon style="margin-left: 20rpx;" name='lobby-loginout' size='30' />
			</div> -->
			<SvgIcon name='logo-01' class='dn_logo02' />
			<image class='popup-img' :src='userStore.getImageBase + "icons/expand.png" ' @click="_clickSidePopup" />
			<!-- <SvgIcon style="margin-right: 20rpx;" @click="_clickSidePopup" name='lobby-bet' size='30' /> -->
		</div>
		<view style="display: flex;justify-content: space-between;align-items: center;">
			<div class='dn_user'>
				<div class='dn_us_account'>账号:{{userStore.userName || '--'}}</div>
				<div class='dn_us_balance'>余额:{{userStore.getBalanceStr || '--'}}</div>
			</div>
			<SvgIcon @click="setVoice" :name="systemStore.playVoice ? 'voice-allow' : 'lobby-voice'" size='24' />
		</view>
		<div class='dn_center'>
			<!-- <SvgIcon class='dn_logo02' name='logo-bx01' size='260' /> -->
			<div class='dn_notice'>
				<!-- <image class='dn_no_img img-normal' :src='ImgLobbyNotice' /> -->
				<div class='dn_no_box'>
					<SvgIcon class='dn_no_bo_icon' name='lobby-notice' size='18' />
					<div class='dn_no_bo_textarea'>
						<div :class='[" dn_no_bo_te_fill", systemStore.noticeList.length> 0 && "_running"]'>
							{{systemStore.noticeList.length > 0 ? systemStore.noticeList[0].content : ''}}
						</div>
					</div>
				</div>
			</div>
		</div>
		<SidePopup ref="_sidePopupWindow" />
	</div>
</template>
<script setup name='DeskNavbar'>
	import {
		ref,
		onMounted,
	} from 'vue';
	// import ImgLobbyNotice from '@front/assets/imgs/bgs/lobby-notice.png';
	// import ImgExpand from '@front/assets/icons/expand.png';
	import SidePopup from '@front/components/SidePopup.vue';
	import {
		useUserStore
	} from '@front/stores/modules/user.store';
	import {
		useSystemStore
	} from '@front/stores/modules/system.store';

	const userStore = useUserStore(),
		systemStore = useSystemStore();

	const _sidePopupWindow = ref(null)

	function _clickSidePopup() {
		_sidePopupWindow.value.showChange()
	}

	function setVoice() {
		systemStore.setPlayVoiceAuto();
	}

	onMounted(() => {
		if (userStore.isFirstLogin) {
			uni.showModal({
				content: '为了您账户安全，请修改密码',
				success: function(res) {
					if (res.confirm) {
						uni.navigateTo({
							url: "/views/SideContent/ChangePassword"
						})
					}
				}
			});
		}
	})
</script>
<style lang='less' src='@front/zstyles/views/Lobby/_view/DeskNavbar.less' scoped>
</style>