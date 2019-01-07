import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';

const Donate = mongoose.model('Donate');

export default function create(req) {

  return rap(req, 'create', 'donate', (resolve, reject) => {
    const info = {
      ...req.body,
      deleted: false,
    };
    const {...others} = info;
    const donate = new Donate(others);
    donate.save((error) => {
      if (error) {
        console.log(error);
        reject({msg: '添加失败！'});
      } else {
        resolve({
          code: config.code.success,
          donate
        });
      }
    });
  });
}
