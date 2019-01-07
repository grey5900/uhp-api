/**
 * Created by isaac on 1/8/16.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

//劳务类型
var LaborTypeSchema = mongoose.Schema({

    name         : {type: String, required: true, unique: true},
    comment      : {type: String},
    province     : {type: String},
    city         : {type: String},
    area         : {type: String},
    source       : {type: String},
    paid         : String, // 已发工资
    patients     : [{type: ObjectId, ref: 'Patient'}], //参加改劳务的人数
    base_cost    : String, // 基地成本
    sale_amount  : String, // 销售金额

    deleted      : {type: Boolean, default: false},
    create_time  : {type: Date, default: Date.now}
});

module.exports = mongoose.model('LaborType', LaborTypeSchema);
