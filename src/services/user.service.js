import request from '@front/utils/request';

/**
 * 用户提现
 * @param {} userName 收款姓名
 * @param {} amount 金额ras
 * @param {} bankName 银行名称ras
 * @param {} accountNo 银行卡号ras
 * @param {} imgUrl 图片
 * @param {} nonce 随机数ras
 * @param {} timeStamp 秒级时间戳
 * @param {} sign
 */
export function req_userWithdrawal(withdrawType, withdrawalPassword, userName, amount, bankName, accountNo, imgUrl, nonce, timeStamp, sign) {
  const data = {
    method: 'post',
    data: {
      withdrawType: withdrawType,
      withdrawalPassword: withdrawalPassword,
      userName: userName,
      amount: amount,
      bankName: bankName,
      accountNo: accountNo,
      imgUrl: imgUrl,
      nonce: nonce,
      timeStamp: timeStamp,
      sign: sign,
    },
    queryUrl: [
    ],
  }

  data.data.bankName === null && (delete data.data.bankName)
  data.data.imgUrl === null && (delete data.data.imgUrl)
  data.data.withdrawalPassword === null && (delete data.data.withdrawalPassword)

  return request('/user/withdrawal', data);
}
