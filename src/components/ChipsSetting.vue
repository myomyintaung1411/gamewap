<template>
<view>

  <view v-if='_show'>

    <view class='cs_mask' @tap='_bindClose' @touchmove.stop.prevent='_moveHandle'></view>

    <view class='cs_model' @touchmove.stop.prevent='_moveHandle'>

      <SvgIcon class='cs_close' name='popup-close' @tap='_bindClose' />

      <view class='cs_ph'></view>

      <view class='cs_title'>
        <view class='cs_ti_text'>{{t("table.chip_set")}}</view>
        <view class='cs_ti_content'>{{t("table.chip_place")}}</view>
      </view>

      <view class='cs_list'>
        <template v-for='item in operaStore.chipsBjlList' :key='item.id'>
          <view
            :class='["cs_li_view", _listEd.includes(item.ident) ? "_bright" : "_normal",]'
            :data-ident='item.ident'
            @click='_bindChipsItem'
          >
            <img class='cs_li_vi_bright' :src='userStore.getImageBase +  "chip-select-bright.png"' />

            <SvgIcon class='cs_li_vi_fill' :name='item.icon' />
          </view>
        </template>
      </view>

      <view class='cs_action'>
        <TheButton
          class='cs_ac_button'
          :taps='_bindAffirm'
        >
          {{t("login.confirm")}}
      </TheButton>
      </view>

    </view>

  </view>

</view>
</template>
<script setup name='ChipsSetting'>
import { ref, inject } from 'vue';
import TheButton from '@front/components/TheButton/Index.vue';
import { EventEmitter } from "@front/eventBus";
import { VOICE_SEND } from "@front/eventBus/actions";
import { useOperaStore } from '@front/stores/modules/opera.store';
import { localSet, localGet, } from '@front/utils/localStorage';
import { useUserStore } from '@front/stores/modules/user.store';

import { useI18n } from "vue-i18n";
const { t } = useI18n();
defineExpose({
  showChange() {
    const _sessValue = localGet('table-multi-chips-use');
    if (_sessValue) {
      _listEd.value.splice(0, _listEd.value.length, ..._sessValue);
    } else {
      _listEd.value.splice(0, _listEd.value.length);
    }

    _show.value = true;
  }
})

const operaStore = useOperaStore();
const userStore = useUserStore();

const _changeChipsUseList = inject('changeChipsUseList'),
      _show = ref(false),
      _listEd = ref([])
;

function _bindClose() {
  EventEmitter.emit(VOICE_SEND, 'a_room');  //增加点击音效
  _show.value = false;

  // _bindReset();
}

function _moveHandle() {}

function _bindChipsItem(event) {
  EventEmitter.emit(VOICE_SEND, 'a_room');

  const { ident } = event.currentTarget.dataset,
        _fIndex = _listEd.value.findIndex(f=> f === ident)
  ;
  _fIndex >= 0
    ? _listEd.value.splice(_fIndex, 1)
    : _listEd.value.push(ident)
}

function _bindAffirm() {
  EventEmitter.emit(VOICE_SEND, 'a_room');
  console.log('_listEd', _listEd.value);
  _changeChipsUseList(_listEd.value);
  localSet('table-multi-chips-use', _listEd.value);

  _bindClose();
}

</script>
<style lang='less' src='@front/zstyles/components/ChipsSetting.less' scoped></style>
