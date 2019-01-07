import mongoose from 'mongoose';
import config from '../../config';
const Hospital = mongoose.model('Hospital');

export default function list(req) {

  return new Promise((resolve, reject) => {
    console.log('list api', req.query);
    let skip = parseInt(req.query.skip);
    let limit = parseInt(req.query.limit);
    if (!skip) {
      skip = 0;
    }
    if (!limit) {
      limit = 20;
    }
    const args = {};
    Hospital.count(args, (error, count) => {
      if (error) {
        reject({msg: error.message});
      } else {
        if (count === 0) {
          resolve({
            code: config.code.success,
            data: {
              total: 0,
              hospitals: []
            }
          });
        } else {
          Hospital.find(args)
            .select('-__v')
                  .populate('contact')
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
                    hospitals: docs
                  }
                });
              }
            });
        }
      }
    });
  });
}
