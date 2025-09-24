<template>
<view class='pca_box'>

  <view class='pca_model'>

    <view class='pca_button'>
      <TheButton
        class='pca_bu_view _theme01'
        :disabled='(
          gameStore.gameStatus !== "timing" ||
          operaStore.waitBetList.length < 1
        )'
        :loading='operaStore.loading.submitWaitBet'
        :taps='_bindAffirm'
      >
        <image class='img-normal' :src=' userStore.getImageBase + "btns/btn-bet-affirm.svg"'  />
      </TheButton>

      <TheButton
        class='pca_bu_view _theme02'
        :disabled='(
          (operaStore.waitBetList.length < 1 && operaStore.affirmBetList.length < 1) ||
          (operaStore.waitBetList.length < 1 && gameStore.gameStatus !== "timing")
        )'
        :loading='operaStore.loading.cancelIsAffirmBet'
        :taps='_bindCancel'
      >
        <image class='img-normal' :src=' userStore.getImageBase + "btns/btn-bet-cancel.svg"'  />
      </TheButton>
    </view>

    <view class='pca_list'>
      <template v-for='item in operaStore.chipsBjlList' key='ident'>
        <view
          :class='[
            "pca_li_view",
            item.ident === operaStore.chipsBjlEd && "_bright",
            gameStore.gameStatus !== "timing" && "_disable"
          ]'
          @tap='(
            gameStore.gameStatus === "timing"
              ? ()=> operaStore.setChipsBjlEd(item.ident)
              : ()=> {}
          )'
        >
          <SvgIcon class='pca_li_vi_icon' :name='item.icon' />
          <template v-if='item.ident === operaStore.chipsBjlEd && "_bright"'>
            <view class='pca_li_vi_bright'>
              <SvgIcon class='img-normal' :name='item.icon' />
              <view class='pca_li_vi_bling _bling01'></view>
              <view class='pca_li_vi_bling _bling02'></view>
              <view class='pca_li_vi_bling _bling03'></view>
              <view class='pca_li_vi_bling _bling04'></view>
            </view>
          </template>
        </view>
      </template>
    </view>

  </view>

  <template v-if='["comeStart", "opening", "settlement"].includes(gameStore.gameStatus)'>
  <!-- <template v-if='true'> -->
    <PokerInfo />
  </template>

  <view class='pca_desk' @tap='_bindOpenDeskList'>
    <SvgIcon class='pca_de_icon' name='switch-desk' size='14' />
    <view class='pca_de_text'>切</view>
    <view class='pca_de_text'>换</view>
    <view class='pca_de_text'>桌</view>
    <view class='pca_de_text'>台</view>
  </view>

</view>
</template>
<script setup name='PanelChipsArea'>
import TheButton from '@front/components/TheButton/Index.vue';
import PokerInfo from './PokerInfo.vue';
import { useOperaStore } from '@front/stores/modules/opera.store';
import { useGameStore } from '@front/stores/modules/game.store';
import { EventEmitter, } from '@front/eventBus/index';
import { OPEN_SWITCH_DESK, } from '@front/eventBus/actions';
import { useUserStore } from '@front/stores/modules/user.store';

const operaStore = useOperaStore(),
      gameStore = useGameStore(),
       userStore = useUserStore()
;

function _bindAffirm() {
  operaStore.submitWaitBet();
}

function _bindCancel() {
  operaStore.cancelWaitBet();
  operaStore.cancelIsAffirmBet();
}

function _bindOpenDeskList() {
  EventEmitter.emit(OPEN_SWITCH_DESK);
}

</script>
<style lang='less' src='@front/zstyles/views/GameTable/_view/PanelChipsArea.less' scoped></style>
