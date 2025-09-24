/**
 * @description: 判断值是否未某个类型
 */
function _is(val, type) {
  return Object.prototype.toString.call(val) === `[object ${type}]`;
}

/**
 * @description:  是否为函数
 */
export function isFunction(val) {
  return _is(val, 'Function');
}

/**
 * @description: 是否为对象
 */
export function isObject(val) {
  return val !== null && _is(val, 'Object');
}

/**
 * @description:  是否为数值
 */
export function isNumber(val) {
  return _is(val, 'Number');
}

/**
 * @description:  是否为字符串
 */
export function isString(val) {
  return _is(val, 'String');
}

/**
 * @description:  是否为boolean类型
 */
export function isBoolean(val) {
  return _is(val, 'Boolean');
}

/**
 * @description:  是否为数组
 */
export function isArray(val) {
  return val && Array.isArray(val);
}

/**
 * @description: 是否已定义
 */
export function isDefined(val) {
  return typeof val !== 'undefined';
}

/**
 * @description: 是否未定义
 */
export function isUndefined(val) {
  return !isDefined(val);
}

/**
 * @description: 是否为 null
 */
export function isNull(val) {
  return val === null;
}

/**
 * @description: 是否为 null || undefined
 */
export function isNullOrUndefined(val) {
  return isUndefined(val) || isNull(val);
}

export function isGetString(val, replaceValue) {
  return isString(val) ? val : replaceValue;
}

export function isGetNumber(val, replaceValue) {
  return isNumber(val) ? val : replaceValue;
}

export function isGetBoolean(val, replaceValue) {
  return isBoolean(val) ? val : replaceValue;
}

export function isGetArray(val, replaceValue) {
  return val && Array.isArray(val) ? val : replaceValue;
}

export function isGetFunction(val, replaceValue) {
  return val && isFunction(val) ? val : replaceValue;
}
