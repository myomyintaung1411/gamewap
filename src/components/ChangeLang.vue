<template>
  <view v-if="_show" class="popup-container">
    <!-- backdrop -->
    <view class="overlay" @click="_bindClose"></view>

    <!-- centered dialog -->
    <view class="popup-card" @click.stop>
      <view class="dialog-header">
        <text class="dialog-title">{{ t('login.title') }}</text>
        <SvgIcon class="tip_close" name="popup-close" @tap="_bindClose" />
      </view>

      <view class="lang_list">
        <view
          v-for="item in lang_ref"
          :key="item.value"
          class="lang_option"
          :class="{ active: radio1 === item.value }"
          @click="selectLang(item)"
        >
          <!-- hide flags to match the first image -->
          <image :src="item.image" class="lang_img" />
          <text class="lang_text">{{ t(item.text) }}</text>
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
/* container + backdrop */
.popup-container {
  position: fixed;
  inset: 0;
  z-index: 100;
}
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,.55);
}

/* dialog */
.popup-card {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(.96);
  width: 640rpx;              /* ~320px on phone */
  max-width: 86%;
  background: #363f45;        /* dark card like screenshot */
  border-radius: 20rpx;
  box-shadow: 0 12rpx 40rpx rgba(0,0,0,.35);
  //padding: 28rpx 28rpx 36rpx;
  padding: 36rpx;
  animation: zoomIn .16s ease-out forwards;
}
@keyframes zoomIn {
  to { transform: translate(-50%, -50%) scale(1); }
}

/* header */
.dialog-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 12rpx;
}
.dialog-title {
  font-size: 30rpx;
  color: #e9eef3;
  font-weight: 600;
  letter-spacing: .5rpx;
}
.tip_close {
  position: absolute;
  right: 0;
  top: -4rpx;
  width: 40rpx;
  height: 40rpx;
  opacity: .9;
}

/* list */
.lang_list {
  margin-top: 28rpx;
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

/* pill buttons */
.lang_option {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  width: 500rpx;
  margin: 0 auto;
  height: 68rpx;
  border-radius: 12rpx;
  background: #ffffff;
  border: 2rpx solid #e6e8eb;
  transition: transform .12s ease, box-shadow .12s ease, background .12s ease;
}
.lang_option:active { transform: scale(.99); }

/* active = blue gradient pill */
.lang_option.active {
  background: linear-gradient(180deg, #0a94b5 0%, #0b81b9 100%);
  border-color: transparent;
  box-shadow: inset 0 -6rpx 12rpx rgba(0,0,0,.12);
}
.lang_option .lang_text {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}
.lang_option.active .lang_text {
  color: #fff;
}

/* hide flag images to match first image; keep in DOM for future use */
.lang_img {  width: 38rpx; height: 38rpx; }

/* (legacy classes neutralized so they don't affect layout) */
.popup-show-left,
.popup-show-right,
.sp_ph,
.tryitplay-head,
.tryitplay-he_name { display: none; }
</style>
