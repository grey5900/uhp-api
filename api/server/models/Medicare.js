 /**
 * Created by isaac on 11/4/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

//医保
var MedicareSchema = mongoose.Schema({

    number      : {type: String, required: true, unique: true}, // 医保编号
    locality    : String,                                       // 医保所属地
    type        : String,                                       // 医保类型

    patient     : {type: ObjectId, ref: 'Patient'},
    deleted     : {type: Boolean, default: false},
    create_time : {type: Date, default: Date.now}
});

module.exports = mongoose.model('Medicare', MedicareSchema);
