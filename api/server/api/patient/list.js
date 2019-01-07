/**
 * Created by isaac on 16/5/6.
 */
import mongoose from 'mongoose';
import config from '../../config';
const Patient = mongoose.model('Patient');

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
    const args = {};
    Patient.count(args, (error, count) => {
      if (error) {
        reject({msg: error.message});
      } else {
        if (count === 0) {
          resolve({
            code: config.code.success,
            data: {
              total: 0,
              patients: []
            }
          });
        } else {
          Patient.find(args)
            .select('-__v')
            .sort('pinyin_name')
            .populate('hospital avatar')
            .skip(skip)
            .limit(limit)
            .exec((err, docs) => {
              if (err || !docs) {
                reject({msg: '查找失败！'});
              } else {
                resolve({
                  code: config.code.success,
                  data: {
                    total: count,
                    patients: docs
                  }
                });
              }
            });
        }
      }
    });
  });
}
