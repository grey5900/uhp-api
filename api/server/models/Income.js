/**
 * Created by isaac on 16/6/2.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

//劳务收入
var IncomeSchema = mongoose.Schema({

  patient      : {type: ObjectId, required: true, ref: 'Patient'},
  type   : {type: ObjectId, ref: 'LaborType'}, // 劳务类型
  start_time   : {type: Date},
  end_time     : {type: Date},
  value        : {type: Number},

  create_time  : {type: Date, default: Date.now}
});

module.exports = mongoose.model('Income', IncomeSchema);
