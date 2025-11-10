<template>
<view :class='["pi_model", _show ? "_show" : "_hidden"]'>

  <div :class='["pi_bg _left", `_type_${gameStore.gameType}`, (gameStore.winBetList.includes("bet-xian") || gameStore.winBetList.includes("bet-long")) && "_bright"]'></div>
  <div :class='["pi_bg _right", `_type_${gameStore.gameType}`, (gameStore.winBetList.includes("bet-zhuang") || gameStore.winBetList.includes("bet-hu")) && "_bright"]'></div>

  <template v-if='_show'>

    <div class='pi_title'>
      <div :class='["pi_ti_view _left", `_type_${gameStore.gameType}`]'>
        <div class='pi_ti_vi_name'>{{ ({ bjl:t("bjl.xian"), lh:t("lh.long")})[gameStore.gameType] || '--' }}</div>
        <div class='pi_ti_vi_value'>{{ ({ bjl:gameStore.pokerInfo.bjlXianTotal, lh:gameStore.pokerInfo.lhLongTotal })[gameStore.gameType] || 0 }}</div>
      </div>

      <div :class='["pi_ti_view _right", `_type_${gameStore.gameType}`]'>
        <div class='pi_ti_vi_value'>{{ ({ bjl:gameStore.pokerInfo.bjlZhuangTotal, lh:gameStore.pokerInfo.lhHuTotal })[gameStore.gameType] || 0 }}</div>
        <div class='pi_ti_vi_name'>{{ ({ bjl:t("bjl.zhuang"), lh:t("lh.hu")})[gameStore.gameType] || '--' }}</div>
      </div>
    </div>

    <template v-if='gameStore.gameType === "bjl"'>

      <!-- 第一排 -->
      <div class='pi_first'>
        <div class='pi_fi_view _left'>
          <!-- 补牌 -->
          <template v-if='gameStore.pokerInfo.bjlXian03'>
            <div class='pi_fi_vi_poker _isBuPai'>
              <image class='img-normal' :src='_getImageUrl(gameStore.pokerInfo.bjlXian03.cardName)' />
            </div>
          </template>

          <div class='pi_fi_vi_poker'>
            <image class='img-normal' :src='_getImageUrl(gameStore.pokerInfo.bjlXian01?.cardName)' />
          </div>
          <div class='pi_fi_vi_poker'>
            <image class='img-normal' :src='_getImageUrl(gameStore.pokerInfo.bjlXian02?.cardName)' />
          </div>
        </div>

        <div class='pi_fi_view _right'>
          <div class='pi_fi_vi_poker'>
            <image class='img-normal' :src='_getImageUrl(gameStore.pokerInfo.bjlZhuang01?.cardName)' />
          </div>
          <div class='pi_fi_vi_poker'>
            <image class='img-normal' :src='_getImageUrl(gameStore.pokerInfo.bjlZhuang02?.cardName)' />
          </div>

          <!-- 补牌 -->
          <template v-if='gameStore.pokerInfo.bjlZhuang03'>
            <div class='pi_fi_vi_poker _isBuPai'>
              <image class='img-normal' :src='_getImageUrl(gameStore.pokerInfo.bjlZhuang03.cardName)' />
            </div>
          </template>
        </div>
      </div>

    </template>
    <template v-if='gameStore.gameType === "lh"'>

      <!-- 第一排 -->
      <div class='pi_first'>
        <div class='pi_fi_view _left'>
          <div class='pi_fi_vi_poker'>
            <image class='img-normal' :src='_getImageUrl(gameStore.pokerInfo.lhLong01?.cardName)' />
          </div>
        </div>

        <div class='pi_fi_view _right'>
          <div class='pi_fi_vi_poker'>
            <image class='img-normal' :src='_getImageUrl(gameStore.pokerInfo.lhHu01?.cardName)' />
          </div>
        </div>
      </div>

    </template>

  </template>

</view>
</template>
<script setup name='PokerInfo'>
import { computed, } from 'vue';
import { useGameStore } from '@front/stores/modules/game.store';
import { useUserStore } from '@front/stores/modules/user.store';

// const modules = import.meta.glob('@front/assets/imgs/pokers/*.png', { eager:true });

const gameStore = useGameStore();
const userStore = useUserStore();
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const _TRANS_POKER_NAME = {
  '方片': 'fangpian',
  '梅花': 'meihua',
  '黑桃': 'heitao',
  '红桃':'hongtao'
}

const _show = computed(()=> (
  !gameStore.isLive &&
  ['comeStart', 'opening', 'settlement'].includes(gameStore.gameStatus)
))

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
}

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableNormal/PokerInfo.less' scoped></style>
