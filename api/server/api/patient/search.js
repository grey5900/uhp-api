/**
 * Created by yons on 16/3/12.
 */
import mongoose from 'mongoose';
import config from '../../config';
import url from 'url';
const Patient = mongoose.model('Patient');
const Hospital = mongoose.model('Hospital');

export default function search(req) {

  return new Promise((resolve, reject) => {
    const obj = url.parse(req.url, true);
    const {search} = obj.query;
    let skip = parseInt(obj.query.skip);
    let limit = parseInt(obj.query.limit);
    if (!skip) {
      skip = 0;
    }
    if (!limit) {
      limit = 20;
    }
    if (search) {
      const exp = new RegExp(search, 'i');
      Hospital.find({name: exp}, (hospitalerr, hospitals) => {
        if (!hospitalerr) {
          const hospitalList = hospitals.map((hospital) => {return hospital._id})
          const args = {
            $or: [
              {hospital: {$in: hospitalList}},
              {real_name: exp},
              {mobile: exp},
              {person_id: exp}
            ]
          };
          Patient.count(args, (error, count) => {
            if (error) {
              reject({msg: error.message});
            } else {
              if (count === 0) {
                resolve({
                  code: config.code.success,
                  data: {
                    total: 0,
                    patients: []
                  }
                });
              } else {
                Patient.find(args)
                       .select('-__v')
                       .populate('hospital avatar')
                       .skip(skip)
                       .limit(limit)
                       .exec((err, docs) => {
                         if (err || !docs) {
                           reject({msg: '查找失败！'});
                         } else {
                           resolve({
                             code: config.code.success,
                             data: {
                               total: count,
                               patients: docs
                             }
                           });
                         }
                       });
              }
            }
          });
        }
      })
    } else {
      reject({msg: '缺少参数!'});
    }
  });
}
