/**
 * Created by chris on 15-11-4.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var PatientSchema = mongoose.Schema({
  real_name              : {type: String, es_indexed: true}, //patient's real name.
  pinyin_name            : {type: String, es_indexed: true},
  user_name              : {type: String, es_indexed: true},
  person_id              : {type: String, sparse: true, es_indexed: true},//ID card
  password               : String,
  type                   : {type: String, enum: ['ckd', 'hemodialysis', 'peritoneal']},
  number                 : Number, //TODO autoIncrement field
  ckd_stage              : {type: String, enum: ['1', '2', '3', '4', '5']},
  avatar                 : {type: ObjectId, ref: 'File'},

  //where we know the patient
  source                 : String,

  return_visit_comment   : String,
  //contact
  mobile                 : {type: String, es_indexed: true},
  mobile2                : {type: String, es_indexed: true},
  email                  : {type: String, es_indexed: true},
  qq                     : {type: String, es_indexed: true},
  contact                : [{type: ObjectId, ref: 'Contact'}],

  //address part
  city                   : {type: String, es_indexed: true},
  area                   : {type: String, es_indexed: true},
  address_detail         : {type: String, es_indexed: true},
  zipcode                : {type: String, es_indexed: true},

  //personal info
  gender                 : {type: String, enum: ['Male', 'Female', ''], default: 'Male'},
  birthday               : Date,
  job                    : {type: String, es_indexed: true},
  nation                 : {type: String, es_indexed: true},
  education_degree       : {type: String, enum: ['', 'primary', 'junior', 'senior', 'college', 'bachelor', 'master', 'doctor'], default: ''},
  marital_status         : {type: String, enum: ['single', 'married', 'divorce', ''], default: ''},

  //hospital
  hospital               : {type: ObjectId, ref: 'Hospital'},
  first_treatment        : Date,

  //payment
  alipay                 : {type: String, es_indexed: true},
  wechat                 : {type: String, es_indexed: true},
  card                   : {type: ObjectId, ref: 'CardInfo'},

  dialysis_schedule_days : {type: String, default: '1-3-5'},

  mode_pay : String, // 支付方式
  primary_disease        : String,
  other_disease : String, // 其他疾病
  medicare_type          : String, // 医保类型

  is_reviewer            : {type: Boolean, default: false},
  //event
  current_event          : {type: ObjectId, ref: 'UserEvent'},

  //labor
  skill                  : String,
  job_intention          : String,

  //fund
  know_fund              : String,
  creator                : {type: ObjectId, ref: 'Admin'},
  deleted                : {type: Boolean, default: false},
  create_time            : {type: Date, default: Date.now}
});

PatientSchema.plugin(deepPopulate,{});

module.exports = mongoose.model('Patient', PatientSchema);
