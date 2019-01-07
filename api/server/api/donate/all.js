import mongoose from 'mongoose';
import config from '../../config';
const Donate = mongoose.model('Donate');

export default function all(req) {

  return new Promise((resolve, reject) => {

    const {patientID} = req.query;
    Donate.find({patient: patientID})
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
