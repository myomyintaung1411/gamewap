import { defineStore } from 'pinia';
import { useDeskStore } from '@front/stores/modules/desk.store';
import { useGameStore } from '@front/stores/modules/game.store';
import { useSystemStore } from '@front/stores/modules/system.store';
import { localSet, localGet, } from '@front/utils/localStorage';
import { sessionSet, sessionGet, } from '@front/utils/sessionStorage';
import { genUUID, formatAmount } from '@front/utils/tools';
import { isGetNumber, isGetBoolean } from '@front/utils/is';
import { listenAdd, listenRemove, listenStop } from '@front/utils/wsManager';
import { req_userLoginout } from '@front/services/login.service';
import router from '@front/routers';

let GAME_STORE = null,
		DESK_STORE = null,
		SYSTEM_STORE = null
;
const _gameStore = () => {
				!GAME_STORE && (GAME_STORE = new useGameStore());
				return GAME_STORE;
			},
			_deskStore = () => {
				!DESK_STORE && (DESK_STORE = new useDeskStore());
				return DESK_STORE;
			},
			_systemStore = ()=> {
        !SYSTEM_STORE && (SYSTEM_STORE = new useSystemStore());
        return SYSTEM_STORE;
      }
;

export const useUserStore = defineStore({
	id: 'db-user',
	state: () => ({
		imageBase:"https://bx1buk.oss-accelerate.aliyuncs.com/h5pt/",
		uuid: genUUID(19),
		token: sessionGet('token') || '',
		userId: sessionGet('userId') || '',
		 lang: localGet('l') || "zh",
		userName: '',
		balanceNum: NaN,
		loading: {
			loginOut: false,
		},
		isFirstLogin: false,
		hasWithdrawPass: false,
		agentType: '', // 代理模式 [creditAgent=信用模式, cashAgent=点击模式]
		isTrialUser: false, // is 试玩账号
	}),
	getters: {
		    getImageBase(){
      return this.imageBase
    },
		    getLang(){
		return this.lang
		},
		getUserId() {
			return this.userId;
		},
		getBalanceStr() {
			return isNaN(this.balanceNum) ? '' : formatAmount(this.balanceNum);
		},
	},
	actions: {
		    setLang(value){
			this.lang = value
			localSet('l',value)
			},
		/**
		 * @param {Object} value {token, userId}
		 */
		setLoginInfo(value = {}) {
			this.token = value.token || '';
			this.userId = value.userId || '';
			this.isFirstLogin = value.isFirstLogin || false;
			sessionSet('token', this.token);
			sessionSet('userId', this.userId);
		},
		setBalanceNum(value) {
			this.balanceNum = isGetNumber(value, this.balanceNum);
		},
		setHasWithdrawPass(value) {
      this.hasWithdrawPass = isGetBoolean(value, false);
    },
		cleanUserFull() {
			this.setLoginInfo({});
			this.userName = '';
			this.balanceNum = NaN;
			this.loading = {
				loginOut: false,
			};
			// this.isFirstLogin = false;
			this.setLoginInfo({});
			this.hasWithdrawPass = false;
			this.agentType = '';
			this.isTrialUser = false;
		},
		updateUserInfo() {
			const _listenId = listenAdd(
				'userInfo',
				{
					route: ({ 'test':'0', 'netcom':'1', 'telecom':'2', 'other':'3' })[_systemStore().netWorkEd] || '',
          frontVersion: import.meta.env.VITE_VERSION,
				},
				(event) => {
					listenRemove(_listenId);
					if (event.code !== 0) return;

					this.userName = event.data.username;
					this.balanceNum = event.data.balance;
					this.hasWithdrawPass = isGetBoolean(event.data.iswithdrawalPassword, false);
					this.isTrialUser = event.data.userType === 'unreal_user';
					this.agentType = ({
            credit_agent: 'creditAgent',
            cash_agent: 'cashAgent',
          })[event.data.agentType] || '';

					_systemStore().setOnlineServicesUrl(event.data.kefuUrl || '');
				}
			)
		},
		async userLoginOut() {
			this.loading.loginOut = true;
			const _result = await req_userLoginout();
			this.loading.loginOut = false;
			// if (!_result.success) return window.$msg(_result.msg, 3000);
			listenStop(false, true);
			this.cleanUserFull();
			_deskStore().cleanDeskFull();
			_gameStore().cleanGameFull();
			if (_result.msg && _result.msg !== 'token已失效' && _result.msg !== 'token不能为空') {
				// window.$msg(_result.msg);
				uni.showToast({
					title: _result.msg,
					icon: 'error',
					duration: 1200
				})
			}
			router.replace('/');
		},
		flowUserBalance() {
      listenAdd(
        'self-userBalanceFlow',
        {},
        (event)=> {
          const { data } = event;

          this.setBalanceNum(data.playerBalance);

          // this.userName = event.data.username;
          // this.balanceNum = event.data.balance;
          // this.hasWithdrawPass = isGetBoolean(event.data.iswithdrawalPassword, false);
          // this.agentType = ({
          //   credit_agent: 'creditAgent',
          //   cash_agent: 'cashAgent',
          // })[event.data.agentType] || '';
        }
      )
    },
	},
})