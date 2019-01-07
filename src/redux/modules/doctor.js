/**
 * Created by isaac on 16/3/3.
 */
import Alert from 'react-s-alert';

const CREATE = 'uhs/doctor/CREATE';
const CREATE_SUCCESS = 'uhs/doctor/CREATE_SUCCESS';
const CREATE_FAIL = 'uhs/doctor/CREATE_FAIL';

const UPDATE = 'uhs/doctor/UPDATE';
const UPDATE_SUCCESS = 'uhs/doctor/UPDATE_SUCCESS';
const UPDATE_FAIL = 'uhs/doctor/UPDATE_FAIL';

const ONE = 'uhs/doctor/ONE';
const ONE_SUCCESS = 'uhs/doctor/ONE_SUCCESS';
const ONE_FAIL = 'uhs/doctor/ONE_FAIL';

const FETCH = 'uhs/doctor/FETCH';
const FETCH_SUCCESS = 'uhs/doctor/FETCH_SUCCESS';
const FETCH_FAIL = 'uhs/doctor/FETCH_FAIL';

const LIST = 'uhs/doctor/LIST';
const LIST_SUCCESS = 'uhs/doctor/LIST_SUCCESS';
const LIST_FAIL = 'uhs/doctor/LIST_FAIL';

const DELETE = 'uhs/doctor/DELETE';
const DELETE_SUCCESS = 'uhs/doctor/DELETE_SUCCESS';
const DELETE_FAIL = 'uhs/doctor/DELETE_FAIL';

const SEARCH = 'uhs/doctor/SEARCH';
const SEARCH_SUCCESS = 'uhs/doctor/SEARCH_SUCCESS';
const SEARCH_FALL = 'uhs/doctor/SEARCH_FALL';


const initialState = {
  loading: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case FETCH:
    case LIST:
    case DELETE:
    case CREATE:
    case UPDATE:
    case ONE:
    case SEARCH:
      return {
        ...state,
        loading: true
      };
    case FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        all: action.result.data
      };
    case LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        list: action.result.data
      };
    case DELETE_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case CREATE_SUCCESS:
    case UPDATE_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case ONE_SUCCESS:
      return {
        ...state,
        loading: false,
        current: action.result.data
      };
    case SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        search: action.result.data
      };
    case ONE_FAIL:
    case FETCH_FAIL:
    case LIST_FAIL:
    case DELETE_FAIL:
    case CREATE_FAIL:
    case UPDATE_FAIL:
    case SEARCH_FALL:
      return {
        ...state,
        loading: false,
        error: action.error.msg
      };
    default:
      return state;
  }
}

function _loadAll(params) {
  return {
    types: [FETCH, FETCH_SUCCESS, FETCH_FAIL],
    promise: (client, ctx) => client.get('/doctor/all', {...ctx, params})
  };
}

export function loadAll(params, callback) {
  return (dispatch) => {
    dispatch(_loadAll(params))
      .then((args) => {
        if (callback) {
          callback(null, args);
        }
      });
  };
}

export function _loadPage(params) {
  return {
    types: [LIST, LIST_SUCCESS, LIST_FAIL],
    promise: (client, ctx) => client.get('/doctor/list', {...ctx, params})
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

export function _addDoctor(data) {
  return {
    types: [CREATE, CREATE_SUCCESS, CREATE_FAIL],
    promise: (client, ctx) => client.post('/doctor/create', {...ctx, data})
  };
}

export function addDoctor(data) {
  return (dispatch) => {
    dispatch(_addDoctor(data))
      .then(() => {
        Alert.success('添加成功', {
          position: 'bottom-right',
          effect: 'scale',
          timeout: 3000
        });
      });
  };
}
export function _loadDoctor(params) {
  return {
    types: [ONE, ONE_SUCCESS, ONE_FAIL],
    promise: (client, ctx) => client.get('/doctor/one', {...ctx, params})
  };
}
export function loadDoctor(params, callback) {
  return (dispatch) => {
    dispatch(_loadDoctor(params))
      .then((args) => {
        if (callback) {
          callback(null, args);
        }
      });
  };
}
export function _updateDoctor(data) {
  return {
    types: [UPDATE, UPDATE_SUCCESS, UPDATE_FAIL],
    promise: (client, ctx) => client.post('/doctor/update', {...ctx, data})
  };
}
export function updateDoctor(data) {
  return (dispatch) => {
    dispatch(_updateDoctor(data))
      .then(() => {
        Alert.success('更新成功', {
          position: 'bottom-right',
          effect: 'scale',
          timeout: 3000
        });
      });
  };
}

export function _deleteDoctor(id) {
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    promise: (client, ctx) => client.post('/doctor/remove', {...ctx, data: {id}})
  };
}

export function deleteDoctor(id, pageInfo, callback) {
  return (dispatch) => {
    dispatch(_deleteDoctor(id))
      .then(() => {
        dispatch(loadPage(pageInfo, callback));
      });
  };
}

function _searchDoctor(params) {
  return {
    types: [SEARCH, SEARCH_SUCCESS, SEARCH_FALL],
    promise: (client, ctx) => client.get('/doctor/search', {...ctx, params})
  };
}

export function searchDoctor(params, callback) {
  return (dispatch) => {
    dispatch(_searchDoctor(params))
      .then((args) => {
        if (callback) {
          callback(null, args);
        }
      });
  };
}
