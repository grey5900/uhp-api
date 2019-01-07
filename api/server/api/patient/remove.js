/**
 * Created by isaac on 16/5/6.
 */
import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';
const Patient = mongoose.model('Patient');

export default function remove(req) {

  return rap(req, 'delete', 'patient', (resolve, reject) => {

    var id = req.body.id;
    if (id) {
      Patient.findOneAndRemove({_id: id}, function (err, doc) {
        if (err) {
          reject({msg: '删除失败！'});
        } else {
          doc.deleted = true;
          resolve({
            code: config.code.success,
            msg: '删除成功！'
          });
        }
      });
    }
  });
}

