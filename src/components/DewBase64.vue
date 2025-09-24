<template>
  <!-- Single img tag, reactivity handled by Vue -->
  <img
    class="img-normal"
    :src="getImageUrl(name)"
    v-lazy="getImageUrl(name)" 
  />
</template>

<script setup name="DewBase64">
import { computed } from "vue";
import { getDewName } from "@front/utils/dew";
import { useI18n } from "vue-i18n";

// Props
const props = defineProps({
  name: String,
});

// i18n locale
const { locale } = useI18n();
locale.value = uni.getStorageSync("l") || "zh";

// OSS base URLs
const ossBaseZh = "https://bx1buk.oss-accelerate.aliyuncs.com/pto1/roadmap/";
const ossBaseEn = "https://bx1buk.oss-accelerate.aliyuncs.com/pto1/roadmapen/";

// Compute full image URL based on current lang
const getImageUrl = (name) =>
  `${locale.value === "zh" ? ossBaseZh : ossBaseEn}${getDewName(props.name, true)}`;
</script>

<style lang="less" scoped>
// .img-normal {
//   width: 100%;
//   height: auto;
//   display: block;
// }
</style>
