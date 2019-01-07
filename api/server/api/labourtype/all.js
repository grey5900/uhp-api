/**
 * Created by isaac on 16/5/6.
 */
import mongoose from 'mongoose';
import config from '../../config';
const LaborType = mongoose.model('LaborType');

export default function all(req) {

  return new Promise((resolve, reject) => {

    LaborType.find({deleted: false})
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
