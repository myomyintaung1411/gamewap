<template>
<scroll-view :id='"box" + _CANVAS_ID' class='dc_model' scroll-x :scroll-left='_pointLeft'>

  <view
    class='dc_content'
    :style='{
      "grid-template-columns":`repeat(auto-fill, ${dewItemWidth}px)`,
      "grid-template-rows":`repeat(auto-fill, ${dewItemWidth}px)`,
    }'
  >

    <DewBgLine
      :id='"content" + _CANVAS_ID'
      :ident='ident'
      :boxItemWidth='boxItemWidth'
      :dewItemWidth='dewItemWidth'
      :backColNum='backColNum'
      :listLength='list.length'
    />

    <template v-for='(item,index) in list' :key='index.toString()'>
      <view
        :class='[
          "dc_view",
          (
            isAsk && 
            (
              typeof blingIndex === "number"
                ? blingIndex === index
                : index === list.length - 1
            ) && "animation-bling"
          )
        ]'
        :style='{ width:`${dewItemWidth}px`, height:`${dewItemWidth}px` }'
      >
        <template v-if='item'>
          <!-- <DewBase64 :class='index.toString()' :name='ident === "PanelSecond" ? item.img : item' /> -->
          <DewBase64 :class='index.toString()' :name='["PanelSecond", "PanelSixth"].includes(ident) ? item.img : item' />

          <!-- <template v-if='ident === "PanelSecond" && !isNaN(item.heCount)'> -->
          <template v-if='["PanelSecond", "PanelSixth"].includes(ident) && !isNaN(item.heCount)'>
            <view class='dc_vi_num'>{{item.heCount}}</view>
          </template>
        </template>
      </view>
    </template>
  </view>

</scroll-view>
</template>
<script setup name='DewCanvas'>
import { ref, watch, nextTick } from 'vue';
import DewBgLine from '@front/components/DewBgLine.vue';
import DewBase64 from '@front/components/DewBase64.vue';
import { getDewName } from '@front/utils/dew';
import { generateID } from '@front/utils/tools';
import { isArray, } from '@front/utils/is';

const _CANVAS_ID = generateID('canvas'),
      _columnNum = ref(0),
      _pointInto = ref(''),
      _pointLeft = ref(0)
;

const _props = defineProps({
  ident: String, // PanelXX
  boxItemWidth: Number,
  dewItemWidth: Number,
  backColNum: Number,
  pointColumn: Number,
  isAsk: Boolean,
  blingIndex: Number,
  list: Array,
})

watch(
  ()=> _props.list,
  (newVal, oldVal)=> {
    drawChange();
  },
  { immediate:true },
)

async function drawChange() {
  nextTick(()=> {
    _getBoxWidth().then((resBox)=> {
      uni.createSelectorQuery().select(`#content${_CANVAS_ID}`)
        .fields({node: true, size: true})
        .exec(resCanvas=> {

          if (resCanvas[0]) {
            const _w = resCanvas[0].width - resBox;
            _pointLeft.value = _pointLeft - 1;
            nextTick(()=> {
              _pointLeft.value = _w - (_w % _props.boxItemWidth);
            })
          }
        })
    })
  });
}

function _getBoxWidth() {
  return new Promise(resolve=> {
    try {
      uni.createSelectorQuery().select(`#box${_CANVAS_ID}`)
        .fields({node: true, size: true})
        .exec(resBox=> {

          if (!resBox || !resBox[0]) return resolve(0); // 兼容手机app
          resolve(resBox[0].width);
        })
    } catch {
      nextTick(()=> {

        try {
          uni.createSelectorQuery().select(`#box${_CANVAS_ID}`)
            .fields({node: true, size: true})
            .exec(resBox=> {

              resolve(resBox[0] ? resBox[0].width : 0);
            })
        } catch {
        }
      })
    }
  })
}

</script>
<style lang='less' src='@front/zstyles/components/DewCanvas.less' scoped></style>
