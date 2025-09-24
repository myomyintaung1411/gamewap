<template>
<view
  :class='["db_background", _VIEW_ID]'
  :style='{
    "grid-template-columns": `repeat(auto-fill, ${boxItemWidth}px)`,
    "grid-template-rows": `repeat(auto-fill, ${boxItemWidth}px)`,
    "width":`${(_listNum / _cellNumWithColumn) * (boxItemWidth * (boxItemWidth / dewItemWidth))}px`,
    "background-size": `${boxItemWidth}px ${boxItemWidth}px`,
  }'
>

  <!-- <template v-for='(item,index) in _listNum'>
    <view
      class='db_view'
      :style='{ width:`${boxItemWidth}px`, height:`${boxItemWidth}px` }'
    >
    </view>
  </template> -->

</view>
</template>
<script setup name='DewBgLine'>
import { ref, computed, onMounted } from 'vue';
import { generateID } from '@front/utils/tools';

const _VIEW_ID = generateID('canvas');

const _props = defineProps({
  ident: String,
  boxItemWidth: Number,
  dewItemWidth: Number,
  backColNum: Number,
  listLength: Number,
})

const _minColumn = ref(0);

const _celNumRate = computed(()=> {
  return (
    _props.boxItemWidth / _props.dewItemWidth
  )
})

const _cellNumWithColumn = ref(_props.ident === 'PanelSixth' ? 3 : 6);

const _listNum = computed(()=> {
  const _listLen = (_props.listLength / (_props.boxItemWidth / _props.dewItemWidth));

  const _valueFillNum = parseInt(
          (
            _addZero(_listLen) + 
            // (_listLen % _cellNumWithColumn.value === 0 ? 0 : _addPh())
            _addPh()
          )
          / _celNumRate.value
        ),
        _minFillNum = parseInt(
          (_minColumn.value * _cellNumWithColumn.value) / _celNumRate.value
        )
  ;

  return (
    _valueFillNum < _minFillNum
      ? _minFillNum
      : _valueFillNum
  )
})

// 补足末列空缺单元格
function _addZero(listLen) {
  return (
    parseInt(
      listLen + (_cellNumWithColumn.value - (listLen % _cellNumWithColumn.value))
    )
  )
}

// 补充空白列
function _addPh(listLen) {
  return (
    (_cellNumWithColumn.value * _props.backColNum)
  )
}

onMounted(()=> {
  try {
    uni.createSelectorQuery().select(`.${_VIEW_ID}`)
      .fields({node: true, size: true})
      .exec(resBox=> {

        if (!resBox || !resBox[0]) return; // 兼容手机app
        _minColumn.value = parseInt(resBox[0].width / _props.boxItemWidth);
      })
  } catch {

    try {
      uni.createSelectorQuery().select(`.${_VIEW_ID}`)
        .fields({node: true, size: true})
        .exec(resBox=> {

          _minColumn.value = parseInt((resBox[0]?.width || 0) / _props.boxItemWidth);
        })
    } catch {
    }
  }

  // _props.ident === 'PanelSixth' && (_minColumn.value += 1);
})

</script>
<style lang='less' src='@front/zstyles/components/DewBgLine.less' scoped></style>
