import mongoose from 'mongoose';
import config from '../../config';
const Hospital = mongoose.model('Hospital');

export default function all(req) {

  return new Promise((resolve, reject) => {

    Hospital.find({})
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
