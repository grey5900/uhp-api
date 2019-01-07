/**
 * Created by yons on 16/3/30.
 */
import mongoose from 'mongoose';
import config from '../../config';
const Doctor = mongoose.model('Doctor');

export default function list(req) {

  return new Promise((resolve, reject) => {
    let skip = parseInt(req.query.skip);
    let limit = parseInt(req.query.limit);
    if (!skip) {
      skip = 0;
    }
    if (!limit) {
      limit = 20;
    }
    Doctor.count({}, (error, count) => {
      if (error) {
        reject({msg: error.message});
      } else {
        if (count === 0) {
          resolve({
            code: config.code.success,
            data: {
              total: 0,
              doctors: []
            }
          });
        } else {
          Doctor.find({})
            .select('-__v')
            .skip(skip)
            .limit(limit)
            .populate('avatar')
            .exec((err, docs) => {
              if (err) {
                reject({msg: '查找失败！'});
              } else {
                resolve({
                  code: config.code.success,
                  data: {
                    total: count,
                    doctors: docs
                  }
                });
              }
            });
        }
      }
    });
  });
}
