/**
 * Created by isaac on 16/4/27.
 */
import mongoose from 'mongoose';
import config from '../../config';
const Donate = mongoose.model('Donate');

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
          {$or: [
            {name: exp},
            {department: exp},
            {title: exp},
            {mobile: exp},
            {person_id: exp}
          ]}
        ]
      };
      Donate.count(args, (error, count) => {
        if (error) {
          reject({msg: error.message});
        } else {
          if (count === 0) {
            resolve({
              code: config.code.success,
              data: {
                total: 0,
                donates: []
              }
            });
          } else {
            Donate.find(args)
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
                      donates: docs
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
