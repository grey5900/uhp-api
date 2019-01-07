/**
 * Created by isaac on 16/5/5.
 */
/**
 * Created by isaac on 16/5/5.
 */

import mongoose from 'mongoose';
import config from '../../config';
const Admin = mongoose.model('Admin');
import {updateToken} from '../../lib/auth';

export default function register(req) {

  return new Promise((resolve, reject) => {

    const {email, password, ...others} = req.body;
    if (email && password) {

      Admin.findOne({email}, function (error, doc) {
        if (doc) {
          reject({msg: '邮箱已被注册!'});
        } else {
          var user = new Admin(others);
          user.email = email;
          user.password = user.generateHash(password);
          user.save(function (error) {
            if (error) {
              reject({msg: '注册失败!'});
            } else {
              user.password = null;
              resolve({
                code: config.code.success,
                user: user,
                access_token: updateToken(user.id)
              });
            }
          });
        }
      });
    } else {
      reject({msg: '缺少参数!'});
    }
  });
}
