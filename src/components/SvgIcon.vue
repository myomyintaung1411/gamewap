<template>

  <!-- <svg aria-hidden='true' class='si_model svg-icon' :width='size' :height='size'>
    <use :xlink:href='symbolId' />
  </svg> -->
  <!-- <image class='si_model svg-icon' :src='_getImgUrl(name)' :style='{ "width":`${size}px`, "height":`${size}px`, }' /> -->
  <!-- <template v-if='name.startsWith("https://") || name.startsWith("http://")'>
    <image class='si_model svg-icon' :src='name' :style='{ "width":`${size}px`, "height":`${size}px`, }' />
  </template> -->
 
    <image class='si_model svg-icon' :src='fullUrl' :style='{ "width":`${size}px`, "height":`${size}px`, }' />
 

</template>
<script setup name='SvgIcon'>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
// const modules = import.meta.glob('@front/assets/icons/*.svg', { eager:true });
import { useUserStore } from '@front/stores/modules/user.store';
const userStore = useUserStore();
const { locale } = useI18n();
	locale.value = uni.getStorageSync('l') || 'zh';
const lang = computed(() => locale.value);
const props = defineProps({
  prefix: {
    type: String,
    default: 'icon'
  },
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: '1em'
  }
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`);

// function _getImgUrl(name) {
//   const _name = `/src/assets/icons/${name}.svg`;
//   return _name in modules ? modules[_name].default : "";
// }

const fullUrl = computed(() => {
  // if name already is a full URL, return as-is
  if (props.name.startsWith('https://') || props.name.startsWith('http://')) {
    return props.name
  }

  // prepend OSS base URL
  return `${userStore.getImageBase}${lang.value}/icons/${props.name}.svg`

  // return `${userStore.getImageBase}icons/${props.name}.svg`
})

</script>
<style>
.si_model {
  fill:currentColor;
  width:fit-content; height:fit-content;
}
</style>
