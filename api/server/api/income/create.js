/**
 * Created by isaac on 16/6/2.
 */
import mongoose from 'mongoose';
import config from '../../config';
const Income = mongoose.model('Income');

export default function create(req) {
  return new Promise((resolve, reject) => {
    const income = new Income(req.body);
    income.save((error) => {
      if (error) {
        console.log(error);
        reject({msg: '创建失败!'});
      } else {
        resolve({
          code: config.code.success,
          data: income
        });
      }
    });
  });
}
