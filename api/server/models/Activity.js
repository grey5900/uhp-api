/*
 * Copyright(c) omk 2016
 * Filename: Activity.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期六,  4 六月 2016.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

//活动
var ActivitySchema = mongoose.Schema({

  date                 : Date,
  address              : String,
  theme                : String,
  style                : String,
  invite_type          : String,

  speaker              : String,
  speaker_mobile       : String,

  participant_num      : Number,
  newer_num            : Number,
  social_participant   : String,
  sponsor              : String,
  sponsor_money        : Number,

  worker_num           : Number,
  market_period        : String,
  cost                 : Number,

  return_visit_num     : Number,
  return_visit_comment : String,
  return_visit_seed    : String,

  effect               : String,
  our_patients         : Number,

  deleted              : {type: Boolean, default: false},
  create_time          : {type: Date, default: Date.now}
});

module.exports = mongoose.model('Activity', ActivitySchema);
