<template>
<view class="body-style">

  <!-- <view title="交易流水" class="top-style" color="#ffffff">
    <view class='back-icon' @tap='_navigateBack'>
      <SvgIcon name='back-lobby' size='24' />
    </view>
    <view class="title-password">交易流水</view>
  </view> -->

  <TheNavbar :title='t("sideList.record")' />

  <view class='tf_top'>
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

    <view class="dateTime-style">
      <picker class="date-style" mode="selector" :range="_dropDownList" @change="_dropDownListChange">
      <view class="picker">
        <view class="picker-style">{{t("bet_rec.current")}}:</view>
        <view class="select-value"><view class="select-value-text">{{_selectedValue}}</view></view>
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

    <template v-if='_selectedValue === "提现记录"'>

      <view class="row-style">
        <view class="list-style">状态：{{ item.status }}</view>
        <view class="list-style">提现金额：{{ item.applyAmount }}</view>
      </view>
      <view class="row-style">
        <view class="list-style-hundred">订单号：{{ item.orderNo }}</view>
      </view>
      <view class="row-style">
        <view class="list-style-hundred">提现时间：{{ item.applyTime }}</view>
      </view>
      <view class="row-style">
        <view class="list-style-hundred">备注：{{ item.remark }}</view>
      </view>
      <view class="row-style">
        <view class="list-style-hundred">
          操作：
          <template v-if='item._oriStatus === 1'>
            <TheButton
              class=''
              :loading='item._loadingRevoke'
              style='background:linear-gradient(to bottom, #890300, #680a0b); border:0; font-size:26rpx; color:white; padding:6rpx 30rpx; border-radius:4rpx; display:inline-block;'
              :taps='_bindRevokeApply.bind(false, index)'
            >
              撤销
            </TheButton>
          </template>
        </view>
      </view>

    </template>
    <template v-else>

      <view class="row-style">
        <view class="list-style">类型：{{ item.type }}</view>
        <view class="list-style">金额：{{ item.amount }}</view>
      </view>
      <view class="row-style">
        <view class="list-style-hundred">交易时间：{{ item.dateTime }}</view>
      </view>
      <view class="row-style">
        <view class="list-style-hundred">交易前余额：{{ item.balanceBefore }}</view>
      </view>
      <view class="row-style">
        <view class="list-style-hundred">交易后余额：{{ item.balanceAfter }}</view>
      </view>

    </template>

  </view>

  <button class="load-style" @click="loadMore">{{ _pageForm.total - _rowsData.length > 0 ?'加载更多':'加载完成' }}</button>

  <TheMsg />
  <TheMsgWithGame />

</view>
</template>
<script setup>
  import {ref} from 'vue';
  import TheButton from '@front/components/TheButton/Index.vue';
  import TheNavbar from '@front/components/TheNavbar/Index.vue';
  import TheMsg from '@front/components/TheMsg.vue';
  import TheMsgWithGame from '@front/components/TheMsgWithGame.vue';
  import { formatAmount } from '@front/utils/tools';
  import { onLoad } from '@dcloudio/uni-app';
  import { req_systemAccountChangeSimpleList, req_userWithdrawalLog } from '@front/services/channel.service';
  // import router from '@front/routers';
  import { autoGetDateRange, autoGetDateRangeAllDay } from '@front/utils/timeline';
  import { useUserStore } from '@front/stores/modules/user.store';
  import { useSystemStore } from '@front/stores/modules/system.store';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
  const userStore = useUserStore(),
        systemStore = useSystemStore()
  ;

  const _show = ref(false),
          _datetimerange = ref(null),
          _betTimeStart = ref(''),
          _betTimeEnd = ref(''),
          _rowsData = ref([]),
          _pageForm = ref({page: 1,line: 2,total: 0}),
          _listData = ref([]),
          mult = ref(null),
          dateTime = ref(''),
          _dropDownList = ref(['全部','上下分','结算', '提现记录']),
          _selectedValue = ref('全部'),
          // _isSelected = ref(null),
          _isSelected = ref('today'),
          // _selectedStyle = ref('background-color: #a98a67;'),
          _selectedStyle = ref('opacity:.6;'),
          _queryloading = ref(false)

  function _closePopup() {
    _show.value = false
  }
    function _dropDownListChange(e){
        _selectedValue.value = _dropDownList.value[e.detail.value]
        _rowsData.value = [];
        _fetchList()
    }
    function _count(e){
        if(e == '全部'){
            return ''
        }
        if(e == '上下分'){
            return '2'
        }
        if(e == '结算'){
            return '1'
        }
        if(e == '提现记录'){
            return '3'
        }
    }
    async function _fetchList(e) {
      // 避免未返回时，多次点击
      if(_queryloading.value) return
      const params = {
       ..._pageForm.value,
       startTime: e==1?_datetimerange.value[0]:_betTimeStart.value + ' 12:00:00',
       endTime: e==1?_datetimerange.value[1]:_betTimeEnd.value + ' 11:59:59',
       status: _count(_selectedValue.value || '全部')
      }

      _queryloading.value = true

      let _startStr = '',
          _endStr
      ;
      if (userStore.agentType === 'creditAgent') {
        _startStr = _isSelected.value ? autoGetDateRange(_isSelected.value)[0] : `${_betTimeStart.value} 00:00:00`;
        _endStr = _isSelected.value ? autoGetDateRange(_isSelected.value)[1] : `${_betTimeEnd.value} 23:59:59`;
      } else {
        _startStr = _isSelected.value ? autoGetDateRangeAllDay(_isSelected.value)[0] : `${_betTimeStart.value} 00:00:00`;
        _endStr = _isSelected.value ? autoGetDateRangeAllDay(_isSelected.value)[1] : `${_betTimeEnd.value} 23:59:59`;
      }

      let _result = false;
      if (params.status === '3') {
        _result = await req_userWithdrawalLog(params.page, params.line, _startStr, _endStr, '');
      } else {
        _result = await req_systemAccountChangeSimpleList(params.page, params.line, _startStr, _endStr, params.status);
      }
      _queryloading.value = false
      if (!_result.success) return;
        _pageForm.value.total = _result.data.total

      if(_result.data.list.length > 0){
        _pageForm.value.total = _result.data.total
        _listData.value = []

        if (params.status === '3') {
          _listData.value = _result.data.list.map(f=> {
            return {
              status: ({ 1:'审核中', 2:'提现成功', 3:'提现失败', 4:'已取消', })[f.status],
              orderNo: f.title,
              applyTime: f.create_time,
              applyAmount: f.amount,
              remark: f.rejectReason || '',
              _id: f.id,
              _oriStatus: f.status,
              _loadingRevoke: false,
            }
          })
        } else {
          _listData.value = _result.data.list.map(f=> {
            const _type = f.operateTypeStr.substring(3);
            return {
              type: _type,
              amount: _type === '下分' ? formatAmount(-f.balanceChangeAmount) : formatAmount(f.balanceChangeAmount),
              dateTime: f.createTime,
              balanceBefore: formatAmount(f.balanceChangeBefore),
              balanceAfter: formatAmount(f.balanceChangeAfter),
            }
          })

        }

        _rowsData.value = _rowsData.value.concat(_listData.value);
        _pageForm.value.page += 1
      }
    }
    function loadMore() {
      if(_pageForm.value.total <= 0 || _pageForm.value.total - _rowsData.value.length <= 0 ) return
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
          _betTimeStart.value = autoGetDateRange(event)[0].slice(0,10)
          _betTimeEnd.value = autoGetDateRange(event)[1].slice(0,10)
          _datetimerange.value = autoGetDateRange(event)
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
                //  //获取上周的最后一天 (周六)
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
        _bindQuery('today')
    })
    defineExpose({
      showChange: () => {
        _show.value = true;
      }
    })

    async function _bindRevokeApply(index) {
      _listData.value[index]._loadingRevoke = true;
      const _result = await systemStore.revokeWithdrawApply(_listData.value[index]._id);
      if (_result) {
        _listData.value[index]._oriStatus = 4;
        _listData.value[index].status = '已取消';
      }
      _listData.value[index]._loadingRevoke = false;
    }
</script>
<style lang='less' src='@front/zstyles/views/Lobby/SideContent/TransactionFlow.less' scoped></style>
