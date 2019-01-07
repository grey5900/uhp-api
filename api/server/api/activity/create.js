import mongoose from 'mongoose';
import config from '../../config';
import {roleAuthPromise as rap} from '../../lib/auth';

const Activity = mongoose.model('Activity');

export default function create(req) {

  return rap(req, 'create', 'activity', (resolve, reject) => {
    const info = {
      ...req.body,
      deleted: false,
    };
    const {...others} = info;
    const activity = new Activity(others);
    activity.save((error) => {
      if (error) {
        console.log(error);
        reject({msg: '添加失败！'});
      } else {
        resolve({
          code: config.code.success,
          activity
        });
      }
    });
  });
}
