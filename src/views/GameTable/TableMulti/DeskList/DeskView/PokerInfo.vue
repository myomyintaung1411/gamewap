<template>
<view :class='["pi_model", _show ? "_show" : "_hidden"]'>

  <div :class='["pi_bg _left", `_type_${_deskItem.deskTypeIdent}`, _deskItem && (_deskItem.winBetList.includes("bet-xian") || _deskItem.winBetList.includes("bet-long")) && "_bright"]'></div>
  <div :class='["pi_bg _right", `_type_${_deskItem.deskTypeIdent}`, _deskItem && (_deskItem.winBetList.includes("bet-zhuang") || _deskItem.winBetList.includes("bet-hu")) && "_bright"]'></div>

  <template v-if='_show'>

    <div class='pi_title'>
      <div :class='["pi_ti_view _left", `_type_${_deskItem.deskTypeIdent}`]'>
        <div class='pi_ti_vi_name'>{{ ({ bjl:t("bjl.xian"), lh:t("lh.long") })[_deskItem.deskTypeIdent] || '--' }}</div>
        <div class='pi_ti_vi_value'>{{ ({ bjl:_deskItem?.pokerInfo.bjlXianTotal, lh:_deskItem?.pokerInfo.lhLongTotal })[_deskItem?.deskTypeIdent] || 0 }}</div>
      </div>

      <div :class='["pi_ti_view _right", `_type_${_deskItem.deskTypeIdent}`]'>
        <div class='pi_ti_vi_value'>{{ ({ bjl:_deskItem?.pokerInfo.bjlZhuangTotal, lh:_deskItem?.pokerInfo.lhHuTotal })[_deskItem?.deskTypeIdent] || 0 }}</div>
        <div class='pi_ti_vi_name'>{{ ({ bjl:t("bjl.zhuang"), lh:t("lh.hu") })[_deskItem.deskTypeIdent] || '--' }}</div>
      </div>
    </div>

    <template v-if='_deskItem?.deskTypeIdent === "bjl"'>

      <!-- 第一排 -->
      <div class='pi_first'>
        <div class='pi_fi_view _left'>
          <!-- 补牌 -->
          <template v-if='_deskItem?.pokerInfo.bjlXian03'>
            <div class='pi_fi_vi_poker _isBuPai'>
              <image class='img-normal' :src='_getImageUrl(_deskItem?.pokerInfo.bjlXian03.cardName)' />
            </div>
          </template>

          <div class='pi_fi_vi_poker'>
            <image class='img-normal' :src='_getImageUrl(_deskItem?.pokerInfo.bjlXian01?.cardName)' />
          </div>
          <div class='pi_fi_vi_poker'>
            <image class='img-normal' :src='_getImageUrl(_deskItem?.pokerInfo.bjlXian02?.cardName)' />
          </div>
        </div>

        <div class='pi_fi_view _right'>
          <div class='pi_fi_vi_poker'>
            <image class='img-normal' :src='_getImageUrl(_deskItem?.pokerInfo.bjlZhuang01?.cardName)' />
          </div>
          <div class='pi_fi_vi_poker'>
            <image class='img-normal' :src='_getImageUrl(_deskItem?.pokerInfo.bjlZhuang02?.cardName)' />
          </div>

          <!-- 补牌 -->
          <template v-if='_deskItem?.pokerInfo.bjlZhuang03'>
            <div class='pi_fi_vi_poker _isBuPai'>
              <image class='img-normal' :src='_getImageUrl(_deskItem?.pokerInfo.bjlZhuang03.cardName)' />
            </div>
          </template>
        </div>
      </div>

    </template>
    <template v-if='_deskItem?.deskTypeIdent === "lh"'>

      <!-- 第一排 -->
      <div class='pi_first'>
        <div class='pi_fi_view _left'>
          <div class='pi_fi_vi_poker'>
            <image class='img-normal' :src='_getImageUrl(_deskItem?.pokerInfo.lhLong01?.cardName)' />
          </div>
        </div>

        <div class='pi_fi_view _right'>
          <div class='pi_fi_vi_poker'>
            <image class='img-normal' :src='_getImageUrl(_deskItem?.pokerInfo.lhHu01?.cardName)' />
          </div>
        </div>
      </div>

    </template>

  </template>

</view>
</template>
<script setup name='PokerInfo'>
import { computed, inject, } from 'vue';
import { useI18n } from "vue-i18n";
import { useUserStore } from '@front/stores/modules/user.store';

const { t } = useI18n();
// const modules = import.meta.glob('@front/assets/imgs/pokers/*.png', { eager:true });
const userStore = useUserStore();

const _TRANS_POKER_NAME = {
  '方片': 'fangpian',
  '梅花': 'meihua',
  '黑桃': 'heitao',
  '红桃':'hongtao'
}

const _deskItem = inject('deskItem'),
      _show = computed(()=> (
        !_deskItem.value
          ? false
          :
        _deskItem.value.isPrivateIng
          ? false
          :
        ['comeStart', 'opening', 'settlement'].includes(_deskItem.value.gameStatus)
          ? true
          :
        false
      ))
;

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
<style lang='less' src='@front/zstyles/views/GameTable/TableMulti/DeskList/DeskView/PokerInfo.less' scoped></style>
