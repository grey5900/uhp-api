import mongoose from 'mongoose';
import '../models/Patient';
const Patient = mongoose.model('Patient');
const pinyin = require('pinyin');
export default function () {
  return new Promise((resolve, reject) => {
    const args = {real_name: {$ne: null}};
    Patient.find(args)
      .select('real_name _id')
      .exec((err, docs) => {
        docs.forEach((item, idx) => {
          if (item.real_name && item.real_name.length > 0) {
            let pinyinName = pinyin(item.real_name, {
              heteronym: true,
              segment: true,
              style: pinyin.STYLE_NORMAL
            }).toString().replace(/,/g, '');
            if (idx < 10) {
              console.log(pinyinName);
            }
            item.pinyin_name = pinyinName;
            item.save((err) => {
              if (err) console.log(err);
            });
          }
        });
      });
  });
}
