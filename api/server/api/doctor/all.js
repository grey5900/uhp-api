import mongoose from 'mongoose';
import config from '../../config';
const Doctor = mongoose.model('Doctor');

export default function all(req) {

  return new Promise((resolve, reject) => {

    const {hospital} = req.query;
    Doctor.find({hospital})
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
