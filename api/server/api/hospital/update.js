import mongoose from 'mongoose';
import config from '../../config';
const Hospital = mongoose.model('Hospital');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function update(req) {

  return rap(req, 'update', 'hospital', (resolve, reject) => {

    const info = req.body;

    Hospital.findOneAndUpdate({_id: info.id}, info.args,
      (error, doc) => {
        if (error || !doc) {
          reject({msg: '更新失败!'});
        } else {
          resolve({code: config.code.success});
        }
      });
  });
}
