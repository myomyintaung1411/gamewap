<template>
<view class='ro_model'>

  <!-- <image class='ro_bg' :src='userStore.getImageBase + "bgs/bg-game-table-route-opera.png"' /> -->

  <view class='ro_list'>
    <template v-for='item in _totalList' :key='item.id'>
      <view :class='["ro_li_view", `_ident-${item.ident}`]'>
        <SvgIcon class='ro_li_vi_icon' name='' />
        <view class='ro_li_vi_name'>{{item.value()}}</view>
      </view>
    </template>
  </view>

  <view class='ro_action'>

    <view class='ro_ac_ask' data-ident='zhunag' :data-str='{"bjl":"庄赢,大", "lh":"龙赢,大"}[gameStore.gameType]' @tap='_bindAsk'>
      <view class='ro_ac_as_circle'>
        <view class='ro_ac_as_ci_view'><template v-if='gameStore.askPointZhuang[0]'><DewBase64 :name='gameStore.askPointZhuang[0]' :key='gameStore.askPointZhuang[0]' /></template></view>
        <view class='ro_ac_as_ci_view'><template v-if='gameStore.askPointZhuang[1]'><DewBase64 :name='gameStore.askPointZhuang[1]' :key='gameStore.askPointZhuang[1]' /></template></view>
        <view class='ro_ac_as_ci_view'><template v-if='gameStore.askPointZhuang[2]'><DewBase64 :name='gameStore.askPointZhuang[2]' :key='gameStore.askPointZhuang[2]' /></template></view>
      </view>
      <view class='ro_ac_as_name'>{{ {'bjl':t("table.b_ask"), 'lh':t("table.d_ask")}[gameStore.gameType] || '--' }}</view>
    </view>

    <view class='ro_ac_ask' data-ident='xian' :data-str='{"bjl":"闲赢,大", "lh":"虎赢,大"}[gameStore.gameType]' @tap='_bindAsk'>
      <view class='ro_ac_as_circle'>
        <view class='ro_ac_as_ci_view'><template v-if='gameStore.askPointXian[0]'><DewBase64 :name='gameStore.askPointXian[0]' :key='gameStore.askPointXian[0]' /></template></view>
        <view class='ro_ac_as_ci_view'><template v-if='gameStore.askPointXian[1]'><DewBase64 :name='gameStore.askPointXian[1]' :key='gameStore.askPointXian[1]' /></template></view>
        <view class='ro_ac_as_ci_view'><template v-if='gameStore.askPointXian[2]'><DewBase64 :name='gameStore.askPointXian[2]' :key='gameStore.askPointXian[2]' /></template></view>
      </view>
      <view class='ro_ac_as_name'>{{ {'bjl':t("table.p_ask"), 'lh':t("table.t_ask")}[gameStore.gameType] || '--' }}</view>
    </view>

    <view class='ro_ac_view' @tap='_bindGood'>
      <SvgIcon class='ro_ac_vi_icon' name='route-opera-good' />
      <view class='ro_ac_vi_name'>{{t("table.trend")}}</view>
    </view>

  </view>

  <PerfComponent :componentUrl='PCompGoodList' ref='_vSwitchDesk' />

</view>
</template>
<script setup name='RouteOpera'>
import { ref, computed } from 'vue';
import DewBase64 from '@front/components/DewBase64.vue';
import PerfComponent from '@front/components/PerfComponent.vue';
import { useGameStore } from '@front/stores/modules/game.store';
import { EventEmitter, } from '@front/eventBus/index';
import { VOICE_SEND, } from '@front/eventBus/actions';
import { useI18n } from "vue-i18n";
import { useUserStore } from '@front/stores/modules/user.store';
const { t } = useI18n();
// #ifdef APP-PLUS
  import PCompGoodList from '@front/components/SwitchDesk/GoodList.vue';
// #endif
// #ifndef APP-PLUS
  const PCompGoodList = ()=> import('@front/components/SwitchDesk/GoodList.vue');
// #endif

const gameStore = useGameStore();
const userStore = useUserStore();
const _askZhunagLoading = ref(false),
      _askXianLoading = ref(false),
      _totalList = computed(()=> {
        return (
          gameStore.gameType === 'bjl'
            ? [
                { ident:'total', name:'总', value:()=> isNaN(gameStore.roundInfo.totalNum) ? '--' : gameStore.roundInfo.totalNum, },
                { ident:'zhuang', name:'庄', value:()=> isNaN(gameStore.roundInfo.zhuangNum) ? '--' : gameStore.roundInfo.zhuangNum, },
                { ident:'xian', name:'闲', value:()=> isNaN(gameStore.roundInfo.xianNum) ? '--' : gameStore.roundInfo.xianNum, },
                { ident:'he', name:'和', value:()=> isNaN(gameStore.roundInfo.heNum) ? '--' : gameStore.roundInfo.heNum, },
                { ident:'zhuangdui', name:'庄对', value:()=> isNaN(gameStore.roundInfo.zhuangDuiNum) ? '--' : gameStore.roundInfo.zhuangDuiNum, },
                { ident:'xiandui', name:'闲对', value:()=> isNaN(gameStore.roundInfo.xianDuiNum) ? '--' : gameStore.roundInfo.xianDuiNum, },
              ]
            :
          gameStore.gameType === 'lh'
            ? [
                { ident:'total', name:'总', value:()=> isNaN(gameStore.roundInfo.totalNum) ? '--' : gameStore.roundInfo.totalNum, },
                { ident:'long', name:'龙', value:()=> isNaN(gameStore.roundInfo.longNum) ? '--' : gameStore.roundInfo.longNum, },
                { ident:'hu', name:'虎', value:()=> isNaN(gameStore.roundInfo.huNum) ? '--' : gameStore.roundInfo.huNum, },
                { ident:'he', name:'和', value:()=> isNaN(gameStore.roundInfo.heNum) ? '--' : gameStore.roundInfo.heNum, },
              ]
            :
          ''
        )
      }),
      _vSwitchDesk = ref(null)
;

async function _bindAsk(event) {
  EventEmitter.emit(VOICE_SEND, 'a_room');
  // if (gameStore.gameType !== 'bjl') return;
  if (_askZhunagLoading.value || _askXianLoading.value) return;

  const { ident, str } = event.currentTarget.dataset;

  ident === 'zhunag' ? (_askZhunagLoading.value = true) :
  ident === 'xian' ? (_askXianLoading.value = true) :
  ''
  await gameStore.reqAskPoint(str);

  setTimeout(()=> {
    ident === 'zhunag' ? (_askZhunagLoading.value = false) :
    ident === 'xian' ? (_askXianLoading.value = false) :
    ''
  }, 3500);
}

function _bindGood() {
  EventEmitter.emit(VOICE_SEND, 'a_room');
  _vSwitchDesk.value.showChange();
}

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableNormal/RouteOpera.less' scoped></style>
