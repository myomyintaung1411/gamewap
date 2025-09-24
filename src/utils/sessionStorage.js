/***
 * APP端使用localStorage
 */

/**
 * @description 获取sessionStorage
 * @param {String} key Storage名称
 * @returns {String}
 */
export function sessionGet(key) {
  // #ifdef APP-PLUS
    const value = uni.getStorageSync(key);
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  // #endif
  // #ifndef APP-PLUS
    const value = sessionStorage.getItem(key);
    try {
      return JSON.parse(sessionStorage.getItem(key));
    } catch (error) {
      return value;
    }
  // #endif
}

/**
 * @description 存储sessionStorage
 * @param {String} key Storage名称
 * @param {*} value Storage值
 * @returns {void}
 */
export function sessionSet(key, value) {
  // #ifdef APP-PLUS
    uni.setStorageSync(key, JSON.stringify(value));
  // #endif
  // #ifndef APP-PLUS
    sessionStorage.setItem(key, JSON.stringify(value));
  // #endif
}

/**
 * @description 清除sessionStorage
 * @param {String} key Storage名称
 * @returns {void}
 */
export function sessionRemove(key) {
  sessionStorage.removeItem(key);
}

/**
 * @description 清除所有sessionStorage
 * @returns {void}
 */
export function sessionClear() {
  sessionStorage.clear();
}
