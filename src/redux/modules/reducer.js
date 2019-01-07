import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-connect';

import auth from './auth';
import {reducer as form} from 'redux-form';
import patient from './patient';
import ui from './ui';
import hospital from './hospital';
import doctor from './doctor';
import admin from './admin';
import search from './search';
import labour from './labour';
import labourType from './labourType';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  auth,
  doctor,
  form,
  labour,
  labourType,
  patient,
  ui,
  hospital,
  admin,
  search
});
