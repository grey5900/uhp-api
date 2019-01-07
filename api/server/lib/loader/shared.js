/**
 * Created by isaac on 16/8/20.
 */
/**
 * Created by isaac on 16/8/3.
 */
import mongoose from 'mongoose';

const convertors = {
  gender: (value) => value && value.indexOf('男') !== -1 ? 'Male' : 'Female'
};

export function trim(str) {
  if (str) {
    return str.trim();
  }
  return str || '';
}

export function getValue(row, mappedKey, key) {
  let realValue = null;
  if (typeof mappedKey === 'string') {
    const value = trim(row[mappedKey]);
    if (value) {
      const convertor = convertors[key];
      realValue = convertor ? convertor(value) : value;
    }
  } else {
    const {fixed} = mappedKey;
    if (fixed) {
      realValue = mappedKey.value;
    } else {
      const realKey = mappedKey.name;
      const valueMap = mappedKey.map;
      if (typeof valueMap === 'function') {
        realValue = valueMap(trim(row[realKey]));
      } else if (typeof valueMap === 'object') {
        realValue = valueMap[trim(row[realKey])];
      }
    }
  }
  if (key === 'person_id') {
    realValue = realValue.toString();
  }
  return realValue;
}

export function saveRowToDB(superMap, row, config, target, callback) {
  const promises = Object.keys(config).map(key => {
    const mappedKey = config[key];
    return new Promise((resolve, reject) => {
      let realValue = null;
      if (typeof mappedKey === 'string') {
        const value = trim(row[mappedKey]);
        if (value) {
          const convertor = convertors[key];
          realValue = convertor ? convertor(value) : value;
        }
      } else {
        const {fixed, exclude} = mappedKey;
        if (!exclude) {
          if (fixed) {
            realValue = mappedKey.value;
          } else {
            const realKey = mappedKey.name;
            const valueMap = mappedKey.map;
            if (typeof valueMap === 'function') {
              realValue = valueMap(trim(row[realKey]));
            } else if (typeof valueMap === 'object') {
              realValue = valueMap[trim(row[realKey])];
            } else {
              // find from db
              const {ref, field} = mappedKey;
              const refModel = mongoose.model(ref);
              const args = {};
              args[field] = trim(row[realKey]);
              refModel.findOne(args)
                .exec((error, doc) => {
                  if (error) {
                    console.log(45, args, error);
                    reject(error);
                  } else if (doc) {
                    realValue = doc._id;
                    target[key] = realValue;
                    resolve(realValue);
                  } else {
                    resolve();
                  }
                });
              // jump out of if-else
              return;
            }
          }
        }
      }
      if (key === 'person_id') {
        realValue = realValue.toString();
      }
      const mappedValue = superMap[realValue];
      if (typeof mappedValue !== 'undefined') {
        realValue = mappedValue;
      }
      if (realValue !== null && typeof realValue !== 'undefined') {
        target[key] = realValue;
      }
      resolve(realValue);
    });
  });
  Promise.all(promises)
    .then(() => {
      target.save((error) => {
        if (error) {
          console.log(error);
        } else {
          if (callback) {
            callback();
          }
        }
      });
    });
}
