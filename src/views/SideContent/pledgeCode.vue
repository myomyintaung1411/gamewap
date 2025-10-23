<template>
<view class="body-style">

  <!-- <view title="押码记录" class="top-style" color="#ffffff">
    <view class='back-icon' @tap='_navigateBack'>
      <SvgIcon name='back-lobby' size='24' />
    </view>
		<view class="title-password">押码记录</view>
	</view> -->

  <TheNavbar :title='t("sideList.bet")' />

  <view class='pc_top'>
    <view class="dateTime-style">
      <picker class="date-style" mode="date" :value="_betTimeStart"  @change="_betTimeStartChange">
        <view class="picker">
          <view class="picker-style">{{t("bet_rec.start")}}:</view><view class="select-style">{{_betTimeStart}}</view>
        </view>
      </picker>
      <picker class="date-style" mode="date" :value="_betTimeEnd"  @change="_betTimeEndChange">
        <view class="picker">
          <view class="picker-style">{{t("bet_rec.end")}}:</view><view class="select-style">{{_betTimeEnd}}</view>
        </view>
      </picker>
    </view>

    <view class="timeData-style">
      <view class="wrap-style"><button class="button-style" :style="_isSelected == 'today'?_selectedStyle:''" @click="_bindQuery('today')">{{t("lobby.date_t")}}</button></view>
      <view class="wrap-style"><button class="button-style" :style="_isSelected == 'yesterday'?_selectedStyle:''" @click="_bindQuery('yesterday')">{{t("lobby.date_y")}}</button></view>
      <view class="wrap-style"><button class="button-style" :style="_isSelected == 'thisweek'?_selectedStyle:''" @click="_bindQuery('thisweek')">{{t("lobby.date_tw")}}</button></view>
      <view class="wrap-style"><button class="button-style" :style="_isSelected == 'laseweek'?_selectedStyle:''" @click="_bindQuery('laseweek')">{{t("lobby.date_lw")}}</button></view>
      <view class="wrap-style"><button class="button-style" :style="_isSelected == 'thismonth'?_selectedStyle:''" @click="_bindQuery('thismonth')">{{t("lobby.date_tm")}}</button></view>
    </view>
  </view>

  <!--  -->
  <view v-for="(item, index) in _rowsData" :key="index" class="listData-style">
    <view class="row-style">
      <view class="list-style-row">台桌：{{ item.deskNo }} 局:{{ item.chessboard }} 口:{{ item.opening }}</view>
    </view>
     <view class="row-style">
      <view class="list-style-hundred">投注：{{ item.downNum }}</view>
    </view>
     <view class="row-style">
      <view class="list-style-hundred">下注时间：{{ item.betTime }}</view>
    </view>
     <view class="row-style">
      <view class="list-style">类型：{{ item.openType }}</view>
      <view class="list-style">洗码量：{{ item.washNum }}</view>
    </view>
    <view class="row-style">
      <view class="list-style">盈利：{{ item.winJet }}</view>
      <view class="list-style">余额：{{ item.currentBalance }}</view>
    </view>
  </view>

  <button class="load-style" @click="loadMore">{{ _pageForm.total - _rowsData.length > 0 ?'加载更多':'加载完成' }}</button>

  <view class="bottom-total-style">
    <view class="bottom-total-left">{{t("lobby.total")}}</view>
    <view class="bottom-total-right">{{t("lobby.profit")}}:{{_totalData.totalAmt || 0}}&nbsp;&nbsp;&nbsp;{{t("lobby.washNum")}}:{{_totalData.totalWashCodeAmount || 0}}</view>
  </view>

</view>
</template>
<script setup>
import { ref, } from 'vue';
import TheNavbar from '@front/components/TheNavbar/Index.vue';
import { req_userJoinLog } from '@front/services/game.service';
import { formatAmount } from '@front/utils/tools';
import { onLoad } from '@dcloudio/uni-app';
// import router from '@front/routers';
import { autoGetDateRange, autoGetDateRangeAllDay, formatDateTime } from '@front/utils/timeline';
import { useUserStore } from '@front/stores/modules/user.store';
import { listenStart, listenConnectEd, } from '@front/utils/wsManager';
import { useDeskStore } from '@front/stores/modules/desk.store';
import { useSystemStore } from '@front/stores/modules/system.store';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const userStore = useUserStore(),
      deskStore = useDeskStore(),
      systemStore = useSystemStore()
;

const _show = ref(false),
        _datetimerange = ref(null),
        _betTimeStart = ref(''),
        _betTimeEnd = ref(''),
        _rowsData = ref([]),
        _pageForm = ref({page: 1,line: 2,total: 0}),
        _listData = ref([]),
        _totalData = ref({}),
        mult = ref(null),
        dateTime = ref(''),
        // _isSelected = ref(null),
        _isSelected = ref('today'),
        // _selectedStyle = ref('background-color: #a98a67;'),
        _selectedStyle = ref('opacity:.6;'),
        _queryloading = ref(false)


function _closePopup() {
	_show.value = false
}
  async function _fetchList(e) {
     if(_queryloading.value) return
     const params = {
      ..._pageForm.value,
      startTime: e==1?_datetimerange.value[0]:_betTimeStart.value +' 12:00:00',
      endTime: e==1?_datetimerange.value[1]:_betTimeEnd.value + ' 11:59:59',
      status: ''
     }
     _queryloading.value = true

     // let _result = false;
     // if (userStore.agentType === 'cashAgent') {
     //  const [ _startStr, _endStr ] = autoGetDateRangeAllDay(_isSelected.value);
     //  _result =  await req_userJoinLog(params.page, params.line, _startStr, _endStr, params.status)
     // } else {
     //  _result =  await req_userJoinLog(params.page, params.line, params.startTime, params.endTime, params.status)
     // }
    let _startStr = '',
        _endStr
    ;
    if (userStore.agentType === 'creditAgent') {
      _startStr = /*autoGetDateRange*/_isSelected.value ? autoGetDateRangeAllDay(_isSelected.value)[0] : `${_betTimeStart.value} 00:00:00`;
      _endStr = /*autoGetDateRange*/_isSelected.value ? autoGetDateRangeAllDay(_isSelected.value)[1] : `${_betTimeEnd.value} 23:59:59`;
    } else {
      _startStr = _isSelected.value ? autoGetDateRangeAllDay(_isSelected.value)[0] : `${_betTimeStart.value} 00:00:00`;
      _endStr = _isSelected.value ? autoGetDateRangeAllDay(_isSelected.value)[1] : `${_betTimeEnd.value} 23:59:59`;
    }
    const _result =  await req_userJoinLog(params.page, params.line, _startStr, _endStr, params.status);

     _queryloading.value = false
     if (!_result.success) return;
     _totalData.value = _result.data
      _pageForm.value.total = _result.data.total
     if(_result.data.list.length > 0){
          _listData.value = []
          _listData.value = _result.data.list.map(f=> {
              const [,, round, slot] = f.sameGame.split('_');
              return {
                deskNo: f.title,
                slot: `第${round}局 第${slot}口`,
                chessboard: round,
                opening: slot,
                dateTime: f.create_time,
                downNum: f.betNote.replace(/_/g, ","),
                // downNum: f.betNote.split('_'),
                openType: f.status_info,
                balanceNum: `${formatAmount(f.winJet)} / ${formatAmount(f.currentBalance)}`,
                currentBalance: `${formatAmount(f.currentBalance)}`,
                winJet: `${formatAmount(f.winJet)}`,
                washNum: f.washCodeAmount,
                betTime: f.create_time ? formatDateTime(new Date(f.create_time)) : '',
                _winJet: f.winJet,
              }
          })
          _rowsData.value = _rowsData.value.concat(_listData.value);
          _pageForm.value.page += 1
     }
  }
  function loadMore() {
    if(_pageForm.value.total <= 0 || _pageForm.value.total - _rowsData.value.length <= 0) return
      _fetchList();
  }
  // function _navigateBack(){
  //     // uni.navigateTo({
  //     //     url: '/views/Lobby/Index'
  //     // })
  //     router.back();
  // }
  // 
  function _betTimeStartChange(e){
      const StartDate  = new Date(e.detail.value).getTime()
      const EndDate = new Date(_betTimeEnd.value).getTime();
      
      if(StartDate >= EndDate){
          window.$msg('开始日期不能大于或等于结束日期',2000);
          _betTimeStart.value = ''
          return
      }
      _betTimeStart.value = e.detail.value
      if(_betTimeEnd.value && _betTimeStart.value){
          _isSelected.value = '';
          _pageForm.value.page = 1
          _pageForm.value.line = 10
          _rowsData.value = []
          _fetchList()
      }
  }
  function _betTimeEndChange(e){
      const StartDate  =  new Date(_betTimeStart.value).getTime()
      const EndDate = new Date(e.detail.value).getTime();
      if(StartDate >= EndDate){
          window.$msg('结束日期不能小于或等于开始日期',2000);
          _betTimeEnd.value = ''
          return
      }
      _betTimeEnd.value = e.detail.value
      if(_betTimeEnd.value && _betTimeStart.value){
          _isSelected.value = '';
          _pageForm.value.page = 1
          _pageForm.value.line = 10
          _rowsData.value = []
          _fetchList()
      }
  }
  function _bindQuery(event){
      _isSelected.value = event
      if (userStore.agentType === 'creditAgent') {
        _betTimeStart.value = /*autoGetDateRange*/autoGetDateRangeAllDay(event)[0].slice(0,10)
        _betTimeEnd.value = /*autoGetDateRange*/autoGetDateRangeAllDay(event)[1].slice(0,10)
        _datetimerange.value = /*autoGetDateRange*/autoGetDateRangeAllDay(event)
      } else {
        _betTimeStart.value = autoGetDateRangeAllDay(event)[0].slice(0,10)
        _betTimeEnd.value = autoGetDateRangeAllDay(event)[1].slice(0,10)
        _datetimerange.value = autoGetDateRangeAllDay(event)
      }

      // 全新获取
      _pageForm.value.page = 1
      _pageForm.value.line = 10
      _rowsData.value = []
      _fetchList(1)
  }
 function search_time_d (event) {
      let now = new Date();
      let year = '';
      let month = '';
      let day = '';
      _isSelected.value = event
      switch (parseInt(event)) {
          case 1: //今日
              year = now.getFullYear();
              month = now.getMonth() + 1 ;
              day = now.getDate();
              // _betTimeStart.value = `${year}-${month}-${day} 00:00:00`
              // _betTimeEnd.value = `${year}-${month}-${day} 23:59:59`
              _betTimeStart.value = `${year}-${month>9?month:'0'+month}-${day}`
              _betTimeEnd.value = `${year}-${month>9?month:'0'+month}-${day}`
              break;
          case 2: //昨日
              now.setDate(now.getDate() - 1);
              year = now.getFullYear()
              month = now.getMonth() + 1
              day = now.getDate()
              _betTimeStart.value = `${year}-${month>9?month:'0'+month}-${day} `
              _betTimeEnd.value = `${year}-${month>9?month:'0'+month}-${day} `
              break;
          case 3: //本周
              //获取 本周第一天、本周最后一天
              let date = new Date();
              let start = new Date(date.getTime() - (3600 * 1000 * 24 * (date.getDay() == 0 ? 6 : date
                  .getDay() - 1)))
              let end = new Date(date.getTime() + (3600 * 1000 * 24 * (date.getDay() == 8 ? 0 : 7 - date
                  .getDay())))
              _betTimeStart.value =
                  `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`
              _betTimeEnd.value = `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()} `
              break;
          case 4: //上周

              // 获取本周的第一天(周日)
              let firstDayofWeek = new Date(now.setDate(now.getDate() - now.getDay()));
              // 获取本周的最后一天 (周六)
              let lastDayofleek = new Date(now.setDate(now.getDate() - now.getDay() + 6));

              // 获取上周的第一天 (周日)
              let firstDayoflastleek = new Date(firstDayofWeek.setDate(firstDayofWeek.getDate() - 6));
              // 	//获取上周的最后一天 (周六)
              let lastDayofLastleek = new Date(lastDayofleek.setDate(lastDayofleek.getDate() - 7));


              year = firstDayoflastleek.getFullYear();
              month = firstDayoflastleek.getMonth() + 1;
              day = firstDayoflastleek.getDate();
              _betTimeStart.value = `${year}-${month>9?month:'0'+month}-${day} `

              year = lastDayofLastleek.getFullYear();
              month = lastDayofLastleek.getMonth() + 1;
              day = lastDayofLastleek.getDate() + 1;

              _betTimeEnd.value = `${year}-${month>9?month:'0'+month}-${day} `
              break;
          case 5: //本月
              // 获取本月的第一天
              let firstDayofMonth = new Date(now.getFullYear(), now.getMonth(), 1);
              // 获取本月的最后一天
              let lastDayofMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

              year = firstDayofMonth.getFullYear();
              month = firstDayofMonth.getMonth() + 1;
              day = firstDayofMonth.getDate();
              _betTimeStart.value = `${year}-${month>9?month:'0'+month}-${day} `

              year = lastDayofMonth.getFullYear();
              month = lastDayofMonth.getMonth() + 1;
              day = lastDayofMonth.getDate();

              _betTimeEnd.value = `${year}-${month>9?month:'0'+month}-${day} `

              break;
          case 6: //上月

              //获取上月的第一天
              let firstDayofLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
              // /获取上月的最后一天
              let lastDayofLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);


              year = firstDayofLastMonth.getFullYear();
              month = firstDayofLastMonth.getMonth() + 1;
              day = firstDayofLastMonth.getDate();
              _betTimeStart.value = `${year}-${month>9?month:'0'+month}-${day} `

              year = lastDayofLastMonth.getFullYear();
              month = lastDayofLastMonth.getMonth() + 1;
              day = lastDayofLastMonth.getDate();

              _betTimeEnd.value = `${year}-${month>9?month:'0'+month}-${day} `
              break;
      }

      _datetimerange.value = [_betTimeStart.value, _betTimeEnd.value]
      
      // 全新获取
      _pageForm.value.page = 1
      _pageForm.value.line = 10
      _rowsData.value = []
      _fetchList()
  }
  onLoad((event)=> {
    // search_time_d(1)
    // _bindQuery('today');

    listenStart();
    listenConnectEd(async ()=> {
      _bindQuery('today');

      if (deskStore.list.length < 1) {
        deskStore.initList().then(()=>
          deskStore.listFlow()
        );
        userStore.updateUserInfo();
        userStore.flowUserBalance();
        systemStore.updateNoticeList();
      }
    });
  })
  defineExpose({
  	showChange: () => {
  		_show.value = true;
  	}
  })
</script>

<style lang='less' src='@front/zstyles/views/Lobby/SideContent/pledgeCode.less' scoped></style>