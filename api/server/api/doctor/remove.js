import mongoose from 'mongoose';
import config from '../../config';
const Doctor = mongoose.model('Doctor');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function one(req) {

  return rap(req, 'delete', 'doctor', (resolve, reject) => {
    const {id} = req.body;
    if (id) {
      Doctor.findOneAndRemove({_id: id},
        (err) => {
          if (err) {
            reject({msg: '删除失败！'});
          } else {
            resolve({
              code: config.code.success,
              msg: '删除成功！'
            });
          }
        });
    }
  });
}
