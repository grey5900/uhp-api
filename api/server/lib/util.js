/**
 * Created by isaac on 16/3/3.
 */
import config from '../config';

export function gather(obj, keys) {
  const result = {};
  keys.forEach((key) => {
    const value = obj[key];
    console.log(key, value);
    if (value !== undefined) {
      result[key] = value;
    }
  });
  return result;
}

export function rangeFromString(str) {
  var range;
  if (str && str.length > 0) {
    var idx = str.indexOf('<');
    if (idx != -1) {
      range = str.split('<');
      range.splice(0, 0, '0');
    } else {
      idx = str.indexOf('>');
      if (idx != -1) {
        range = str.split('>');
        range.push(Number.MAX_VALUE + '');
      } else {
        idx = str.indexOf('-');
        if (idx != -1) {
          range = str.split('-');
        } else {
          range = [str, str];
        }
      }
    }
  } else {
    range = ['', ''];
  }

  return range;
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
  var date = time.getDate();
  var order = orderFromDate(date);
  return `${time.getFullYear()}_${time.getMonth() + 1}_${order}`;
}


export function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

export function randomString() {
  let time = new Date().getTime();
  let suffix = Math.random().toString(36).substring(5);
  return `${time}-${suffix}`;
}

export function allAPI(Model, populate) {
  return new Promise((resolve, reject) => {
    Model.find({deleted: false})
      .select('-__v')
      .populate(populate)
      .exec((err, docs) => {
        if (err) {
          reject({msg: '查找失败！'});
        } else {
          resolve({
            code: config.code.success,
            data: docs
          });
        }
      });
  });
}