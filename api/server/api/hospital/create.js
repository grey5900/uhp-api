import mongoose from 'mongoose';
import config from '../../config';
const Hospital = mongoose.model('Hospital');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function create(req) {

  return rap(req, 'create', 'hospital', (resolve, reject) => {
    const info = {
      ...req.body,
      deleted: false
    };
    const hospital = new Hospital(info);
    hospital.save((error) => {
      if (error) {
        reject({msg: '医院创建失败!'});
      } else {
        resolve({
          code: config.code.success,
          data: hospital
        });
      }
    });
  });
}
