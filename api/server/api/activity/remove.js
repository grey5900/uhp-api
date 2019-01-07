import mongoose from 'mongoose';
import config from '../../config';
const Activity = mongoose.model('Activity');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function one(req) {

  return rap(req, 'delete', 'activity', (resolve, reject) => {
    const {id} = req.body;
    if (id) {
      Activity.findOneAndRemove({_id: id},
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
