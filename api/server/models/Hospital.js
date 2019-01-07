/**
 * Created by isaac on 11/4/15.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

//医院
var HospitalSchema = mongoose.Schema({

  name: String,
  province: String,
  city: String,
  area: String,
  address: String,
  visited: String,
  share: String,
  marketing: String,
  service: String,
  charge: String,
  features: String,
  scheduling: String,
  equipment: String,
  layout: String,
  level: String,
  medical: String,
  patients_info: String,
  beds: String,

  contact: {type: ObjectId, ref: 'Doctor'},
  super_hospital: {type: ObjectId, ref: 'Hospital'},
  deleted: {type: Boolean, default: false},
  create_time: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Hospital', HospitalSchema);
