/**
 * Created by isaac on 16/8/20.
 */
import xlsx from 'xlsx';
import patientLoader from './patient';
import activityLoader from './activity';
import laborLoader from './labor';

export default function (filePath, allConfig) {
  // read xlsx
  //
  const workbook = xlsx.readFile(filePath);
  const result = [];
  // convert to json
  //
  workbook.SheetNames.forEach((sheetName) => {
    const roa = xlsx.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    if (roa.length > 0) {
      result.push(roa);
    }
  });
  const patientConfig = allConfig.patient;
  const activityConfig = allConfig.activity;
  const laborConfig = allConfig.labor;

  // import to db
  result.forEach((sheet) => {
    sheet.forEach((row) => {
      if (Object.keys(row).length > 0) {
        if (patientConfig) {
          patientLoader(row, allConfig);
        } else if (activityConfig) {
          activityLoader(row, allConfig);
        } else if (laborConfig) {
          laborLoader(row, allConfig);
        }
      }
    });
    console.log('did load');
  });
}
