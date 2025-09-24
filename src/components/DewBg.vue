<template>
<view
  class='db_background'
  :style='{
    "grid-template-columns": `repeat(auto-fill, ${itemWidth}px)`,
    "grid-template-rows": `repeat(auto-fill, ${itemWidth}px)`,
  }'
>

  <template v-for='(item,index) in _listNum' :key='"dewbg-" + index.toString()'>
    <view
      class='db_view'
      :style='{ width:`${itemWidth}px`, height:`${itemWidth}px` }'
    >
    </view>
  </template>

</view>
</template>
<script setup name='DewBg'>
import { computed } from 'vue';

const _COLUMN_NUM = 20;

const _props = defineProps({
  itemWidth: Number,
  minColumnNum: Number,
  celNum: Number,
  listLength: Number
})

const _listNum = computed(()=> {
  const _minTotalNum = (_props.minColumnNum !== undefined ? _props.minColumnNum : _COLUMN_NUM) * _props.celNum;
  console.log('_minTotalNum', _props.minColumnNum, _minTotalNum, _props.listLength);
  console.log(
    _props.listLength < _minTotalNum
      ? (
          (_props.listLength + (_minTotalNum - _props.listLength)) +
          _props.celNum
        )
      : (
          _props.listLength +
          (_props.celNum - (_props.listLength % _props.celNum)) +
          _props.celNum
        )
  );
  return (
    _props.listLength < _minTotalNum
      ? (
          (_props.listLength + (_minTotalNum - _props.listLength)) +
          _props.celNum
        )
      : (
          _props.listLength +
          (_props.celNum - (_props.listLength % _props.celNum)) +
          _props.celNum
        ) / 2
  )
})

</script>
<style lang='less' src='@front/zstyles/components/DewBg.less' scoped></style>
