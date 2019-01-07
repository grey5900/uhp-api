/**
 * Created by isaac on 16/6/2.
 */
import mongoose from 'mongoose';
const Income = mongoose.model('Income');
import {allAPI} from '../../lib/util';

export default function all(req) {
  const {patient} = req.query;
  return allAPI(Income, {patient}, 'type');
}
