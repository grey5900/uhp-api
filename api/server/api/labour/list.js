/**
 * Created by isaac on 16/5/6.
 */
import mongoose from 'mongoose';
import config from '../../config';
const LaborRecord = mongoose.model('LaborRecord');

export default function list(req) {

  return new Promise((resolve, reject) => {
    let skip = parseInt(req.query.skip);
    let limit = parseInt(req.query.limit);
    let {patient, type} = req.query;
    if (!skip) {
      skip = 0;
    }
    if (!limit) {
      limit = 20;
    }

    const args = {deleted: false};
    if (patient) {
      args.assignee = patient;
    }
    if (type) {
      args.type = type;
    }
    LaborRecord.count(args, (error, count) => {
      if (error) {
        reject({msg: error.message});
      } else {
        if (count === 0) {
          resolve({
            code: config.code.success,
            data: {
              total: 0,
              labours: []
            }
          });
        } else {
          LaborRecord.find(args)
            .select('-__v')
            .skip(skip)
            .limit(limit)
            .populate('director type assignee reviewer')
            .exec((err, docs) => {
              if (err || !docs) {
                reject({msg: '查找失败！'});
              } else {
                resolve({
                  code: config.code.success,
                  data: {
                    total: count,
                    labours: docs
                  }
                });
              }
            });
        }
      }
    });
  });
}
