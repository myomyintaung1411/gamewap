<template>
<view
  :class='[
    "vb_model",
    (["bet-longdan", "bet-hudan", "bet-longshuang", "bet-hushuang"].includes(ident) && gameStore.disableBetLhDS) && "_disable",
    color,
  ]'
  :data-ident='ident' @click='operaStore.addBet(ident)'
>

  <template v-if='gameStore.winBetList.includes(ident)'>
    <div class='vb_animation'></div>
  </template>

  <view class='vb_name'>{{name}}</view>

  <view class='vb_rate'>{{rate}}</view>

    <view class="chip_section" >
      <view 
      v-for="(item, index) in chipList"
      :key="item.icon + '-' + index"
      :id="'chip-' + index"
      :ref="el => chipRefs[index] = el"
      :class="['chipIcon_main', chipFlyClass[index]]"
      :style="[defaultChipStyle(index), chipStyles[index]]"
      >
        <SvgIcon   v-if="item.icon !== 'chip-summary'" class="chipIcon" :name="item.icon" />
      </view>
    </view>
   <!-- {{ operaStore.betBjlList }} -->
   <!-- {{ _getTotalAmount(ident) }} -->
  <ViewAmount :hasWaitAmount='_hasWaitNum(ident)' :amount='_getTotalAmount(ident)' />

  <ViewPool
    :count='gameStore.bothBet ? (gameStore.bothBet[_shortIdent] ? gameStore.bothBet[_shortIdent].count : NaN) : NaN'
    :amount='gameStore.bothBet ? (gameStore.bothBet[_shortIdent] ? gameStore.bothBet[_shortIdent].value : NaN) : NaN'
  />

</view>
</template>

<script setup name='ViewBlock'>
import {ref,computed,watch,nextTick,reactive} from 'vue'
import ViewAmount from './ViewAmount.vue';
import ViewPool from './ViewPool.vue';
import { useOperaStore } from '@front/stores/modules/opera.store';
import { useGameStore } from '@front/stores/modules/game.store';

const _props = defineProps({
  ident: String,
  rate: String,
  name: String,
  color: String,
})


const operaStore = useOperaStore(),
      gameStore = useGameStore()
;

const _shortIdent = _props.ident.substring(4);

function _hasWaitNum(ident) {
  if (!ident) return '';
  return !isNaN(operaStore.getWaitBetAmountAll[ident]);
}

// console.log(operaStore.affirmBetList,"operaStore.betBjlList")

function _getTotalAmount(ident) {
  if (!ident) return '';
  const _isAffirmNum = isNaN(operaStore.getAffirmBetAmountAll[ident]) ? NaN : operaStore.getAffirmBetAmountAll[ident],
        _waitAffirmNum = isNaN(operaStore.getWaitBetAmountAll[ident]) ? NaN : operaStore.getWaitBetAmountAll[ident]
  ;

  return (
    (isNaN(_isAffirmNum) && isNaN(_waitAffirmNum)) ? '' :
    (!isNaN(_isAffirmNum) && !isNaN(_waitAffirmNum)) ? (_isAffirmNum + _waitAffirmNum) :
    (_isAffirmNum || _waitAffirmNum)
  )
}

const chipMap = [
  { value: '', icon: 'chip-allIn' },
  { value: 100000, icon: 'chip-100000-shallow' },
  { value: 50000, icon: 'chip-50000-shallow' },
  { value: 20000, icon: 'chip-20000-shallow' },
  { value: 10000, icon: 'chip-10000-shallow' },
  { value: 5000, icon: 'chip-5000-shallow' },
  { value: 2000, icon: 'chip-2000-shallow' },
  { value: 1000, icon: 'chip-1000-shallow' },
  { value: 500, icon: 'chip-500-shallow' },
  { value: 100, icon: 'chip-100-shallow' },
  { value: 50, icon: 'chip-50-shallow' },
  { value: 20, icon: 'chip-20-shallow' },
  { value: 10, icon: 'chip-10-shallow' }
]


console.log(operaStore.chipsBjlList,"operaStore.chipsBjlList")

function amountToChips(amount, maxChips = 5) {
  if (!amount || amount <= 0) return [];

  const chips = [];
  let remaining = amount;

  // Sort chips descending for normal large-chip usage
  const sortedChips = chipMap
    .filter(c => c.value && !isNaN(c.value))
    .sort((a, b) => b.value - a.value);

  while (remaining > 0) {
    let placed = false;

    // Try to find a chip that divides remaining evenly if possible
    for (const chip of sortedChips) {
      if (remaining >= chip.value) {
        const count = Math.floor(remaining / chip.value);

        for (let i = 0; i < count; i++) {
          if (chips.length < maxChips) {
            chips.push({ icon: chip.icon });
            remaining -= chip.value;
          } else {
            // maxChips reached, show summary for remaining
            chips.push({ icon: 'chip-summary', label: `+${remaining}` });
            return chips;
          }
        }

        placed = true;
        break; // restart from largest chip
      }
    }

    if (!placed) {
      // remaining smaller than smallest chip
      if (chips.length < maxChips) {
        chips.push({ icon: 'chip-summary', label: `+${remaining}` });
      }
      break;
    }
  }

  return chips;
}


const chipList = computed(() => {
  const total = _getTotalAmount(_props.ident);
  return amountToChips(total);
})

const chipRefs = ref([]);
const chipStyles = reactive([]);
const chipFlyClass = reactive([]);
const lastChipsCount = ref(0);

const defaultChipStyle = (index) => ({
  top: index * -5 + 'rpx',
  position: 'absolute',
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

watch(chipList, async (newVal) => {
  await nextTick();
  const newCount = newVal.length;
  if (newCount > lastChipsCount.value) {
    const toId = `#chip-${newCount - 1}`;
    const fromId = `#ref-chip-id-${operaStore.chipsBjlEd}`;

    const query = uni.createSelectorQuery();

    const fromRect = await new Promise(resolve =>
      query.select(fromId).boundingClientRect(res => resolve(res)).exec()
    );
    const toRect = await new Promise(resolve =>
      query.select(toId).boundingClientRect(res => resolve(res)).exec()
    );

    if (!fromRect || !toRect) return;

    const dx = fromRect.left - toRect.left;
    const dy = fromRect.top - toRect.top;

    chipStyles.splice(newCount - 1, 1, { '--dx': dx + 'px', '--dy': dy + 'px' });
    chipFlyClass.splice(newCount - 1, 1, '_fly');

    // Remove _fly after animation
    setTimeout(() => {
      chipFlyClass.splice(newCount - 1, 1, '');
      chipStyles.splice(newCount - 1, 1, {
        top: (newCount - 1) * -5 + 'rpx',
        transform: 'translate(0, 0)',
        opacity: 1,
        transition: 'transform 0.3s ease-out, opacity 0.3s ease-out'
      });
    }, 350); // match animation duration
  }
  lastChipsCount.value = newCount;
});


</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableNormal/BetArea/ViewBlock.less' scoped>

</style>
