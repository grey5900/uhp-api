/**
 * Created by chris on 12/3/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var PatientAdditionSchema = mongoose.Schema({

    patient          : {type: ObjectId, ref: 'Patient'},
    //家庭状况
    marital_status   : String,
    children_num     : String,
    patients_status  : String,

    //经济状况
    annual_income    : String,
    vehicle_status   : String,
    phone_status     : String,
    house_status     : String,

    //工作状况
    current_job      : String,
    job_before_disease: String,
    education        : String,
    skills           : String

});

module.exports = mongoose.model('PatientAddition', PatientAdditionSchema);