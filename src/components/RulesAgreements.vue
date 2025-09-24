<template>
	<view>
		<view class="modal" v-if="_showPopup">
			<!-- 弹窗内容 -->
			<view v-if="lang == 'zh'" class="modal-content">
				<view class="modal-top">用户协议与规则</view>
				<view class='ruleagreements-rules'>
					<p>
						本用户协议适用于所有使用本平台服务的用户。在使用本服务前,请仔细阅读以下条款：
					</p>
					<ol>
						<li>本網站所提供的遊戲，只限法律允許地區及符合法定年齡的個人使用。</li>
						<li>為避免於本網站投注時之爭議，請會員務必在遊戲同意前，詳細閱讀本娛樂城所定之各項規則，客戶一經『同意』進入本遊戲進行投注時，即被視為已接受所有規定。</li>
						<li>客戶有責任確保自己的帳戶及登入資料的保密性,以會員帳號及密碼進行的任何網上投注，將被視為
							"有效"。請您於首次使用前更改原始密碼。如果客戶發現或懷疑自己的資料被盜用，請告知本公司或代理商，立即做密碼變更之動作。</li>
						<li>開牌後,若您已有下注,請確認您的輸贏金額。</li>
						<li>您的 "總下注金額" 及 "贏得金額" 亦會每局顯示於右上邊,請會員詳加確認。</li>
						<li>当会员在游戏中途发生网路问题而断线,所有已被确定的投注仍然有效。会员再重新登入时，就可以查询游戏端内的 "下注纪录" 查询发牌结果，会员的额度也会随著当局的输赢增加或减少。</li>
						<li>当您在下注确定后，没有看到您所下注提示下注成功时,这代表该局您的投注不成功，可能是您下注的时间太迟或是因为网路问题而没有被系统接受。</li>
						<li>当会员进入游戏，超过十分钟没下注的时候将会被游戏弹出，请会员过两分钟重新登入。</li>
						<li>本网上游戏是在现场把牌将牌例显示在会员端萤幕上。</li>
						<li>在洗牌或将牌放入牌靴过程中,有牌不慎曝光,荷官会把牌迭起并重新洗牌,牌局将重新开始。</li>
						<li>当发牌时不小心同时在牌靴抽出两张牌,在没翻开情况下,按正常次序发牌,牌局如常继续。</li>
						<li>派错牌例（已不须补牌，荷官仍补牌）多补的那张牌将退回下局，牌局将如常进行;若该张多补的牌已亮开,由公司决定是否取消。</li>
						<li>荷官未依闲、庄发牌正确顺序将牌放错位置，由现场人员将牌依正确顺序摆放回位置后牌局将照常继续。若牌局已开配，而结果不符，由公司决定是否取消。</li>
						<li>发牌视讯仅保留三日，若有异议请于游戏当日起三日内提出，三日后恕不受理。</li>
						<li>本娱乐城之视讯为真人直播，故该局游戏若因国际线路传输问题出现争议，将以视讯看到牌局结果决定输赢。</li>
						<li>本娱乐城所提供之牌路仅供参考，若因国际线路问题或其他因素造成牌路显示有误，所有游戏结果将以视讯开牌及游戏纪录为主。</li>
						<li>本公司保留一切有争议事项的修正及最后的决策。</li>
						<li>本娛樂城保留隨時更改、修订或刪除遊戲、遊戲規則（包括機率及賠率）及協議條款的權利而無須作事先通知。</li>
						<li>本娛樂城保留隨時修订、撤銷或中止任何投注的權利而無須作事先通知，亦無須作任何解釋。</li>
						<li>本娛樂城紀錄每一項於本網站伺服器内執行的交易及投注功能。若會員認為向本娛樂城提供的資料與本網站資料庫中的資料紀錄之間出現了任何聲稱的差異，一切均以本網站資料庫的資料為准。</li>
						<li>會員在本娛樂城之遊戲廳內任何遊戲的押注紀錄均視為有效，會員需自行承擔下注後的風險。</li>
						<li>禁止使用外掛程序，一經發現，本公司將有權自行處理。</li>
						<li>本公司保留最終解釋權。</li>
					</ol>
				</view>
                <button class="button-style" @click="_showPopup = false">关闭</button>
			</view>
			<view v-else class="modal-content">
			<view class="modal-top">User Agreement & Rules</view>
			<view class="ruleagreements-rules">
				<p>
				This User Agreement applies to all users of this platform. Please read the following terms carefully before using our services:
				</p>
				<ol>
				<li>The games provided on this website are only available to individuals of legal age and in jurisdictions where online gaming is permitted.</li>
				<li>To avoid disputes, members must carefully read all rules of this platform before agreeing to play. Once a customer clicks "Agree" and enters the game, it will be deemed as acceptance of all terms.</li>
				<li>Members are responsible for keeping their account and login information confidential. Any bets placed using a member’s account and password will be considered valid. Please change your default password before your first use. If you suspect your information has been compromised, notify the company or your agent immediately and change your password.</li>
				<li>After the cards are revealed, if you have placed bets, please check your win/loss amount.</li>
				<li>Your "Total Bet Amount" and "Winnings" will be displayed at the top-right corner of the game screen for confirmation.</li>
				<li>If a network issue causes disconnection during the game, all confirmed bets remain valid. Once logged in again, you can review your "Bet History" to check results. Your balance will be updated accordingly.</li>
				<li>If no confirmation appears after placing a bet, it means your bet was unsuccessful. This may occur if you placed the bet too late or due to a network error.</li>
				<li>If you are inactive for more than 10 minutes without placing a bet, the system will log you out. Please log in again after 2 minutes.</li>
				<li>Game results are streamed live and displayed on the player’s screen.</li>
				<li>If a card is accidentally exposed during shuffling or loading into the shoe, the dealer will reshuffle and restart the game.</li>
				<li>If two cards are drawn at the same time, they will be dealt in normal order (if unopened) and the game will continue.</li>
				<li>If an extra card is dealt by mistake, the extra card will be set aside for the next round. If the card has already been revealed, the company reserves the right to cancel the round.</li>
				<li>If the dealer places cards in the wrong position (not following Player/Banker order), the cards will be rearranged correctly and the game will continue. If results are already revealed and incorrect, the company reserves the right to cancel the round.</li>
				<li>Video records of game rounds are kept for three (3) days. Any disputes must be raised within three days of the game. After this period, no claims will be accepted.</li>
				<li>All games are live-streamed with real dealers. If disputes arise due to international network issues, the video result will be considered final.</li>
				<li>The roadmaps (patterns) displayed are for reference only. In case of display errors caused by network or other issues, the official video and game records will prevail.</li>
				<li>The company reserves the right to amend or make final decisions in all disputes.</li>
				<li>The company reserves the right to change, revise, or delete games, rules (including odds and payouts), and agreement terms at any time without prior notice.</li>
				<li>The company reserves the right to revise, cancel, or suspend any bet at any time without prior notice or explanation.</li>
				<li>The company records all transactions and betting activities on its servers. In case of discrepancies between player-provided data and system records, the system database shall prevail.</li>
				<li>All bets placed within the gaming lobby are considered valid, and members assume all risks after confirming bets.</li>
				<li>The use of plug-ins or cheating programs is strictly prohibited. If detected, the company reserves the right to take action.</li>
				<li>The company reserves the final right of interpretation of these terms.</li>
				</ol>
			</view>
			<button class="button-style" @click="_showPopup = false">Close</button>
			</view>

		</view>

	</view>

</template>
<script setup name='RulesAgreements'>
	import {ref,computed} from 'vue';
	import { useI18n } from "vue-i18n";

	const { t,locale } = useI18n();
	const _showPopup = ref(false);
	locale.value = uni.getStorageSync('l') || 'zh';
	// expose a computed lang if you still need it
	const lang = computed(() => locale.value);
	defineExpose({
		showChange: () => {
			_showPopup.value = true;

		}
	})

	function _bindClose() {
		_showPopup.value = false;
	}
</script>
<style lang='less' src='@front/zstyles/components/RulesAgreements.less'></style>
