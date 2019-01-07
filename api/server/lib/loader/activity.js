/**
 * Created by isaac on 16/8/20.
 */
import mongoose from 'mongoose';
const Activity = mongoose.model('Activity');
import {getValue, saveRowToDB} from './shared';

export default function (row, config) {
  const activityConfig = config.activity;
  const superMap = config.__map || {};

  const date = getValue(row, activityConfig.date, 'date');
  const address = getValue(row, activityConfig.address, 'address');

  Activity.findOne({date, address}).exec((error, doc) => {
    if (error) {
      console.log(213, error);
    } else if (doc) {
      console.log(215, 'warning not create activity on', date, address);
    } else {
      const newActivity = new Activity();
      saveRowToDB(superMap, row, activityConfig, newActivity);
    }
  });
}
