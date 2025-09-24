import request from '@front/utils/request';

export function req_apiIndexCheckupdate(version) {
  const data = {
    method: 'get',
    data: {
      version: version,
    },
    queryUrl: [
    ],
  }

  return request('/api/index/checkupdate', data);
}

export function req_commonUpload(filePath) {
  const data = {
    method: 'post',
    data: filePath,
    queryUrl: [
    ],
  }

  return request('/common/upload', data);
}

export function req_indexGetloginapi() {
  const data = {
    method: 'get',
    data: {
    },
    queryUrl: [
    ],
  }

  return request('/index/getloginapi', data);
}

export function req_indexGetwsapi() {
  const data = {
    method: 'get',
    data: {
    },
    queryUrl: [
    ],
  }

  return request('/index/getwsapi', data);
}

/**
 * @params {String} phoneType [app_href_android app_href_iso]
 */
export function req_publicAppVersion(url, phoneType) {
  const data = {
    method: 'get',
    data: {
      url: url,
      phoneType: phoneType,
    },
    queryUrl: [
    ],
  }

  return request('/public/appVersion', data);
}
