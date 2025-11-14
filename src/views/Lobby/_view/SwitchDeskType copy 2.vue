<template>
  <view class="sdt_model">
    <view class="sdt_header">
      <image class="sdt_bg" src="@front/assets/lobby/bg_swtich.png" mode="widthFix" />
      <view class="sdt_tabs-base"></view>

    <view class="sdt_tabs">
      <view
        v-for="(item, index) in switchList"
        :key="item.ident || index"
        :class="[
          'sdt_tab',
          index === activeIndex && '_active',
          index === 0 ? '_left' : index === 1 ? '_middle' : '_right'
        ]"
        :data-ident="item.ident"
        @tap="bindSwitchType"
      >
        <text class="sdt_tab__name">{{ t(item.name) }}</text>
        <text class="sdt_tab__sub">{{ item.sub }}</text>
      </view>
    </view>

    </view>

    <!-- <view class="sdt_actions">
      <view class="sdt_action" @tap="refreshRoutes">
        <view class="sdt_action__icon-wrap">
          <image class="sdt_action__icon" :src="refreshIcon" mode="widthFix" />
        </view>
        <text class="sdt_action__text">好路刷新</text>
      </view>
      <view class="sdt_action" @tap="toggleSort">
        <view class="sdt_action__icon-wrap">
          <image class="sdt_action__icon" :src="sortIcon" mode="widthFix" />
        </view>
        <text class="sdt_action__text">好路排序</text>
        <text class="sdt_action__caret">▼</text>
      </view>
      <view class="sdt_action" @tap="toggleMode">
        <view class="sdt_action__icon-wrap">
          <image class="sdt_action__icon" :src="modeIcon" mode="widthFix" />
        </view>
        <text class="sdt_action__text">现场模式</text>
        <text class="sdt_action__caret">▼</text>
      </view>
    </view> -->
  </view>
</template>

<script setup name="SwitchDeskType">
import { computed } from 'vue'
import { useDeskStore } from '@front/stores/modules/desk.store'
import { useI18n } from 'vue-i18n'
import refreshIcon from '@front/assets/lobby/reload.png'
import sortIcon from '@front/assets/lobby/service.png'
import modeIcon from '@front/assets/lobby/server.png'

const { t } = useI18n()
const deskStore = useDeskStore()

const switchList = [
  { name: 'multiTable.all', sub: 'HALL', ident: '' },
  { name: 'multiTable.bjl', sub: 'BACCARAT', ident: '百家乐' },
  { name: 'multiTable.lh', sub: 'DRAGON TIGER', ident: '龙虎' },
]

const activeIndex = computed(() => {
  const idx = switchList.findIndex((item) => item.ident === deskStore.queryType)
  return idx < 0 ? 0 : idx
})

function bindSwitchType(event) {
  const { ident } = event.currentTarget.dataset
  deskStore.switchQueryList(250, ident)
}

function refreshRoutes() {
  deskStore.switchQueryList(250, deskStore.queryType)
}

function toggleSort() {}

function toggleMode() {}
</script>

<style scoped lang="less" src="@front/zstyles/views/Lobby/_view/SwitchDeskType.less"></style>
