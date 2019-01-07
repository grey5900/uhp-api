import mongoose from 'mongoose';
import config from '../../config';
const Hospital = mongoose.model('Hospital');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function one(req) {

  return rap(req, 'delete', 'hospital', (resolve, reject) => {
    const {id} = req.body;
    if (id) {
      Hospital.findOneAndRemove({_id: id},
        (err) => {
          if (err) {
            reject({msg: '删除失败！'});
          } else {
            resolve({
              code: config.code.success,
              msg: '删除成功！'
            });
          }
        });
    }
  });
}
