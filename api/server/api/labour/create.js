/**
 * Created by isaac on 16/5/5.
 */
import mongoose from 'mongoose';
import config from '../../config';
const LaborRecord = mongoose.model('LaborRecord');

export default function create(req) {

  return new Promise((resolve, reject) => {
    var info = req.body.labourRecord;
    var laborRecord = new LaborRecord(info);
    laborRecord.save(function (error) {
      if (error) {
        console.log(error);
        reject({msg: '添加失败！'});
      } else {
        resolve({
          code: config.code.success,
          data: laborRecord
        });
      }
    });
  });
}
