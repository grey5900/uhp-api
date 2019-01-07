/**
 * Created by isaac on 12/2/15.
 */

module.exports = function () {

    var saver = require('./util');

    var bio1 = require('./types/bio1');
    var blood = require('./types/blood');
    var bt = require('./types/bt');
    var coa = require('./types/coa');
    var fe = require('./types/fe');
    var hiv = require('./types/hiv');
    var para = require('./types/para');

    saver(bio1);
    saver(blood);
    saver(bt);
    saver(coa);
    saver(fe);
    saver(hiv);
    saver(para);
};
