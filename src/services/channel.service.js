import request from '@front/utils/request';

/**
 * 交易流水
 */
export function req_systemAccountChangeSimpleList(page, line, startTime, endTime, status) {
  const data = {
    method: 'post',
    data: {
      pageNum: page,
      pageSize: line,
      startTime: startTime,
      endTime: endTime,
      status: status,
    },
    queryUrl: [
    ],
  }

  return request('/system/account_change_simple/list', data);
}

/**
 * 提现记录
 */
export function req_userWithdrawalLog(page, line, startDate, endDate, status) {
  const data = {
    method: 'post',
    data: {
      page: page,
      line: line,
      startDate: startDate,
      endDate: endDate,
      status: status,
    },
    queryUrl: [
    ],
  }

  return request('/user/withdrawalLog', data);
}
