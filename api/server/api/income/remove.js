/**
 * Created by isaac on 16/6/2.
 */
import mongoose from 'mongoose';
import config from '../../config';
const Income = mongoose.model('Income');

export default function remove(req) {
  return new Promise((resolve, reject) => {
    const {id} = req.body;
    Income.findOneAndRemove({_id: id}, (error) => {
      if (error) {
        console.log(error);
        reject({msg: '删除失败!'});
      } else {
        resolve({
          code: config.code.success
        });
      }
    });
  });
}
