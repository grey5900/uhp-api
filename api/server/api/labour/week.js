/**
 * Created by isaac on 16/5/6.
 */
import mongoose from 'mongoose';
import config from '../../config';
import moment from 'moment';
const LaborRecord = mongoose.model('LaborRecord');

export default function week(req) {

  return new Promise((resolve, reject) => {

    const today = new Date();
    const sevenPastDay = moment(today).add('days', -7).toDate();
    LaborRecord.find({deleted: false, create_time: {'$gte': sevenPastDay, '$lte': today}})
      .select('-__v')
      .exec(function (err, docs) {
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
