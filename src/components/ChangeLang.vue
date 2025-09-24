<template>
  <view v-if="_show" class="popup-container">
    <view class="popup-show-left" v-if="_show" @click="_bindClose"></view>
     <view class="popup-show-right" v-if='_show'>
      <!-- <view class='tip_mask' @tap='_bindClose' @touchmove.stop.prevent='_moveHandle'></view> -->
    <view @click.stop class="popup-content"
     
    >
      <view class='sp_ph'></view>
        <!-- <view class="tryitplay-head">
          <view class="tryitplay-he_name">{{ t('login.title') }}</view>
           <SvgIcon class='tip_close' name='popup-close' @tap='_bindClose' />
        </view>

      <view class="lang_form">
        <view
          v-for="item in lang_ref"
          :key="item.value"
          class="lang_option"
          :class="{ active: radio1 === item.value }"
         @click="selectLang(item)"
        >
          <image :src="item.image" class="lang_img" />
          <span class="lang_text">{{ t(item.text) }}</span>
        </view>
      </view> -->

      <view class="tryitplay-head">
          <view class="tryitplay-he_name">{{ t('login.title') }}</view>
           <SvgIcon class='tip_close' name='popup-close' @tap='_bindClose' />
        </view>
         <view class="lang_form">
        <view
          v-for="item in lang_ref"
          :key="item.value"
          class="lang_option"
          :class="{ active: radio1 === item.value }"
         @click="selectLang(item)"
        >
          <image :src="item.image" class="lang_img" />
          <span class="lang_text">{{ t(item.text) }}</span>
        </view>
      </view> 
    </view>
    </view>
  </view>
</template>

<script setup name="ChangeLang">
import { ref } from 'vue'
import enImg from '@front/assets/us.png'
import zhImg from '@front/assets/cn.png'
import { useI18n } from "vue-i18n";
import i18n from "@front/config/index";
const { t } = useI18n();
import { useUserStore } from '@front/stores/modules/user.store';

const userStore = useUserStore()

const _emits = defineEmits(['perfComponentClose'])
const _show = ref(false)
// const radio1 = ref('en')
const radio1 = ref(localStorage.getItem("l") || "zh");

const lang_ref = [
    { value: 'zh', image: zhImg, text: 'login.cn' },
  { value: 'en', image: enImg, text: 'login.en' }
]

defineExpose({
  showChange: () => {
    _show.value = true
  }
})

function _moveHandle() {}

const selectLang = (item) => {
 console.log(item,"item ******")
 radio1.value = item.value
 userStore.setLang(radio1.value)
 localStorage.setItem("l", radio1.value);
  i18n.global.locale.value = radio1.value; // update i18n instance
_bindClose()
}

function _bindClose() {
  _show.value = false
  _emits('perfComponentClose')
}
</script>

<style lang="less" scoped>
.popup-container {
  width: 100%;
  height: 100%;
  // overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
   z-index: 100;
}
.popup-show-left {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 200;
  // background-color: rgba(53, 51, 51, 0.6); /* 半透明遮罩层 */
}
.sp_ph {
  width:100%; height:var(--status-bar-height);
}

.popup-show-right {
  position: fixed;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  z-index: 210;
  background: linear-gradient(to right, #1c1a20, 60%, #60636b);
  // background-color: rgb(18, 17, 17); /* 半透明遮罩层 */
  /* background-color: rgba(0, 0, 0, 0.5);  */
  transform:translateX(100%);
  animation:_modelShow .2s forwards ease-in-out;
}
  @keyframes _modelShow
    {
      from { transform:translateX(100%); }
      to { transform:translateX(0); }
    }

    .tryitplay-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 10rpx;
  }

  .tryitplay-he_name {
    font-size: 16px;
    font-weight: bold;
  }

.tip_close {
  width:40rpx; height:40rpx;
  // position:absolute; top:20rpx; right:20rpx;
}

.lang_form {
  padding: 40rpx 15rpx;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lang_option {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  padding: 10px 14px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;
  color: #333;

  &:hover {
    border-color: var(--el-color-primary);
  }

  &.active {
    background: #ddcd94; /* selected background */
    color: #333; /* selected text */
    border-color: #ddcd94;
  }
}

.lang_img {
  width: 28px;
  height: 20px;
  object-fit: cover;
  border-radius: 4px;
}

.lang_text {
  font-size: 14px;
  font-weight: 500;
}
.tip_mask {
  /* .bg-mask(.6); */
  width:100%; height:100vh;
  position:fixed; top:0; right:0;
  z-index:200;
}

</style>
