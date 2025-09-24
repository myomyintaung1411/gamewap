import { defineStore } from 'pinia';
import { listenAdd, listenRemove } from '@front/utils/wsManager';
import DtDesk from '@front/dataTrans/DtDesk.dt';
import { useGameStore } from '@front/stores/modules/game.store';
import { useUserStore } from '@front/stores/modules/user.store';
import { useOperaStore } from '@front/stores/modules/opera.store';
import { useSystemStore } from '@front/stores/modules/system.store';
import { getTimmingNum } from '@front/utils/timeline';
import { isGetNumber, } from '@front/utils/is';
import { EventEmitter, } from '@front/eventBus/index';
import { VOICE_SEND, } from '@front/eventBus/actions';
import router from '@front/routers';
import { listenStop } from '@front/utils/wsManager';

let GAME_STORE = null,
		USER_STORE = null,
		OPERA_STORE = null,
    SYSTEM_STORE = null
;

const _gameStore = () => {
				!GAME_STORE && (GAME_STORE = new useGameStore());
				return GAME_STORE;
			},
			_userStore = ()=> {
        !USER_STORE && (USER_STORE = new useUserStore());
        return USER_STORE;
      },
      _operaStore = ()=> {
        !OPERA_STORE && (OPERA_STORE = new useOperaStore());
        return OPERA_STORE;
      },
      _systemStore = ()=> {
        !SYSTEM_STORE && (SYSTEM_STORE = new useSystemStore());
        return SYSTEM_STORE;
      }
;

let _tipLoginOutIng = false;

export const useDeskStore = defineStore({
	id: 'db-desk',
	state: () => ({
		loading: false,
		list: [],
		useDesk: '', // list.deskId
		isFlowIng: false,
		page: 1,
    pageSize: 7,
    queryType: '',
    hasNext: false,
    queryMulti: '',
	}),
	getters: {
		getDeskName() {
			const _fIndex = this.list.findIndex(f => f.deskId === this.useDesk);
			if (_fIndex < 0) return '';
			return (
				this.list[_fIndex].deskTypeName === '百家乐' ? `bjl${_fIndex + 1}` :
				this.list[_fIndex].deskTypeName === '龙虎' ? `lh${_fIndex + 1}` :
				''
			)
		}
	},
	actions: {
		setQueryType(value) {
			if (!['', '百家乐', '龙虎'].includes(value)) return;
			if (value === this.queryType) return;

			this.queryType = value;
		},
		switchQueryList(delayGetList, queryType) {
			if (queryType === this.queryType) return;

			this.setQueryType(queryType);
			setTimeout(()=> {
				this.initList();
			}, delayGetList || 0)
		},
		setQueryMulti(value) {
      if (!['', 'y', 'n'].includes(value)) return;

      this.queryMulti = value;
    },
		cleanList() {
			this.list.splice(0, this.list.length);
		},
		cleanDeskFull() {
			this.loading = false;
			this.list.splice(0, this.list.length);
			this.useDesk = '';
			this.isFlowIng = false;
      this.page = 1;
      this.pageSize = 7;
      this.queryType = '';
      this.queryMulti = '';
      this.hasNext = false;
		},
		async initList() {
			return new Promise(resolve => {
				this.loading = true;
				this.hasNext = false;
				this.page = 1;
				this.pageSize = 7;
				this.list.splice(0, this.list.length);

				const _listenId = listenAdd('stageList', {
					// gameTypeId: '',
					// maxId: 0,
					pageNum: this.page,
          pageSize: _userStore().isPhoneBet ? 50 : this.pageSize,
          stageTypeName: this.queryType,
          multiStage: this.queryMulti,
				}, (event) => {
					listenRemove(_listenId);
					this.loading = false;
					if (event.code !== 0) return;

					this.hasNext = (this.list.length + event.data.list.length) < event.data.total;
					this.list = event.data.list.map(f => DtDesk.normal(f));
					this.list.forEach((f, i) => {
						this._setTimming(
							f,
							event.data.list[Number(i)].betTimeLimit,
							event.data.list[Number(i)].betStartTime,
							event.data.list[Number(i)].currentTime,
						);
					});
					!this.useDesk && (this.useDesk = this.list[0].deskId);
					resolve(true);
				})
			})
		},
		async updateList() {
      if (!this.hasNext) return;
      return new Promise(resolve=> {
        this.loading = true;
        const _listenId = listenAdd('stageList', {
          // gameTypeId: '',
          // maxId: 0,
          pageNum: this.page += 1,
          pageSize: this.pageSize,
          stageTypeName: this.queryType,
          multiStage: this.queryMulti,
        }, (event)=> {
          listenRemove(_listenId);
          this.loading = false;
          if (event.code !== 0) return;

          this.hasNext = (this.list.length + event.data.list.length) < event.data.total;
          const _list = event.data.list.map(f=> DtDesk.normal(f));
          _list.forEach((f,i)=> {
            this._setTimming(
              f,
              event.data.list[Number(i)].betTimeLimit,
              event.data.list[Number(i)].betStartTime,
              event.data.list[Number(i)].currentTime,
            );
          })
          this.list = this.list.concat(_list);
          resolve(true);
        })
      })
    },
		_setTimming(listItem, totalCount, startTime, executedTime) {
			listItem.timming.value = getTimmingNum(totalCount, startTime, executedTime);
			listItem.timming.totalTime = isGetNumber(totalCount, NaN);
			this._startTimmingCount(listItem);
		},
		_startTimmingCount(listItem) {
			if (isNaN(listItem.timming.value)) return;
			if (listItem.timming.value <= 1) {
				listItem.timming.value = 0;
				return;
			}
			if (listItem.timming.timmingId) clearInterval(listItem.timming.timmingId);

			listItem.timming.timmingId = setInterval(() => {
				listItem.timming.value -= 1;

				if (listItem.timming.value <= 0) {
					clearInterval(listItem.timming.timmingId);
				}
			}, 1000);
		},
		async listFlow() {
			if (this.isFlowIng) return;
			_tipLoginOutIng = false;

			this.isFlowIng = true;
			listenAdd('self-stageFlow', {
				gameTypeId: '',
				maxId: 0,
				pageNum: 10,
				pageSize: 1,
			}, (event) => {

				const { type,data } = event;

				if (type === 'changeGameStatus') {
					// !['addCard', 'betOrder', 'betOrderStats', 'playerBalance', 'gambleSettle', 'playerBetResult', 'playerBalance', 'readyOpenCards'].includes(event.type) && console.log('status', event.data, data.stageId || '--');
					const _listItem = this.list.find(f => f.deskId === data.stageId.toString());
					if (!_listItem) return;

					const _lastStatus = _listItem.gameStatus;
					_listItem.gameStatus = data.gameStatus;

					if (_listItem.gameStatus === 'timing' && _lastStatus === 'shuffle') {
						_listItem.dewList.dewListFirst.splice(0, _listItem.dewList.dewListFirst.length);
						_listItem.dewList.dewListSecond.splice(0, _listItem.dewList.dewListSecond.length);
						_listItem.dewList.dewListThird.splice(0, _listItem.dewList.dewListThird.length);
						_listItem.dewList.dewListFourth.splice(0, _listItem.dewList.dewListFourth.length);
						_listItem.dewList.dewListFifth.splice(0, _listItem.dewList.dewListFifth.length);
						_listItem.dewList.dewListSixth.splice(0, _listItem.dewList.dewListSixth.length);
					}

					if (_listItem.gameStatus === 'opening') {
            _listItem.waitBetList.splice(0, _listItem.waitBetList.length);
          }

				} else if (type === 'startBet') {
					const _listItem = this.list.find(f => f.deskId === data.stageId.toString());
					if (!_listItem) return;

					this._setTimming(
						_listItem,
						data.betTimeLimit,
						data.betStartTime,
						data.currentTime,
					);
					_listItem.deskRoundNum = data.bootsNum;
					_listItem.deskSlotNum = data.paveNum;
					_listItem.replaceAffirmBetList([]);

					_listItem.isPrivateIng = data.isPrivateIng;

          _listItem.pokerInfo = {
            bjlXianTotal:NaN, bjlZhuangTotal:NaN,
            bjlXian01:false, bjlXian02:false, bjlXian03:false, bjlZhuang01:false, bjlZhuang02:false, bjlZhuang03:false,

            lhLongTotal:NaN, lhHuTotal:NaN,
            lhLong01:false, lhHu01:false,
          };

				} else if (type === 'gambleSettle') {
					const _listItem = this.list.find(f => f.deskId === data.stageId.toString());
					if (!_listItem) return;

					_listItem.deskTotalNum = data._front._roundInfo._totalNum;
          _listItem.deskXianNum = data._front._roundInfo._xianNum;
          _listItem.deskZhuangNum = data._front._roundInfo._zhuangNum;
          _listItem.deskHeNum = data._front._roundInfo._heNum;
          _listItem.deskXianDuiNum = data._front._roundInfo._xianDuiNum;
          _listItem.deskZhuangDuiNum = data._front._roundInfo._zhuangDuiNum;
          _listItem.deskLongNum = data._front._roundInfo._longNum;
          _listItem.deskHuNum = data._front._roundInfo._huNum;

          _listItem.isNoCommissionDesk && (data.newDewListFirstArr = data.newDewListFirstArr.map(f=> {
            return f.split(',').filter(f=> !f.includes('幸运')).join(',');
          }))

					// _listItem.dewList.dewListFirst.push(...data.newDewListFirstArr);
					// _listItem.dewList.dewListSecond.push(...data.newDewListSecondArr);
					// _listItem.dewList.dewListThird.push(...data.newDewListThirdArr);
					// _listItem.dewList.dewListFourth.push(...data.newDewListFourthArr);
					// _listItem.dewList.dewListFifth.push(...data.newDewListFifthArr);
					_listItem.dewList.dewListFirst = data.newDewListFirstArr;
					_listItem.dewList.dewListSecond = data.newDewListSecondArr;
					_listItem.dewList.dewListThird = data.newDewListThirdArr;
					_listItem.dewList.dewListFourth = data.newDewListFourthArr;
					_listItem.dewList.dewListFifth = data.newDewListFifthArr;
					_listItem.dewList.dewListSixth = data.newDewListSixthArr;

					// setTimeout(()=> {
            _listItem.winBetList.push(...data._front._winBetArrs);
            setTimeout(()=> {
              _listItem.winBetList.splice(0, _listItem.winBetList.length);
            }, 8000);
          // }, this.winResultDelay);

				} else if (type === 'cancelGamble') {
					const _listItem = this.list.find(f => f.deskId === data.stageId.toString());
					if (!_listItem) return;

					if (_listItem.timming.timmingId) {
						clearInterval(_listItem.timming.timmingId);
						_listItem.timming.value = NaN;
						_listItem.timming.totalTime = NaN;
					}

					_listItem.deskRoundNum = data.bootsNum;
					_listItem.deskSlotNum = data.paveNum;

				} else if (type === 'playerBetResult') {
					setTimeout(
            ()=> {
              data._front._winAmount > 0 && EventEmitter.emit(VOICE_SEND, 'game-win');
            },
            (
              data.stageId.toString() === this.useDesk
                ? ( isNaN(_gameStore().winResultDelay) ? (0 + 1000) : (_gameStore().winResultDelay + 1000) ) // 此处ws接受比game-win-result快, 手动延迟1000ms
                : 0
            )
          );

					_gameStore().setWinAmount(data._front._winAmount);

				} else if (type === 'bet') {  //TODO 这里为下注成功的type
          if (data.code !== 0) return window.$msgWithGame(data.msg, 3000);
          // EventEmitter.emit(VOICE_SEND, 'game-bet-success');
          const _listItem = this.list.find(f=> f.deskId === data.data.stageId.toString());
          if (!_listItem) return;

          _listItem.replaceAffirmBetList(data.data.betNoteList);

        } else if (type === 'addCard') { // 录牌
          const _listItem = this.list.find(f=> f.deskId === data.stageId.toString());
          if (!_listItem) return;

          if (!data.cardName || isNaN(data.cardIndex) || !data.belongName) return;
          if (_listItem.pokerInfo[data._front._pokerInfoCardNameField]) return;
          if (!['opening', 'settlement'].includes(_listItem.gameStatus)) {
            // _listItem._setGameStatus('opening');
            _listItem.gameStatus = 'opening';
          }

          _listItem.pokerInfo[data._front._pokerInfoCardNameField] = {
            cardName: data.cardName,
          }
          _listItem.deskTypeIdent === 'bjl'
            ? _listItem.pokerInfo[data._front._pokerInfoTotalField] = ((_listItem.pokerInfo[data._front._pokerInfoTotalField] || 0) + data.cardPoint) % 10
            :
          _listItem.deskTypeIdent === 'lh'
            ? _listItem.pokerInfo[data._front._pokerInfoTotalField] = data.cardPoint
            :
          ''

        } else if (type === 'withdraw_audit') {
          return window.$msg(data.msg, 3000);

        } else if (type === 'logout') {
					if (_tipLoginOutIng) return;

					/*_tipLoginOutIng = true;
					uni.showModal({
						content: event.data.msg,
						showCancel: false,
						confirmText: '知道了',
						success: function(res) {
							const _userStore = new useUserStore();
							uni.showLoading({
								title: '退出登录'
							})
							_userStore.userLoginOut().then(() => {
								uni.hideLoading()
								_tipLoginOutIng = false;
							});
						}
					})*/

					_tipLoginOutIng = true;
					listenStop(false, true);
					_userStore().cleanUserFull();
					_gameStore().cleanGameFull();
          _operaStore().cleanOperaFull();
          this.cleanDeskFull();
          router.replace('/');
          event.data.msg && uni.showModal({
						content: event.data.msg,
						showCancel: false,
						confirmText: '知道了',
					})
					setTimeout(()=> {
						_tipLoginOutIng = false;
					}, 1000);

					/*_tipLoginOutIng = true;
					const _userStore = new useUserStore();
					uni.showLoading({ title:'退出登录' })
					_userStore.userLoginOut().then(()=> {
						uni.hideLoading();
						_tipLoginOutIng = false;

						uni.showModal({
							content: event.data.msg,
							showCancel: false,
							confirmText: '知道了',
							// success: function(res) {
							// }
						})
					});*/

					// uni.showToast({
					// 	title: event.data.msg,
					// 	icon: 'none',
					// 	duration: 1200
					// })
					// setTimeout(() => {
					// 	const _userStore = new useUserStore();
					// 	// window.$loading(true, '退出登录');
					// 	uni.showLoading({
					// 		title: '退出登录'
					// 	})
					// 	_userStore.userLoginOut().then(() => {
					// 		uni.hideLoading()
					// 		// window.$loading(false);
					// 		_tipLoginOutIng = false;
					// 	});
					// }, 1200)

				} else if (type === 'user_return_stage_list') {
          // _systemStore().setLobbyFilter('');
          _gameStore().cleanGameFull();
          _operaStore().cleanOperaFull();
          router.replace('/views/Lobby/Index');

          // return window.$dialogue(data.msg);
          uni.showModal({
						content: data.msg || '返回大厅',
						showCancel: false,
						confirmText: '知道了',
						success: function() {}
					})
          return;

        } else if (type === 'privateStage') {
          const _listItem = this.list.find(f=> f.deskId === data.stageId.toString());
          if (!_listItem) return;

          _listItem.isPrivateIng = (data.privateStage || '') === '是';
          _listItem.canJoinPrivate = (data.privateStagePlayer || '').split(',').includes(_userStore().userName);

        }
			})
		},
		switchUseDesk(value) {
			if (value === this.useDesk) return;
			this.useDesk = value;
		}
	},
})