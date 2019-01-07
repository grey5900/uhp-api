/*
 * Copyright(c) omk 2016
 * Filename: count_as_city.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期四, 23 六月 2016.
 */

import mongoose from 'mongoose';
import config from '../../config';
const Hospital = mongoose.model('Hospital');

export default function count_as_city(req) {

  return new Promise((resolve, reject) => {

    Hospital.aggregate([
      {
        $group: {
          _id: '$city',
          count: {$sum: 1}
        }
      }
    ]).sort({count: -1})
            .exec(function (err, docs) {
      if (err) {
        reject({msg: '查找失败！'});
      } else {
        resolve({
          code: config.code.success,
          data: docs
        });
      }
    });
  });
}
