/**
 * Created by isaac on 16/5/5.
 */
import mongoose from 'mongoose';
import config from '../../config';
const Patient = mongoose.model('Patient');
import {roleAuthPromise as rap} from '../../lib/auth';
const pinyin = require('pinyin');

export default function create(req) {

  return rap(req, 'create', 'patient', (resolve, reject) => {

    var info = req.body.patient;
    var person_id = info.person_id;

    const savePatient = (info) => {
      let pinyinName = pinyin(info.real_name, {
        heteronym: true,
        segment: true,
        style: pinyin.STYLE_NORMAL
      }).toString().replace(/,/g, '');
      if (!info.pinyin_name) {
        info.pinyin_name = pinyinName;
      }
      if (info.person_id) {
        info.person_id = info.person_id.toString();
      }
      var patient = new Patient(info);

      patient.save(function (error) {
        if (error) {
          console.log(error);
          reject({msg: person_id + '添加失败！'});
        } else {
          delete patient.password;
          resolve({
            code: config.code.success,
            data: patient
          });
        }
      });
    }
    if (person_id) {
      Patient.findOne({person_id}, (err, doc) => {
        if (doc) {
          reject({msg: '该用户已存在！'});
        } else {
          savePatient(info);
        }
      });
    } else {
      savePatient(info);
    }
  });
}
