import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';

const Donate = mongoose.model('Donate');

export default function update(req) {

  return rap(req, 'update', 'donate', (resolve, reject) => {
    const {id, args} = req.body;

    if (id) {
      Donate.findOneAndUpdate({_id: id}, args, (err, doc) => {
        if (!err && doc) {
          resolve({
            code: config.code.success,
            msg: '更新成功'
          });
        } else {
          reject({msg: '更新失败'});
        }
      });
    } else {
      reject({msg: '缺少参数'});
    }
  });
}
