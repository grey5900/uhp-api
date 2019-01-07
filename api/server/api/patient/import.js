/**
 * Created by isaac on 16/8/3.
 */
import mongoose from 'mongoose';
import xlsx from 'xlsx';
import config from '../../config';
const Patient = mongoose.model('Patient');

function tryToCreateOrUpdatePatient(error, patient, config, row) {
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
    Object.keys(config).forEach((key) => {
      const mappedKey = config[key];
      if (mappedKey) {
        const value = row[mappedKey];
        if (value) {
          patient[key] = value;
        }
      }
    });
    patient.save((error) => {
      if (error) {
        console.log(error);
      }
    });
  }
}

export default function (req) {

  return new Promise((resolve, reject) => {
    const {file} = req;
    console.log(file);
    // TODO
    const config = {};
    // read xlsx
    //
    const workbook = xlsx.readFile(file.path);
    const result = [];
    // convert to json
    //
    workbook.SheetNames.forEach((sheetName) => {
      const roa = xlsx.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
      if (roa.length > 0) {
        result.push(roa);
      }
    });
    // import to db
    result.forEach((sheet) => {
      sheet.forEach((row) => {
        const {person_id} = config;
        const personID = row[person_id];
        // if has personID
        //
        if (personID && personID.length > 0) {
          Patient.findOne({person_id: personID})
            .exec((error, patient) => tryToCreateOrUpdatePatient(error, patient, config, row));
        } else {
          // check for mobile
          //
          const {mobile} = config;
          const mobileValue = row[mobile];
          if (mobileValue && mobileValue.length > 0) {
            Patient.findOne({mobile: mobileValue})
              .exec((error, patient) => tryToCreateOrUpdatePatient(error, patient, config, row));
          } else {
            // judge by area && real_name
            //
            const {real_name, area} = config;
            const realName = row[real_name];
            const areaValue = row[area];
            Patient.findOne({real_name: realName, area: areaValue})
              .exec((error, patient) => tryToCreateOrUpdatePatient(error, patient, config, row));
          }
        }
      });
    });
  });
}
