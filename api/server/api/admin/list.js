/**
 * Created by isaac on 16/5/5.
 */

import mongoose from 'mongoose';
import config from '../../config';
const Admin = mongoose.model('Admin');

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
    Admin.count({}, (error, count) => {
      if (error) {
        reject({msg: error.message});
      } else {
        if (count === 0) {
          resolve({
            code: config.code.success,
            data: {
              total: 0,
              admins: []
            }
          });
        } else {
          Admin.find({})
            .skip(skip)
            .limit(limit)
            .exec((err, docs) => {
              if (err) {
                reject({
                  msg: '查找出错！'
                });
              } else {
                resolve({
                  code: config.code.success,
                  data:{
                    total: count,
                    admins: docs
                  }
                });
              }
            })
        }
      }
    })
  });
}
