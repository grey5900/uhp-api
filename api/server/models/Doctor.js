/**
 * Created by isaac on 11/4/15.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

//医生
var DoctorSchema = mongoose.Schema({

    //id
    qualification: {type: String}, //医师资格证
    person_id    : String, //身份证号码
    name         : String,


    hospital     : {type: ObjectId, ref: 'Hospital'},
    department   : String,                          // 科室
  title: String, //职位


    //contact
    mobile       : String,
    email        : String,
    wechat       : String,
    qq           : String,

    //personal
    gender       : {type: String, enum: ['Male', 'Female'], default: 'Male'},  //0: male, 1: female
    avatar       : {type: ObjectId, ref: 'File'},
    avatar_url   : String,
    birthday     : Date,
    comment      : String,

  deleted        : {type: Boolean, default: false},
    create_time  : {type: Date, default: Date.now}
});

module.exports = mongoose.model('Doctor', DoctorSchema);
