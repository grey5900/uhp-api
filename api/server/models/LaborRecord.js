/**
 * Created by isaac on 1/13/16.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

//劳务记录
var LaborRecordSchema = mongoose.Schema({

    reference_id : {type: ObjectId, ref: 'LaborRecord'},
    is_review    : {type: Boolean, default: false},
    generation   : {type: Number, default: 0}, //It will increase when create for `NotFinished' LaborRecord
    name         : {type: String},
    base         : {type: String},
    director     : {type: ObjectId, ref: 'Admin'}, //负责人
    start_time   : {type: Date}, //开始时间
    dead_line    : {type: Date},   //完成时间
    status       : {type: String, enum: ['Init',
                                         'Going',
                                         'NotFinished',
                                         'InReview',
                                         'InCheck',
                                         'Finished',
                                         'Canceled'], default: 'Init'},
    payment      : {type: Number},
    type         : {type: ObjectId, ref: 'LaborType'},
    assignee     : {type: ObjectId, ref: 'Patient'},
    reviewer     : {type: ObjectId, ref: 'Patient'},
    score        : {
        quality  : {type: Number, default: 0},
        speed    : {type: Number, default: 0}
    },
    deleted      : {type: Boolean, default: false},
    create_time  : {type: Date, default: Date.now},
    comment      : {type: String},
});

module.exports = mongoose.model('LaborRecord', LaborRecordSchema);
