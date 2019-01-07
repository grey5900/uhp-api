/**
 * Created by yons on 16/3/30.
 */
import mongoose from 'mongoose';
import config from '../../config';
const Activity = mongoose.model('Activity');

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
    Activity.count({}, (error, count) => {
      if (error) {
        reject({msg: error.message});
      } else {
        if (count === 0) {
          resolve({
            code: config.code.success,
            data: {
              total: 0,
              activitys: []
            }
          });
        } else {
          Activity.find({})
            .select('-__v')
            .skip(skip)
            .limit(limit)
            .exec((err, docs) => {
              if (err) {
                reject({msg: '查找失败！'});
              } else {
                resolve({
                  code: config.code.success,
                  data: {
                    total: count,
                    activitys: docs
                  }
                });
              }
            });
        }
      }
    });
  });
}
