/**
 * Created by isaac on 16/8/20.
 */
import mongoose from 'mongoose';
import moment from 'moment';
const Patient = mongoose.model('Patient');
const Donate = mongoose.model('Donate');
import {getValue, saveRowToDB, trim} from './shared';

function tryToCreateOrUpdatePatient(error, patient, allConfig, row) {
  const patientConfig = allConfig.patient;
  const superMap = allConfig.__map || {};
  if (error) {
    console.log(error);
  } else {
    if (patient) {
      // need to update patient
      console.log('will update', row);
    } else {
      // create new patient
      patient = new Patient();
      console.log('will create', row);
    }
    saveRowToDB(superMap, row, patientConfig, patient, () => {
      const donateConfig = allConfig.donate;
      if (donateConfig) {
        const date = getValue(row, donateConfig.date, 'date');
        const bank_card = getValue(row, donateConfig.bank_card, 'bank_card');
        console.log(139, date, bank_card);
        const startDate = moment(date).startOf('day').toDate();
        const endDate = moment(date).endOf('day').toDate();
        const args = {bank_card, date: {$gte: startDate, $lte: endDate}, patient: patient.id};
        Donate.findOne(args)
          .exec((error, doc) => {
            if (error) {
              console.log(141, error);
            } else if (doc) {
              console.log('[warning] not add donate record for patient on same day:', patient.real_name, date);
            } else {
              const donate = new Donate();
              donate.patient = patient.id;
              saveRowToDB(superMap, row, donateConfig, donate);
            }
          });
      }
    });
  }
}

export default function (row, allConfig) {
  const patientConfig = allConfig.patient;
  const {person_id} = patientConfig;
  let personID = trim(row[person_id]);
  if (personID) {
    personID = personID.toString();
  }
  // if has personID
  //
  if (personID && personID.length > 0) {
    Patient.findOne({person_id: personID})
      .exec((error, patient) => tryToCreateOrUpdatePatient(error, patient, allConfig, row));
  } else {
    // check for mobile
    //
    const {mobile} = patientConfig;
    const mobileValue = trim(row[mobile]);
    if (mobileValue && mobileValue.length > 0) {
      Patient.findOne({mobile: mobileValue})
        .exec((error, patient) => tryToCreateOrUpdatePatient(error, patient, allConfig, row));
    } else {
      // judge by area && real_name
      //
      const {real_name, area} = patientConfig;
      const realName = trim(row[real_name]);
      const areaValue = trim(row[area]);
      Patient.findOne({real_name: realName, area: areaValue})
        .exec((error, patient) => tryToCreateOrUpdatePatient(error, patient, allConfig, row));
    }
  }
}
