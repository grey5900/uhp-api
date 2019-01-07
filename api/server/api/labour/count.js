/**
 * Created by jiang_mac on 16/5/23.
 */
import mongoose from 'mongoose';
import config from '../../config';
const LaborRecord = mongoose.model('LaborRecord');
const LaborType = mongoose.model('LaborType');

export default function count(req) {

  return new Promise((resolve, reject) => {
    LaborRecord.aggregate([
      {
        $group: {
          _id: '$type',
          typecount: {$sum: 1},
          income: {$sum: '$payment'}
        }
      }
    ]).exec(function (err, docs) {
        if (err) {
          reject({msg: '查找失败!'});
        } else {
          LaborType.populate(docs, {"path": "_id"}, function (error, populatedDocs) {
            if (error) {
              reject({msg: 'populate失败'})
            } else {
              resolve({
                code: config.code.success,
                data: populatedDocs
              });
            }
          });
        }
      })
  });
}
