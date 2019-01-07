/**
 * Created by yons on 16/3/13.
 */

import moment from 'moment';

export function getPageCount(length, pageSize) {
  return parseInt(Math.ceil(length / pageSize), 10);
}

export function dbObjectIndexInArray(array, item) {
  if (array && item) {
    for (let idx = 0; idx < array.length; ++idx) {
      const obj = array[idx];
      if (obj && obj._id === item._id) {
        return idx;
      }
    }
  }
  return -1;
}

export function getDays() {
  return [
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六'
  ];
}

const weekMap = {
  0: '零',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '日',
};

export function getDaysOfCurrentWeek() {
  const today = new Date();
  const current = today.getDay();
  const result = [];
  for (let idx = 1; idx <= 6; ++idx) {
    let date = null;
    if (idx !== current) {
      date = moment(today).add(idx - current, 'days').toDate();
    } else {
      date = today;
    }
    result.push(`${date.getMonth() + 1}月${date.getDate()}日(周${weekMap[idx]})`);
  }
  return result;
}

export function getYearMonth() {
  return moment().format('YYYY-MM');
}

export function orderFromDate(date) {
  let order = 0;
  if (date >= 0 && date <= 7 * 1) {
    order = 1;
  } else if (date >= 8 && date <= 7 * 2) {
    order = 2;
  } else if (date >= 15 && date <= 7 * 3) {
    order = 3;
  } else if (date >= 22 && date <= 31) {
    order = 4;
  }
  return order;
}

export function dateToWeekString(time) {
  const date = time.getDate();
  const order = orderFromDate(date);
  return `${time.getFullYear()}_${time.getMonth() + 1}_${order}`;
}
