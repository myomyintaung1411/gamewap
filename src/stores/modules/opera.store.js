import { defineStore } from 'pinia';
import { useUserStore } from '@front/stores/modules/user.store';
import { useDeskStore } from '@front/stores/modules/desk.store';
import { useGameStore } from '@front/stores/modules/game.store';
import { isGetString } from '@front/utils/is';
import { emitError } from '@front/utils/jsCode';
import { listenAdd, listenRemove } from '@front/utils/wsManager';
import { isNumber, isArray } from '@front/utils/is';
import { EventEmitter, } from '@front/eventBus/index';
import { VOICE_SEND, } from '@front/eventBus/actions';
import { BET_LIST_BJL, BET_LIST_LH } from '@front/constants';
import i18n from '@front/config/index'   // ✅ import global i18n instance

// const modules = import.meta.glob('@front/assets/icons/*.svg', { eager:true });

let GAME_STORE = null,
    DESK_STORE = null,
    USER_STORE = null
;
const _gameStore = ()=> {
        !GAME_STORE && (GAME_STORE = new useGameStore());
        return GAME_STORE;
      },
      _deskStore = ()=> {
        !DESK_STORE && (DESK_STORE = new useDeskStore());
        return DESK_STORE;
      },
      _userStore = ()=> {
        !USER_STORE && (USER_STORE = new useUserStore());
        return USER_STORE;
      }
;

export const useOperaStore = defineStore({
  id: 'db-opera',
  state: ()=> ({
    lang: i18n.global.locale.value || "zh",
    loading: {
      submitWaitBet: false,
      cancelIsAffirmBet: false,
    },
    chipsBjlEd: 'chip-1000', // bjl-已选筹码
    chipsBjlList: [ // bjl-筹码列表
      // { ident:'chip-100', icon:'chip-100-shallow', valueStr:'100', },
      // { ident:'chip-500', icon:'chip-500-shallow', valueStr:'500', },
      // { ident:'chip-1000', icon:'chip-1000-shallow', valueStr:'1000', },
      // { ident:'chip-2000', icon:'chip-2000-shallow', valueStr:'2000', },
      // { ident:'chip-10000', icon:'chip-10000-shallow', valueStr:'10000', },
      // { ident:'chip-allIn', icon:'chip-allIn', valueStr:'', },
    ],
    betBjlList: [], // bjl-下注区列表
    waitBetList: [],
    affirmBetList: [],
  }),
  getters: {
        // lang: () => i18n.global.locale.value || "zh",

    getWaitBetAmountAll() {
      const _arrList = this.betBjlList.reduce((a,b)=> {
        a[b.ident] = (
          this.waitBetList
            .filter(f=> f.betIdent === b.ident)
            .reduce((aa, bb)=> {
              const _chipItem = this.chipsBjlList.find(f=> f.ident === bb.chipIdent);
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
    getAffirmBetAmountAll() {
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
    getWaitBetAmountNum() { // 获取当前'待下注'金额
      return (
        Object.keys(this.getWaitBetAmountAll).reduce((a,b)=> {
          a += isNaN(this.getWaitBetAmountAll[b]) ? 0 : this.getWaitBetAmountAll[b]
          return a;
        }, 0)
      )
    },
    getAffirmBetAmountNum() { // 获取当前'已下注'金额
      return (
        Object.keys(this.affirmBetList).reduce((a,b)=> {
          a += isNaN(this.affirmBetList[b].amount) ? 0 : this.affirmBetList[b].amount
          return a;
        }, 0)
      )
    },
  },
  actions: {
    initConfigBetList(type) {
      if (type === 'bjl') {
        this.betBjlList.splice(0, this.betBjlList.length, ...BET_LIST_BJL());
      } else if (type === 'lh') {
        this.betBjlList.splice(0, this.betBjlList.length, ...BET_LIST_LH());
      }
    },
    // chipList=[ value:金额, icon:默认网络图片 ]
    // initConfigChipsList(chipList) {
    //   this.chipsBjlList.splice(0, this.chipsBjlList.length);

    //   if (!isArray(chipList)) return;

    //   const _list = [];
    //   for (let i = 0; i < chipList.length; i+=1) {
    //     const _value = Number(chipList[i].value);
    //     if (!isNumber(_value)) continue;

    //     let _icon = `chip-${_value}-shallow`;
    //     !(`/src/assets/icons/${_icon}.svg` in modules) && (
    //       _icon = chipList[i].icon
    //     )

    //     if (!_icon) continue;

    //     _list.push({
    //       ident: `chip-${_value}`,
    //       icon: _icon,
    //       valueStr: `${_value}`,
    //     })
    //   }

    //   _list.push({
    //      ident: 'chip-allIn',
    //      icon: 'chip-allIn',
    //      valueStr: '',
    //   })

    //   this.chipsBjlList.push(..._list);
    // },
    initConfigChipsList(chipList) {
    this.chipsBjlList.splice(0, this.chipsBjlList.length);

    if (!isArray(chipList)) return;

    const userStore = _userStore();
    const baseUrl = userStore.getImageBase; // OSS base URL

    const _list = [];
    for (let i = 0; i < chipList.length; i += 1) {
      const _value = Number(chipList[i].value);
      if (!isNumber(_value)) continue;

      // Construct OSS URL instead of using local assets
      let _icon = `${baseUrl}${this.lang}/icons/chip-${_value}-shallow.svg`;

      // Optional fallback if chip has a custom icon property
      if (!_icon) {
        _icon = `${baseUrl}${this.lang}/icons/${chipList[i].icon}`;
      }

      if (!_icon) continue;

      _list.push({
        ident: `chip-${_value}`,
        icon: _icon,
        valueStr: `${_value}`,
      });
    }

    // Add all-in chip
    _list.push({
      ident: 'chip-allIn',
      icon: `${baseUrl}${this.lang}/icons/chip-allIn.svg`,
      valueStr: '',
    });

    this.chipsBjlList.push(..._list);
  },
    updateChipIcons(newLang) {
      this.lang = newLang;
      const userStore = _userStore();
      const baseUrl = userStore.getImageBase;

      this.chipsBjlList = this.chipsBjlList.map(chip => {
        if (chip.ident === 'chip-allIn') {
          return { ...chip, icon: `${baseUrl}${newLang}/icons/chip-allIn.svg` };
        }

        const match = chip.ident.match(/^chip-(\d+)$/);
        if (match) {
          const value = match[1];
          return { ...chip, icon: `${baseUrl}${newLang}/icons/chip-${value}-shallow.svg` };
        }

        return chip;
      });
    },
    cleanOperaFull() {
      this.loading = {
        submitWaitBet: false,
        cancelIsAffirmBet: false,
      }
      this.betBjlList.splice(0, this.betBjlList.length);
      this.waitBetList.splice(0, this.waitBetList.length);
      this.affirmBetList.splice(0, this.affirmBetList.length);
    },
    setChipsBjlEd(value) {
      this.chipsBjlEd = isGetString(value);
      EventEmitter.emit(VOICE_SEND, 'game-chip-switch');
    },
    // [betIdent=betBjlList.ident]
    addBet(betIdent) {
      if (!betIdent) return;
      if (!this.chipsBjlEd) return;
      if (_gameStore().gameStatus !== 'timing') return;
      if (["bet-longdan", "bet-hudan", "bet-longshuang", "bet-hushuang"].includes(betIdent) && _gameStore().disableBetLhDS) return;

      const _chipItem = this.chipsBjlList.find(f=> f.ident === this.chipsBjlEd);
      if (!_chipItem) return emitError(`Error addBet: miss chipItem ${this.chipsBjlEd}`);

      // if (_chipItem.ident === 'chip-allIn') {

        // 一个押注类型仅允许一个梭哈
        if (
          _chipItem.ident === 'chip-allIn' &&
          this.waitBetList.filter(f=> f.betIdent === betIdent).find(f=> f.chipIdent === _chipItem.ident)
        ) return;

        const _canUseBalance = _userStore().balanceNum - this.getWaitBetAmountNum/* - this.getAffirmBetAmountNum*/;
        if (_canUseBalance <= 0) return window.$msgWithGame('余额不足', 3000);

        const _betItem = this.betBjlList.find(f=> f.ident === betIdent);
        if (!_betItem) return;

        const _isHedgingBet = ['bet-xian', 'bet-zhuang', 'bet-long', 'bet-hu'].includes(betIdent);

        let _limitMaxAmount = NaN;
        const _limitItem = (
          _isHedgingBet
            ? {
                maxAmount: _gameStore().limitRedTotal.max
              }
            : (
                betIdent === 'bet-xingyun'
                  ? _gameStore().limitArea.find(f=> f.name === '闲对')
                  : _gameStore().limitArea.find(f=> f.name === _betItem.nameZh)
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

        const _curBetWaitAmount = betIdent in this.getWaitBetAmountAll ? this.getWaitBetAmountAll[betIdent] : NaN,
              _curBetAffirmAmount = betIdent in this.getAffirmBetAmountAll ? this.getAffirmBetAmountAll[betIdent] : NaN,
              _hedgingUsedAmount = !_isHedgingBet ? 0 : this._getHedgingUsedAmount(betIdent),
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
            chipIdent: this.chipsBjlEd,
            betIdent: betIdent,
            customAmount: _canUseBalance > _curDeskCanBetAmount ? _curDeskCanBetAmount : _canUseBalance,
          })
          EventEmitter.emit(VOICE_SEND, 'game-betting-down');

        } else {
          if (Number(_chipItem.valueStr) > _curDeskCanBetAmount) return window.$msgWithGame(`可投注限额: ${_curDeskCanBetAmount}`, 3000);

          this.waitBetList.push({
            chipIdent: this.chipsBjlEd,
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

      const _otherBetWaitAmount = _otherBetIdent in this.getWaitBetAmountAll ? this.getWaitBetAmountAll[_otherBetIdent] : NaN,
            _otherBetAffirmAmount = _otherBetIdent in this.getAffirmBetAmountAll ? this.getAffirmBetAmountAll[_otherBetIdent] : NaN
      ;

      return (
        (isNaN(_otherBetWaitAmount) ? 0 : _otherBetWaitAmount)
        +
        (isNaN(_otherBetAffirmAmount) ? 0 : _otherBetAffirmAmount)
      );
    },
    // [betIdent=betBjlList.ident]
    removeBet(betIdent) {
      if (!betIdent) return;

      for (let i = 0; i < this.waitBetList.length; i+=1) {
        if (this.waitBetList[i].betIdent !== betIdent) continue;
        this.waitBetList.splice(i, 1);
        i -= 1;
      }
    },
    replaceAffirmBetList(originBetNoteList) {
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
    async submitWaitBet(isCommission) {
      return new Promise(resolve=> {
        this.loading.submitWaitBet = true;
        const _listenId = listenAdd(
          'bet',
          Object.assign(
            {
              stageId: _deskStore().useDesk,
              bootsNum: _gameStore().roundInfo.roundNum,
              paveNum: _gameStore().roundInfo.slotNum,
              list: JSON.stringify(this.waitBetList.map(f=> ({
                // score: this.chipsBjlList.find(ff=> ff.ident === f.chipIdent)?.valueStr || '',
                score: (
                  f.chipIdent === 'chip-allIn' ? f.customAmount.toString() :
                  this.chipsBjlList.find(ff=> ff.ident === f.chipIdent)?.valueStr || ''
                ),
                betNote: this.betBjlList.find(ff=> ff.ident === f.betIdent)?.nameZh || '',
              }))),
              // commission: 0,
              commission: isCommission ? 1 : 0,
              userAgent: (navigator && 'userAgent' in navigator) ? navigator.userAgent : plus.navigator.getUserAgent(),
              deviceId: _userStore().uuid,
              platform: 'pc',
              userId: _userStore().userId,
              isMultiBet: '否',
            },
            this.waitBetList.find(f=> f.chipIdent === 'chip-allIn') ? { soha: 'y', } : {}
          ),
          (event)=> {
            this.loading.submitWaitBet = false;
            listenRemove(_listenId);
            if (event.code !== 0) return window.$msgWithGame(event.msg, 3000);
            window.$msgWithGame(event.msg, 3000);

            this.waitBetList.splice(0, this.waitBetList.length);

            resolve(true);
          }
        )
      })
    },
    // 撤销已确定的下注
    async cancelIsAffirmBet() {
      if (this.affirmBetList.length < 1) return;
      this.loading.cancelIsAffirmBet = true;
      const _listenId = listenAdd('cancelBet', {
        stageId: _deskStore().useDesk,
        bootsNum: _gameStore().roundInfo.roundNum,
        paveNum: _gameStore().roundInfo.slotNum,
      }, (event)=> {
        listenRemove(_listenId);
        this.loading.cancelIsAffirmBet = false;
        if (event.code !== 0) return window.$msgWithGame(event.msg, 3000);

        window.$msgWithGame(event.msg, 3000);
        this.affirmBetList.splice(0, this.affirmBetList.length);
      })
    },
    cancelWaitBet() {
      this.cleanWaitBet();
    },
    cleanWaitBet() {
      this.waitBetList.splice(0, this.waitBetList.length);
    },
  },
})
