/**
 * Created by isaac on 16/5/6.
 */
import mongoose from 'mongoose';
import config from '../../config';
const LaborType = mongoose.model('LaborType');

export default function remove(req) {

  return new Promise((resolve, reject) => {

    var id = req.body.id;
    if (id) {
      LaborType.findOneAndRemove({_id: id}, function (err, doc) {
        if (err) {
          console.log(err);
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

