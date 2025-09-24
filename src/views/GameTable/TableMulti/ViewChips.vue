<template>
<view class='vc_model'>

  <view class='vc_opera' data-opera='last' @tap='_bindSwitchChip'>
    <SvgIcon class='vc_op_icon' name='game-table-chips-last' />
  </view>

  <!-- <view class='vc_li_view _normal' @tap=''> -->
  <!-- <view class='vc_view _normal' @tap='_bindChipsSetting'>
    <SvgIcon class='vc_vi_fill' name='chip-setting' />
  </view> -->

  <view
    :class='["vc_li_view", "chip-allIn" === operaStore.chipsBjlEd ? "_bright" : "_normal",]'
    @tap='(
      gameStore.gameStatus === "timing"
        ? ()=> operaStore.setChipsBjlEd("chip-allIn")
        : ()=> operaStore.setChipsBjlEd("chip-allIn")
    )'
  >
    <SvgIcon class='vc_li_vi_fill' :name='"chip-allIn"' />

    <image class='vc_li_vi_bright' :src=' userStore.getImageBase + "chip-select-bright.png"' />
  </view>

  <swiper
    class='vc_list'
    :display-multiple-items='_useChipList.length < 5 ? 5 : 5' acceleration
    :current='_currentSwiper'
  >
    <template v-for='item in _useChipList' key='ident'>
      <swiper-item>
        <view
          :class='["vc_li_view", item.ident === operaStore.chipsBjlEd ? "_bright" : "_normal",]'
          @tap='(
            gameStore.gameStatus === "timing"
              ? ()=> operaStore.setChipsBjlEd(item.ident)
              : ()=> operaStore.setChipsBjlEd(item.ident)
          )'
        >
          <SvgIcon class='vc_li_vi_fill' :name='item.icon' />

          <image class='vc_li_vi_bright' :src=' userStore.getImageBase + "chip-select-bright.png"' />
        </view>
      </swiper-item>
    </template>

    <swiper-item>
      <view class='vc_li_view' @tap='_bindChipsSetting'>
        <SvgIcon class='vc_li_vi_fill' name='chip-setting' size='40' />
      </view>
    </swiper-item>

    <template v-for='item in (_useChipList.length < 5 ? Array.from({length:(5 - _useChipList.length)}, ()=> "") : [])' key='ident'>
      <swiper-item>
        <view class='vc_li_view'></view>
      </swiper-item>
    </template>
  </swiper>

  <view class='vc_opera' data-opera='next' @tap='_bindSwitchChip'>
    <SvgIcon class='vc_op_icon' name='game-table-chips-next' />
  </view>

  <PerfComponent :componentUrl='PCompChipsSetting' ref='_vChipsSetting' />

</view>
</template>
<script setup name='ViewChips'>
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

const _chipsUseList = inject('chipsUseList'),
      _vChipsSetting = ref(null),
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

function _bindChipsSetting() {
  _vChipsSetting.value.showChange();
}

function _bindSwitchChip(event) {
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
  operaStore.setChipsBjlEd(_targetChipIdent);
}

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableMulti/ViewChips.less' scoped></style>
