<template>
<!-- <view> -->

  <!-- <image class='img-normal' :src='_base64Data' />  v-lazy='libDewBase64[getDewName(name)] libDewBase64[getDewName(name)]'-->
  <template v-if='lang == "zh"'>
    <!-- #ifdef APP-PLUS -->
      <img class='img-normal' :src="`${ossBaseZh}${getDewName(name, true)}`" />
    <!-- #endif -->
    <!-- #ifndef APP-PLUS -->
      <img class='img-normal'  v-lazy="`${ossBaseZh}${getDewName(name, true)}`" />
    <!-- #endif -->
  </template>
  <template v-else>
    <!-- #ifdef APP-PLUS -->
      <img class='img-normal' :src="`${ossBaseEn}${getDewName(name, true)}`" />
    <!-- #endif -->
    <!-- #ifndef APP-PLUS -->
      <img class='img-normal' v-lazy="`${ossBaseEn}${getDewName(name, true)}`" />
    <!-- #endif -->
  </template>

<!-- </view> -->
</template>
<script setup name='DewBase64'>
import { computed } from 'vue';
// import libDewBase64 from '@front/lib/DewBase64';
// import libDewBase64En from '@front/lib/DewBase64En';
import { getDewName } from '@front/utils/dew';
import { useI18n } from 'vue-i18n';

const {t,locale} = useI18n()
locale.value = uni.getStorageSync('l') || 'zh';
const lang = computed(() => locale.value);

/*const _props = */defineProps({
  name: String,
})

const ossBaseZh  = computed(()=> 'https://bx1buk.oss-accelerate.aliyuncs.com/pto1/roadmap/')
const ossBaseEn = computed(()=>  'https://bx1buk.oss-accelerate.aliyuncs.com/pto1/roadmapen/')

// const _base64Data = computed(()=> {
//   return (
//     _props.name
//       ? libDewBase64[getDewName(_props.name)]
//       : ''
//   );
// });

</script>
<style lang='less' scoped></style>
