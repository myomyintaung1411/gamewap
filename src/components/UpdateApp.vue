<template>
<div>

  <template v-if='_show'>
    <div class='ua_model'>

      <SvgIcon class='ua_logo' name='logo-01' />

      <div class='ua_textarea'>
        <div class='ua_te_title'>更新内容 (V{{systemStore.updateNewVersion || '--'}})</div>
        <div class='ua_te_list'>
          <template v-for='(item,index) in systemStore.updatePromptList' :key='item.id'>
            <div class='ua_te_li_line'>{{index + 1}}. {{item}}</div>
          </template>
        </div>
        <div class='ua_te_tip'>正在更新中，请不要关闭客户端</div>
      </div>

      <div class='ua_process'>
        <el-progress
          striped striped-flow color='#ae7725'
          :percentage='isNaN(systemStore.updateProcess) ? 0 : systemStore.updateProcess'
          :stroke-width='100'
          :show-text='false'
        />
      </div>

      <div class='ua_bottom'>
        <div class='ua_bo_left'>
          <div class='ua_bo_le_view'>更新遇到问题？</div>
          <div class='ua_bo_le_view _download' @click='_bindDownload'>下载最新安装包</div>
        </div>
        <div class='ua_bo_right'>更新进度：{{isNaN(systemStore.updateProcess) ? '--' : Number(systemStore.updateProcess).toFixed(2)}}%</div>
      </div>

    </div>
  </template>

</div>
</template>
<script setup name='TheVoice'>
import { ref } from 'vue';
import { useSystemStore } from '@front/stores/modules/system.store';

const systemStore = useSystemStore();

const _show = ref(false);

defineExpose({
  showChange:()=> {
    _show.value = true;
  },
  closeChange:()=> {
    _show.value = false;
  }
})

function _bindDownload() {
  window.electron.ipcRenderer.send('message', `downloadPackage-${systemStore.newPackageUrl}`);
}

</script>
<style lang='less' src='@front/zstyles/components/UpdateApp.less' scoped></style>
