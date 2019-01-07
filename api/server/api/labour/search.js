/**
 * Created by isaac on 16/8/20.
 */
import mongoose from 'mongoose';
import config from '../../config';
import url from 'url';
const Patient = mongoose.model('Patient');
const LaborRecord = mongoose.model('LaborRecord');

export default function (req) {
  return new Promise((resolve, reject) => {
    const obj = url.parse(req.url, true);
    const {search} = obj.query;
    let skip = parseInt(obj.query.skip);
    let limit = parseInt(obj.query.limit);
    const exp = new RegExp(search, 'i');
    const args = {
      $or: [
        {real_name: exp},
        {mobile: exp},
        {person_id: exp}
      ]
    };
    Patient.count(args, (error, count) => {
      if (error) {
        reject({msg: error.message});
      } else {
        if (count === 0) {
          resolve({
            code: config.code.success,
            labours: []
          });
        } else {
          Patient.find(args)
            .select('-__v')
            .skip(skip)
            .limit(limit)
            .exec((err, docs) => {
              if (err || !docs) {
                reject({msg: '查找失败！'});
              } else {
                const ids = docs.map(doc => doc._id);
                LaborRecord.find({assignee: {$in: ids}})
                  .populate('director type assignee reviewer')
                  .exec((err, docs) => {
                    if (err) {
                      console.log(err);
                      reject({msg: err.message});
                    } else {
                      resolve({
                        code: config.code.success,
                        labours: docs
                      });
                    }
                  });
              }
            });
        }
      }
    });
  });
}