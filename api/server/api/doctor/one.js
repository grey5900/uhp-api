import mongoose from 'mongoose';
import config from '../../config';
const Doctor = mongoose.model('Doctor');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function one(req) {

  return rap(req, 'search', 'doctor', (resolve, reject) => {
    const {id} = req.query;
    if (id) {
      Doctor.findOne({_id: id})
        .select('-__v')
        .populate('hospital avatar')
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
