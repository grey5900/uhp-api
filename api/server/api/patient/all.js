/**
 * Created by isaac on 16/5/6.
 */
import mongoose from 'mongoose';
import config from '../../config';
const Patient = mongoose.model('Patient');

export default function all(req) {

  return new Promise((resolve, reject) => {

    Patient.find({})
      .select('-__v')
      .populate('hospital')
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
