/**
 * Created by isaac on 16/6/2.
 */
import mongoose from 'mongoose';
import config from '../../config';
const Income = mongoose.model('Income');

export default function update(req) {
  return new Promise((resolve, reject) => {
    const {id, args} = req.body;
    Income.findOneAndUpdate({_id: id}, args, (error) => {
      if (error) {
        console.log(error);
        reject({msg: '更新失败!'});
      } else {
        resolve({
          code: config.code.success
        });
      }
    });
  });
}
