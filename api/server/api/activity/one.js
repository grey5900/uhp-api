import mongoose from 'mongoose';
import config from '../../config';
const Activity = mongoose.model('Activity');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function one(req) {

  return rap(req, 'search', 'activity', (resolve, reject) => {
    const {id} = req.query;
    if (id) {
      Activity.findOne({_id: id})
        .select('-__v')
        .exec((err, doc) => {
          if (err || !doc) {
            reject({msg: '查找失败'});
          } else {
            resolve({
              code: config.code.success,
              data: doc
            });
          }
        });
    }
  });
}
