<template>
  <view class="ca_model">
    <!-- LEFT SETTINGS BUTTON -->
    <view class="ca_side_btn" @tap="_bindChipSetting">
      <img src="@/assets/tablenormal/setting.png" alt="chip-setting" class="ca_side_icon" >
      <!-- <SvgIcon class="ca_side_icon" name="chip-setting" size="40" /> -->
    </view>

    <!-- LEFT ARROW -->
    <view class="ca_opera" data-opera="last" @tap="_bindSwitchChip">
            <img src="@/assets/tablenormal/lefta.png" alt="game-table-chips-last" class="ca_op_icon" >
      <!-- <SvgIcon class="ca_op_icon" name="game-table-chips-last" /> -->
    </view>

    <!-- CHIP LIST -->
    <swiper
      class="ca_list"
      :display-multiple-items="5"
      acceleration
      :current="_currentSwiper"
    >
      <!-- real chips -->
      <swiper-item v-for="item in _useChipList" :key="item.ident">
        <view
          class="ca_chip"
          :class="{ _bright: item.ident === operaStore.chipsBjlEd }"
          @tap="_bindAction(item.ident)"
        >
          <SvgIcon class="ca_chip_fill" :name="item.icon" />
          <image
            class="ca_chip_glow"
            :src="userStore.getImageBase + 'chip-select-bright.png'"
            mode="widthFix"
          />
        </view>
      </swiper-item>

      <!-- empty slots so center stays like design when <5 chips -->
      <swiper-item
        v-for="n in (_useChipList.length < 5 ? 5 - _useChipList.length : 0)"
        :key="'empty-' + n"
      >
        <view class="ca_chip ca_chip--empty"></view>
      </swiper-item>
    </swiper>

    <!-- RIGHT ARROW -->
    <view class="ca_opera" data-opera="next" @tap="_bindSwitchChip">
      <!-- <SvgIcon class="ca_op_icon" name="game-table-chips-next" /> -->
      <img src="@/assets/tablenormal/righta.png" alt="game-table-chips-next" class="ca_op_icon" >
    </view>

    <!-- RIGHT SIDE BUTTON (for now gear, later you can put the B badge) -->
    <view class="ca_side_btn" >
      <img src="@/assets/tablenormal/Ratio.png" alt="chip-setting" class="ca_side_icon" >
      <!-- <SvgIcon class="ca_side_icon" name="chip-setting" size="40" /> -->
    </view>
  </view>

  <PerfComponent :componentUrl="PCompChipsSetting" ref="_vChipsSetting" />
</template>

<script setup name='ChipsArea'>
import { ref, computed, inject } from 'vue';
import PerfComponent from '@front/components/PerfComponent.vue';
import { useOperaStore } from '@front/stores/modules/opera.store';
import { useGameStore } from '@front/stores/modules/game.store';
import { useUserStore } from '@front/stores/modules/user.store';
// #ifdef APP-PLUS
  import PCompChipsSetting from '@front/components/ChipsSetting.vue';
// #endif
// #ifndef APP-PLUS
  const PCompChipsSetting = ()=> import('@front/components/ChipsSetting.vue');
// #endif

const operaStore = useOperaStore(),
      gameStore = useGameStore(),
      userStore = useUserStore()
;

const _vChipsSetting = ref(null),
      _chipsUseList = inject('chipsUseList'),
      _useChipList = computed(()=> (
        _chipsUseList.value.length > 0
          ? operaStore.chipsBjlList.filter(f=> f.ident !== "chip-allIn").filter(f=> _chipsUseList.value.includes(f.ident))
          : operaStore.chipsBjlList.filter(f=> f.ident !== "chip-allIn")
      )),
      _currentSwiper = computed(()=> {
        const _currentIndex = operaStore.chipsBjlEd ? _useChipList.value.findIndex(f=> f.ident === operaStore.chipsBjlEd) : -1;
        if (_currentIndex < 0) return '';
        if (_useChipList.value.length < 5) return 0;

        if (_currentIndex > _useChipList.value.length - 6) return _useChipList.value.length - 6;
        return _currentIndex - 1;
      })
;

function _bindAction(ident) {
  // if (gameStore.gameStatus !== 'timing') return;

  operaStore.setChipsBjlEd(ident);
}

function _bindSwitchChip(event) {
  // if (gameStore.gameStatus !== 'timing') return;

  const { opera } = event.currentTarget.dataset;

  const _curIndex = _useChipList.value.findIndex(f=> f.ident === operaStore.chipsBjlEd);

  let _targetChipIdent = '';

  if (opera === 'last') {
    if (_curIndex === 0) return;

    _targetChipIdent = _useChipList.value[_curIndex - 1].ident;

  } else if (opera === 'next') {
    if (_curIndex === (_useChipList.value.length - 1)) return;

    _targetChipIdent = _useChipList.value[_curIndex + 1].ident;

  }
  console.log('_targetChipIdent', _targetChipIdent);
  operaStore.setChipsBjlEd(_targetChipIdent);
}

function _bindChipSetting() {
  console.log('_bindChipSetting');
  _vChipsSetting.value.showChange();
}



</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableNormal/ChipsArea.less' scoped></style>
