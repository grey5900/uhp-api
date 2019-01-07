/**
 * Created by isaac on 16/8/20.
 */
import mongoose from 'mongoose';
import * as actions from './server';
import path from 'path';
import dbConfig from './server/config';
import importDataFromXLSX from './server/lib/loader';

mongoose.connect(dbConfig.db);

function importPatients() {
  let config = require('./nan35.js');
  importDataFromXLSX(path.join(__dirname, './nan35.xls'), config);
  config = require('./m194.js');
  importDataFromXLSX(path.join(__dirname, './m194.xls'), config);
  config = require('./n149.js');
  importDataFromXLSX(path.join(__dirname, './n149.xls'), config);
  config = require('./xlsx.js');
  importDataFromXLSX(path.join(__dirname, './818.xls'), config);
}

function importDonate() {
  let config = require('./donate.js');
  importDataFromXLSX(path.join(__dirname, './d1.xls'), config);
  importDataFromXLSX(path.join(__dirname, './d2.xls'), config);
  importDataFromXLSX(path.join(__dirname, './d3.xls'), config);
  importDataFromXLSX(path.join(__dirname, './d4.xls'), config);
  importDataFromXLSX(path.join(__dirname, './d5.xls'), config);
  importDataFromXLSX(path.join(__dirname, './d6.xls'), config);
  importDataFromXLSX(path.join(__dirname, './d7.xls'), config);
  importDataFromXLSX(path.join(__dirname, './d8.xls'), config);
  importDataFromXLSX(path.join(__dirname, './d9.xls'), config);
  importDataFromXLSX(path.join(__dirname, './d10.xls'), config);
}

function importActivity() {
  let config = require('./activity.js');
  importDataFromXLSX(path.join(__dirname, './a1.xls'), config);
}

function importLabor() {
  let config = require('./labor.js');
  importDataFromXLSX(path.join(__dirname, './La1.xls'), config);
}

// importPatients();
importDonate();
// importActivity();
// importLabor();
