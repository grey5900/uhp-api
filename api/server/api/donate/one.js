import mongoose from 'mongoose';
import config from '../../config';
const Donate = mongoose.model('Donate');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function one(req) {

  return rap(req, 'search', 'donate', (resolve, reject) => {
    const {id} = req.query;
    if (id) {
      Donate.findOne({_id: id})
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
