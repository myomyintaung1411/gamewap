<template>
<div>

  <template v-if='_show'>
    <div class='tm_model'>
      <div class='tm_content'>
        您的网络不稳定 正在重连中
        <span class='tm_co_animation'>{{_animationPoint}}</span>
      </div>
    </div>
  </template>

</div>
</template>
<script setup name='WsConnectStatus'>
import { ref, onMounted, } from 'vue';

let _timeAnimationPoint = '',
    _animationOrigin = '+'
;

const _show = ref(false),
      _animationPoint = ref('....')
;

defineProps({
  content: String,
})

function _bindClose() {
  _show.value = false;

  clearInterval(_timeAnimationPoint);
  _timeAnimationPoint = '';
}

function _startAnimationPoint() {
  _timeAnimationPoint = setInterval(()=> {
    _animationPoint.value.length === 4 ? (_animationOrigin = '-') :
    _animationPoint.value.length === 1 ? (_animationOrigin = '+') :
    ''

    _animationOrigin === '+' ? (_animationPoint.value = _animationPoint.value + '.') :
    _animationOrigin === '-' ? (_animationPoint.value = _animationPoint.value.split('.').slice(0, _animationPoint.value.length - 1).map(()=> '.').join('')) :
    ''
  }, 300);
}

onMounted(()=> {
  window.$showWsConnectStatus = ()=> {
    _show.value = true;
    _startAnimationPoint();
  }
  window.$closeWsConnectStatus = ()=> {
    _bindClose();
  }

  // window.$showWsConnectStatus();
})

</script>
<style lang='less' src='@front/zstyles/components/WsConnectStatus/Index.less' scoped></style>
