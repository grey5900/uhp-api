/**
 * Created by isaac on 16/2/27.
 */
import Alert from 'react-s-alert';

const LOAD = 'uhp/patient/LOAD';
const LOAD_SUCCESS = 'uhp/patient/LOAD_SUCCESS';
const LOAD_FAIL = 'uhp/patient/LOAD_FAIL';

const LOAD_ALL = 'uhp/patient/LOAD_ALL';
const LOAD_ALL_SUCCESS = 'uhp/patient/LOAD_ALL_SUCCESS';
const LOAD_ALL_FAIL = 'uhp/patient/LOAD_ALL_FAIL';

const CREATE = 'uhp/patient/CREATE';
const CREATE_SUCCESS = 'uhp/patient/CREATE_SUCCESS';
const CREATE_FAIL = 'uhp/patient/CREATE_FAIL';

const LOAD_PATIENT = 'uhp/patient/LOAD_PATIENT';
const LOAD_PATIENT_SUCCESS = 'uhp/patient/LOAD_PATIENT_SUCCESS';
const LOAD_PATIENT_FAIL = 'uhp/patient/LOAD_PATIENT_FAIL';

const UPDATE = 'uhp/patient/UPDATE';
const UPDATE_SUCCESS = 'uhp/patient/UPDATE_SUCCESS';
const UPDATE_FAIL = 'uhp/patient/UPDATE_FAIL';

const FETCH_BY_QR = 'uhp/patient/FETCH_BY_QR';
const FETCH_BY_QR_SUCCESS = 'uhp/patient/FETCH_BY_QR_SUCCESS';
const FETCH_BY_QR_FAIL = 'uhp/patient/FETCH_BY_QR_FAIL';

const DELETE = 'uhp/patient/DELETE';
const DELETE_SUCCESS = 'uhp/patient/DELETE_SUCCESS';
const DELETE_FAIL = 'uhp/patient/DELETE_FAIL';

const SEARCH = 'uhp/patient/SEARCH';
const SEARCH_SUCCESS = 'uhp/patient/SEARCH_SUCCESS';
const SEARCH_FAIL = 'uhp/patient/SEARCH_FAIL';

const COUNT = 'uhp/patient/COUNT';
const COUNT_SUCCESS = 'uhp/patient/COUNT_SUCCESS';
const COUNT_FAIL = 'uhp/patient/COUNT_FAIL';

const TYPE_COUNT = 'uhp/patient/TYPE_COUNT';
const TYPE_COUNT_SUCCESS = 'uhp/patient/TYPE_COUNT_SUCCESS';
const TYPE_COUNT_FAIL = 'uhp/patient/TYPE_COUNT_FAIL';

const SET_PAGEINDEX = 'uhp/patient/SET_PAGEINDEX';

const initialState = {
  loaded: false
};

export default function info(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
    case CREATE:
    case LOAD_PATIENT:
    case FETCH_BY_QR:
    case UPDATE:
    case DELETE:
    case SEARCH:
    case TYPE_COUNT:
    case LOAD_ALL:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        current: action.result.data
      };
    case LOAD_PATIENT_SUCCESS:
      return {
        ...state,
        loading: false,
        patient: action.result.data
      };
    case UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        current: action.result.data
      };
    case FETCH_BY_QR_SUCCESS:
      return {
        ...state,
        loading: false,
        current: action.result.data
      };
    case DELETE_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        search: action.result.data
      };
    case LOAD_ALL_SUCCESS:
      return {
        ...state,
        loading: false,
        allPatients: action.result.data
      };
    case LOAD_ALL_FAIL:
    case CREATE_FAIL:
    case UPDATE_FAIL:
    case LOAD_PATIENT_FAIL:
    case FETCH_BY_QR_FAIL:
    case DELETE_FAIL:
    case TYPE_COUNT_FAIL:
    case SEARCH_FAIL:
      return {
        ...state,
        loading: false,
        current: null,
        error: action.error
      };
    case SET_PAGEINDEX:
      return {
        ...state,
        pageIndex: action.pageIndex
      };
    default:
      return state;
  }
}

function _loadAll() {
  return {
    types: [LOAD_ALL, LOAD_ALL_SUCCESS, LOAD_ALL_FAIL],
    promise: (client, ctx) => client.get('/patient/all', ctx)
  };
}

export function loadAll(callback) {
  return (dispatch) => {
    dispatch(_loadAll(callback))
      .then((args) => {
        if (callback) {
          callback(null, args);
        }
      });
  };
}

function _loadPage(params) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client, ctx) => client.get('/patient/list', {...ctx, params})
  };
}

export function loadPage(params, callback) {
  return (dispatch) => {
    dispatch(_loadPage(params))
      .then((args) => {
        if (callback) {
          callback(null, args);
        }
      });
  };
}

export function _addPatient(data) {
  return {
    types: [CREATE, CREATE_SUCCESS, CREATE_FAIL],
    promise: (client, ctx) => client.post('/patient/create', {...ctx, data})
  };
}

export function addPatient(data) {
  return (dispatch) => {
    dispatch(_addPatient(data))
      .then(() => {
        Alert.success('添加成功', {
          position: 'bottom-right',
          effect: 'scale',
          timeout: 3000
        });
      });
  };
}

function _loadPatient(params) {
  return {
    types: [LOAD_PATIENT, LOAD_PATIENT_SUCCESS, LOAD_PATIENT_FAIL],
    promise: (client, ctx) => client.get('/patient/one', {...ctx, params})
  };
}

export function loadPatient(params, callback) {
  return (dispatch) => {
    dispatch(_loadPatient(params))
      .then((args) => {
        if (callback) {
          callback(null, args);
        }
      });
  };
}

function _updatePatient(data) {
  return {
    types: [UPDATE, UPDATE_SUCCESS, UPDATE_FAIL],
    promise: (client, ctx) => client.post('/patient/update', {...ctx, data})
  };
}

export function updatePatient(data) {
  return (dispatch) => {
    dispatch(_updatePatient(data))
      .then(() => {
        Alert.success('更新成功', {
          position: 'bottom-right',
          effect: 'scale',
          timeout: 3000
        });
      });
  };
}

export function getPatientInfoByQRCode(qrcode) {
  return {
    types: [FETCH_BY_QR, FETCH_BY_QR_SUCCESS, FETCH_BY_QR_FAIL],
    promise: (client, ctx) => client.get('/patient/byqrcode', {
      ...ctx,
      params: {qrcode}
    })
  };
}

export function _deletePatient(id) {
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    promise: (client, ctx) => client.post('/patient/remove', {
      ...ctx,
      data: {id}
    })
  };
}

export function deletePatient(id, pageInfo, callback) {
  return (dispatch) => {
    dispatch(_deletePatient(id))
      .then(() => {
        dispatch(loadPage(pageInfo, callback));
      });
  };
}

export function _searchPatient(params) {
  return {
    types: [SEARCH, SEARCH_SUCCESS, SEARCH_FAIL],
    promise: (client, ctx) => client.get('/patient/search', {...ctx, params})
  };
}

export function searchPatient(params, callback) {
  return (dispatch) => {
    dispatch(_searchPatient(params))
      .then((args) => {
        if (callback) {
          callback(null, args);
        }
      });
  };
}

export function searchPatientCount(params, callback) {
  return (dispatch) => {
    dispatch({
      types: [COUNT, COUNT_SUCCESS, COUNT_FAIL],
      promise: (client, ctx) => client.get('/patient/count', {...ctx, params})
    }).then(callback);
  };
}

function _typeCount(params) {
  return {
    types: [TYPE_COUNT, TYPE_COUNT_SUCCESS, TYPE_COUNT_FAIL],
    promise: (client, ctx) => client.get('/patient/typecount', {...ctx, params})
  };
}

export function typeCount(params, callback) {
  return (dispatch) => {
    dispatch(_typeCount(params))
      .then((args) => {
        if (callback) {
          callback(args);
        }
      });
  };
}

export function setPageIndex(pageIndex) {
  return {type: SET_PAGEINDEX, pageIndex};
}
