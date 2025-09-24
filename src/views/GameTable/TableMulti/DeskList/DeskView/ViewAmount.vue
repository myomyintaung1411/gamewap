<template>
<view :id='_VIEW_ID' :class='["viewamount-model", hasWaitAmount && "_hasWaitAmount"]'>

  <template v-if='amount'>
    <div class='viewamount-_view div02' :style='{ top:`${_posTop}px`, left:`${_posLeft}px`, }'>
      <div class='viewamount-_vi_title'>¥{{amount}}</div>
    </div>
  </template>

</view>
</template>
<script setup name='ViewAmount'>
import { ref, watch, nextTick } from 'vue';
import { generateID } from '@front/utils/tools';

const _props = defineProps({
  hasWaitAmount: Boolean,
  amount: [String, Number],
})

const _VIEW_ID = generateID('view-amount');

const _posTop = ref(0),
      _posLeft = ref(0)
;

watch(
  ()=> _props.amount,
  (value)=> {
    if (!value) return;
    if (_posTop.value || _posLeft.value) return;

    nextTick(()=> {
      const [ _newTop, _newLeft ] = _addRandomDiv02();
      _posTop.value = _newTop;
      _posLeft.value = _newLeft;
    })
  },
  { immediate:true }
)

function _addRandomDiv02() {
  const div01 = document.getElementById(_VIEW_ID);
  const div02s = document.querySelectorAll('.div02');
  
  // 获取 div01 的宽高
  const div01Width = div01.offsetWidth;
  const div01Height = div01.offsetHeight;

  // 创建一个新的 div02 元素
  let newDiv = document.createElement('div');
  newDiv.classList.add('div02');

  // 随机生成 div02 的宽度和高度
  // const newWidth = Math.floor(Math.random() * 150) + 50;  // 随机宽度，50到200px
  // const newHeight = Math.floor(Math.random() * 150) + 50; // 随机高度，50到200px
  const newWidth = /*40*/50;
  const newHeight = 20;

  // 给新 div02 设置随机宽高
  newDiv.style.width = `${newWidth}px`;
  newDiv.style.height = `${newHeight}px`;

  let isPositionValid = false;
  let newLeft, newTop;

  while (!isPositionValid) {
    // 随机生成 top 和 left，保证不会超出 div01 的范围
    newLeft = Math.floor(Math.random() * (div01Width - newWidth));
    newTop = Math.floor(Math.random() * (div01Height - newHeight));

    isPositionValid = true;

    // 检查是否与现有的 div02 重叠
    for (let div02 of div02s) {
      const rect = div02.getBoundingClientRect();
      const newDivRect = {
        top: newTop,
        left: newLeft,
        bottom: newTop + newHeight,
        right: newLeft + newWidth
      };
      
      // 如果新 div02 与现有的 div02 重叠
      if (!(newDivRect.right <= rect.left || 
            newDivRect.left >= rect.right || 
            newDivRect.bottom <= rect.top || 
            newDivRect.top >= rect.bottom)) {
        isPositionValid = false;  // 如果有重叠，则不合法
        break;
      }
    }

    // 如果位置有效，跳出循环
    if (isPositionValid) {
      newDiv.style.top = `${newTop}px`;
      newDiv.style.left = `${newLeft}px`;
    }
  }

  return [newTop, newLeft];
  // 把新 div02 加入到 div01 中
  // div01.appendChild(newDiv);
}

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableMulti/DeskList/DeskView/ViewAmount.less' scoped></style>
