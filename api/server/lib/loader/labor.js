/**
 * Created by isaac on 16/8/20.
 */
import mongoose from 'mongoose';
const LaborType = mongoose.model('LaborType');
const LaborRecord = mongoose.model('LaborRecord');
const Patient = mongoose.model('Patient');
import {getValue, saveRowToDB} from './shared';

export default function (row, allConfig) {
  const laborConfig = allConfig.labor;
  const superMap = allConfig.__map || {};

  const typeName = row[laborConfig.type.name];
  const assigneeName = row[laborConfig.assignee.name];
  const startTime = getValue(row, laborConfig.start_time, 'start_time');
  const endTime = getValue(row, laborConfig.dead_line, 'dead_line');
  LaborType.findOne({name: new RegExp(typeName, 'i')})
    .exec((error, typeDoc) => {
      if (error) {
        console.log(error);
      } else if (typeDoc) {
        Patient.findOne({real_name: assigneeName})
          .exec((error, patientDoc) => {
            if (error) {
              console.log(error);
            } else if (patientDoc) {
              LaborRecord.findOne({
                assignee: patientDoc.id,
                type: typeDoc.id,
                start_time: startTime,
                dead_line: endTime
              }).exec((error, record) => {
                if (error) {
                  console.log(error);
                } else if (record) {
                  console.log('warning: not import record', typeName, assigneeName, startTime, endTime);
                } else {
                  const newRecord = new LaborRecord();
                  newRecord.assignee = patientDoc.id;
                  newRecord.type = typeDoc.id;
                  saveRowToDB(superMap, row, laborConfig, newRecord);
                }
              });
            } else {
              console.log('no such patient', assigneeName);
            }
          });
      } else {
        console.log('no type', typeName);
      }
    });
}

