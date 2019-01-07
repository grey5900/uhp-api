/**
 * Created by isaac on 2/21/16.
 */

import mongoose from 'mongoose';
import {roleAuthPromise as rap} from '../../lib/auth';
import config from '../../config';
const Admin = mongoose.model('Admin');

export default function remove(req) {

  return rap(req, 'delete', 'admin', (resolve, reject) => {

    const id = req.body.id;
    if (id) {
      console.log('admin id', id);
      Admin.findOneAndRemove({_id: id},
        (err, doc) => {
          if (err || !doc) {
            reject({msg: '删除失败'});
          } else {
            resolve({code: config.code.success});
          }
      });
    } else {
      reject({msg: '缺少参数'});
    }
  });
}
