/**
 * Created by isaac on 2/21/16.
 */
import mongoose from 'mongoose';
import {getIP, genToken, roleAuthPromise as rap} from '../../lib/auth';
import config from '../../config';
const Admin = mongoose.model('Admin');

export default function resetpassword(req) {

  return rap(req, null, null, (resolve, reject) => {

    var id = req.body._id;
    var oldPassword = req.body.old_password;
    var newPassword = req.body.new_password;
    console.log('password', oldPassword, newPassword);
    if (id && oldPassword && newPassword) {

      Admin.findOne({_id: id}, (error, doc) => {

        if (doc) {
          if (doc.validPassword(oldPassword)) {
            
            Admin.update({_id: id},
              {password: doc.generateHash(newPassword)},
               (error) => {
                if (error) {
                  reject({msg: error.message});
                } else {
                  resolve({
                    code: config.code.success,
                    access_token: genToken(id, getIP(req))
                  });
                }
              });
          } else {
            reject({msg: '密码错误！'});
          }
        } else {
          reject({msg: '邮箱不存在!'});
        }
      });
    } else {
      reject({msg: '缺少参数！'});
    }
  });
}
