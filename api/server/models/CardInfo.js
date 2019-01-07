/**
 * Created by isaac on 1/8/16.
 */
var mongoose = require('mongoose');

var CardInfoSchema = mongoose.Schema({

    bank_name        : {type: String, required: true},
    card_number      : {type: String, required: true, unique: true},
    user_name        : {type: String},
    associated_mobile: {type: String},
    create_time : {type: Date, default: Date.now}
});

module.exports = mongoose.model('CardInfo', CardInfoSchema);