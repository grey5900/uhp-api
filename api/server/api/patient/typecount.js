/**
 * Created by jiang_mac on 16/5/23.
 */
import mongoose from 'mongoose';
import config from '../../config';
const Patient = mongoose.model('Patient');

export default function typecount(req) {

  return new Promise((resolve, reject) => {
    const count = [];
    let num = 0;
    const types = ['ckd', 'hemodialysis', 'peritoneal'];
    queryType(types, resolve, reject, num, count);
  });
}

function queryType(types, resolve, reject, num, count) {
  Patient.count({type: types[num]}, (err, sum) => {
    if (!err) {
      const countItem = {};
      countItem.name = types[num];
      countItem.value = sum;
      count.push(countItem);
      if (num === types.length - 1) {
        resolve({
          code: config.code.success,
          data: count
        });
      } else {
        num++;
        queryType(types, resolve, reject, num, count);
      }
    } else {
      reject({msg: '查找失败！', err});
    }
  });
}
