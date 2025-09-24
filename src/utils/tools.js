// import dayjs from 'dayjs';
// import dayjsUTC from 'dayjs/plugin/utc';
// import dayjsTimeZone from 'dayjs/plugin/timezone';
import { TextEncoder as SelfTextEncoder, TextDecoder as SelfTextDecoder, } from 'text-decoding';
import md5 from '@front/lib/md5';
import CryptoJS from 'crypto-js';

// dayjs.extend(dayjsUTC);
// dayjs.extend(dayjsTimeZone);

// md5加密
export function md5Encrypt(str) {

  return md5.hex_md5_32(str).toUpperCase();

}

/**
 * 生成ID
 * @param {String} prefix 前缀标识符 (非必传)
 * @returns {String} 
 */
export function generateID(prefix) {
  return `${prefix ? `${prefix}-` : ''}` + (Math.random()*10000000).toString(11).substr(0, 4) + `${(new Date()).getTime()}`.substring(6);
}

export function genUUID(len=32, radix) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  let uuid = [],
      i
  ;
  radix = radix || chars.length;

  if (len) {
    for (i = 0; i < len; i+=1) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    let r;

    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    for (i = 0; i < 36; i+=1) {
      if (!uuid[i]) {
        r = 0 | Math.random()*16;
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
}

export function isInElectron() {
  return (
    (navigator && 'userAgent' in navigator)
      ? navigator.userAgent.toLowerCase().indexOf(' electron/') > -1
      : false
  );
}

export function formatAmount(amount) {
  return (
    Math.trunc(amount)
      .toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
  );
}

export function getRandomOption(optionArr) {
  if (optionArr.length === 1) return optionArr[0];

  const probabilities = optionArr.length < 3 ? [0.5, 0.5] : [0.4, 0.4, 0.2], // 概率: [40%, 40%, 20%]
        rand = Math.random() // 生成0到1之间的随机数
  ;

  let cumulativeProbability = 0;

  // 遍历概率数组，判断随机数属于哪个区间
  for (let i = 0; i < optionArr.length; i++) {
    cumulativeProbability += probabilities[i];

    if (rand < cumulativeProbability) {
      return optionArr[i];
    }
  }
}

// 查找最后的连续数字
export function getLastContinuousNumber(str) {
  const match = str.match(/(\d+)(?=[^\d]*$)/);
  return match ? match[0] : '0';
}

function _aesEncrypt(value) {
  const key = CryptoJS.enc.Utf8.parse('0123456789ABCDEF'),
        iv = CryptoJS.enc.Utf8.parse('0123456789ABCDEF'),
        srcs = CryptoJS.enc.Utf8.parse(value),
        encrypted = CryptoJS.AES.encrypt(srcs, key, {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        })
  ;
  return encrypted.toString();
}
 
function _aesDecrypt(value) {
  const key = CryptoJS.enc.Utf8.parse('0123456789ABCDEF'),
        iv = CryptoJS.enc.Utf8.parse('0123456789ABCDEF'),
        srcs = value,
        // CBC 加密方式，Pkcs7 填充方式
        decrypted = CryptoJS.AES.decrypt(srcs, key, {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        })
  ;
  return decrypted.toString(CryptoJS.enc.Utf8);
}

function _aesWsEncrypt(value) {
  const key = CryptoJS.enc.Utf8.parse('cpou20249654hkbx'),
        iv = CryptoJS.enc.Utf8.parse(''),
        srcs = CryptoJS.enc.Utf8.parse(value),
        encrypted = CryptoJS.AES.encrypt(srcs, key, {
          iv: iv,
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        })
  ;
  return encrypted.toString();
}

export function binaryWsEncrypt(value) {
  if (['test', 'development'].includes(import.meta.env.MODE)) return value;

  const _encoder = new SelfTextEncoder(),
        _binaryData = _encoder.encode(value)
  ;
  return _binaryData;
}

function _aesWsDecrypt(value) {
  const key = CryptoJS.enc.Utf8.parse('cpou20249654hkbx'),
        iv = CryptoJS.enc.Utf8.parse(''),
        srcs = value,
        // CBC 加密方式，Pkcs7 填充方式
        decrypted = CryptoJS.AES.decrypt(srcs, key, {
          iv: iv,
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        })
  ;
  return decrypted.toString(CryptoJS.enc.Utf8);
}

export function binaryWsDecrypt(value) {
  return new Promise(resolve=> {
    if (['test', 'development'].includes(import.meta.env.MODE)) return resolve(value);

    if (value.constructor.name === 'Blob') {
      const _res = new Response(value);
      _res.text().then(resStr=> {
        resolve(resStr);
      });

    } else {

      const _encoder = new SelfTextDecoder(),
            _binaryData = _encoder.decode(value)
      ;
      resolve(_binaryData);

    }
  })
}


export function base64Enc(value) {
  return _aesEncrypt(value);
}

export function base64Dec(value) {
  return _aesDecrypt(value);
}

export function base64WsEnc(value) {
  return (
    ['test', 'development'].includes(import.meta.env.MODE) ? value : _aesWsEncrypt(value)
  )
  // return value;
}

export function base64WsDec(value) {
  /*const _decStr = _aesWsDecrypt(value);
  return (_decStr || '');*/
  return (
    ['test', 'development'].includes(import.meta.env.MODE) ? value : ( _aesWsDecrypt(value) || '' )
  )
  // return value;
}
