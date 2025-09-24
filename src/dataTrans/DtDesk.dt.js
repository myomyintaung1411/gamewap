import { isString, isGetString, isNumber, isGetNumber, isGetArray, } from '@front/utils/is';
import { BET_LIST_BJL, BET_LIST_LH } from '@front/constants';
import { useOperaStore } from '@front/stores/modules/opera.store';
import { useUserStore } from '@front/stores/modules/user.store';
import { EventEmitter, } from '@front/eventBus/index';
import { VOICE_SEND, } from '@front/eventBus/actions';
import { listenAdd, listenRemove } from '@front/utils/wsManager';
import { req_gameAskRoad } from '@front/services/game.service';
import DtGame from '@front/dataTrans/DtGame.dt';
import { getLastContinuousNumber } from '@front/utils/tools';

let OPERA_STORE = null,
    USER_STORE = null
;

const _operaStore = ()=> {
        !OPERA_STORE && (OPERA_STORE = new useOperaStore());
        return OPERA_STORE;
      },
      _userStore = ()=> {
        !USER_STORE && (USER_STORE = new useUserStore());
        return USER_STORE;
      }
;

const _ep = {

  _getWaitBetAmountAll() {
    const _chipsBjlList = _operaStore().chipsBjlList;

    const _arrList = this.betBjlList.reduce((a,b)=> {
      a[b.ident] = (
        this.waitBetList
          .filter(f=> f.betIdent === b.ident)
          .reduce((aa, bb)=> {
            const _chipItem = _chipsBjlList.find(f=> f.ident === bb.chipIdent);
            aa = (isNaN(aa) ? 0 : Number(aa)) + (
              _chipItem.ident === 'chip-allIn' ? (isNaN(bb.customAmount) ? 0 : bb.customAmount) :
              Number(_chipItem.valueStr)
            )
            return aa;
          }, NaN)
      )
      return a;
    }, {})
    return _arrList;
  },

  _getWaitBetAmountNum() {
    const __getWaitBetAmountAll = this.getWaitBetAmountAll();
    return (
      Object.keys(__getWaitBetAmountAll).reduce((a,b)=> {
        a += isNaN(__getWaitBetAmountAll[b]) ? 0 : __getWaitBetAmountAll[b]
        return a;
      }, 0)
    )
  },

  _getAffirmBetAmountAll() {
    return (
      this.betBjlList.reduce((a,b)=> {
        a[b.ident] = (
          this.affirmBetList
            .filter(f=> f.betIdent === b.ident)
            .reduce((aa, bb)=> {
              aa = (isNaN(aa) ? 0 : Number(aa)) + Number(bb.amount);
              return aa;
            }, NaN)
        )
        return a;
      }, {})
    )
  },

  // 获取对冲的另一项目已占用金额 [curBetIdent=当前项目标识]
  _getHedgingUsedAmount(curBetIdent) {
    if (!curBetIdent) return 0;

    const _otherBetIdent = ({
      'bet-xian': 'bet-zhuang',
      'bet-zhuang': 'bet-xian',
      'bet-long': 'bet-hu',
      'bet-hu': 'bet-long',
    }[curBetIdent])
    if (!_otherBetIdent) return 0;

    const __getWaitBetAmountAll = this.getWaitBetAmountAll(),
          __getAffirmBetAmountAll = this.getAffirmBetAmountAll()
    ;

    const _otherBetWaitAmount = _otherBetIdent in __getWaitBetAmountAll ? __getWaitBetAmountAll[_otherBetIdent] : NaN,
          _otherBetAffirmAmount = _otherBetIdent in __getAffirmBetAmountAll ? __getAffirmBetAmountAll[_otherBetIdent] : NaN
    ;

    return (
      (isNaN(_otherBetWaitAmount) ? 0 : _otherBetWaitAmount)
      +
      (isNaN(_otherBetAffirmAmount) ? 0 : _otherBetAffirmAmount)
    );
  },

  _addBet(betIdent, chipsBjlEd) {
    if (!betIdent) return;
    if (!chipsBjlEd) return;
    if ((this.gameStatus !== 'timing' || this.timming.value === 0) || this.isPrivateIng) return;
    if (['bet-longdan', 'bet-hudan', 'bet-longshuang', 'bet-hushuang'].includes(betIdent) && this.disableBetLhDS()) return;

    const _chipsBjlList = _operaStore().chipsBjlList;

    const _chipItem = _chipsBjlList.find(f=> f.ident === chipsBjlEd);
    if (!_chipItem) return emitError(`Error addBet: miss chipItem ${chipsBjlEd}`);

    // if (_chipItem.ident === 'chip-allIn') {

      // 一个押注类型仅允许一个梭哈
      if (
        _chipItem.ident === 'chip-allIn' &&
        this.waitBetList.filter(f=> f.betIdent === betIdent).find(f=> f.chipIdent === _chipItem.ident)
      ) return;

      const _canUseBalance = _userStore().balanceNum - this.getWaitBetAmountNum()/* - this.getAffirmBetAmountNum*/;
      if (_canUseBalance <= 0) return window.$msgWithGame('余额不足', 3000);

      const _betItem = this.betBjlList.find(f=> f.ident === betIdent);
      if (!_betItem) return;

      const _isHedgingBet = ['bet-xian', 'bet-zhuang', 'bet-long', 'bet-hu'].includes(betIdent);

      let _limitMaxAmount = NaN;
      const _limitItem = (
        _isHedgingBet
          ? {
              maxAmount: this.limitAreaStr.max
            }
          : (
              betIdent === 'bet-xingyun'
                ? this.limitArea.find(f=> f.name === '闲对')
                : this.limitArea.find(f=> f.name === _betItem.nameZh)
            )
      );
      // 异常 获取不到'最大限红'数据
      if (!_limitItem || !isNumber(_limitItem.maxAmount)) {
        // this.waitBetList.push({
        //   chipIdent: this.chipsBjlEd,
        //   betIdent: betIdent,
        //   customAmount: _canUseBalance,
        // })
        return;
      }
      _limitMaxAmount = _limitItem.maxAmount;

      const __getWaitBetAmountAll = this.getWaitBetAmountAll(),
            __getAffirmBetAmountAll = this.getAffirmBetAmountAll()
      ;

      const _curBetWaitAmount = betIdent in __getWaitBetAmountAll ? __getWaitBetAmountAll[betIdent] : NaN,
            _curBetAffirmAmount = betIdent in __getAffirmBetAmountAll ? __getAffirmBetAmountAll[betIdent] : NaN,
            _hedgingUsedAmount = !_isHedgingBet ? 0 : this.getHedgingUsedAmount(betIdent),
            _curDeskCanBetAmount = (
              !_isHedgingBet
                ? (
                    _limitMaxAmount -
                      (isNaN(_curBetWaitAmount) ? 0 : _curBetWaitAmount) -
                        (isNaN(_curBetAffirmAmount) ? 0 : _curBetAffirmAmount)
                  )
                : (
                    _limitMaxAmount -
                      (isNaN(_curBetWaitAmount) ? 0 : _curBetWaitAmount) -
                        (isNaN(_curBetAffirmAmount) ? 0 : _curBetAffirmAmount) /*-*/+
                          (_hedgingUsedAmount)
                  )
            )
      ;
      if (_canUseBalance <= 0 || _curDeskCanBetAmount <= 0) return;

      if (_chipItem.ident === 'chip-allIn') {
        this.waitBetList.push({
          chipIdent: chipsBjlEd,
          betIdent: betIdent,
          customAmount: _canUseBalance > _curDeskCanBetAmount ? _curDeskCanBetAmount : _canUseBalance,
        })
        EventEmitter.emit(VOICE_SEND, 'game-betting-down');

      } else {
        if (Number(_chipItem.valueStr) > _curDeskCanBetAmount) return window.$msgWithGame(`可投注限额: ${_curDeskCanBetAmount}`, 3000);

        this.waitBetList.push({
          chipIdent: chipsBjlEd,
          betIdent: betIdent,
          customAmount: NaN,
        })
        EventEmitter.emit(VOICE_SEND, 'game-betting-down');
      }
    // } else {
    //   this.waitBetList.push({
    //     chipIdent: this.chipsBjlEd,
    //     betIdent: betIdent,
    //     customAmount: NaN,
    //   })
    // }
  },

  _removeBet(betIdent) {
    if (!betIdent) return;

    for (let i = 0; i < this.waitBetList.length; i+=1) {
      if (this.waitBetList[i].betIdent !== betIdent) continue;
      this.waitBetList.splice(i, 1);
      i -= 1;
    }
  },

  _replaceAffirmBetList(originBetNoteList) {
    if (!originBetNoteList || originBetNoteList.length < 1) {
      this.affirmBetList.splice(0, this.affirmBetList.length);
      return;
    }
    this.affirmBetList = (originBetNoteList || []).reduce((a,b)=> {
      const _betItem = this.betBjlList.find(f=> f.nameZh === b.betNote);
      if (!_betItem) return a;
      a.push({
        amount: b.betAmount,
        betIdent: _betItem.ident,
      })
      return a;
    }, []);
  },

  async _submitWaitBet(isCommission) {
    return new Promise(resolve=> {
      this.loading.submitWaitBet = true;

      const _chipsBjlList = _operaStore().chipsBjlList;

      const _listenId = listenAdd(
        'bet',
        Object.assign(
          {
            stageId: this.deskId,
            bootsNum: this.deskRoundNum,
            paveNum: this.deskSlotNum,
            list: JSON.stringify(this.waitBetList.map(f=> ({
              // score: this.chipsBjlList.find(ff=> ff.ident === f.chipIdent)?.valueStr || '',
              score: (
                f.chipIdent === 'chip-allIn' ? f.customAmount.toString() :
                _chipsBjlList.find(ff=> ff.ident === f.chipIdent)?.valueStr || ''
              ),
              betNote: this.betBjlList.find(ff=> ff.ident === f.betIdent)?.nameZh || '',
            }))),
            // commission: 0,
            commission: isCommission ? 1 : 0,
            userAgent: (navigator && 'userAgent' in navigator) ? navigator.userAgent : plus.navigator.getUserAgent(),
            deviceId: _userStore().uuid,
            platform: 'pc',
            userId: _userStore().userId,
            isMultiBet: '是',
          },
          this.waitBetList.find(f=> f.chipIdent === 'chip-allIn') ? { soha: 'y', } : {}
        ),
        (event)=> {
          this.loading.submitWaitBet = false;
          listenRemove(_listenId);
          if (event.code !== 0) return window.$msgWithGame(event.msg, 3000);
          window.$msg(event.msg, 3000);

          this.waitBetList.splice(0, this.waitBetList.length);

          resolve(true);
        }
      )
    })
  },

  async _cancelIsAffirmBet() {
    if (this.affirmBetList.length < 1) return;
    this.loading.cancelIsAffirmBet = true;
    const _listenId = listenAdd('cancelBet', {
      stageId: this.deskId,
      bootsNum: this.deskRoundNum,
      paveNum: this.deskSlotNum,
    }, (event)=> {
      listenRemove(_listenId);
      this.loading.cancelIsAffirmBet = false;
      if (event.code !== 0) return window.$msgWithGame(event.msg, 3000);

      window.$msgWithGame(event.msg, 3000);
      this.affirmBetList.splice(0, this.affirmBetList.length);
    })
  },

  _cancelWaitBet() {
    this.waitBetList.splice(0, this.waitBetList.length);
  },

  async _reqAskPoint(str) {
    if (!str) return;
    const _result = await req_gameAskRoad(this.deskId, this.deskRoundNum, str);
    if (!_result.success) return window.$msg(_result.msg, 3000);

    const _data = DtGame.type.askRoute(_result.data);
    this.dewList.askDewListFirst.push(..._data.newDewListFirstArr);
    this.dewList.askDewListSecond.push(..._data.newDewListSecondArr);
    this.dewList.askDewListThird.push(..._data.newDewListThirdArr);
    this.dewList.askDewListFourth.push(..._data.newDewListFourthArr);
    this.dewList.askDewListFifth.push(..._data.newDewListFifthArr);
    this.dewList.askDewListSixth.push(..._data.newDewListSixthArr);
    setTimeout(()=> {
      this.dewList.askDewListFirst.splice(0, this.dewList.askDewListFirst.length);
      this.dewList.askDewListSecond.splice(0, this.dewList.askDewListSecond.length);
      this.dewList.askDewListThird.splice(0, this.dewList.askDewListThird.length);
      this.dewList.askDewListFourth.splice(0, this.dewList.askDewListFourth.length);
      this.dewList.askDewListFifth.splice(0, this.dewList.askDewListFifth.length);
      this.dewList.askDewListSixth.splice(0, this.dewList.askDewListSixth.length);
    }, 3000);
  },

  _getSelfStatus() {
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

  _setBetRate(originLimitList) {
    const _objLimit = originLimitList.reduce((a,b)=> {
      a[b.name] = b;
      return a;
    }, {})
    return {
      notCommission: {
        xian: _objLimit['闲'] ? `1:${_objLimit['闲'].rate}` : '',
        zhuang: _objLimit['庄'] ? `1:${_objLimit['庄'].rate}` : '',
        xianDui: _objLimit['闲对'] ? `1:${_objLimit['闲对'].rate}` : '',
        zhuangDui: _objLimit['庄对'] ? `1:${_objLimit['庄对'].rate}` : '',
        he: _objLimit['和'] ? `1:${_objLimit['和'].rate}` : '',
        xingYun: _objLimit['幸运6'] ? `1:${_objLimit['幸运6'].rate}` : '',
        xingYun6: _objLimit['幸运6 + 1'] ? `1:${_objLimit['幸运6 + 1'].rate}` : '',
        long: _objLimit['龙'] ? `1:${_objLimit['龙'].rate}` : '',
        hu: _objLimit['虎'] ? `1:${_objLimit['虎'].rate}` : '',
      },
      isCommission: {
        xian: _objLimit['闲'] ? `1:${_objLimit['闲'].rateNoChouShui}` : '',
        zhuang: _objLimit['庄'] ? `1:${_objLimit['庄'].rateNoChouShui}` : '',
        xianDui: _objLimit['闲对'] ? `1:${_objLimit['闲对'].rateNoChouShui}` : '',
        zhuangDui: _objLimit['庄对'] ? `1:${_objLimit['庄对'].rateNoChouShui}` : '',
        he: _objLimit['和'] ? `1:${_objLimit['和'].rateNoChouShui}` : '',
        xingYun: _objLimit['幸运6'] ? `1:${_objLimit['幸运6'].rateNoChouShui}` : '',
        xingYun6: _objLimit['幸运6 + 1'] ? `1:${_objLimit['幸运6 + 1'].rateNoChouShui}` : '',
        long: _objLimit['龙'] ? `1:${_objLimit['龙'].rateNoChouShui}` : '',
        hu: _objLimit['虎'] ? `1:${_objLimit['虎'].rateNoChouShui}` : '',
      }
    }
  },

  _disableBetLhDS() {
    return !isNaN(this.deskSlotNum) && this.deskSlotNum > 30;
  },

  normal(data) {
    const _limitStr = 'limitRed' in data ? data.limitRed.split('-') : [],
          _deskTypeIdent = { '百':'bjl', '龙':'lh', }[(data.stageTypeName || data.stageName).substring(0, 1)] || '',

          _riTotalItem = data.gambleResultCount?.find(f=> f.name === '总数'),
          _riXianItem = data.gambleResultCount?.find(f=> f.name === '闲'),
          _riZhuangItem = data.gambleResultCount?.find(f=> f.name === '庄'),
          _riHeItem = data.gambleResultCount?.find(f=> f.name === '和'),
          _riXianDuiItem = data.gambleResultCount?.find(f=> f.name === '闲对'),
          _riZhuangDuiItem = data.gambleResultCount?.find(f=> f.name === '庄对'),
          _riLongItem = data.gambleResultCount?.find(f=> f.name === '龙'),
          _riHuItem = data.gambleResultCount?.find(f=> f.name === '虎'),

          _askXianArr = Array.from(
            { length:3 },
            (f,i)=> (
              (isGetArray(data.xianAsk) ? data.xianAsk : [])[i] || ''
            )
          ),
          _askZhuangArr = Array.from(
            { length:3 },
            (f,i)=> (
              (isGetArray(data.zhuangAsk) ? data.zhuangAsk : [])[i] || ''
            )
          ),
          _limitArea = (
            (data.limitList || [])
            .filter(f=> ['闲', '闲对', '和', '庄', '庄对', '龙', '虎'].includes(f.name))
            .map(f=> ({
              minAmount: isGetNumber(f.min, NaN),
              maxAmount: isGetNumber(f.max, NaN),
              name: isGetString(f.name, ''),
            }))
          )
    ;

    const _revData = {
      loading: {
        submitWaitBet: false,
        cancelIsAffirmBet: false,
      },

      deskId: isNumber(data.stageId) ? data.stageId.toString() : '', // 桌台ID
      deskTypeIdent: _deskTypeIdent || '--', // 桌台类型名称
      deskTypeName: ({ // 桌台类型名称
        // 'baijiale': '百家乐',
        // 'longhu': '龙虎',
        '百': '百家乐',
        '龙': '龙虎',
      }[(data.stageTypeName || data.stageName).substring(0, 1)] || '--'),
      // deskNo: Number(data./* gameName */stageName.substring(1)), // 桌台编号
      // deskNo: Number(getLastContinuousNumber(data.stageName)), // 桌台编号
      deskShortName: data.stageName || '',
      deskRoundNum: data.bootsNum,
      deskSlotNum: data.paveNum,

      deskTotalNum: _riTotalItem ? _riTotalItem.num : NaN,
      deskXianNum: _riXianItem ? _riXianItem.num : NaN,
      deskZhuangNum: _riZhuangItem ? _riZhuangItem.num : NaN,
      deskHeNum: _riHeItem ? _riHeItem.num : NaN,
      deskXianDuiNum: _riXianDuiItem ? _riXianDuiItem.num : NaN,
      deskZhuangDuiNum: _riZhuangDuiItem ? _riZhuangDuiItem.num : NaN,
      deskLongNum: _riLongItem ? _riLongItem.num : NaN,
      deskHuNum: _riHuItem ? _riHuItem.num : NaN,
      isPrivateIng: data.privateStage === '是',
      canJoinPrivate: data.privateStageOpen === '是',

      isNoCommissionDesk: data.freeCommissionPlay === '否',

      videoUrl: data.flvAddress1,
      videoMiniUrl: data.flvAddress2,

      betBjlList: _deskTypeIdent === 'bjl' ? BET_LIST_BJL() : (_deskTypeIdent === 'lh' ? BET_LIST_LH() : []),
      waitBetList: [],
      affirmBetList: [],

      betAmountImg: data.betAmountImg,

      winBetList: [],

      betRate: this._setBetRate(data.limitList || []),

      pokerInfo: {
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

      askPointXian: [
        _askXianArr[0],
        _askXianArr[1],
        _askXianArr[2],
      ],
      askPointZhuang: [
        _askZhuangArr[0],
        _askZhuangArr[1],
        _askZhuangArr[2],
      ],

      dewList: {
        dewListFirst: data._front._dewListFirst,
        dewListSecond: data._front._dewListSecond,
        dewListThird: data._front._dewListThird,
        dewListFourth: data._front._dewListFourth,
        dewListFifth: data._front._dewListFifth,
        dewListSixth: data._front._dewListSixth,

        askDewListFirst: [],
        askDewListSecond: [],
        askDewListThird: [],
        askDewListFourth: [],
        askDewListFifth: [],
        askDewListSixth: [],
      },
      gameStatus: data._front._gameStatus,
      timming: {
        timmingId: '',
        value: NaN,
        totalTime: NaN,
      },
      // limitAreaStr: data.limitList.length > 0 ? `${data.limitList[0].min}-${data.limitList[0].max}` : '??-??'
      limitAreaStr: {
        min: isGetNumber(Number(_limitStr[0]), 0),
        max: isGetNumber(Number(_limitStr[1]), 0),
      },
      limitArea: _limitArea,
      isLive: isNumber(data.stageScene) && data.stageScene === 3,
      isGood: isString(data.goodRoadName),
      goodTitle: isGetString(data.goodRoadName, ''),

      addBet: this._addBet,
      getWaitBetAmountAll: this._getWaitBetAmountAll,
      getWaitBetAmountNum: this._getWaitBetAmountNum,
      getAffirmBetAmountAll: this._getAffirmBetAmountAll,
      getHedgingUsedAmount: this._getHedgingUsedAmount,
      removeBet: this._removeBet,
      submitWaitBet: this._submitWaitBet,
      replaceAffirmBetList: this._replaceAffirmBetList,
      cancelIsAffirmBet: this._cancelIsAffirmBet,
      cancelWaitBet: this._cancelWaitBet,
      reqAskPoint: this._reqAskPoint,
      getSelfStatus: this._getSelfStatus,
      disableBetLhDS: this._disableBetLhDS,
    }

    _revData.replaceAffirmBetList(
      Object.keys(data.betNoteStats || {}).map(f=> ({
        betNote: data.betNoteStats[f].betNote,
        betAmount: data.betNoteStats[f].betAmount,
      }))
    )

    return _revData;
  }

}

export default _ep;
