import { defineStore } from 'pinia';
// import ScreenFull from 'screenfull';
import { isString, isGetString } from '@front/utils/is';
import { listenAdd, listenRemove, } from '@front/utils/wsManager';
import { isInElectron, getRandomOption } from '@front/utils/tools';
import { localSet, localGet, } from '@front/utils/localStorage';
import { req_indexGetloginapi, req_indexGetwsapi } from '@front/services/system.service';

// ScreenFull.on('change', _changeFullScreen);
// function _changeFullScreen() {
//   useSystemStore().isFullScreen = ScreenFull.isFullscreen;
// }

export const useSystemStore = defineStore({
  id: 'db-system',
  state: ()=> ({
    wsStatus: 0, // ['wait'=未连接, 'loading'=请求连接中, 'ing'=已连接中, 'fail'=连接失败]
    netWorkList: ( // status=[''=未定义, smooth=流畅, congestion=拥挤]
      ['test', 'development'].includes(import.meta.env.MODE)
        ? ([
            { ident:'test', name:'测试', urlHttp:import.meta.env.VITE_HTTP_TEST, urlWs:import.meta.env.VITE_WS_TEST, status:'', },
          ])
        :
      // ['production', 'devprod'].includes(import.meta.env.MODE)
      //   ? ([
      //       { ident:'netcom', name:'电信', urlHttp:import.meta.env.VITE_HTTP_NETCOM, urlWs:import.meta.env.VITE_WS_NETCOM, status:'', },
      //       { ident:'telecom', name:'网通', urlHttp:import.meta.env.VITE_HTTP_TELECOM, urlWs:import.meta.env.VITE_WS_TELECOM, status:'', },
      //       { ident:'other', name:'海外', urlHttp:import.meta.env.VITE_HTTP_OVERSEAS, urlWs:import.meta.env.VITE_WS_OVERSEAS, status:'', },
      //     ])
      //   :
      [
        //{ ident:'netcom', name:'电信', urlHttp:import.meta.env.VITE_HTTP_NETCOM, urlWs:import.meta.env.VITE_WS_NETCOM, status:'', },
        { ident:'netcom', name:'电信', urlHttp:'https://95527.vip/api', urlWs:'wss://95527.vip/wsapi', status:'', },
      ]
    ),
    netWorkEd: (
      ['test', 'development'].includes(import.meta.env.MODE) ? 'test' :
      // ['production', 'devprod'].includes(import.meta.env.MODE) ? (sessionStorage.getItem('netword') || 'telecom') :
      // ''
      'netcom'
    ),
    // netWorkVideoVerify: 'https://www.bx5178.com:9102',
    netWorkVideoVerify: 'https://api.bx9939.com',
    netWorkUpdateApp: 'https://exe.bx8788.com/',
    netWorkDomainConfig: 'https://exe.bx8788.com/api',
    onlineServicesUrl: '',
    noticeList: [],
    playVoice: (localGet('playVoice') || 'true') === 'true',
    isInElectron: isInElectron(),
    updateList: [],
    updateProcess: NaN,
    newPackageUrl: '',
    updateNewVersion: '',
    isFullScreen: false,
    checkCount: 0,
    updatePromptList: [],
    platform: (()=> {
      // #ifdef APP-PLUS
        return 'APP';
      // #endif
      // #ifndef APP-PLUS
        return 'H5';
      // #endif
    })(),
    isPhoneSmall: window.innerHeight < 630,
    zoomVideo: false,
    //initDomainIng: false,
    initDomainIng: true,
    //isDomainLoadEd: false,
    isDomainLoadEd: true,
  }),
  getters: {
    getUrlHttp() {
      return this.netWorkList.find(f=> f.ident === this.netWorkEd).urlHttp;
    },
    getUrlWs() {
      return this.netWorkList.find(f=> f.ident === this.netWorkEd).urlWs;
    },
    getNetWorkVideoVerify() {
      return this.netWorkVideoVerify;
    },
    getNetWorkDomainConfig() {
      return this.netWorkDomainConfig;
    },
    getNetWorkUpdateApp() {
      return this.netWorkUpdateApp;
    },
  },
  actions: {
    randomSelectNetwordEd() {
      this.setNetWorkEd(getRandomOption(this.netWorkList.map(f=> f.ident)));
    },
    setUpdateProcess(value) {
      this.updateProcess = value;
    },
    setUpdateNewVersion(value) {
      this.updateNewVersion = value;
    },
    setWsStatus(value) {
      if (!isString(value) || !['wait', 'loading', 'reloading', 'ing', 'fail', 'disconnect'].includes(value)) throw new Error(`Error setSsStatus: typeof value not match ${value}`);
      this.wsStatus = isGetString(value);
    },
    setPlayVoiceAuto() {
      this.playVoice = !this.playVoice;
      localSet('playVoice', (this.playVoice).toString());
    },
    setNetWorkEd(value) {
      this.netWorkEd = value;
      localSet('netword', value);
    },
    setNetWorkStatus(ident, value) {
      const _listItem = this.netWorkList.find(f=> f.ident === ident);
      if (!_listItem) return;

      _listItem.status = value;
    },
    switchIsFullScreen() {
      // ScreenFull.toggle();
    },
    setOnlineServicesUrl(value) {
      this.onlineServicesUrl = value;
    },
    setZoomVideo(value) {
      this.zoomVideo = value;
    },
    aotuSwitchOtherNetwork() {
      const _otherNetwork = (
        ['netcom', 'telecom'].includes(this.netWorkEd) ? 'other' :
        ['other'].includes(this.netWorkEd) ? 'telecom' :
        ''
      )
      _otherNetwork && (this.netWorkEd = _otherNetwork);
    },
    async updateNoticeList() {
      const _listenId = listenAdd(
        'notice',
        {},
        (event)=> {
          listenRemove(_listenId);
          if (event.code !== 0) return;

          this.noticeList = event.data.map(f=> ({
            type: f.type,
            content: f.content,
          }))
        }
      )
    },
    revokeWithdrawApply(withdrawId) {
      return new Promise(resolve=> {
        const _listenId = listenAdd(
          'withdrawCancel',
          Object.assign(
            {
              withdrawId: withdrawId,
            },
          ),
          (event)=> {
            listenRemove(_listenId);
            if (event.code !== 0) {
              resolve(false);
              return window.$msg(event.msg, 3000);
            }
            window.$msg(event.msg, 3000);
            resolve(true);
          }
        )
      })
    },
    // return Array
    _autoInitDomainHttp() {
      // eslint-disable-next-line
      return new Promise(async resolve=> {
        const _resHttp = await req_indexGetloginapi();

        if (!_resHttp.success) {
          // window.$msg(`获取HTTP配置失败 ${_resHttp.msg || _resHttp.code || ''}`);
          return resolve([]);
        }
        if (!_resHttp.data || !('http' in _resHttp.data)) {
          // window.$msg(`获取HTTP配置失败 暂无线路信息`);
          return resolve([]);
        }

        const _httpArr = isGetString(_resHttp.data.http, '').split(';');
        if (_httpArr.length < 1) {
          // window.$msg(`获取HTTP配置失败 暂无可用线路`);
          return resolve([]);
        }
        return resolve(_httpArr);
      })
    },
    // return Array
    async _autoInitDomainWs() {
      // eslint-disable-next-line
      return new Promise(async resolve=> {
        const _resWs = await req_indexGetwsapi();

        if (!_resWs.success) {
          // window.$msg(`获取WS配置失败 ${_resWs.msg || _resWs.code || ''}`);
          return resolve([]);
        }
        if (!_resWs.data || !('wss' in _resWs.data)) {
          // window.$msg(`获取WS配置失败 暂无线路信息`);
          return resolve([]);
        }

        const _wsArr = isGetString(_resWs.data.wss, '').split(';');
        if (_wsArr.length < 1) {
          // window.$msg(`获取WS配置失败 暂无可用线路`);
          return resolve([]);
        }
        return resolve(_wsArr);
      })
    },
    /**
     * @return {Boolean} success/fail
     */
    async autoInitDomainConfig() {
      if (this.netWorkList.length > 0) {
        this.initDomainIng = false;
        this.isDomainLoadEd = true;
        return;
      }
      // close dynamic domain
      if (new Date().getTime() > 1) {
        this.netWorkEd = '';
        this.netWorkList.splice(0, this.netWorkList.length);
        this.netWorkList = [
          { ident:'netcom', name:'线路1', urlHttp:import.meta.env.VITE_HTTP_NETCOM, urlWs:import.meta.env.VITE_WS_NETCOM, status:'', },
          { ident:'telecom', name:'线路2', urlHttp:import.meta.env.VITE_HTTP_TELECOM, urlWs:import.meta.env.VITE_WS_TELECOM, status:'', },
          { ident:'other', name:'线路3', urlHttp:import.meta.env.VITE_HTTP_OVERSEAS, urlWs:import.meta.env.VITE_WS_OVERSEAS, status:'', },
        ]
        this.randomSelectNetwordEd();
        this.initDomainIng = false;
        this.isDomainLoadEd = true;
        return;
      }
      // close dynamic domain

      // eslint-disable-next-line
      return new Promise(async resolve=> {
        // if (this.initDomainIng) return;
        if (this.initDomainIng) {
          let _count = 0;
          const _timerId = setInterval(()=> {
            if (_count >= (2 * 30)) {
              clearInterval(_timerId);
              return resolve();
            }
            _count += 1;

            if (!this.initDomainIng) {
              clearInterval(_timerId);
              return resolve();
            }
          }, 500);
          return;
        }
        this.initDomainIng = true;

        const _currentPages = getCurrentPages();
        const _showLoading = _currentPages[_currentPages.length - 1].route !== 'views/Login/Index';

        _showLoading && window.$loading(true, '加载线路中');
        const _result = await Promise.allSettled([
          this._autoInitDomainHttp(),
          this._autoInitDomainWs(),
        ])
        _showLoading && window.$loading(false);

        let _resHttp = _result[0].value,
            _resWs = _result[1].value
        ;
        // if (_resHttp.length < 1) return resolve(false);
        // if (_resWs.length < 1) return resolve(false);
        if (_resHttp.length < 1 || _resWs.length < 1) {
          this.netWorkEd = '';
          this.netWorkList.splice(0, this.netWorkList.length);
          this.netWorkList = [
            { ident:'netcom', name:'电信', urlHttp:import.meta.env.VITE_HTTP_NETCOM, urlWs:import.meta.env.VITE_WS_NETCOM, status:'', },
            { ident:'telecom', name:'网通', urlHttp:import.meta.env.VITE_HTTP_TELECOM, urlWs:import.meta.env.VITE_WS_TELECOM, status:'', },
            { ident:'other', name:'海外', urlHttp:import.meta.env.VITE_HTTP_OVERSEAS, urlWs:import.meta.env.VITE_WS_OVERSEAS, status:'', },
          ]
          this.randomSelectNetwordEd();
          this.initDomainIng = false;
          this.isDomainLoadEd = true;
          return resolve(true);
        }

        // let _resHttp = await this._autoInitDomainHttp();
        // if (_resHttp.length < 1) return resolve(false);

        // let _resWs = await this._autoInitDomainWs();
        // if (_resWs.length < 1) return resolve(false);

        // tempcode
        // _resHttp = ['https://www.9909399.com:20443/hjuser', 'https://www.9909399.com:20443/hjuser', 'https://www.9909399.com:20443/hjuser'];
        // _resWs = ['wss://www.9909399.com:20443/hjws/', 'wss://www.9909399.com:20443/hjws/'];

        this.netWorkEd = '';
        this.netWorkList.splice(0, this.netWorkList.length);
        let _netWorkArr = [];
        for (let i in _resHttp) {
          if (!_resWs[i]) break;

          const _index = Number(i) + 1;

          _netWorkArr.push({
            ident: `netWork${_index}`,
            name: `线路${_index}`,
            urlHttp: _resHttp[i],
            urlWs: _resWs[i],
          })
        }
        this.netWorkList.push(..._netWorkArr);
        this.randomSelectNetwordEd();

        this.initDomainIng = false;
        this.isDomainLoadEd = true;
        return resolve(true);
      })
    },
  },
})
