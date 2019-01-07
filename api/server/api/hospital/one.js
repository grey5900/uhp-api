import mongoose from 'mongoose';
import config from '../../config';
const Hospital = mongoose.model('Hospital');
import {roleAuthPromise as rap} from '../../lib/auth';

export default function one(req) {

  return rap(req, 'search', 'hospital', (resolve, reject) => {
    const {id} = req.query;

    if (id) {
      Hospital.findOne({_id: id})
              .populate('contact')
              .exec((err, doc) => {
                if (err || !doc) {
                  reject({msg: '查找失败'});
                } else {
                  resolve({
                    code: config.code.success,
                    data: doc
                  });
                }
              });
    } else {
      reject({msg: '缺少参数!'});
    }
  });
}
