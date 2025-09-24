/**
 * @description 获取localStorage
 * @param {String} key Storage名称
 * @returns {String}
 */
export function localGet(key) {
  // #ifdef APP-PLUS
    const value = uni.getStorageSync(key);
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  // #endif
  // #ifndef APP-PLUS
    const value = window.localStorage.getItem(key);
    try {
      return JSON.parse(window.localStorage.getItem(key));
    } catch (error) {
      return value;
    }
  // #endif
}

/**
 * @description 存储localStorage
 * @param {String} key Storage名称
 * @param {*} value Storage值
 * @returns {void}
 */
export function localSet(key, value) {
  // #ifdef APP-PLUS
    uni.setStorageSync(key, JSON.stringify(value));
  // #endif
  // #ifndef APP-PLUS
    window.localStorage.setItem(key, JSON.stringify(value));
  // #endif
}

/**
 * @description 清除localStorage
 * @param {String} key Storage名称
 * @returns {void}
 */
export function localRemove(key) {
  window.localStorage.removeItem(key);
}

/**
 * @description 清除所有localStorage
 * @returns {void}
 */
export function localClear() {
  window.localStorage.clear();
}
