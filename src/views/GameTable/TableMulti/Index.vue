<template>
<view class='page-box tm_page' :style='{ backgroundColor:"#0e112c", height:`${_windowHeight}px` }'>

  <view style='height:var(--status-bar-height)'></view>

  <TitleAction />

  <!-- <div class='tm_list' @scroll='handleScroll' ref='_vScrollWrapper'> -->
  <div class='tm_list' ref='_vScrollWrapper'>
    <scroll-view @scrolltolower='_handleScrollNext' scroll-y='true' style='height:100%'>
      <DeskList />
    </scroll-view>
  </div>

  <view class='tm_opera'>
    <view class='tm_op_chips'>
      <ViewChips />
    </view>

    <ViewOpera />
  </view>

  <PageBaseImport />

</view>
</template>
<script setup name='TableMulti'>
import { ref, provide, } from 'vue';
import { onLoad, onShow, onHide, onUnload } from '@dcloudio/uni-app';
import PageBaseImport from '@front/components/PageBaseImport.vue';
import TitleAction from './TitleAction.vue';
import DeskList from './DeskList/Index.vue';
import ViewChips from './ViewChips.vue';
import ViewOpera from './ViewOpera.vue';
import { debounce } from 'lodash';
import { useOperaStore } from '@front/stores/modules/opera.store';
import { useDeskStore } from '@front/stores/modules/desk.store';
import { useUserStore } from '@front/stores/modules/user.store';
import { useSystemStore } from '@front/stores/modules/system.store';
import { listenStart, listenConnectEd, } from '@front/utils/wsManager';
import { localGet, } from '@front/utils/localStorage';

const operaStore = useOperaStore(),
      deskStore = useDeskStore(),
      userStore = useUserStore(),
      systemStore = useSystemStore()
;

const _chipsUseList = ref(localGet('table-multi-chips-use') || []),
      _vScrollWrapper = ref(false),
      _goodFilter = ref(false),
      _windowHeight = ref(-1),
      _routeType = ref('PanelSecond') // [PanelSecond, PanelOther]
;
provide('chipsUseList', _chipsUseList);
provide('goodFilter', _goodFilter);
provide('routeType', _routeType);

function _changeChipsUseList(value) {
  console.log('changeChipsUseList', value);
  if (value.length >= 1) {
    if (!value.includes(operaStore.chipsBjlEd)) {
      operaStore.setChipsBjlEd(value[0]);
    }
  }
  _chipsUseList.value.splice(0, _chipsUseList.value.length, ...value);
}
provide('changeChipsUseList', _changeChipsUseList);

function _changeGoodFilter(value) {
  _goodFilter.value = value;
}
provide('changeGoodFilter', _changeGoodFilter);

function _changeRouteTypeAuto() {
  _routeType.value = (
    _routeType.value === 'PanelSecond' ? 'PanelOther' : 'PanelSecond'
  );
}
provide('changeRouteTypeAuto', _changeRouteTypeAuto);

function _setWindowHeight() {
  const vh = window.innerHeight;
  _windowHeight.value = vh;
}

onLoad(()=> {
  _setWindowHeight();
})

// function handleScroll() {
//   const _scrollWrapper = _vScrollWrapper.value;
//   const { scrollTop, clientHeight, scrollHeight } = _scrollWrapper;

//   (scrollTop + clientHeight >= scrollHeight - 10) && _loadNextPage();
// }
function _handleScrollNext() {
  _loadNextPage();
}

const _loadNextPage = debounce(async function() {
  if (deskStore.loading) return;

  window.$loading(true, '加载中');
  await deskStore.updateList();
  window.$loading(false);
}, 200)

onShow(()=> {
  // tempcode (app打包兼容问题)
  uni.onWindowResize(_setWindowHeight);

  if (deskStore.list.length < 1) {
    listenStart();
  }
  listenConnectEd(async ()=> {
    // if (deskStore.list.length < 1) {
      deskStore.setQueryMulti('y');
      deskStore.initList().then(()=> {
        deskStore.listFlow();

        operaStore.initConfigChipsList(Object.keys(deskStore.list[0].betAmountImg).map(f=> ({ value:f, icon:deskStore.list[0].betAmountImg[f] || '' })));
      });
    // } else {
    //   operaStore.initConfigChipsList(Object.keys(deskStore.list[0].betAmountImg).map(f=> ({ value:f, icon:deskStore.list[0].betAmountImg[f] || '' })));
    // }
    userStore.updateUserInfo();
    userStore.flowUserBalance();
    systemStore.updateNoticeList();
  });
})

onHide(()=> {
  deskStore.cleanList();

  // window.removeEventListener('resize', _setWindowHeight, true,);
  uni.offWindowResize(_setWindowHeight);
})

onUnload(()=> {
  // window.removeEventListener('resize', _setWindowHeight, true,);
  uni.offWindowResize(_setWindowHeight);
})

</script>
<style lang='less' src='@front/zstyles/views/GameTable/TableMulti/Index.less' scoped></style>
