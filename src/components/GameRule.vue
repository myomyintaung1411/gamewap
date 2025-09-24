<template>
<view>

  <template v-if='_show'>

    <view class='gr_mask' @tap='_bindClose' @touchmove.stop.prevent='_moveHandle'></view>

    <view class='gr_model' @touchmove.stop.prevent='_moveHandle'>

      <view class='gr_title'>{{t("lobby.game_rule")}}</view>

      <view v-if="lang == 'zh'" class='gr_content'>
        <template v-if='["test", "production"].includes(_mode)'>
          <!-- <iframe class='gr_co_iframe' src='/help-main/index.html' /> -->
          <iframe class='gr_co_iframe' src='https://47.238.146.253:3365/helph5/' />
        </template>
        <template v-else>
          <iframe class='gr_co_iframe' src='/hybrid/html/help-main/index.html' />
        </template>
      </view>
      <view v-else class='gr_content'>
        <template v-if='["test", "production"].includes(_mode)'>
          <!-- <iframe class='gr_co_iframe' src='/help-main/index.html' /> -->
          <iframe class='gr_co_iframe' src="https://47.238.146.253:3365/helph5/index-en.html" />
        </template>
        <template v-else>
          <iframe class='gr_co_iframe' src='/hybrid/html/help-main/index.html' />
        </template>
      </view>

    </view>

  </template>

</view>
</template>
<script setup name='GameRule'>
import { ref,computed } from 'vue';
import { EventEmitter, } from '@front/eventBus/index';
import { VOICE_SEND, } from '@front/eventBus/actions';
import { useI18n } from "vue-i18n";

	const { t,locale } = useI18n();
   locale.value = uni.getStorageSync('l') || 'zh';
	// expose a computed lang if you still need it
	const lang = computed(() => locale.value);

const _emits = defineEmits(['perfComponentClose']);

defineExpose({
  showChange:()=> {
    _show.value = true;
  }
})

const _mode = import.meta.env.MODE;

const _show = ref(false);

function _moveHandle() {}

function _bindClose() {
  EventEmitter.emit(VOICE_SEND, 'a_room');

  _show.value = false;

  _emits('perfComponentClose');
}

</script>
<style lang='less' src='@front/zstyles/components/GameRule.less' scoped></style>
