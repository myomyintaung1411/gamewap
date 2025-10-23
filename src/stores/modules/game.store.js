import { defineStore } from 'pinia';
import { req_gameAskRoad } from '@front/services/game.service';
import { useUserStore } from '@front/stores/modules/user.store';
import { useOperaStore } from '@front/stores/modules/opera.store';
import { useLogStore } from '@front/stores/modules/log.store';
import { listenAdd, listenRemove } from '@front/utils/wsManager';
import { useDeskStore } from '@front/stores/modules/desk.store';
import { getTimmingNum } from '@front/utils/timeline';
import { isNumber, isGetNumber, isGetString, isString, isGetArray, isObject } from '@front/utils/is';
import { MATCH_GAME_STATUS } from '@front/constants';
import DtGame from '@front/dataTrans/DtGame.dt';
import { EventEmitter, } from '@front/eventBus/index';
import { VOICE_SEND, } from '@front/eventBus/actions';
import router from '@front/routers';
// import { isArray } from '@front/utils/is';

let OPERA_STORE = null,
    USER_STORE = null,
    LOG_STORE = null,
    DESK_STORE = null
;
const _operaStore = ()=> {
        !OPERA_STORE && (OPERA_STORE = new useOperaStore());
        return OPERA_STORE;
      },
      _userStore = ()=> {
        !USER_STORE && (USER_STORE = new useUserStore());
        return USER_STORE;
      },
      _logStore = ()=> {
        !LOG_STORE && (LOG_STORE = new useLogStore());
        return LOG_STORE;
      },
      _deskStore = ()=> {
        !DESK_STORE && (DESK_STORE = new useDeskStore());
        return DESK_STORE;
      }
;

let _startTimmingId = '',
    _listenGameInfoId = '',
    _listenGameingId = ''
;

function _defBothItem() {
  return {
    count: NaN,
    value: NaN,
    _setData(count, value) {
      this.count = isGetNumber(count, NaN);
      this.value = isGetNumber(value, NaN);
    },
    _cleanData() {
      this.count = NaN;
      this.value = NaN;
    },
  }
}

export const useGameStore = defineStore({
  id: 'db-game',
  state: ()=> ({
    // [stageState=1=停台中, 0=即将开局, 1=计时中, 2=停止下注, 3=开牌中, 4=结算中, 5=废除牌局, 6=洗牌中]
    gameStatus: '', // 游戏状态 [stopDesk=停台中, comeStart=即将开局, timing=计时中, stopBetting=停止下注, opening=开牌中, settlement=结算中, repeal=废除牌局, shuffle=洗牌中]
    gameType: '', // [bjl, lh]
    gameShortName: '',
    isLive: false, // 是否是三合一
    timming: {
      value: NaN, // <Number || NaN> 倒计时时间 countdown time
      totalTime: NaN, // <Number || NaN> 总时长 total time
    },
    videoUrl: '',
    pokerInfo: { // 开牌信息
      bjlXianTotal: NaN, // bjl.xian.总点数
      bjlZhuangTotal: NaN, // bjl.zhuang.总点数
      bjlXian01: false, // value={ cardName }
      bjlXian02: false, // value={ cardName }
      bjlXian03: false, // value={ cardName }
      bjlZhuang01: false, // value={ cardName }
      bjlZhuang02: false, // value={ cardName }
      bjlZhuang03: false, // value={ cardName }

      lhLongTotal: NaN, // lh.long.总点数
      lhHuTotal: NaN, // lh.long.总点数
      lhLong01: false, // value={ cardName }
      lhHu01: false, // value={ cardName }
    },
    roundInfo: { // 场次信息
      roundNum: NaN, // 第几场
      slotNum: NaN, // 第几口
      totalNum: NaN,
      xianNum: NaN, // 闲赢
      zhuangNum: NaN, // 庄赢
      heNum: NaN, // 和赢
      xianDuiNum: NaN, // 闲对赢
      zhuangDuiNum: NaN, // 庄对赢
      longNum: NaN, // 龙赢
      huNum: NaN, // 虎赢
    },
    dewListFirst: [],
    dewListSecond: [],
    dewListThird: [],
    dewListFourth: [],
    dewListFifth: [],
    dewListSixth: [],
    askPointXian: ['', '', ''],
    askPointZhuang: ['', '', ''],
    askDewListFirst: [],
    askDewListSecond: [],
    askDewListThird: [],
    askDewListFourth: [],
    askDewListFifth: [],
    askDewListSixth: [],
    winAmount: NaN,
    winBetList: [], // bet-ident
    winResultDelay: NaN,
    limitArea: [],
    // tempcode
    limitRedTotal: {
      min: NaN,
      max: NaN,
    },
    bothBet: false,
    isNoCommissionDesk: false, // [true=非免佣台, false=免佣台]
    betRate: {
      notCommission: { // 非免佣
        xian: '',
        zhuang: '',
        xianDui: '',
        zhuangDui: '',
        he: '',
        xingYun: '',
        xingYun6: '',
        long: '',
        hu: '',
        longDan: '',
        huDan: '',
        longShuang: '',
        huShuang: '',
      },
      isCommission: { // 免佣
        xian: '',
        zhuang: '',
        xianDui: '',
        zhuangDui: '',
        he: '',
        xingYun: '',
        xingYun6: '',
        long: '',
        hu: '',
        longDan: '',
        huDan: '',
        longShuang: '',
        huShuang: '',
      },
    },
  }),
  getters: {
    getSelfStatus() {
      return (
        this.gameStatus === 'comeStart' ? 'comeStart' :
        this.gameStatus === 'timing'
          ? (
              (!isNaN(this.timming.value) && this.timming.value <= 10)
                ? 'countDown'
                : 'timing'
            )
          :
        this.gameStatus === 'stopBetting' ? 'stopBetting' :
        this.gameStatus === 'opening' ? 'opening' :
        this.gameStatus === 'settlement' ? 'settlement' :
        this.gameStatus === 'repeal' ? 'repeal' :
        this.gameStatus === 'shuffle' ? 'shuffle' :
        this.gameStatus === 'stopDesk' ? 'stopDesk' :
        ''
      )
    },
    disableBetLhDS() { // 禁止下注龙虎单双
      return !isNaN(this.roundInfo.slotNum) && this.roundInfo.slotNum > 30;
    },
  },
  actions: {
    _setGameType(value) {
      this.gameType = (isString(value) && ['bjl', 'lh'].includes(value)) ? value : '';
    },
    _startTimmingCount() {
      if (isNaN(this.timming.value)) return;
      if (this.timming.value <= 1) {
        this.gameStatus === 'timing' && (
          this._setGameStatus('stopBetting'),
          EventEmitter.emit(VOICE_SEND, 'game-stop-betting'),
          _operaStore().cleanWaitBet()
        );
        return;
      }
      if (_startTimmingId) clearInterval(_startTimmingId);

      //EventEmitter.emit(VOICE_SEND, 'game-is-start');

      _startTimmingId = setInterval(()=> {
        this.timming.value -= 1;

        if (this.timming.value === 10) {
          EventEmitter.emit(VOICE_SEND, 'game-last-ten-seconds');
        }

        if (this.timming.value <= 1) {
          clearInterval(_startTimmingId);
          setTimeout(()=> {
            this._setGameStatus('stopBetting');
            EventEmitter.emit(VOICE_SEND, 'game-stop-betting');
            _operaStore().cleanWaitBet();
          }, 1000);
        }
      }, 1000);
    },
    _setTimming(totalCount, startTime, executedTime) {
      this.timming.value = getTimmingNum(totalCount, startTime, executedTime);
      this.timming.totalTime = isGetNumber(totalCount, NaN);
      this._startTimmingCount();
    },
    _setGameStatus(value) {
      this.gameStatus = isGetString(value, '');
    },
    _cleanPokerInfo() {
      this.pokerInfo = {
        bjlXianTotal:NaN, bjlZhuangTotal:NaN,
        bjlXian01:false, bjlXian02:false, bjlXian03:false, bjlZhuang01:false, bjlZhuang02:false, bjlZhuang03:false,

        lhLongTotal:NaN, lhHuTotal:NaN,
        lhLong01:false, lhHu01:false,
      };
    },
    // [roundNum=场次, slotNum=口数, totalNum, xianNum, zhuangNum, heNum, xianDuiNum, zhuangDuiNum, longNum, huNum]
    _setRoundInfo(roundNum, slotNum, totalNum, xianNum, zhuangNum, heNum, xianDuiNum, zhuangDuiNum, longNum, huNum) {
      this.roundInfo = {
        roundNum: isGetNumber(roundNum, NaN),
        slotNum: isGetNumber(slotNum, NaN),
        totalNum: isGetNumber(totalNum, NaN),
        xianNum: isGetNumber(xianNum, NaN),
        zhuangNum: isGetNumber(zhuangNum, NaN),
        heNum: isGetNumber(heNum, NaN),
        xianDuiNum: isGetNumber(xianDuiNum, NaN),
        zhuangDuiNum: isGetNumber(zhuangDuiNum, NaN),
        longNum: isGetNumber(longNum, NaN),
        huNum: isGetNumber(huNum, NaN),
      }
    },
    _setAskPoint(xianArr, zhuangArr) {
      const _xianArr = Array.from(
              { length:3 },
              (f,i)=> (
                (isGetArray(xianArr) ? xianArr : [])[i] || ''
              )
            ),
            _zhuangArr = Array.from(
              { length:3 },
              (f,i)=> (
                (isGetArray(zhuangArr) ? zhuangArr : [])[i] || ''
              )
            )
      ;
      this.askPointXian[0] = _xianArr[0];
      this.askPointXian[1] = _xianArr[1];
      this.askPointXian[2] = _xianArr[2];
      this.askPointZhuang[0] = _zhuangArr[0];
      this.askPointZhuang[1] = _zhuangArr[1];
      this.askPointZhuang[2] = _zhuangArr[2];
    },
    _setLimitArea(originLimit) {
      this.limitArea = (
        originLimit
          .filter(f=> ['闲', '闲对', '和', '庄', '庄对', '龙', '虎', '幸运6', '龙单', '虎单', '龙双', '虎双'].includes(f.name))
          .map(f=> ({
            minAmount: isGetNumber(f.min, NaN),
            maxAmount: isGetNumber(f.max, NaN),
            name: isGetString(f.name, ''),
          })
        )
      )
    },
    setWinAmount(value) {
      this.winAmount = isGetNumber(value, NaN);
    },
    _setBetRate(originLimitList) {
      const _objLimit = originLimitList.reduce((a,b)=> {
        a[b.name] = b;
        return a;
      }, {})
      this.betRate.notCommission = {
        xian: _objLimit['闲'] ? `1:${_objLimit['闲'].rate}` : '',
        zhuang: _objLimit['庄'] ? `1:${_objLimit['庄'].rate}` : '',
        xianDui: _objLimit['闲对'] ? `1:${_objLimit['闲对'].rate}` : '',
        zhuangDui: _objLimit['庄对'] ? `1:${_objLimit['庄对'].rate}` : '',
        he: _objLimit['和'] ? `1:${_objLimit['和'].rate}` : '',
        xingYun: _objLimit['幸运6'] ? `1:${_objLimit['幸运6'].rate}` : '',
        xingYun6: _objLimit['幸运6 + 1'] ? `1:${_objLimit['幸运6 + 1'].rate}` : '',
        long: _objLimit['龙'] ? `1:${_objLimit['龙'].rate}` : '',
        hu: _objLimit['虎'] ? `1:${_objLimit['虎'].rate}` : '',
        longDan: _objLimit['龙单'] ? `1:${_objLimit['龙单'].rate}` : '',
        huDan: _objLimit['虎单'] ? `1:${_objLimit['虎单'].rate}` : '',
        longShuang: _objLimit['龙双'] ? `1:${_objLimit['龙双'].rate}` : '',
        huShuang: _objLimit['虎双'] ? `1:${_objLimit['虎双'].rate}` : '',
      }
      this.betRate.isCommission = {
        xian: _objLimit['闲'] ? `1:${_objLimit['闲'].rateNoChoushui}` : '',
        zhuang: _objLimit['庄'] ? `1:${_objLimit['庄'].rateNoChoushui}` : '',
        xianDui: _objLimit['闲对'] ? `1:${_objLimit['闲对'].rateNoChoushui}` : '',
        zhuangDui: _objLimit['庄对'] ? `1:${_objLimit['庄对'].rateNoChoushui}` : '',
        he: _objLimit['和'] ? `1:${_objLimit['和'].rateNoChoushui}` : '',
        xingYun: _objLimit['幸运6'] ? `1:${_objLimit['幸运6'].rateNoChoushui}` : '',
        xingYun6: _objLimit['幸运6 + 1'] ? `1:${_objLimit['幸运6 + 1'].rateNoChoushui}` : '',
        long: _objLimit['龙'] ? `1:${_objLimit['龙'].rateNoChoushui}` : '',
        hu: _objLimit['虎'] ? `1:${_objLimit['虎'].rateNoChoushui}` : '',
        longDan: _objLimit['龙单'] ? `1:${_objLimit['龙单'].rateNoChoushui}` : '',
        huDan: _objLimit['虎单'] ? `1:${_objLimit['虎单'].rateNoChoushui}` : '',
        longShuang: _objLimit['龙双'] ? `1:${_objLimit['龙双'].rateNoChoushui}` : '',
        huShuang: _objLimit['虎双'] ? `1:${_objLimit['虎双'].rateNoChoushui}` : '',
      }
    },
    setBothBet(data, total) {
      if (!this.gameType) return;

      // init
      if (!this.bothBet) {
        this.bothBet = (
          this.gameType === 'bjl' ? { zhuang:_defBothItem(), xian:_defBothItem(), he:_defBothItem(), zhuangdui:_defBothItem(), xiandui:_defBothItem(), total:_defBothItem(), } :
          this.gameType === 'lh' ? { long:_defBothItem(), hu:_defBothItem(), he:_defBothItem(), total:_defBothItem(), } :
          false
        )

        if (!this.bothBet) return;
      }

      if (!isObject(data)) return;

      if (Object.keys(data).length < 1 && this.bothBet) {
        for (let i in this.bothBet) {
          this.bothBet[i]._cleanData();
        }
        return;
      }

      for (let i in data) {
        i === '庄' ? this.bothBet.zhuang._setData(data[i].betCount, data[i].betAmount) :
        i === '闲' ? this.bothBet.xian._setData(data[i].betCount, data[i].betAmount) :
        i === '和' ? this.bothBet.he._setData(data[i].betCount, data[i].betAmount) :
        i === '庄对' ? this.bothBet.zhuangdui._setData(data[i].betCount, data[i].betAmount) :
        i === '闲对' ? this.bothBet.xiandui._setData(data[i].betCount, data[i].betAmount) :
        i === '龙' ? this.bothBet.long._setData(data[i].betCount, data[i].betAmount) :
        i === '虎' ? this.bothBet.hu._setData(data[i].betCount, data[i].betAmount) :
        i === '龙单' ? this.bothBet.longdan._setData(data[i].betCount, data[i].betAmount) :
        i === '虎单' ? this.bothBet.hudan._setData(data[i].betCount, data[i].betAmount) :
        i === '龙双' ? this.bothBet.longshuang._setData(data[i].betCount, data[i].betAmount) :
        i === '虎双' ? this.bothBet.hushuang._setData(data[i].betCount, data[i].betAmount) :
        ''
      }

      this.bothBet.total._setData(NaN, total);
    },
    cleanGameFull() {
      if (_startTimmingId) clearInterval(_startTimmingId);
      if (_listenGameInfoId) listenRemove(_listenGameInfoId);
      if (_listenGameingId) listenRemove(_listenGameingId);
      this.gameStatus = '';
      this.gameType = '';
      this.gameShortName = '';
      this.isLive = false;
      this.timming = {
        value: NaN,
        totalTime: NaN,
      };
      this.videoUrl = '';
      this.pokerInfo = {
        bjlXianTotal: NaN,
        bjlZhuangTotal: NaN,
        bjlXian01: false,
        bjlXian02: false,
        bjlXian03: false,
        bjlZhuang01: false,
        bjlZhuang02: false,
        bjlZhuang03: false,

        lhLongTotal: NaN,
        lhHuTotal: NaN,
        lhLong01: false,
        lhHu01: false,
      };
      this.roundInfo = {
        roundNum: NaN,
        slotNum: NaN,
        xianNum: NaN,
        zhuangNum: NaN,
        heNum: NaN,
        xianDuiNum: NaN,
        zhuangDuiNum: NaN,
        longNum: NaN,
        huNum: NaN,
      };
      this.dewListFirst.splice(0, this.dewListFirst.length);
      this.dewListSecond.splice(0, this.dewListSecond.length);
      this.dewListThird.splice(0, this.dewListThird.length);
      this.dewListFourth.splice(0, this.dewListFourth.length);
      this.dewListFifth.splice(0, this.dewListFifth.length);
      this.dewListSixth.splice(0, this.dewListSixth.length);

      this.askDewListFirst.splice(0, this.askDewListFirst.length);
      this.askDewListSecond.splice(0, this.askDewListSecond.length);
      this.askDewListThird.splice(0, this.askDewListThird.length);
      this.askDewListFourth.splice(0, this.askDewListFourth.length);
      this.askDewListFifth.splice(0, this.askDewListFifth.length);
      this.askDewListSixth.splice(0, this.askDewListSixth.length);
      this._setAskPoint(['', '', ''], ['', '', '']);
      // this.winAmount = NaN;
      this.winBetList.splice(0, this.winBetList.length);
      this.winResultDelay = NaN;
      this.limitArea.splice(0, this.limitArea.length);
      this.limitRedTotal.min = NaN;
      this.limitRedTotal.max = NaN;
      this.bothBet = false;
      this.isNoCommissionDesk = false;
      this.betRate = {
        notCommission: {
          xian: '',
          zhuang: '',
          xianDui: '',
          zhuangDui: '',
          he: '',
          long: '',
          hu: '',
          longDan: '',
          huDan: '',
          longShuang: '',
          huShuang: '',
        },
        isCommission: {
          xian: '',
          zhuang: '',
          xianDui: '',
          zhuangDui: '',
          he: '',
          long: '',
          hu: '',
          longDan: '',
          huDan: '',
          longShuang: '',
          huShuang: '',
        },
      };
    },
    async getGameInfo() {
      return new Promise(resolve=> {
        _logStore().addLog('', 'getGameInfo 01');
        _listenGameInfoId = listenAdd('stageInfo', {
          stageId: _deskStore().useDesk,
        }, (event)=> {
          _logStore().addLog('', `getGameInfo 02 ${event.code} ${event.msg}`);
          // console.log('event', JSON.parse(JSON.stringify(event)));
          listenRemove(_listenGameInfoId);
          // if (event.code !== 0) return;
          if (event.code !== 0) {
            event.msg.includes('包台') && (
              window.$msgWithGame('该桌台已包台', 3000),
              setTimeout(()=> {
                this.cleanGameFull();
                _operaStore().cleanOperaFull();
                router.replace('/views/Lobby/Index');
              }, 3000)
            )
            // uni.showModal({
            //   content:event.msg, showCancel:false, confirmText:'知道了',
            //   success:()=> {
            //     const _userStore = new useUserStore();
            //     uni.showLoading({ title:'退出登录' })
            //     _userStore.userLoginOut().then(()=> uni.hideLoading());
            //   }
            // })
            return;
          }

          const _data = event.data;

          const _gameType = { '百':'bjl', '龙':'lh' }[(_data.stageTypeName || _data.stageName).substring(0, 1)] || '';
          _operaStore().initConfigBetList(_gameType);
          _operaStore().initConfigChipsList(Object.keys(_data.betAmountImg).map(f=> ({ value:f, icon:_data.betAmountImg[f] || '' })));
          this._setGameType(_gameType);
          this.gameShortName = _data.stageName;
          this.isLive = isNumber(_data.stageScene) && _data.stageScene === 3;

          this._setBetRate(_data.limitList);

          this.isNoCommissionDesk = _data.freeCommissionPlay === '否';

          // tempcode
          this.videoUrl = _data.flvAddress1;
          // this.videoUrl = `http://192.168.0.102:3000/proxy?url=${_data.flvAddress1}`;
          this.winResultDelay = isNumber(_data.clientDelay) ? _data.clientDelay * 1000 : 0;

          const _limitStr = 'limitRed' in _data ? _data.limitRed.split('-') : [];
          this.limitRedTotal.min = isGetNumber(Number(_limitStr[0]), 0);
          this.limitRedTotal.max = isGetNumber(Number(_limitStr[1]), 0);

          this._setGameStatus(_data.stageState === 1 ? 'stopDesk' : MATCH_GAME_STATUS[_data.playStatus]);

          this._setTimming(_data.betTimeLimit, _data.betStartTime, _data.currentTime);

          _data._front._pokerList.forEach(f=> {
            this.pokerInfo[f._front._pokerInfoCardNameField] = {
              cardName: f.cardName,
            }
            this.gameType === 'bjl'
              ? this.pokerInfo[f._front._pokerInfoTotalField] = ((this.pokerInfo[f._front._pokerInfoTotalField] || 0) + f.cardPoint) % 10
              :
            this.gameType === 'lh'
              ? this.pokerInfo[f._front._pokerInfoTotalField] = f.cardPoint
              :
            ''
          })

          this._setRoundInfo(
            _data.bootsNum,
            _data.paveNum,
            _data._front._roundInfo._totalNum,
            _data._front._roundInfo._xianNum,
            _data._front._roundInfo._zhuangNum,
            _data._front._roundInfo._heNum,
            _data._front._roundInfo._xianDuiNum,
            _data._front._roundInfo._zhuangDuiNum,
            _data._front._roundInfo._longNum,
            _data._front._roundInfo._huNum,
          );

          this.dewListFirst = _data._front._dewListFirst;
          this.dewListSecond = _data._front._dewListSecond;
          this.dewListThird = _data._front._dewListThird;
          this.dewListFourth = _data._front._dewListFourth;
          this.dewListFifth = _data._front._dewListFifth;
          this.dewListSixth = _data._front._dewListSixth;

          _operaStore().replaceAffirmBetList(
            Object.keys(_data.betNoteStats).map(f=> ({
              betNote: _data.betNoteStats[f].betNote,
              betAmount: _data.betNoteStats[f].betAmount,
            }))
          );

          this._setAskPoint(_data.xianAsk, _data.zhuangAsk);

          this._setLimitArea(_data.limitList);

          this.setBothBet((_data.betNoteStatsColorPool?.betNoteStatsMap || {}), _data.betNoteStatsColorPool?.totalScore || 0);

          resolve(true);
        })
      })
    },
    async listenGame() {
      _listenGameingId = listenAdd(`self-gameing-${_deskStore().useDesk}`, {
      }, (event)=> {
        // !['addCard', 'betOrder', 'betOrderStats', 'playerBalance', 'gambleSettle', 'playerBetResult', 'playerBalance', 'readyOpenCards'].includes(event.type) && console.log('gameing', JSON.parse(JSON.stringify(event)));
        // ['addCard'].includes(event.type) && console.log('gameing', event, this.gameType);
        // ['betOrderStats', 'betOrder'].includes(event.type) && console.log('gameing', JSON.parse(JSON.stringify(event)));
        // listenRemove(_listenId);

        const { type, data } = event;

        let _lastStatus = this.gameStatus;
        this._setGameStatus(
          type === 'readyOpenCards' ? (this.gameStatus = 'opening') :
          type === 'gambleSettle' ? (this.gameStatus = 'settlement') :
          type === 'startBet' ? (this.gameStatus = 'timing') :
          type === 'increaseBoots' ? (this.gameStatus = 'shuffle') :
          type === 'cancelGamble' ? (this.gameStatus = 'repeal') :
          type === 'stageStatus'
            ? (
                data.stageState === 1 ? (this.gameStatus = 'stopDesk') :
                data.stageState === 0 ? (this.gameStatus = 'comeStart') :
                this.gameStatus
              )
            :
          this.gameStatus
        );
        if (type === 'startBet' && _lastStatus === 'shuffle') {
          this.dewListFirst.splice(0, this.dewListFirst.length);
          this.dewListSecond.splice(0, this.dewListSecond.length);
          this.dewListThird.splice(0, this.dewListThird.length);
          this.dewListFourth.splice(0, this.dewListFourth.length);
          this.dewListFifth.splice(0, this.dewListFifth.length);
          this.dewListSixth.splice(0, this.dewListSixth.length);
        }

        if (type === 'startBet') { // 开始下注
          if (data.isPrivateIng) {
            window.$msgWithGame('该桌台已包台', 3000);

            if (!data.canJoinPlayerList.includes(_userStore().userName)) {
              setTimeout(()=> {
                this.cleanGameFull();
                _operaStore().cleanOperaFull();
                router.replace('/views/Lobby/Index');
              }, 3000);
              return;
            }
          }

          EventEmitter.emit(VOICE_SEND, 'game-is-start');
          this._setTimming(data.betTimeLimit, data.betStartTime, data.currentTime);
          this._cleanPokerInfo();
          this.bothBet = false;
          this._setRoundInfo(
            data.bootsNum,
            data.paveNum,
            this.roundInfo.totalNum, this.roundInfo.xianNum, this.roundInfo.zhuangNum, this.roundInfo.heNum, this.roundInfo.xianDuiNum, this.roundInfo.zhuangDuiNum, this.roundInfo.longNum, this.roundInfo.huNum,
          );
          _operaStore().replaceAffirmBetList(/*{}*/[]);
          // this.winAmount = NaN;

        } else if (type === 'addCard') { // 录牌
          if (!data.cardName || isNaN(data.cardIndex) || !data.belongName) return;
          if (this.pokerInfo[data._front._pokerInfoCardNameField]) return;
          if (!['opening', 'settlement'].includes(this.gameStatus)) {
            this._setGameStatus('opening');
          }

          this.pokerInfo[data._front._pokerInfoCardNameField] = {
            cardName: data.cardName,
          }
          this.gameType === 'bjl'
            ? this.pokerInfo[data._front._pokerInfoTotalField] = ((this.pokerInfo[data._front._pokerInfoTotalField] || 0) + data.cardPoint) % 10
            :
          this.gameType === 'lh'
            ? this.pokerInfo[data._front._pokerInfoTotalField] = data.cardPoint
            :
          ''

        } else if (type === 'gambleSettle') {
          // EventEmitter.emit(VOICE_SEND, 'game-result-list', data.voiceSrc);
          setTimeout(()=> {
            if (data.stageId.toString() !== _deskStore().useDesk) return;
            EventEmitter.emit(VOICE_SEND, 'game-result-list', data.voiceSrc);
          }, this.winResultDelay);

          this.isNoCommissionDesk && (data.newDewListFirstArr = data.newDewListFirstArr.map(f=> {
            return f.split(',').filter(f=> !f.includes('幸运')).join(',');
          }))

          // this.dewListFirst.push(...data.newDewListFirstArr);
          // this.dewListSecond.push(...data.newDewListSecondArr);
          // this.dewListThird.push(...data.newDewListThirdArr);
          // this.dewListFourth.push(...data.newDewListFourthArr);
          // this.dewListFifth.push(...data.newDewListFifthArr);

          this._setAskPoint(data.xianAsk, data.zhuangAsk);

          this.dewListFirst = data.newDewListFirstArr;
          this.dewListSecond = data.newDewListSecondArr;
          this.dewListThird = data.newDewListThirdArr;
          this.dewListFourth = data.newDewListFourthArr;
          this.dewListFifth = data.newDewListFifthArr;
          this.dewListSixth = data.newDewListSixthArr;

          this._setRoundInfo(
            this.roundInfo.roundNum,
            this.roundInfo.slotNum,
            data._front._roundInfo._totalNum,
            data._front._roundInfo._xianNum,
            data._front._roundInfo._zhuangNum,
            data._front._roundInfo._heNum,
            data._front._roundInfo._xianDuiNum,
            data._front._roundInfo._zhuangDuiNum,
            data._front._roundInfo._longNum,
            data._front._roundInfo._huNum,
          );

          setTimeout(()=> {
            if (data.stageId.toString() !== _deskStore().useDesk) return;
            this.winBetList.push(...data._front._winBetArrs);
            setTimeout(()=> {
              this.winBetList.splice(0, this.winBetList.length);
            }, 8000);
          }, this.winResultDelay);

        } else if (type === 'bet') {  //TODO 这里为下注成功的type
          if (data.code !== 0) return window.$msgWithGame(data.msg, 3000);
          EventEmitter.emit(VOICE_SEND, 'game-bet-success');
          _operaStore().replaceAffirmBetList(data.data.betNoteList);

        } else if (type === 'playerBetResult') {
          _userStore().setBalanceNum(data.playerBalance);
          // this.winAmount = data._front._winAmount; // 由desk.store通知

        } else if (type === 'playerBalance') {
          _userStore().setBalanceNum(data.playerBalance);

        } else if (type === 'increaseBoots') {
          this._setRoundInfo(
            data.bootsNum,
            NaN,
            NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN,
          );

        } else if (type === 'cancelGamble') {
          // data.voiceSrc
          window.$msgWithGame('当前牌局已作废', 3000);
          EventEmitter.emit(VOICE_SEND, 'game-repeal');
          if (_startTimmingId) clearInterval(_startTimmingId);
          this.timming = {
            value: NaN,
            totalTime: NaN,
          };
          this._setRoundInfo(
            data.bootsNum,
            data.paveNum,
            this.roundInfo.totalNum, this.roundInfo.xianNum, this.roundInfo.zhuangNum, this.roundInfo.heNum, this.roundInfo.xianDuiNum, this.roundInfo.zhuangDuiNum, this.roundInfo.longNum, this.roundInfo.huNum,
          );

        } else if (type === 'betNoteStats_colorPool') {
          this.setBothBet((data.betNoteStatsMap || {}), data.totalScore || 0);

        }
      })
    },
    async reqAskPoint(str) {
      if (!str) return;
      const _result = await req_gameAskRoad(_deskStore().useDesk, this.roundInfo.roundNum, /*'庄赢,大'*/str);
      if (!_result.success) return window.$msg(_result.msg, 3000);

      const _data = DtGame.type.askRoute(_result.data);
      this.askDewListFirst.push(..._data.newDewListFirstArr);
      this.askDewListSecond.push(..._data.newDewListSecondArr);
      this.askDewListThird.push(..._data.newDewListThirdArr);
      this.askDewListFourth.push(..._data.newDewListFourthArr);
      this.askDewListFifth.push(..._data.newDewListFifthArr);
      this.askDewListSixth.push(..._data.newDewListSixthArr);
      setTimeout(()=> {
        this.askDewListFirst.splice(0, this.askDewListFirst.length);
        this.askDewListSecond.splice(0, this.askDewListSecond.length);
        this.askDewListThird.splice(0, this.askDewListThird.length);
        this.askDewListFourth.splice(0, this.askDewListFourth.length);
        this.askDewListFifth.splice(0, this.askDewListFifth.length);
        this.askDewListSixth.splice(0, this.askDewListSixth.length);
      }, 3000);
    }
  },
})
