/**
 * Created by isaac on 16/5/6.
 */
import mongoose from 'mongoose';
import config from '../../config';
const Patient = mongoose.model('Patient');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function one(req) {

  return rap(req, 'search', 'patient', (resolve, reject) => {

    var id = req.query.id;

    if (id) {
      Patient.findOne({_id: id})
        .populate('hospital contact')
        .exec(function(err, doc) {
          if (err) {
            reject({msg  : '查找失败！'});
          } else {
            resolve({
              code : config.code.success,
              data : doc
            });
          }
        });
    } else {
      reject({msg  : '缺少参数'});
    }
  });
}
