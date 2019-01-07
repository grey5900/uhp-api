/**
 * Created by isaac on 1/8/16.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var UserEventSchema = mongoose.Schema({

    patient    : {type: ObjectId, ref: 'Patient'},
    target_id   : {type: ObjectId},
    type       : {type: String},
    comment     : {type: String},
    end_time    : {type: Date},
    create_time : {type: Date, default: Date.now}
});

module.exports = mongoose.model('UserEvent', UserEventSchema);