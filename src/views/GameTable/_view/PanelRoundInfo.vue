<template>
<view>

  <view class='pri_model'>

    <view class='pri_list'>
      <template v-for='item in _list' key='ident'>
        <view class='pri_li_view'>
          <view class='pri_li_vi_name'>{{item.name}}</view>
          <view class='pri_li_vi_value'>{{item.value()}}</view>
        </view>
      </template>
    </view>

    <view class='pri_ask'>
      <!-- <view class='pri_as_view'>
        <view class='pri_as_vi_name'>庄问路</view>
        <view class='pri_as_vi_content'>xxx</view>
      </view>

      <view class='pri_as_view'>
        <view class='pri_as_vi_name'>闲问路</view>
        <view class='pri_as_vi_content'>xxx</view>
      </view> -->

      <view class='pri_as_view' data-ident='zhunag' :data-str='{"bjl":"庄赢,大", "lh":"龙赢,大"}[gameStore.gameType]' @tap='_bindAsk'>
        <view class='pri_as_vi_name'>{{ {'bjl':t("table.b_ask"), 'lh':t("table.d_ask")}[gameStore.gameType] || '--' }}</view>
        <view class='pri_as_vi_content'>
          <view class='pri_as_vi_co_point01'><template v-if='gameStore.askPointZhuang[0]'><DewBase64 :name='gameStore.askPointZhuang[0]' /></template></view>
          <view class='pri_as_vi_co_point02'><template v-if='gameStore.askPointZhuang[1]'><DewBase64 :name='gameStore.askPointZhuang[1]' /></template></view>
          <view class='pri_as_vi_co_point03'><template v-if='gameStore.askPointZhuang[2]'><DewBase64 :name='gameStore.askPointZhuang[2]' /></template></view>
        </view>
      </view>

      <view class='pri_as_view' data-ident='xian' :data-str='{"bjl":"闲赢,大", "lh":"虎赢,大"}[gameStore.gameType]' @tap='_bindAsk'>
        <view class='pri_as_vi_name'>{{ {'bjl':t("table.p_ask"), 'lh':t("table.t_ask")}[gameStore.gameType] || '--' }}</view>
        <view class='pri_as_vi_content'>
          <view class='pri_as_vi_co_point01'><template v-if='gameStore.askPointXian[0]'><DewBase64 :name='gameStore.askPointXian[0]' /></template></view>
          <view class='pri_as_vi_co_point02'><template v-if='gameStore.askPointXian[1]'><DewBase64 :name='gameStore.askPointXian[1]' /></template></view>
          <view class='pri_as_vi_co_point03'><template v-if='gameStore.askPointXian[2]'><DewBase64 :name='gameStore.askPointXian[2]' /></template></view>
        </view>
      </view>
    </view>

  </view>

</view>
</template>
<script setup name='PanelRoundInfo'>
import { ref, watch } from 'vue';
import DewBase64 from '@front/components/DewBase64.vue';
import { useGameStore } from '@front/stores/modules/game.store';
import { useUserStore } from '@front/stores/modules/user.store';
	import { useI18n } from "vue-i18n";
	const { t } = useI18n();

const gameStore = useGameStore(),
      userStore = useUserStore()
;

const _askZhunagLoading = ref(false),
      _askXianLoading = ref(false)
;

watch(()=> gameStore.gameType, (value)=> {
  if (!value) return _list.value.splice(0, _list.value.length, ...[
    { ident:'x03', name:'', value:()=> '', },
    { ident:'x04', name:'', value:()=> '', },
    { ident:'x05', name:'', value:()=> '', },
    { ident:'x06', name:'', value:()=> '', },
    { ident:'x07', name:'', value:()=> '', },
  ]);

  if (value === 'bjl') {
    _list.value = [
      { ident:'zhuang', name:t("bjl_short.zhuang"), value:()=> isNaN(gameStore.roundInfo.zhuangNum) ? '--' : gameStore.roundInfo.zhuangNum, },
      { ident:'xian', name:t("bjl_short.xian"), value:()=> isNaN(gameStore.roundInfo.xianNum) ? '--' : gameStore.roundInfo.xianNum, },
      { ident:'he', name:t("bjl_short.tie"), value:()=> isNaN(gameStore.roundInfo.heNum) ? '--' : gameStore.roundInfo.heNum, },
      { ident:'zhuangdui', name:t("bjl_short.zhuangdui"), value:()=> isNaN(gameStore.roundInfo.zhuangDuiNum) ? '--' : gameStore.roundInfo.zhuangDuiNum, },
      { ident:'xiandui', name:t("bjl_short.xiandui"), value:()=> isNaN(gameStore.roundInfo.xianDuiNum) ? '--' : gameStore.roundInfo.xianDuiNum, },
    ]
  } else if (value === 'lh') {
    _list.value = [
      { ident:'zhuang', name:t("lh_short.long"), value:()=> isNaN(gameStore.roundInfo.longNum) ? '--' : gameStore.roundInfo.longNum, },
      { ident:'xian', name:t("lh_short.hu"), value:()=> isNaN(gameStore.roundInfo.huNum) ? '--' : gameStore.roundInfo.huNum, },
      { ident:'he', name:t("bjl_short.tie"), value:()=> isNaN(gameStore.roundInfo.heNum) ? '--' : gameStore.roundInfo.heNum, },
    ]
  }
})

const _list = ref([
  { ident:'x03', name:'', value:()=> '', },
  { ident:'x04', name:'', value:()=> '', },
  { ident:'x05', name:'', value:()=> '', },
  { ident:'x06', name:'', value:()=> '', },
  { ident:'x07', name:'', value:()=> '', },
])

async function _bindAsk(event) {
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

</script>
<style lang='less' src='@front/zstyles/views/GameTable/_view/PanelRoundInfo.less' scoped></style>
