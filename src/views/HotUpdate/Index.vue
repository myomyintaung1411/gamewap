<template>
<view class='page-box hu_page' :style='{ height:`${_windowHeight}px` }'>

  <view class='hu_flex'>
    <view style='width:100%; height:var(--status-bar-height)'></view>

    <view class='hu_title'>有新版本 {{_newVersion}}</view>

    <view class='hu_subtitle'>【更新内容】</view>
    <view class='hu_list' :style='{ maxHeight:`calc(${_windowHeight}px - 900rpx)` }'>
      <template v-for='(item,index) in _updateContents'>
        <view class='hu_li_line'>
          <view class='hu_li_li_num'>{{ (index + 1).toString().padStart(2, '0') }}.</view>
          <view class='hu_li_li_value'>{{item}}</view>
        </view>
      </template>
    </view>

    <template v-if='["downloadIng", "installIng"].includes(_status)'>
      <view class='hu_process'>
        <view class='hu_pr_status'>{{ ({ downloadIng:'下载中', installIng:'安装中' })[_status] || '--' }}</view>
        <progress :percent='_downloadProcess' show-info stroke-width='8' />
      </view>
    </template>

    <view class='hu_button'>
      <template v-if='_canIgnore'>
        <view :class='["hu_bu_view _theme01", _status && "_disable"]' hover-class='hu_bu_vi_hover' style='margin-right:40rpx;' @tap='_bindBack'>跳过此版本</view>
      </template>

      <template v-if='_appDownloadPage'>
        <view :class='["hu_bu_view _theme01"]' hover-class='hu_bu_vi_hover' style='margin-right:40rpx;' @tap='_bindAppDownload'>App完整下载</view>
      </template>

      <view :class='["hu_bu_view _theme02", _status && "_disable"]' hover-class='hu_bu_vi_hover' @tap='_bindUpdate'>立即更新</view>
    </view>
  </view>

  <PageBaseImport />

</view>
</template>
<script setup name='HotUpdate'>
import { ref } from 'vue';
import { onLoad, } from '@dcloudio/uni-app';
import PageBaseImport from '@front/components/PageBaseImport.vue';
import { isGetArray, isGetString, isGetBoolean, } from '@front/utils/is';

const _windowHeight = ref(0),
      _status = ref(''),
      _updateContents = ref([]),
      _newVersion = ref(''),
      _canIgnore = ref(false),
      _downloadProcess = ref(0),
      _wgtUrl = ref(''),
      _appDownloadPage = ref('')
;

function _bindBack() {
  uni.navigateBack();
}

function _setWindowHeight() {
  const vh = uni.getSystemInfoSync().windowHeight;
  _windowHeight.value = vh;
}

function _bindUpdate() {
  _status.value = 'downloadIng';

  const _downTask = uni.downloadFile({
    url: _wgtUrl.value,
    success:downRes=> {
      if (downRes.statusCode === 200) {
        // _downTask.abort();
        _status.value = 'installIng';

        plus.runtime.install(
          downRes.tempFilePath,
          {
            force: false
          },
          ()=> { // success
            window.$msg('安装成功, 即将重启完成安装', 3000);
            setTimeout(()=> {
              plus.runtime.restart();
            }, 3500);
          },
          (e)=> { // fail
            return uni.showModal({ content:`安装失败: ${e.message}`, showCancel:false, confirmText:'知道了', });
          }
        );
      }
    },
    fail:err=> {
      _downTask.abort();
      return uni.showModal({ content:`下载失败: ${err.errMsg}`, showCancel:false, confirmText:'知道了', });
    },
  });

  _downTask.onProgressUpdate(res=> {
    _downloadProcess.value = res.progress;
  })
}

function _bindAppDownload() {
  plus.runtime.openURL(_appDownloadPage.value, function() {
  });
}

onLoad((event={})=> {
  _setWindowHeight();

  const { data } = event;
  if (!data) return uni.showModal({ content:'异常, 缺少更新信息', showCancel:false, confirmText:'知道了', });

  const _data = JSON.parse(data);
  _updateContents.value = isGetArray(_data.contents, '');
  _newVersion.value = isGetString(_data.newVersion, '--');
  _canIgnore.value = !_data.isStrong;
  _wgtUrl.value = isGetString(_data.hotWgtUrl, '');
  _appDownloadPage.value = isGetString(_data.appDownload, '');

  if (!_wgtUrl.value) return uni.showModal({ content:'异常, 缺少更新地址', showCancel:false, confirmText:'知道了', });
})

</script>
<style lang='less' src='@front/zstyles/views/HotUpdate/Index.less' scoped></style>
