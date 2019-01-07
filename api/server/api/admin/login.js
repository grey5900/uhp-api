/**
 * Created by isaac on 16/5/5.
 */

import mongoose from 'mongoose';
import config from '../../config';
const Admin = mongoose.model('Admin');
import {updateToken} from '../../lib/auth';

export default function login(req) {

  return new Promise((resolve, reject) => {
    const {email, password} = req.body;
    if (email && password) {
      Admin.findOne({email : email}, function (error, doc) {

        if (doc) {
          if (doc.validPassword(password)) {
            doc.password = null;
            resolve({
              code: config.code.success,
              user: doc,
              access_token: updateToken(doc.id)
            });
          } else {
            reject({msg  : '密码错误！'});
          }
        } else {
          reject({msg: '邮箱不存在!'});
        }
      });
    } else {
      reject({msg: '缺少参数!'});
    }
  });
}
