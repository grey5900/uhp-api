/**
 * Created by jiang_mac on 16/5/23.
 */
import mongoose from 'mongoose';
import config from '../../config';
import moment from 'moment';
const Patient = mongoose.model('Patient');

const ALL = 'all';

export default function count(req) {

  return new Promise((resolve, reject) => {
    var {area, age, hospital, gender, education, type, group} = req.query;
    const args = {};
    if (area !== ALL && area.length > 0) {
      args.area = new RegExp(area, 'i');
    }
    if (age !== ALL) {
      const range = age.split('-');
      args.birthday = checkDate(range[0], range[1]);
    }
    if (hospital !== ALL) {
      args.hospital = hospital;
    }
    if (gender !== ALL) {
      args.gender = gender;
    }
    if (education !== ALL) {
      args.education = education;
    }
    if (type !== ALL) {
      args.type = type;
    }
    console.log(args);
    Patient.find(args).lean().exec((err, docs) => {
      if (err) {
        console.log(err);
        reject({msg: '查询失败!'});
      } else {
        const result = {};
         docs.forEach((patient) => {
           var obj = patient;
           var key = obj[group];
           if (typeof key === 'undefined') {
             key = '<无记录>';
           }
           var count = result[key] || 0;
           ++count;
           result[key] = count;
         });
        resolve({
          code: config.code.success,
          data: result
        });
      }
    });
  });
}

function checkDate(minAge, maxAge) {
  const maxDate = moment().subtract(minAge, 'years').toDate();
  const minDate = moment().subtract(maxAge, 'years').toDate();
  return {'$gte': minDate, '$lte': maxDate}
}
