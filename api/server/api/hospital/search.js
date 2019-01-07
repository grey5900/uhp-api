/**
 * Created by chris
 */
import mongoose from 'mongoose';
import config from '../../config';
const Hospital = mongoose.model('Hospital');

export default function search(req) {

  return new Promise((resolve, reject) => {

    const {search} = req.query;
    let skip = parseInt(req.query.skip);
    let limit = parseInt(req.query.limit);
    if (!skip) {
      skip = 0;
    }
    if (!limit) {
      limit = 20;
    }
    if (search) {
      const exp = new RegExp(search, 'i');
      const args = {
        $and: [
          {deleted: false},
          {$or: [
            {name: exp},
            {province: exp},
            {city: exp},
            {area: exp}
          ]}
        ]
      };
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
                      hospitals: docs
                    }
                  });
                }
              });
          }
        }
      });
    } else {
      reject({msg: '缺少参数!'});
    }
  });
}
