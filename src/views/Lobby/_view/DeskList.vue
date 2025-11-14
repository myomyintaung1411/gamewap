<template>
	<!-- <div class='dl_model' @scroll='handleScroll' ref='_vScrollWrapper'> -->
	<div class='dl_model' ref='_vScrollWrapper'>
		<scroll-view @scrolltolower='_handleScrollNext' scroll-y='true' style='height:100%'>
			<template
				v-for='item in (_list.length === 0 ? Array.from({ length: 6 }, () => ({ dewList: { dewListFirst: [], dewListSecond: [], dewListThird: [], dewListFourth: [], dewListFifth: [], dewListSixth: [], } })) : _list)'
				:key='item.id'>
				<div class='dl_view' :data-id='item.id' :data-is-private-ing='item.isPrivateIng'
					:data-can-join-private='item.canJoinPrivate' @click='_bindAction'>

					<div class='dl_vi_title'>
						<div class='dl_vi_ti_name'>
							 {{ item.name }}
						</div>
						<div class='dl_vi_ti_textarea'>
							<div class='dl_vi_ti_info'>限红: {{ item.limitAreaStr }}</div>
							<div class='dl_vi_ti_info'>{{t("time_status.round")}}: {{item.round}}</div>
						<div class='dl_vi_ti_info'>{{t("time_status.hand")}}: {{item.slot}}</div>
							<div class='dl_vi_ti_time'>
								<img v-if="item?.timming?.value > 10" src="@/assets/lobby/time1.png" alt=""
									class='dl_vi_ti_ti_icon'>
								<img v-else src="@/assets/lobby/time2.png" alt="" class='dl_vi_ti_ti_icon'>
								<!-- <SvgIcon class='dl_vi_ti_ti_icon' name='lobby-desk-lock' size='14' /> -->
								<template v-if='["timing"].includes(item.gameStatus)'>
									<div  :class="{
										'time-high': item?.timming?.value > 10,
										'time-low': item?.timming?.value <= 10
									}" class='dl_vi_ti_ti_ic_num'>
										{{ isNaN(item.timming.value) ? '-' : item.timming.value }}
									</div>
								</template>
								<template v-else>
									<div class='dl_vi_ti_ti_ic_text'>{{ t(MATCH_GAME_STATUS_NAME[item.gameStatus] ||
										'time_status.unknown')}}
									</div>
								</template>
							</div>
						</div>
					</div>

					<div class='dl_vi_content'>
						<div class='dl_vi_co_banner'>
							<template v-if='item.banner'>
								<image class='img-normal' :src='item.banner' />
							</template>
						</div>


						<div id='dewContent' class='dl_vi_co_dew' :style='{
							"width": `${_dewWidth > 0 ? _dewWidth + "px" : ""}`,
							"max-width": `${_dewWidth > 0 ? _dewWidth + "px" : ""}`,
							"--viewSize01": "18px",
							"--viewSize02": "9px",
							"--viewSize03": "4.5px",
							"--iconSize": "92%",
							"--iconMargin": "4% 0 0 4%",
						}'>

							<template v-if='item.isPrivateIng'>
								<div class='dl_vi_co_de_private'>
									<div class='dl_vi_co_de_pr_line'></div>
									<div class='dl_vi_co_de_pr_name'>{{ t("time_status.reversed") }}</div>
									<div class='dl_vi_co_de_pr_line'></div>
								</div>
							</template>
							<template v-else-if='item.gameStatus === "shuffle"'>
								<div class='dl_vi_co_de_shuffle'>
									<div class='dl_vi_co_de_sh_line'></div>
									<div class='dl_vi_co_de_sh_name'>{{ t("time_status.shuffle") }}</div>
									<div class='dl_vi_co_de_sh_line'></div>
								</div>
							</template>
							<template v-else-if='item.gameStatus === "stopDesk"'>
								<div class='dl_vi_co_de_shuffle'>
									<div class='dl_vi_co_de_sh_line'></div>
									<div class='dl_vi_co_de_sh_name'>{{ t("time_status.stop") }}</div>
									<div class='dl_vi_co_de_sh_line'></div>
								</div>
							</template>
							<div class='pd_left'>
								<div class='pd_first'>
									<PanelSecond :list='item.dewList.dewListSecond' :id='item.id' />
								</div>

							</div>
						</div>


					</div>
					<!-- <div class="dl-type-display">
						<div class="dl-result-type">
							<img src="@/assets/lobby/all.png" alt="all" class="all_img">
							<div class="result_txt">{{item.TotalNum}}</div>
						</div>
						<div v-if="item.gameType == 'bjl'" class="dl-result-type">
							<img src="@/assets/lobby/banker.png" alt="all" class="result_img">
							<div class="result_txt">{{item.BankerWin}}</div>
						</div>
						<div v-if="item.gameType == 'bjl'" class="dl-result-type">
							<img src="@/assets/lobby/player.png" alt="all" class="result_img">
							<div class="result_txt">{{item.PlayerWin}}</div>
						</div>
						<div v-if="item.gameType == 'lh'" class="dl-result-type">
							<img src="@/assets/lobby/dragon.png" alt="all" class="result_img">
							<div class="result_txt">{{item.DragonWin}}</div>
						</div>
						<div v-if="item.gameType == 'lh'" class="dl-result-type">
							<img src="@/assets/lobby/tiger.png" alt="all" class="result_img">
							<div class="result_txt">{{item.TigerWin}}</div>
						</div>
						<div class="dl-result-type">
							<img src="@/assets/lobby/tie.png" alt="all" class="result_img">
							<div class="result_txt">{{item.TieWin}}</div>
						</div>
						<div v-if="item.gameType == 'bjl'" class="dl-result-type">
							<img src="@/assets/lobby/bPair.png" alt="all" class="result_img">
							<div class="result_txt">{{item.BankerPair}}</div>
						</div>
						<div v-if="item.gameType == 'bjl'" class="dl-result-type">
							<img src="@/assets/lobby/pPair.png" alt="all" class="result_img">
							<div class="result_txt">{{item.PlayerPair}}</div>
						</div>
						<div class='dl_vi_ti_button'>{{ item.id ? t("table.play") : t("table.load") }}</div>
					</div> -->

					<div class="dl-type-display">
					<template v-for="box in buildTypeDisplay(item)" :key="box.ident">
						<div class="dl-result-type" :class="`_ident-${box.ident}`">
						<img :src="box.icon" :alt="box.ident" :class="box.ident === 'total' ? 'all_img' : 'result_img'" />
						<div class="result_txt">{{ box.value }}</div>
						</div>
					</template>

					<div class='dl_vi_ti_button'></div>
					</div>

				</div>
			</template>
		</scroll-view>
	</div>
</template>
<script setup name='DeskList'>
import { ref, computed, onMounted } from 'vue';
// import ImgBannerBjl from '@front/assets/imgs/lobby-banner-bjl.jpg';
// import ImgBannerLh from '@front/assets/imgs/lobby-banner-lh.jpg';
import PanelFirst from './PanelFirst.vue';
import PanelSecond from './PanelSecond.vue';
import PanelThird from './PanelThird.vue';
import PanelFourth from './PanelFourth.vue';
import PanelFifth from './PanelFifth.vue';
import PanelSixth from './PanelSixth.vue';
import { debounce } from 'lodash';
import { MATCH_GAME_STATUS_NAME } from '@front/constants';
import { useDeskStore } from '@front/stores/modules/desk.store';
import routers from '@front/routers/index';
import { EventEmitter, } from '@front/eventBus/index';
import { VOICE_SEND, } from '@front/eventBus/actions';
import { isArray, } from '@front/utils/is';
// import { listenStop } from '@front/utils/wsManager';
import { useUserStore } from '@front/stores/modules/user.store';
import girlImage from '@front/assets/lobby/girl.png'
import { useI18n } from "vue-i18n";
import totalImg from '@front/assets/lobby/all.png';
import bankerImg from '@front/assets/lobby/banker.png';
import playerImg from '@front/assets/lobby/player.png';
import dragonImg from '@front/assets/lobby/dragon.png';
import tigerImg from '@front/assets/lobby/tiger.png';
import tieImg from '@front/assets/lobby/tie.png';
import bPairImg from '@front/assets/lobby/bPair.png';
import pPairImg from '@front/assets/lobby/pPair.png';

const { t } = useI18n();
const deskStore = useDeskStore();
const userStore = useUserStore();
const _vScrollWrapper = ref(false),
	_list = computed(() => deskStore.list.map(f => ({
		id: f.deskId.toString(),
		name: f.deskShortName || '--',
		time: NaN,
		banner: f.deskTypeName === '百家乐' ? girlImage : (f.deskTypeName === '龙虎' ? girlImage : ''),
		round: f.deskRoundNum,
		slot: f.deskSlotNum < 0 ? 0 : f.deskSlotNum,
		dewList: f.dewList,
		timming: f.timming,
		gameStatus: f.gameStatus,
		limitAreaStr: `${_transNumToK(f.limitAreaStr.min)}-${_transNumToK(f.limitAreaStr.max)}`,
		isPrivateIng: f.isPrivateIng,
		canJoinPrivate: f.canJoinPrivate,
		tableName: f.deskTypeName || '--',
		BankerWin: f.deskZhuangNum || 0,
		PlayerWin: f.deskXianNum || 0,
		TieWin: f.deskHeNum || 0,
		BankerPair: f.deskZhuangDuiNum || 0,
		PlayerPair: f.deskXianDuiNum || 0,
		DragonWin: f.deskLongNum || 0,
		TigerWin: f.deskHuNum || 0,
		TotalNum: f.deskTotalNum || 0,
		gameType: f.deskTypeName === '百家乐' ? 'bjl' : (f.deskTypeName === '龙虎' ? 'lh' : 'unknown'),

	}))),
	_dewWidth = ref(0)
	;
	console.log('deskStore.list', deskStore);


	// JS only
const ICONS = {
  total: totalImg,
  banker: bankerImg,
  player: playerImg,
  dragon: dragonImg,
  tiger: tigerImg,
  tie: tieImg,
  bPair: bPairImg,
  pPair: pPairImg,
};

// ident, iconKey, fieldName on the item
const DISPLAY_SCHEMA = {
  bjl: [
    ['total', 'total', 'TotalNum'],
    ['banker', 'banker', 'BankerWin'],
    ['player', 'player', 'PlayerWin'],
    ['tie', 'tie', 'TieWin'],
    ['bPair', 'bPair', 'BankerPair'],
    ['pPair', 'pPair', 'PlayerPair'],
  ],
  lh: [
    ['total', 'total', 'TotalNum'],
    ['dragon', 'dragon', 'DragonWin'],
    ['tiger', 'tiger', 'TigerWin'],
    ['tie', 'tie', 'TieWin'],
  ],
  unknown: [
    ['total', 'total', 'TotalNum'],
    ['tie', 'tie', 'TieWin'],
  ],
};

function asDisplayValue(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : '--';
}

function buildTypeDisplay(it) {
  const schema = DISPLAY_SCHEMA[it.gameType] || DISPLAY_SCHEMA.unknown;
  return schema.map(([ident, iconKey, field]) => ({
    ident,
    icon: ICONS[iconKey],
    value: asDisplayValue(it[field]),
  }));
}

const ImgBannerBjl = computed(() =>
	userStore.getImageBase + 'lobby-banner-bjl.jpg'
)
const ImgBannerLh = computed(() =>
	userStore.getImageBase + 'lobby-banner-lh.jpg'
)

function _bindAction(event) {
	// tempcode
	// if (new Date().getTime() > 1) return listenStop(false, false);

	const { id, isPrivateIng, canJoinPrivate } = event.currentTarget.dataset;
	if (!id) return;
	if (isPrivateIng === 'true' && canJoinPrivate === 'false') return window.$msg('该桌台为包台', 1500);

	EventEmitter.emit(VOICE_SEND, 'a_room');

	deskStore.switchUseDesk(id);
	// routers.push(`/views/GameTable/Index?deskId=${deskStore.useDesk}`);
	routers.push(`/views/GameTable/TableNormal/Index?deskId=${deskStore.useDesk}`);

	setTimeout(() => {
		deskStore.cleanList();
	}, 250);
}

function _transNumToK(value) {
	if (value >= 1000) {
		return (value / 1000) + 'K';
	}
	return value.toString();
}

// function handleScroll() {
//   const _scrollWrapper = _vScrollWrapper.value;
//   const { scrollTop, clientHeight, scrollHeight } = _scrollWrapper;

//   (scrollTop + clientHeight >= scrollHeight - 10) && _loadNextPage();
// }
function _handleScrollNext() {
	_loadNextPage();
}

const _loadNextPage = debounce(async function () {
	if (deskStore.loading) return;

	window.$loading(true, '加载中');
	await deskStore.updateList();
	window.$loading(false);
}, 200)

onMounted(() => {
	uni.createSelectorQuery().select(`#dewContent`)
		.fields({ node: true, size: true })
		.exec(resBox => {

			if (!isArray(resBox)) return;
			_dewWidth.value = (parseInt(resBox[0].width / 8) - 1) * 8;
		})
})

</script>
<style lang='less' src='@front/zstyles/views/Lobby/_view/DeskList.less' scoped></style>
