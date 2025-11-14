<template>
<view class="popup-container">

  <view class="popup-show-left" v-if="_showModal" @click="_closePopup"></view>
  <view class="popup-show-right" v-if="_showModal">
    <view class="popup-content" @click.stop>

      <view class='sp_ph'></view>

      <!-- 弹窗内容 -->
      <view v-for="(item,i) in _listData" :key="i">
        <template v-if='item.show && item.attribute == "changeLanguage"'>
          <view class="popup-style" @click="_clickIcon(item)">
             <view class="left_sec">
               <img @click="_bindChangeLang"  :src="lang == 'zh' ? zhImg : enImg " alt="lang" class="popup-icon" style="  width: 48rpx;height: 48rpx;">
               <view class="popup-text">{{ item.name }}</view>
             </view>
             <img :src="arrowImg" :alt="arrowImg" class="right-icon" >
          </view>
        </template>
        <template v-else-if='item.show'>
          <view class="popup-style" @click="_clickIcon(item)">
            <view class="left_sec">
              <img :src="item.icon" :alt="item.icon" class="popup-icon" >
               <view class="popup-text">{{ item.name }}</view>
            </view>
             <img v-if="item.attribute !== 'loginout'" :src="arrowImg" :alt="arrowImg" class="right-icon" >
            <!-- <SvgIcon :name='item.icon' class="popup-icon" size='28' /> -->
          </view>
        </template>
      </view>
    </view>
    <!-- <view class="popup-bottom" @click="_closePopup"><button class="popup-bottom-close">关闭</button></view> -->
  </view>

  <PerfComponent :componentUrl='PCompWithdrawApply' @closeChange='_closePopup' ref='_vWithdrawApply' />
  <PerfComponent :componentUrl='ChangePassword' @closeChange='_closePopup' ref='_passWordModel' />
  <PerfComponent :componentUrl='PCompGameRule' @closeChange='_closePopup' ref='_vGameRule' />
  <PerfComponent :componentUrl='PCLangChange' @closeChange='_closePopup' ref='_vChangeLang' />

</view>
</template>
<script setup>
import { ref, computed} from 'vue';
import PerfComponent from '@front/components/PerfComponent.vue';
import { useUserStore } from '@front/stores/modules/user.store';
import { useDeskStore } from '@front/stores/modules/desk.store';
import { useSystemStore } from '@front/stores/modules/system.store';
import { EventEmitter, } from '@front/eventBus/index';
import { VOICE_SEND, } from '@front/eventBus/actions';
import { useI18n } from "vue-i18n";
import zhImg from '@front/assets/cn.png';
import enImg from '@front/assets/us.png';
import arrowImg from '@front/assets/sidebar/arrow.png';
import logoutImg from '@front/assets/sidebar/logout.png';
import ruleImg from '@front/assets/sidebar/rule.png';
import withdrawImg from '@front/assets/sidebar/withdraw.png';
import changePassImg from '@front/assets/sidebar/pass.png';
import serviceImg from '@front/assets/sidebar/service.png';
import settingImg from '@front/assets/sidebar/setting.png';
import multiImg from '@front/assets/sidebar/multi.png';
import recordImg from '@front/assets/sidebar/record.png';
const { t,locale } = useI18n();
	locale.value = uni.getStorageSync('l') || 'zh';
// #ifdef APP-PLUS
  import PCompWithdrawApply from '@front/components/WithdrawApply.vue';
  import ChangePassword from '@front/components/ChangePassword.vue';
  import PCompGameRule from '@front/components/GameRule.vue';
  import PCLangChange from '@front/components/ChangeLang.vue';
// #endif
// #ifndef APP-PLUS
  const PCompWithdrawApply = ()=> import('@front/components/WithdrawApply.vue');
  const ChangePassword = ()=> import('@front/components/ChangePassword.vue');
  const PCompGameRule = ()=> import('@front/components/GameRule.vue');
  const PCLangChange = ()=> import('@front/components/ChangeLang.vue');
// #endif

const _emits = defineEmits(['perfComponentClose']);
const lang = computed(() => locale.value);

const userStore = useUserStore(),
      deskStore = useDeskStore(),
      systemStore = useSystemStore()
;


const _showModal = ref(false),
      _listData = ref([
        {
          name: t("sideList.moredesk"),
          icon: multiImg,
          attribute: 'more-desk',
          show: true,
        },
        {
          name: t("sideList.bet"),
          icon: recordImg,
          attribute: 'pledgeCode',
          show: true,
        },


        {
          name:  t("sideList.passchange"),
          icon: changePassImg,
          attribute: 'changePassword',
          show: true,
        },
        //  {
        //   name:  t("sideList.record"),
        //   icon: ruleImg,
        //   attribute: 'TransactionFlow',
        //   show: true,
        // },
        {
          name:  t("sideList.withdraw"),
          icon: withdrawImg,
          attribute: 'withdraw-apply',
          show: true,
        },
        {
          name:  t("sideList.rule"),
          icon: ruleImg,
          attribute: 'game-rule',
          show: true,
        },
        {
          name:  t("sideList.service"),
          icon: serviceImg,
          attribute: 'customerService',
          show: true,
        },
        {
          name:  t("login.title"),
          icon: 'menu-navbar-lang',
          attribute: 'changeLanguage',
          show: true,
        },
        {
          name:  t("sideList.out"),
          icon: logoutImg,
          attribute: 'loginout',
          show: true,
        },
      ]),
      _vWithdrawApply = ref(null),
      _passWordModel = ref(null),
      _vChangeLang = ref(null),
      _vGameRule = ref(null)
;

const onPopupChange = (event) => {
  _showModal.value = event.detail.show;
};

function _closeModal() {
  _showModal.value = false;
}

function _closePopup() {
  _showModal.value = false;
  _emits('perfComponentClose');
}

function _clickIcon(item) {
  EventEmitter.emit(VOICE_SEND, 'a_room');

  if (item.attribute == 'more-desk') {
    deskStore.setQueryType('');
    deskStore.cleanList();

    uni.navigateTo({
      url: '/views/GameTable/TableMulti/Index'
    })

  } else if (item.attribute == 'customerService') {
    uni.navigateTo({
      url: '/views/SideContent/OnlineService'
    })

  } else if (item.attribute == 'changePassword') {
    // uni.navigateTo({
    //   url: '/views/SideContent/ChangePassword'
    // })
    _passWordModel.value.showChange();
    return _closeModal();

  } else if (item.attribute == 'pledgeCode') {
    // uni.navigateTo({
    //   url: '/views/SideContent/pledgeCode'
    // })
    uni.navigateTo({
      url: '/views/Record/Index'
    })

  } else if (item.attribute == 'TransactionFlow') {
    // uni.navigateTo({
    //   url: '/views/SideContent/TransactionFlow'
    // })
    uni.navigateTo({
      url: '/views/Record/Index'
    })

  } else if (item.attribute == 'loginout') {
    userStore.userLoginOut();

  } else if (item.attribute === 'withdraw-apply') {
    _vWithdrawApply.value.showChange();
    return _closeModal();

  } else if (item.attribute === 'game-rule') {
    _vGameRule.value.showChange();
    return _closeModal();

  }
   else if (item.attribute === 'changeLanguage') {
    _vChangeLang.value.showChange();
    return _closeModal();

  }

  _closePopup();
}

defineExpose({
  showChange: () => {
    _showModal.value = true;
    userStore.agentType !== 'cashAgent' && (_listData.value.find(f=> f.attribute === 'withdraw-apply').show = false)
    // systemStore.onlineServicesUrl
    //   ? (_listData.value.find(f=> f.attribute === 'customerService').show = true)
    //   : (_listData.value.find(f=> f.attribute === 'customerService').show = false)
  }
})

</script>
<style lang='less' src='@front/zstyles/components/SidePopup.less' scoped></style>