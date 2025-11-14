<template>
  <view class="records-page">

    <!-- 顶部导航 -->
    <TheNavbar :title="activeTab === 'bet' ? t('sideList.bet') : t('sideList.record')" />

    <!-- Sticky：Tabs + 筛选区（对齐你的截图风格——左对齐，层级感） -->
    <view class="sticky">

      <!-- 顶部Tab -->
      <view class="top-tabs">
        <view :class="['top-tab', activeTab==='bet' && 'is-active']" @tap="switchTab('bet')">
          押码记录
          <view class="underline" v-if="activeTab==='bet'"></view>
        </view>
        <view :class="['top-tab', activeTab==='flow' && 'is-active']" @tap="switchTab('flow')">
          交易流水
          <view class="underline" v-if="activeTab==='flow'"></view>
        </view>

        <!-- <view class="top-close" @tap="goBack">×</view> -->
      </view>

      <!-- 面板 -->
      <view class="panel">

        <!-- 交易类型（仅交易流水显示） -->
        <view v-if="activeTab==='flow'" class="row">
          <text class="row-title">交易类型</text>
          <view class="seg">
            <view
              v-for="k in _dropDownList"
              :key="k"
              :class="['seg-item', _selectedValue===k && 'on']"
              @tap="_selectedValue = k"
            >
              {{ k }}
            </view>
          </view>
        </view>

        <!-- 日期快捷（两页一致） -->
        <view class="row" style="margin-top: 30rpx;">
          <text class="row-title">日期</text>
          <view class="seg">
            <view :class="['seg-item', _isSelected==='today' && 'on']"     @tap="_bindQuery('today')">{{t("lobby.date_t")}}</view>
            <view :class="['seg-item', _isSelected==='yesterday' && 'on']" @tap="_bindQuery('yesterday')">{{t("lobby.date_y")}}</view>
            <view :class="['seg-item', _isSelected==='thisweek' && 'on']"  @tap="_bindQuery('thisweek')">{{t("lobby.date_tw")}}</view>
            <view :class="['seg-item', _isSelected==='laseweek' && 'on']"  @tap="_bindQuery('laseweek')">{{t("lobby.date_lw")}}</view>
            <view :class="['seg-item', _isSelected==='thismonth' && 'on']" @tap="_bindQuery('thismonth')">{{t("lobby.date_tm")}}</view>
          </view>
        </view>

        <view class="row actions">
          <button class="btn primary" :loading="_queryloading" @tap="doQuery">查询</button>
          <button class="btn ghost" :disabled="_queryloading" @tap="doReset">重置</button>
        </view>
      </view>
    </view>

    <!-- 内容滚动区 -->
    <scroll-view scroll-y class="scroll">

      <!-- 押码记录 列表 -->
      <template v-if="activeTab==='bet'">
        <view v-for="(item, index) in _rowsData" :key="'b'+index" class="card">
          <view class="card-date">{{ (item.betTime||'').slice(0,10) }}</view>
          <view class="line">台桌：{{ item.deskNo }}</view>
          <view class="line">局口：{{ item.chessboard }} / {{ item.opening }}</view>
          <view class="line">下注时间：{{ item.betTime }}</view>
          <view class="line">投注：{{ item.downNum }}</view>
          <view class="line">开牌类型：{{ item.openType }}</view>
          <view class="line">盈利/余额：{{ item.winJet }} / {{ item.currentBalance }}</view>
          <view class="line">洗码量：{{ item.washNum }}</view>
        </view>
      </template>

      <!-- 交易流水 列表 -->
      <template v-else>
        <view v-for="(item, index) in _rowsData" :key="'f'+index" class="card">
          <!-- 提现记录 -->
          <template v-if="_selectedValue==='提现记录'">
            <view class="card-date">{{ (item.applyTime||'').slice(0,10) }}</view>
            <view class="line">状态：{{ item.status }}</view>
            <view class="line">提现金额：{{ item.applyAmount }}</view>
            <view class="line">订单号：{{ item.orderNo }}</view>
            <view class="line">提现时间：{{ item.applyTime }}</view>
            <view class="line">备注：{{ item.remark }}</view>
            <view class="line">
              <button v-if="item._oriStatus===1" class="btn danger"
                      :loading="item._loadingRevoke"
                      @tap="_bindRevokeApply(index)">撤销</button>
            </view>
          </template>
          <!-- 普通流水 -->
          <template v-else>
            <view class="card-date">{{ (item.dateTime||'').slice(0,10) }}</view>
            <view class="line">类型：{{ item.type }}</view>
            <view class="line">金额：{{ item.amount }}</view>
            <view class="line">交易时间：{{ item.dateTime }}</view>
            <view class="line">交易前余额：{{ item.balanceBefore }}</view>
            <view class="line">交易后余额：{{ item.balanceAfter }}</view>
          </template>
        </view>
      </template>

      <view v-if="!_queryloading && _rowsData.length===0" class="empty">暂无数据</view>

      <!-- 底部分页（同截图） -->
      <view class="pager">
        <view class="pg-btn" :class="{disabled: _queryloading || _pageForm.page<=1}" @tap="goPrev"> 上一页</view>
        <view class="pg-index">{{ _pageForm.page }} / {{ totalPages }}</view>
        <view class="pg-btn" :class="{disabled: _queryloading || _pageForm.page>=totalPages}" @tap="goNext">下一页 </view>
      </view>

      <!-- 押码记录合计条（如需显示） -->
      <view v-if="activeTab==='bet'" class="bottom-total-style">
        <view class="bottom-total-left">{{t("lobby.total")}}</view>
        <view class="bottom-total-right">
          {{t("lobby.profit")}}:{{_totalData.totalAmt || 0}}
          &nbsp;&nbsp;&nbsp;
          {{t("lobby.washNum")}}:{{_totalData.totalWashCodeAmount || 0}}
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import TheNavbar from '@front/components/TheNavbar/Index.vue'
import TheButton from '@front/components/TheButton/Index.vue' // 用于交易流水撤销按钮风格（可选）
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@front/stores/modules/user.store'
import { useSystemStore } from '@front/stores/modules/system.store'
import { useDeskStore } from '@front/stores/modules/desk.store'
import { listenStart, listenConnectEd } from '@front/utils/wsManager'

import { req_userJoinLog } from '@front/services/game.service'
import { req_systemAccountChangeSimpleList, req_userWithdrawalLog } from '@front/services/channel.service'

import { autoGetDateRange, autoGetDateRangeAllDay, formatDateTime } from '@front/utils/timeline'
import { formatAmount } from '@front/utils/tools'

const { t } = useI18n()
const userStore = useUserStore()
const systemStore = useSystemStore()
const deskStore = useDeskStore()

/** Tabs */
const activeTab = ref('bet')  // 'bet' | 'flow'

/** 公共筛选（与原页一致：仅快捷日期，不做独立日期选择框） */
const _isSelected = ref('today') // today|yesterday|thisweek|laseweek|thismonth

/** 交易流水额外筛选 */
const _dropDownList = ref(['全部','上下分','结算', '提现记录'])
const _selectedValue = ref('全部')

/** 列表 & 分页 */
const _rowsData = ref([])
const _listData = ref([])
const _totalData = ref({})
const _pageForm = ref({ page: 1, line: 10, total: 0 })
const _queryloading = ref(false)

/* 计算页数 */
const totalPages = computed(() => Math.max(1, Math.ceil((_pageForm.value.total || 0) / (_pageForm.value.line || 10))))

/* —— API 拉取 —— */
async function fetchBetList(rangeByQuick) {
  if (_queryloading.value) return
  _queryloading.value = true

  const fn = userStore.agentType === 'creditAgent' ? autoGetDateRangeAllDay : autoGetDateRangeAllDay
  const [s, e] = fn(rangeByQuick)
  const res = await req_userJoinLog(_pageForm.value.page, _pageForm.value.line, s, e, '')
  _queryloading.value = false
  if (!res?.success) return

  _totalData.value = res.data
  _pageForm.value.total = res.data.total || 0

  const list = (res.data.list || []).map(f => {
    const [,, round, slot] = f.sameGame.split('_')
    const dt = f.create_time ? formatDateTime(new Date(f.create_time)) : ''
    return {
      deskNo: f.title,
      chessboard: round,
      opening: slot,
      downNum: f.betNote.replace(/_/g, ','),
      openType: f.status_info,
      currentBalance: formatAmount(f.currentBalance),
      winJet: formatAmount(f.winJet),
      washNum: f.washCodeAmount,
      betTime: dt,
      _winJet: f.winJet
    }
  })

  _rowsData.value = list
}

async function fetchFlowList(rangeByQuick) {
  if (_queryloading.value) return
  _queryloading.value = true

  const credit = userStore.agentType === 'creditAgent'
  const fn = credit ? autoGetDateRange : autoGetDateRangeAllDay
  const [s, e] = fn(rangeByQuick)

  const mapStatus = { '全部':'', '上下分':'2', '结算':'1', '提现记录':'3' }
  const status = mapStatus[_selectedValue.value] ?? ''
  let res = null

  if (status === '3') {
    res = await req_userWithdrawalLog(_pageForm.value.page, _pageForm.value.line, s, e, '')
  } else {
    res = await req_systemAccountChangeSimpleList(_pageForm.value.page, _pageForm.value.line, s, e, status)
  }

  _queryloading.value = false
  if (!res?.success) return

  _pageForm.value.total = res.data.total || 0
  const list = (res.data.list || []).map(f => {
    if (status === '3') {
      return {
        status: ({1:'审核中',2:'提现成功',3:'提现失败',4:'已取消'})[f.status],
        orderNo: f.title,
        applyTime: f.create_time,
        applyAmount: f.amount,
        remark: f.rejectReason || '',
        _id: f.id,
        _oriStatus: f.status,
        _loadingRevoke: false,
        _withdraw: true
      }
    } else {
      const _type = f.operateTypeStr.substring(3)
      return {
        type: _type,
        amount: _type === '下分' ? formatAmount(-f.balanceChangeAmount) : formatAmount(f.balanceChangeAmount),
        dateTime: f.createTime,
        balanceBefore: formatAmount(f.balanceChangeBefore),
        balanceAfter: formatAmount(f.balanceChangeAfter),
        _withdraw: false
      }
    }
  })

  _rowsData.value = list
}

/* —— 统一操作 —— */
async function _fetchList() {
  if (activeTab.value === 'bet') {
    await fetchBetList(_isSelected.value)
  } else {
    await fetchFlowList(_isSelected.value)
  }
}

function _bindQuery(key) {
  _isSelected.value = key
  _pageForm.value.page = 1
  _rowsData.value = []
  _fetchList()
}

function doQuery() {
  _pageForm.value.page = 1
  _rowsData.value = []
  _fetchList()
}

function doReset() {
  _selectedValue.value = '全部'
  _isSelected.value = 'today'
  _pageForm.value.page = 1
  _rowsData.value = []
  _fetchList()
}

function goPrev() {
  if (_queryloading.value || _pageForm.value.page <= 1) return
  _pageForm.value.page -= 1
  _fetchList()
}
function goNext() {
  if (_queryloading.value || _pageForm.value.page >= totalPages.value) return
  _pageForm.value.page += 1
  _fetchList()
}

async function _bindRevokeApply(index) {
  const it = _rowsData.value[index]
  if (!it || it._oriStatus !== 1) return
  _rowsData.value[index]._loadingRevoke = true
  const ok = await systemStore.revokeWithdrawApply(it._id)
  if (ok) {
    _rowsData.value[index]._oriStatus = 4
    _rowsData.value[index].status = '已取消'
  }
  _rowsData.value[index]._loadingRevoke = false
}

/** 切换Tab */
function switchTab(k) {
  if (activeTab.value === k) return
  activeTab.value = k
  _pageForm.value.page = 1
  _rowsData.value = []
  _fetchList()
}

/** 返回（如果你不需要，删掉即可） */
function goBack() {
  // 如果你有路由，换成 router.back()
}

/** 初始化（沿用你现有的 socket 初始化） */
onLoad(() => {
  listenStart()
  listenConnectEd(async () => {
    _bindQuery('today')

    if (deskStore.list.length < 1) {
      deskStore.initList().then(() => deskStore.listFlow())
      userStore.updateUserInfo()
      userStore.flowUserBalance()
      systemStore.updateNoticeList()
    }
  })
})
</script>

<style scoped lang="less">
/* 页面背景和结构 */
.records-page { height:100vh; background:#363f45; display:flex; flex-direction:column; }

/* 顶部Sticky区域（Tabs + 面板） */
.sticky{
  position:sticky; top:calc(80rpx + var(--status-bar-height));
  background:#363f45; z-index:5; border-bottom: 1px solid #2e343c;
}

/* Tab条 */
.top-tabs{
  position:relative;
  display:flex; align-items:center; gap:32rpx;
  justify-content: center;
  padding: 18rpx 20rpx 8rpx;
  background: linear-gradient(180deg,#39464f,#334049);
  color:#d6e1ea;
}
.top-tab{ position:relative; padding:8rpx 6rpx; }
.top-tab.is-active{ color:#ffffff; font-weight:700; }
.underline{
  position:absolute; left:6rpx; right:6rpx; bottom:-10rpx;
  height:8rpx; background:#ffd77a; border-radius:8rpx;
}
.top-close{ position:absolute; right:24rpx; top:10rpx; font-size:40rpx; opacity:.8; }

/* 面板（左对齐控件，如截图） */
.panel{ padding: 16rpx 20rpx 10rpx; }
.row{ display:flex; align-items:center; margin:10rpx 0; }
.row-title{ color:#c9d5df; width: 140rpx; }
.seg{ display:flex;  flex-wrap:wrap; background:#25323a;  }
.seg-item{
  padding: 10rpx 28rpx; border-radius:12rpx; background:#25323a;
  color:#c9d5df; font-size:24rpx;
}
.seg-item.on{ background:#17add8; color:#fff; border-color:transparent; font-weight:700; }

.row.actions{ margin: 20rpx 100rpx; }
.btn{ min-width:140rpx; height:56rpx; line-height:56rpx; border-radius:10rpx; font-size:26rpx; }
.primary{ background:#12a6d3; color:#fff; border:0; }
.ghost{ background:#60727d; color:#e6f3ff; border:0; }
.danger{ background:linear-gradient(180deg,#890300,#680a0b); color:#fff; border:0; padding:8rpx 24rpx; border-radius:10rpx; }

/* 滚动列表区 */
.scroll{ flex:1 1 auto; overflow:auto;  }
.card{
  background:#2e343c; border:2rpx solid #395a70; border-radius:16rpx; color:#e9f6ff;
  padding:14rpx; margin:12rpx 18rpx;
}
.card-date{ color:#c8d6e2; border-bottom:2rpx solid #50697a; padding-bottom:8rpx; margin-bottom:8rpx; }
.line{ margin:6rpx 0; }
.empty{ text-align:center; color:#a9c1cf; padding: 40rpx 0; }

/* 分页器（居中，左右箭头按钮 + 中间页码） */
.pager{
  display:flex; align-items:center; justify-content:center; gap: 20rpx; padding: 18rpx 0 120rpx;
}
.pg-btn{
  padding: 8rpx 20rpx; border-radius:999rpx; border:2rpx solid #1e607f;
  background:#173444; color:#e7f7ff;
}
.pg-btn.disabled{ opacity:.4 }
.pg-index{
  min-width:110rpx; text-align:center; padding: 6rpx 14rpx;
  border-radius:999rpx; background:#0a3245; color:#bfe9ff; border:2rpx solid #1e607f;
}

/* 合计条（保持你原有样式） */
.bottom-total-style {
  position: sticky; bottom: 0; left: 0; right: 0;
  height: 70rpx; width: 100%; line-height: 70rpx;
  background:linear-gradient(to right, #003852, #0d2b4a);
  margin-top: 20rpx;
  .bottom-total-right { float:right; font-size:30rpx; margin-right:30rpx; }
  .bottom-total-left  { float:left;  font-size:30rpx; margin-left:10rpx; }
}
</style>
