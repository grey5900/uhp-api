/*
 * Copyright(c) omk 2016
 * Filename: update.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期五, 26 二月 2016.
 */
import mongoose from 'mongoose';
import config from '../../config';
import fs from 'fs';
import {decodeBase64Image, randomString} from '../../lib/util';

import {roleAuthPromise as rap} from '../../lib/auth';
const Patient = mongoose.model('Patient');
const Contact = mongoose.model('Contact');
const File = mongoose.model('File');
const pinyin = require('pinyin');

export default function update(req) {

  return rap(req, 'update', 'patient', (resolve, reject) => {

    const info = req.body;
    const {patient, contact} = info;
    const patientID = patient.id;
    const contactID = contact._id;
    const {avatar = {}, avatarData} = patient;
    if (patient.real_name) {
      let pinyinName = pinyin(patient.real_name, {
        heteronym: true,
        segment: true,
        style: pinyin.STYLE_NORMAL
      }).toString().replace(/,/g, '');
      patient.pinyin_name = pinyinName;
    }
    if (patient.person_id) {
      patient.person_id = patient.person_id.toString();
    }
    if (patientID) {
      Patient.findOneAndUpdate({_id: patientID}, patient, (err) => {
        if (err) {
          reject({msg: '修改失败！'});
        } else {
          resolve({code: config.code.success});
        }
      });
    } else {
      reject({msg: '缺少参数！'});
    }

    if (!avatar._id && avatarData) {
      const buffer = decodeBase64Image(avatarData);
      const imageName = `${randomString()}.png`;
      const imagePath = `${config.uploadFolder}/${imageName}`;
      fs.writeFile(imagePath, buffer.data, (err) => {
        if (err) {
          console.log(err);
          reject({msg: '保存头像失败!'});
        } else {
          const file = new File();
          file.name = imageName;
          file.original_name = imageName;
          file.size = buffer.length;
          file.type = 'png';
          file.path = imagePath;
          file.save((error) => {
            if (error) {
              reject({msg: '保存头像失败!'});
            }
          });
          Patient.findOneAndUpdate({_id: patientID}, {avatar: file._id}, (err) => {
            if (err) {
              console.log(err);
            }
          })
        }
      })
    } else if (avatar._id && avatarData) {
      const buffer = decodeBase64Image(avatarData);
      const imageName = `${randomString()}.png`;
      const imagePath = `${config.uploadFolder}/${imageName}`;
      fs.writeFile(imagePath, buffer.data, (err) => {
        if (err) {
          console.log(err);
          reject({msg: '保存头像失败!'});
        } else {
          const file = {};
          file.name = imageName;
          file.original_name = imageName;
          file.size = buffer.data.length;
          file.type = 'png';
          file.path = imagePath;
          console.log('file:', file);
          File.findOneAndUpdate({_id: avatar._id}, {...file}, (err) => {
            if (err) {
              console.log(err);
            }
          })
        }
      })
    }

    if (contact) {
      if (contactID) {
        Contact.findOneAndUpdate({_id: contactID}, contact, (err) => {
          if (err) {
            reject({msg: '修改失败！'});
          } else {
            resolve({code: config.code.success});
          }
        });
      } else {
        const newContact = new Contact(contact);
        newContact.save((error) => {
          if (error) {
            console.log('contact :', error);
          } else {
            Patient.findOneAndUpdate({_id: patientID}, {contact: newContact._id}, (err) => {
              if (err) {
                console.log(err);
              }
            })
          }
        });
      }
    }
  });
}
