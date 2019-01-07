/**
 * Created by isaac on 16/5/6.
 */
import mongoose from 'mongoose';
import config from '../../config';
const LaborRecord = mongoose.model('LaborRecord');

export default function one(req) {

  return new Promise((resolve, reject) => {

    var id = req.query.id;

    if (id) {
      LaborRecord.findOne({_id: id, deleted: false})
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
