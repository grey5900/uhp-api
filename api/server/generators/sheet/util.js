/**
 * Created by isaac on 12/2/15.
 */

var mongoose = require('mongoose');
var SheetReference = mongoose.model('SheetReference');
var SheetType = mongoose.model('SheetType');

function rangeFromString(str) {
    var range;
    if (str && str.length > 0) {
        var idx = str.indexOf('<');
        if (idx != -1) {
            range = str.split('<');
            range.splice(0, 0, '0');
        } else {
            idx = str.indexOf('>');
            if (idx != -1) {
                range = str.split('>');
                range.push(Number.MAX_VALUE + '');
            } else {
                idx = str.indexOf('-');
                if (idx != -1) {
                    range = str.split('-');
                } else {
                    range = [str, str];
                }
            }
        }
    } else {
        range = ['', ''];
    }

    return range;
}

function save(array, type) {

    for (var i = 0; i < array.length; ++i) {
        var info = array[i];

        var range = rangeFromString(info.reference);
        var ref = new SheetReference();

        ref.name = info.name;
        ref.short_name = info.short_name;

        ref.max_value = range[0].trim();
        ref.min_value = range[1].trim();
        ref.unit = info.unit;

        type.references.push(ref);

        ref.save();
    }
}

module.exports = function (info) {
    var name = info.name;
    var data = info.data;
    var type = new SheetType();
    type.name = name;
    save(data, type);

    type.save(function (error) {
        if (error) {
            console.log(error);
        } else {
            console.log('saved:', name);
        }
    });
};