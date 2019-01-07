/**
 * Created by isaac on 16/5/6.
 */
import mongoose from 'mongoose';
import config from '../../config';
const LaborRecord = mongoose.model('LaborRecord');

export default function remove(req) {

  return new Promise((resolve, reject) => {

    var id = req.body.id;
    if (id) {
      LaborRecord.findOneAndRemove({_id: id}, function (err, doc) {
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

