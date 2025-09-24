<template>
<div>

  <!-- <div :class='["tm_mask", _show ? "_show" : "_hide"]'></div> -->
  <template v-if='_show'>
    <div class='tm_model'>
      <div class='tm_content'>
        <!-- {{content}} -->
        {{_content}}
      </div>
    </div>
  </template>

</div>
</template>
<script setup name='TheMsg'>
import { ref, onMounted, } from 'vue';

const _show = ref(false),
      _content = ref('')
;

defineProps({
  content: String,
})

onMounted(()=> {
  window.$msg = (content, duration = 1500)=> {
    _content.value = content;
    _show.value = true;

    setTimeout(() => {
      _show.value = false;
    }, duration || 3000);
  }
})

</script>
<style lang='less' src='@front/zstyles/components/TheMsg.less' scoped></style>
