/*
 * Copyright(c) omk 2016
 * Filename: Donate.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期二,  7 六月 2016.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

//活动
var DonateSchema = mongoose.Schema({

  patient       : {type: ObjectId, ref: 'Patient'},
  date          : Date,
  amount        : Number,
  type          : String,
  bank_card     : String,
  openning_bank : String,

  deleted       : {type: Boolean, default: false},
  create_time   : {type: Date, default: Date.now}
});

module.exports = mongoose.model('Donate', DonateSchema);
