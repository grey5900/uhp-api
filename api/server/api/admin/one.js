import mongoose from 'mongoose';
import {roleAuthPromise as rap} from '../../lib/auth';
import config from '../../config';
const Admin = mongoose.model('Admin');

export default function one(req) {

  return rap(req, 'search', 'admin', (resolve, reject) => {
    const {id} = req.query;
    if (id) {
      Admin.findOne({_id: id})
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
