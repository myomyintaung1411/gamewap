import axios from 'axios';
import Respons from '@front/entitys/respons.entity';
import { useUserStore } from '@front/stores/modules/user.store';
import { useSystemStore } from '@front/stores/modules/system.store';
import { setDiffWithServer } from '@front/utils/timeline';

let USER_STORE = null,
    SYSTEM_STORE = null
;
const _userStore = ()=> {
        !USER_STORE && (USER_STORE = new useUserStore());
        return USER_STORE;
      },
      _systemStore = ()=> {
        !SYSTEM_STORE && (SYSTEM_STORE = new useSystemStore());
        return SYSTEM_STORE;
      }
;

const CONTENT_TYPE_A = 'application/json',
      CONTENT_TYPE_B = 'application/x-www-form-urlencoded',
      CONTENT_TYPE_C = 'multipart/form-data'
;
const _contentType = {
        '/xx': CONTENT_TYPE_B,
        '/user/login': CONTENT_TYPE_B,
        '/user/login_byunreal': CONTENT_TYPE_B,
        '/user/cancel_bet': CONTENT_TYPE_B,
        '/system/account_change_simple/list': CONTENT_TYPE_B,
        '/user/updatePassword': CONTENT_TYPE_B,
        '/user/joinLog': CONTENT_TYPE_B,
        '/game/askRoad': CONTENT_TYPE_B,
        '/common/upload': CONTENT_TYPE_C,
        '/user/withdrawal': CONTENT_TYPE_B,
        '/user/withdrawalLog': CONTENT_TYPE_B,
        '/ajax.php': CONTENT_TYPE_B
      }
;

export default function request(url, params={ method:'get', data:{}, queryUrl:'', }) {
  params.method = params.method.toUpperCase();
  const data = params.method === 'GET' ? 'params' : 'data';

  return new Promise(async resolve=> {

    if (!_systemStore().isDomainLoadEd) {
      if (!['/index/getloginapi', '/index/getwsapi'].includes(url)) {
        await _systemStore().autoInitDomainConfig();
      }

      // if (!_systemStore().netWorkEd) return resolve(config);
    }

    const _url = (
            (
              [/*'/postMsg'*/'/ajax.php'].includes(url) ? _systemStore().getNetWorkVideoVerify :
              ['/api/index/checkupdate'].includes(url) ? _systemStore().getNetWorkUpdateApp :
              ['/index/getloginapi', '/index/getwsapi'].includes(url) ? _systemStore().getNetWorkDomainConfig :
              [/*'/checkNetWorkStatus'*/'/network/check'].includes(url) ? (_systemStore().netWorkList.find(f=> f.ident === params.data.url)?.urlHttp || '') :
              ['/public/appVersion'].includes(url) ? (params.data.url || '') :
              _systemStore().getUrlHttp
            )
            +
            (
              // url + `${(params.queryUrl && params.queryUrl.length > 0) ? '?' + params.queryUrl.join('&') : ''}`
              // (['/checkNetWorkStatus'].includes(url) ? '/captcha/captchaImage' : url)
              url
              + `${(params.queryUrl && params.queryUrl.length > 0) ? '?' + params.queryUrl.join('&') : ''}`
            )
          ),
          _header = (
            url === '/ajax.php'
              ? ({
                  'Content-Type': (url && _contentType[url]) || CONTENT_TYPE_A,
                })
              : ({
                  'Token': _userStore().token,
                  'Content-Type': (url && _contentType[url]) || CONTENT_TYPE_A,
                  'X-Platform': 'pc',
                })
          )
    ;

    if (url === '/common/upload') {
      axios
        .create({
          headers: _header,
        })
        .request({
          baseURL: (
            ['/postMsg'].includes(url) ? _systemStore().getNetWorkVideoVerify :
            ['/api/index/checkupdate'].includes(url) ? _systemStore().getNetWorkUpdateApp :
            _systemStore().getUrlHttp
          ),
          url: _url,
          method: params.method,
          [data]: params.data,
        }).then(resp=> {
          const { data } = resp;
          if ('code' in data && 'msg' in data) {
            if (data.code !== 0) return resolve(Respons.setMsg(`${data.msg}`));
            return resolve(Respons.setData(
              {
                fileName: data.fileName,
                newFileName: data.newFileName,
                originalFilename: data.originalFilename,
                url: data.url,
              },
              data.msg || '',
            ));
          } else {
            return resolve(Respons.setMsg('miss response data'));
          }
        })

    } else {

      ['/public/appVersion'].includes(url) && (
        delete params.data.url
      )

      uni.request({
        url: _url,
        method: params.method,
        // data: params.data,
        data: ['/network/check'].includes(url) ? {} : params.data,
        timeout: (
          url === '/user/login' ? 5000 :
          [/*'/checkNetWorkStatus'*/'/network/check', '/captcha/captchaImage'].includes(url) ? 2000 :
          10000
        ),
        header: _header,
        responseType: [/*'/checkNetWorkStatus', */'/captcha/captchaImage'].includes(url) ? 'arraybuffer' : 'text',
        success:res=> {
          const { data } = res;
          if (['/network/check'].includes(url)) return resolve(Respons.setData({}));
          if (['/ajax.php'].includes(url)) return resolve(Respons.setData({}, '操作成功'));
          else if (['/api/index/checkupdate'].includes(url)) return resolve(Respons.setData(data.data));
          else if ([/*'/checkNetWorkStatus', */'/captcha/captchaImage'].includes(url)) {
            return resolve(Respons.setData(
              'data:image/png;base64,' + btoa(
                new Uint8Array(data)
                  .reduce((_u8aData, _u8aByte) => _u8aData + String.fromCharCode(_u8aByte), '')
              )
            ))
          }

          if (data && ('code' in data && 'msg' in data)) {

            if (['/index/getloginapi', '/index/getwsapi'].includes(url)) {
              if (data.code !== 1) return resolve(Respons.setMsg(`${data.msg}`, false, data.code));

              return resolve(Respons.setData(
                ('data' in data ? data.data : {}),
                data.msg || '',
                data.code,
              ));
            }

            if (data.code !== 0) {
              if (data.code === 1003) setDiffWithServer(data.data);

              return resolve(Respons.setMsg(`${data.msg}`));
            }
            /*if (!('data' in data)) return resolve(Respons.setMsg('miss data'));
            return resolve(Respons.setData(data.data));*/
            return resolve(Respons.setData(
              // 'data' in data ? data.data : {},
              (
                ['/system/account_change_simple/list'].includes(url) ? { list:data.rows, total:data.total } :
                ('data' in data ? data.data : {})
              ),
              data.msg || '',
            ));
          } else {
            return resolve(Respons.setMsg('miss response data'));
          }
        },
        fail:err=> {
          if (err.errMsg.includes('timeout')) return resolve(Respons.setMsg('请求超时', {}, 10060));
          return resolve(Respons.setMsg(err.errMsg || '网络拥挤，请稍后再试', {}, 10050));
        },
      })

    }
  })
}
