<template>
<view>

  <template v-if='_loadEd'>
    <template v-if='typeof _props.componentUrl !== "function"'>
      <component :is='componentUrl' @perfComponentClose='_bindCloseChange' ref='_vComponent' />
    </template>
    <template v-else>
      <component :is='_loadComponent' @perfComponentClose='_bindCloseChange' ref='_vComponent' />
    </template>
  </template>

</view>
</template>
<script setup name='PerfComponent'>
import { ref, markRaw, nextTick } from 'vue';

const _emits = defineEmits(['closeChange']);

const _props = defineProps({
  componentUrl: [Function, Object],
})

defineExpose({
  showChange: ()=> {
    if (!_props.componentUrl) return;

    if (typeof _props.componentUrl !== 'function') {
      _loadEd.value = true;
      nextTick(()=> {
        _vComponent?.value?.showChange && _vComponent.value.showChange();
      })
      return;
    }
    _props.componentUrl().then(component=> {
      _loadComponent = component.default;
      _loadEd.value = true;
      nextTick(()=> {
        _vComponent?.value?.showChange && _vComponent.value.showChange();
      })
    })
  }
})

const _loadEd = ref(false),
      _vComponent = ref(null)
;
let _loadComponent = markRaw(null);

function _bindCloseChange() {
  _loadEd.value = false;
  _loadComponent = null;

  _emits('closeChange');
}

</script>
<!-- <style lang='less' src='@front/zstyles/components/PerfComponent.less' scoped></style> -->
