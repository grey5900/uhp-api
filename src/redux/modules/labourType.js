/**
 * Created by isaac on 16/3/3.
 */

const LABOUR_TYPE_CREATE = 'uhs/labourType/LABOUR_TYPE_CREATE';
const LABOUR_TYPE_CREATE_SUCCESS = 'uhs/labourType/LABOUR_TYPE_CREATE_SUCCESS';
const LABOUR_TYPE_CREATE_FAIL = 'uhs/labourType/LABOUR_TYPE_CREATE_FAIL';

const LABOUR_TYPE_UPDATE = 'uhs/labourType/LABOUR_TYPE_UPDATE';
const LABOUR_TYPE_UPDATE_SUCCESS = 'uhs/labourType/LABOUR_TYPE_UPDATE_SUCCESS';
const LABOUR_TYPE_UPDATE_FAIL = 'uhs/labourType/LABOUR_TYPE_UPDATE_FAIL';

const LABOUR_TYPE_ONE = 'uhs/labourType/LABOUR_TYPE_ONE';
const LABOUR_TYPE_ONE_SUCCESS = 'uhs/labourType/LABOUR_TYPE_ONE_SUCCESS';
const LABOUR_TYPE_ONE_FAIL = 'uhs/labourType/LABOUR_TYPE_ONE_FAIL';

const LABOUR_TYPE_FETCH = 'uhs/labourType/LABOUR_TYPE_FETCH';
const LABOUR_TYPE_FETCH_SUCCESS = 'uhs/labourType/LABOUR_TYPE_FETCH_SUCCESS';
const LABOUR_TYPE_FETCH_FAIL = 'uhs/labourType/LABOUR_TYPE_FETCH_FAIL';

const LABOUR_TYPE_LIST = 'uhs/labourType/LABOUR_TYPE_LIST';
const LABOUR_TYPE_LIST_SUCCESS = 'uhs/labourType/LABOUR_TYPE_LIST_SUCCESS';
const LABOUR_TYPE_LIST_FAIL = 'uhs/labourType/LABOUR_TYPE_LIST_FAIL';

const LABOUR_TYPE_DELETE = 'uhs/labourType/LABOUR_TYPE_DELETE';
const LABOUR_TYPE_DELETE_SUCCESS = 'uhs/labourType/LABOUR_TYPE_DELETE_SUCCESS';
const LABOUR_TYPE_DELETE_FAIL = 'uhs/labourType/LABOUR_TYPE_DELETE_FAIL';

const initialState = {
  loading: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LABOUR_TYPE_FETCH:
    case LABOUR_TYPE_LIST:
    case LABOUR_TYPE_DELETE:
    case LABOUR_TYPE_CREATE:
    case LABOUR_TYPE_UPDATE:
    case LABOUR_TYPE_ONE:
      return {
        ...state,
        loading: true
      };
    case LABOUR_TYPE_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        all: action.result.data
      };
    case LABOUR_TYPE_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        list: action.result.data
      };
    case LABOUR_TYPE_DELETE_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case LABOUR_TYPE_CREATE_SUCCESS:
    case LABOUR_TYPE_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case LABOUR_TYPE_ONE_SUCCESS:
      return {
        ...state,
        loading: false,
        current: action.result.data
      };
    case LABOUR_TYPE_ONE_FAIL:
    case LABOUR_TYPE_FETCH_FAIL:
    case LABOUR_TYPE_LIST_FAIL:
    case LABOUR_TYPE_DELETE_FAIL:
    case LABOUR_TYPE_CREATE_FAIL:
    case LABOUR_TYPE_UPDATE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error.msg
      };
    default:
      return state;
  }
}

export function isAllLoaded(state) {
  return state.labourType && state.labourType.all;
}

function _loadAll() {
  return {
    types: [LABOUR_TYPE_FETCH, LABOUR_TYPE_FETCH_SUCCESS, LABOUR_TYPE_FETCH_FAIL],
    promise: (client, ctx) => client.get('/labourtype/all', ctx)
  };
}

export function loadAll(callback) {
  return (dispatch) => {
    dispatch(_loadAll()).then(callback);
  };
}

export function _loadPage(params) {
  return {
    types: [LABOUR_TYPE_LIST, LABOUR_TYPE_LIST_SUCCESS, LABOUR_TYPE_LIST_FAIL],
    promise: (client, ctx) => client.get('/labourtype/list', {...ctx, params})
  };
}
export function loadPage(params, callback) {
  return (dispatch) => {
    dispatch(_loadPage(params)).then(callback);
  };
}

export function _addLabourType(data) {
  return {
    types: [LABOUR_TYPE_CREATE, LABOUR_TYPE_CREATE_SUCCESS, LABOUR_TYPE_CREATE_FAIL],
    promise: (client, ctx) => client.post('/labourtype/create', {...ctx, data})
  };
}

export function addLabourType(data, callback) {
  return (dispatch) => {
    dispatch(_addLabourType(data)).then(callback);
  };
}
export function _loadLabourType(params) {
  return {
    types: [LABOUR_TYPE_ONE, LABOUR_TYPE_ONE_SUCCESS, LABOUR_TYPE_ONE_FAIL],
    promise: (client, ctx) => client.get('/labourtype/one', {...ctx, params})
  };
}
export function loadLabourType(params, callback) {
  return (dispatch) => {
    dispatch(_loadLabourType(params)).then(callback);
  };
}
export function _updateLabourType(data) {
  return {
    types: [LABOUR_TYPE_UPDATE, LABOUR_TYPE_UPDATE_SUCCESS, LABOUR_TYPE_UPDATE_FAIL],
    promise: (client, ctx) => client.post('/labourtype/update', {...ctx, data})
  };
}
export function updateLabourType(data, callback) {
  return (dispatch) => {
    dispatch(_updateLabourType(data)).then(callback);
  };
}

export function _deleteLabourType(id) {
  return {
    types: [LABOUR_TYPE_DELETE, LABOUR_TYPE_DELETE_SUCCESS, LABOUR_TYPE_DELETE_FAIL],
    promise: (client, ctx) => client.post('/labourtype/remove', {...ctx, data: {id}})
  };
}

export function deleteLabourType(id, callback) {
  return (dispatch) => {
    dispatch(_deleteLabourType(id)).then(callback);
  };
}
