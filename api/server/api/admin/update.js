/**
 * Created by isaac on 2/21/16.
 */


import mongoose from 'mongoose';
import {roleAuthPromise as rap} from '../../lib/auth';
import config from '../../config';
const Admin = mongoose.model('Admin');

export default function update(req) {

  return rap(req, 'update', 'admin', (resolve, reject) => {
    const info = req.body;
    const {id} = info;

    if (id) {
      Admin.findOneAndUpdate({_id: id}, info.args, (err, doc) => {
        if (!doc || err) {
          reject({msg: '修改失败！'});
        } else {
          resolve({code: config.code.success});
        }
      })
    } else {
      reject({msg: '缺少参数！'});
    }
  });
}
