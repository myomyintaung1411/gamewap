<template>
<view class='pi_model'>

  <view :class='["pi_bg01", `_type_${gameStore.gameType}`]'>
    <view :class='["pi_animation _xian", `_type_${gameStore.gameType}`]'>
      <view class='pi_an_mask'></view>
      <template v-if='gameStore.winBetList.includes("bet-xian") || gameStore.winBetList.includes("bet-long")'>
        <view class='pi_an_trans'></view>
      </template>
    </view>
  </view>
  <view :class='["pi_bg02", `_type_${gameStore.gameType}`]'>
    <view :class='["pi_animation _zhuang", `_type_${gameStore.gameType}`]'>
      <view class='pi_an_mask'></view>
      <template v-if='gameStore.winBetList.includes("bet-zhuang") || gameStore.winBetList.includes("bet-hu")'>
        <view class='pi_an_trans'></view>
      </template>
    </view>
  </view>

  <view class='pi_title'>
    <view :class='["pi_ti_animation _xian", `_type_${gameStore.gameType}`]'>
      <!-- <template v-if='gameStore.winBetList.includes("bet-xian") || gameStore.winBetList.includes("bet-long")'>
        <view class='pi_ti_an_trans'></view>
      </template> -->
      <view class='pi_ti_view'>
        <view class='pi_ti_vi_info'>
          <view class='pi_ti_vi_in_zh'>{{ ({ bjl:t("poker.player"), lh:t("poker.dragon") })[gameStore.gameType] || '--' }}</view>
        </view>
        <view class='pi_ti_vi_num'>{{ ({ bjl:gameStore.pokerInfo.bjlXianTotal, lh:gameStore.pokerInfo.lhLongTotal })[gameStore.gameType] || 0 }}</view>
      </view>
    </view>

    <view :class='["pi_ti_animation _zhuang", `_type_${gameStore.gameType}`]'>
      <!-- <template v-if='gameStore.winBetList.includes("bet-zhuang") || gameStore.winBetList.includes("bet-hu")'>
        <view class='pi_ti_an_trans'></view>
      </template> -->
      <view class='pi_ti_view'>
        <view class='pi_ti_vi_num'>{{ ({ bjl:gameStore.pokerInfo.bjlZhuangTotal, lh:gameStore.pokerInfo.lhHuTotal })[gameStore.gameType] || 0 }}</view>
        <view class='pi_ti_vi_info'>
          <view class='pi_ti_vi_in_zh'>{{ ({ bjl:t("poker.banker"), lh:t("poker.tiger") })[gameStore.gameType] || '--' }}</view>
        </view>
      </view>
    </view>
  </view>

  <template v-if='gameStore.gameType === "bjl"'>
    <!-- 第一排卡片 -->
    <view class='pi_first'>
      <view class='pi_fi_view'>
        <template v-if='gameStore.pokerInfo.bjlXian03'>
          <view class='pi_fi_vi_card _bupai'>
            <image class='img-normal' :src='_getImageUrl(gameStore.pokerInfo.bjlXian03?.cardName)' />
          </view>
        </template>

        <view class='pi_fi_vi_card'>
          <image class='img-normal' :src='_getImageUrl(gameStore.pokerInfo.bjlXian01?.cardName)' />
        </view>
        <view class='pi_fi_vi_card'>
          <image class='img-normal' :src='_getImageUrl(gameStore.pokerInfo.bjlXian02?.cardName)' />
        </view>
      </view>

      <view class='pi_fi_view'>
        <view class='pi_fi_vi_card'>
          <image class='img-normal' :src='_getImageUrl(gameStore.pokerInfo.bjlZhuang01?.cardName)' />
        </view>
        <view class='pi_fi_vi_card'>
          <image class='img-normal' :src='_getImageUrl(gameStore.pokerInfo.bjlZhuang02?.cardName)' />
        </view>

        <template v-if='gameStore.pokerInfo.bjlZhuang03'>
          <view class='pi_fi_vi_card _bupai'>
            <image class='img-normal' :src='_getImageUrl(gameStore.pokerInfo.bjlZhuang03?.cardName)' />
          </view>
        </template>
      </view>
    </view>
  </template>
  <template v-if='gameStore.gameType === "lh"'>
    <!-- 第一排卡片 -->
    <view class='pi_first'>
      <view class='pi_fi_view'>
        <view class='pi_fi_vi_card'>
          <image class='img-normal' :src='_getImageUrl(gameStore.pokerInfo.lhLong01?.cardName)' />
        </view>
      </view>

      <view class='pi_fi_view'>
        <view class='pi_fi_vi_card'>
          <image class='img-normal' :src='_getImageUrl(gameStore.pokerInfo.lhHu01?.cardName)' />
        </view>
      </view>
    </view>
  </template>

</view>
</template>
<script setup name='PokerInfo'>
import { useGameStore } from '@front/stores/modules/game.store';
import { useUserStore } from '@front/stores/modules/user.store';
	import { useI18n } from "vue-i18n";
	const { t } = useI18n();

// const modules = import.meta.glob('@front/assets/imgs/pokers/*.png', { eager:true });

const gameStore = useGameStore();
const userStore = useUserStore();

const _TRANS_POKER_NAME = {
  '方片': 'fangpian',
  '梅花': 'meihua',
  '黑桃': 'heitao',
  '红桃':'hongtao'
}

// function _getImageUrl(name) {
//   if (!name) return modules['/src/assets/imgs/pokers/poker-bg.png'].default;
//   const _nameZh = name.substring(0, 2),
//         _name = _nameZh in _TRANS_POKER_NAME ? (_TRANS_POKER_NAME[_nameZh] + name.substring(2)) : name
//   ;
//   return (
//     _name
//       ? modules[`/src/assets/imgs/pokers/poker-${_name}.png`].default
//       : modules['/src/assets/imgs/pokers/poker-bg.png'].default
//   );
// }

function _getImageUrl(name) {
  const base = userStore.getImageBase; // e.g. "https://your-bucket.oss-cn-shanghai.aliyuncs.com/"

  if (!name) {
    return `${base}pokers/poker-bg.png`;
  }

  const _nameZh = name.substring(0, 2);
  const _name =
    _nameZh in _TRANS_POKER_NAME
      ? _TRANS_POKER_NAME[_nameZh] + name.substring(2)
      : name;
  return (
    _name
      ? `${base}pokers/poker-${_name}.png`
      : `${base}pokers/poker-bg.png`
  );
  // return `${base}pokers/poker-${_name}.png`;
}

</script>
<style lang='less' src='@front/zstyles/views/GameTable/_view/PokerInfo.less' scoped></style>
