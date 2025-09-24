// import dayjs from 'dayjs';
// import dayjsUTC from 'dayjs/plugin/utc';
// import dayjsTimeZone from 'dayjs/plugin/timezone';
import { isNumber } from '@front/utils/is';
import { sessionGet, sessionSet } from '@front/utils/sessionStorage';

// dayjs.extend(dayjsUTC);
// dayjs.extend(dayjsTimeZone);

// 本机时间与服务器时间差距
let _diffWithServer = sessionGet('diffWithServer') || 0;

export function setDiffWithServer(serverTimestamp) {
  if (!isNumber(serverTimestamp)) return;

  _diffWithServer = serverTimestamp - Date.now();

  sessionSet('diffWithServer', _diffWithServer);
}

/**
 * 获取剩余倒计时时间
 * @param {Number} totalCount 总计时 (35)
 * @param {Number} startTime 本口开始时间点
 * @param {Number} executedTime 当前已执行到时间点
 */
export function getTimmingNum(totalCount, startTime, executedTime) {
  return (
    ( isNumber(totalCount) && isNumber(startTime) && isNumber(executedTime) )
      ? (
          executedTime < startTime
            ? totalCount
            : totalCount - Math.floor( (executedTime - new Date(startTime).getTime()) / 1000 )
        )
      : NaN
  )
}

/**
 * 判断是当前时间是当日中午12点之前还是之后
 * @return {String} [before, after]
 */
function _is12HourBefOfAft() {
  const now = new Date(),
        hour = now.getHours()
  ;

  return (
    hour < 12 ? 'before' : 'after'
  )
}

function _formatDate(date) {
  const year = date.getFullYear(),
        month = String(date.getMonth() + 1).padStart(2, '0'),
        day = String(date.getDate()).padStart(2, '0')
  ;
  
  return `${year}-${month}-${day}`;
}

export function formatDateTime(date) {
  const year = date.getFullYear(),
        month = String(date.getMonth() + 1).padStart(2, '0'),
        day = String(date.getDate()).padStart(2, '0'),
        hour = String(date.getHours()).padStart(2, '0'),
        minute = String(date.getMinutes()).padStart(2, '0'),
        second = String(date.getSeconds()).padStart(2, '0')
  ;
  
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export function getCurrentDateTime() {
  const _date = new Date();
  const year = _date.getFullYear(),
        month = String(_date.getMonth() + 1).padStart(2, '0'),
        day = String(_date.getDate()).padStart(2, '0'),
        hour = String(_date.getHours()).padStart(2, '0'),
        minute = String(_date.getMinutes()).padStart(2, '0'),
        second = String(_date.getSeconds()).padStart(2, '0')
  ;
  
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export function getCurrentTimeWithServer() {
  const _valueOf = Date.now();

  const _calcDiff = (Number(_valueOf) + Number(_diffWithServer)).toString();
  return _calcDiff;
}

/**
 * 根据type获取业务日期区间
 */
export function autoGetDateRange(type) {
  switch (type) {
    case 'today': {
      const _is12BefOfAft = _is12HourBefOfAft(),
            _now = new Date(),
            _startStr = new Date(_now),
            _endStr = new Date(_now)
      ;

      if (_is12BefOfAft === 'before') _startStr.setDate(_now.getDate() - 1);
      else if (_is12BefOfAft === 'after') _endStr.setDate(_now.getDate() + 1);

      return [`${_formatDate(_startStr)} 12:00:00`, `${_formatDate(_endStr)} 11:59:59`];
    }
    case 'yesterday': {
      const _is12BefOfAft = _is12HourBefOfAft(),
            _now = new Date(),
            _startStr = new Date(_now),
            _endStr = new Date(_now)
      ;

      if (_is12BefOfAft === 'before') {
        _startStr.setDate(_now.getDate() - 2);
        _endStr.setDate(_now.getDate() - 1);
      } else if (_is12BefOfAft === 'after') {
        _startStr.setDate(_now.getDate() - 1);
      }

      return [`${_formatDate(_startStr)} 12:00:00`, `${_formatDate(_endStr)} 11:59:59`];
    }
    case 'thisweek': {
      const _now = new Date();

      const _todayOfWeek = _now.getDay();

      if (_todayOfWeek === 1 && _is12HourBefOfAft() === 'before') return autoGetDateRange('laseweek');

      // 本周一的日期
      const _monday = new Date(_now);
      _monday.setDate(_now.getDate() - _todayOfWeek + (_todayOfWeek === 0 ? -6 : 1));
      _monday.setHours(12);
      _monday.setMinutes(0);
      _monday.setSeconds(0);
      _monday.setMilliseconds(0);

      // return [`${_formatDate(_monday)} 12:00:00`, `${formatDateTime(_now)}`];
      return [
        `${_formatDate(_monday)} 12:00:00`,
        (
          _now > _monday ? `${formatDateTime(_now)}` : `${_formatDate(_monday)} 12:00:00`
        )
      ];
    }
    case 'laseweek': {
      const _now = new Date();

      const _todayOfWeek = _now.getDay();

      // 本周一的日期
      const _monday = new Date(_now);
      _monday.setDate(_now.getDate() - _todayOfWeek + (_todayOfWeek === 0 ? -6 : 1));

      // 上周一的日期
      const _lastMonday = new Date(_now);
      _lastMonday.setDate(_now.getDate() - _todayOfWeek + (_todayOfWeek === 0 ? -13 : -6));

      return [`${_formatDate(_lastMonday)} 12:00:00`, `${_formatDate(_monday)} 11:59:59`];
    }
    case 'thismonth': {
      const _now = new Date();

      const _firstDay = new Date(_now.getFullYear(), _now.getMonth(), 1);

      return [`${_formatDate(_firstDay)} 12:00:00`, `${formatDateTime(_now)}`];
    }
    default: {
      return ['', ''];
    }
  }
}

/**
 * 根据type获取业务日期区间-获取整天---00:00:00-23:59:59
 */
export function autoGetDateRangeAllDay(type) {
  switch (type) {
    case 'today': {
      // const _is12BefOfAft = _is12HourBefOfAft(),
          const  _now = new Date(),
            _startStr = new Date(_now),
            _endStr = new Date(_now)
      ;

      // if (_is12BefOfAft === 'before') _startStr.setDate(_now.getDate() - 1);
      // else if (_is12BefOfAft === 'after') _endStr.setDate(_now.getDate());

      return [`${_formatDate(_startStr)} 00:00:00`, `${_formatDate(_endStr)} 23:59:59`];
    }
    case 'yesterday': {
      // const _is12BefOfAft = _is12HourBefOfAft(),
      const  _now = new Date(),
            _startStr = new Date(_now),
            _endStr = new Date(_now)
      ;
      // 
      _startStr.setDate(_now.getDate() - 1);
      _endStr.setDate(_now.getDate() - 1);
        
      // if (_is12BefOfAft === 'before') {
      //   _startStr.setDate(_now.getDate() - 2);
      //   _endStr.setDate(_now.getDate() - 1);
      // } else if (_is12BefOfAft === 'after') {
      //   _startStr.setDate(_now.getDate() - 1);
      // }

      return [`${_formatDate(_startStr)} 00:00:00`, `${_formatDate(_endStr)} 23:59:59`];
    }
    case 'thisweek': {
      const _now = new Date();

      const _todayOfWeek = _now.getDay();

      if (_todayOfWeek === 1 && _is12HourBefOfAft() === 'before') return autoGetDateRangeAllDay('laseweek');

      // 本周一的日期
      const _monday = new Date(_now);
      _monday.setDate(_now.getDate() - _todayOfWeek + (_todayOfWeek === 0 ? -6 : 0));
      _monday.setHours(12);
      _monday.setMinutes(0);
      _monday.setSeconds(0);
      _monday.setMilliseconds(0);

      // return [`${_formatDate(_monday)} 12:00:00`, `${formatDateTime(_now)}`];
      return [
        `${_formatDate(_monday)} 00:00:00`,
        (
          _now > _monday ? `${formatDateTime(_now)}` : `${_formatDate(_monday)} 00:00:00`
        )
      ];
    }
    case 'laseweek': {
      const _now = new Date();

      const _todayOfWeek = _now.getDay();

      // 本周一的日期
      const _monday = new Date(_now);
      _monday.setDate(_now.getDate() - _todayOfWeek + (_todayOfWeek === 0 ? -6 : 0));

      // 上周一的日期
      const _lastMonday = new Date(_now);
      _lastMonday.setDate(_now.getDate() - _todayOfWeek + (_todayOfWeek === 0 ? -13 : -6));

      return [`${_formatDate(_lastMonday)} 00:00:00`, `${_formatDate(_monday)} 23:59:59`];
    }
    case 'thismonth': {
      const _now = new Date();

      const _firstDay = new Date(_now.getFullYear(), _now.getMonth(), 1);

      return [`${_formatDate(_firstDay)} 00:00:00`, `${formatDateTime(_now)}`];
    }
    default: {
      return ['', ''];
    }
  }
}

export function getLoginUUID() {
  // const _valueOf = dayjs().tz('Asia/Shanghai').valueOf().toString();
  const _valueOf = Date.now();

  const _calcDiff = (Number(_valueOf) + Number(_diffWithServer)).toString();
  return _calcDiff.substring(0, _calcDiff.length - 3);
}
