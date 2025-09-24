import { req_publicAppVersion } from '@front/services/system.service';
import { useSystemStore } from '@front/stores/modules/system.store';

export function checkUpdate(useNetIndex=-1) {
  /*const _systemStore = new useSystemStore(),
        _platform = uni.getSystemInfoSync().platform,
        _useNetWorkIndex = useNetIndex === -1 ? 0 : useNetIndex;
  ;

  req_publicAppVersion(_systemStore.netWorkList[_useNetWorkIndex].urlHttp, `app_href_${_platform === 'ios' ? 'iso' : _platform}`).then(res=> {
    if (!res.success) {
      if (_systemStore.netWorkList.length > (_useNetWorkIndex + 1)) {
        checkUpdate(_useNetWorkIndex + 1);
      }
      return;
    }
  })*/

  // #ifdef APP-PLUS
  plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
    // uni.request({
    //   url: `https://test.bx8988.com/beta-app/wap/version.json?${new Date().getTime().toString()}`,
    //   data: {
    //   },
    //   success:res=> {
    // },
    //   fail:err=> {
    //     console.log('err', err);
    //   },
    // });
    const _systemStore = new useSystemStore(),
          _platform = uni.getSystemInfoSync().platform,
          _useNetWorkIndex = useNetIndex === -1 ? 0 : useNetIndex;
    ;

    req_publicAppVersion(_systemStore.netWorkList[_useNetWorkIndex].urlHttp, `app_href_${_platform === 'ios' ? 'iso' : _platform}`).then(res=> {
      if (!res.success) {
        if (_systemStore.netWorkList.length > (_useNetWorkIndex + 1)) {
          checkUpdate(_useNetWorkIndex + 1);
        }
        return;
      }

      !res.data && (res.data = {});

      const _data = {
              newVersion: ( // 新版本号
                'version' in res.data ? res.data.version :
                'appVersion' in res.data ? res.data.appVersion :
                ''
              ),
              contents: ( // 更新内容列表
                'contents' in res.data ? res.data.contents :
                'updateNotes' in res.data ? res.data.updateNotes :
                []
              ),
              appDownload: ( // app下载页地址
                'fullPackageUrl' in res.data ? res.data.fullPackageUrl :
                ''
              ),
              hotWgtUrl: ( // 热更新包地址
                'wgtUrl' in res.data ? res.data.wgtUrl :
                'hotPatchUrl' in res.data ? res.data.hotPatchUrl :
                ''
              ),
              isStrong: true, // 是否强制更新
            },
            _localVersion = widgetInfo.version || ''
      ;
      // _data.hotWgtUrl && (_data.hotWgtUrl = `${_systemStore.getUrlHttp}/public${_data.hotWgtUrl}`)
      _data.hotWgtUrl && (_data.hotWgtUrl = `${_systemStore.getUrlHttp.replace(/\/hjuser/g, '')}${_data.hotWgtUrl}`)

      if (!_data.newVersion || !_localVersion) return;
      if (!_data.hotWgtUrl && !_data.appDownload) return;

      const [ loFirst, loSecond, loThird ] = _localVersion.split('.').map(f=> isNaN(Number(f)) ? 0 : Number(f)),
            [ nvFirst, nvSecond, nvThird ] = _data.newVersion.split('.').map(f=> isNaN(Number(f)) ? 0 : Number(f)),
            _hasNewVersion = (
              nvFirst > loFirst ||
              ( nvFirst === loFirst && nvSecond > loSecond ) ||
              ( nvFirst === loFirst && nvSecond === loSecond && nvThird > loThird )
            ),
            _needStrong = _hasNewVersion && _data.isStrong
      ;

      if (!_hasNewVersion) return;

      _needStrong
        ? uni.reLaunch({ url:`/views/HotUpdate/Index?data=${JSON.stringify(_data)}`, })
        : uni.navigateTo({ url:`/views/HotUpdate/Index?data=${JSON.stringify(_data)}`, })
    })
  });
  // #endif
}
