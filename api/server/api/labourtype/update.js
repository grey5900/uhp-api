/**
 * Created by isaac on 2016/3/18.
 */
import mongoose from 'mongoose';
import config from '../../config';
const LaborType = mongoose.model('LaborType');

export default function update(req) {

  return new Promise((resolve, reject) => {

    const {id, args} = req.body;
    if (id) {
      LaborType.findOneAndUpdate({_id: id}, args, (err) => {
        if (err) {
          reject({msg: '更新失败！'});
        } else {
          resolve({code: config.code.success});
        }
      });
    } else {
      reject({msg: '缺少参数!'});
    }
  });
}
