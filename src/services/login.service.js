import request from '@front/utils/request';

/**
 * 登录
 * @param {String} username 登录用户名
 * @param {String} password 密码ras
 * @param {String} nonce 随机数ras
 * @param {Number} timeStamp 秒级时间戳
 * @param {String} sign
 */
export function req_userLogin(username, password, verifyCode, uuid, nonce, timeStamp, sign) {
  const data = {
    method: 'post',
    data: {
      username: username,
      password: password,
      verifyCode: verifyCode,
      uuid: uuid,
      nonce: nonce,
      timeStamp: timeStamp,
      sign: sign,
    },
    queryUrl: [
    ],
  }

  return request('/user/login', data);
}

export function req_userLoginout() {
  const data = {
    method: 'post',
    data: {
    },
    queryUrl: [
    ],
  }

  return request('/user/loginout', data);
}

export function req_userUpdatePassword(password, newPassword, nonce, timeStamp, sign) {
  const data = {
    method: 'post',
    data: {
      password: password,
      newPassword: newPassword,
      nonce: nonce,
      timeStamp: timeStamp,
      sign: sign,
    },
    queryUrl: [
    ],
  }

  return request('/user/updatePassword', data);
}

export function req_userLoginByunreal(verifyCode, uuid,) {
  const data = {
    method: 'post',
    data: {
      verifyCode: verifyCode,
      uuid: uuid,
    },
    queryUrl: [
    ],
  }

  return request('/user/login_byunreal', data);
}

export function req_captchaCaptchaImage(uuid) {
  const data = {
    method: 'get',
    data: {
      type: 'char',
      uuid: uuid,
    },
    queryUrl: [
    ],
  }

  return request('/captcha/captchaImage', data);
}

export function req_checkNetStatus(/*uuid, */url) {
  const data = {
    method: 'get',
    data: {
      // type: 'char',
      // uuid: uuid,
      url: url,
    },
    queryUrl: [
    ],
  }

  // return request('/checkNetWorkStatus', data);
  return request('/network/check', data);
}
