/**
 * Created by isaac on 16/3/3.
 */
import Alert from 'react-s-alert';

const CREATE = 'uhs/hospital/CREATE';
const CREATE_SUCCESS = 'uhs/hospital/CREATE_SUCCESS';
const CREATE_FAIL = 'uhs/hospital/CREATE_FAIL';

const UPDATE = 'uhs/hospital/UPDATE';
const UPDATE_SUCCESS = 'uhs/hospital/UPDATE_SUCCESS';
const UPDATE_FAIL = 'uhs/hospital/UPDATE_FAIL';

const ONE = 'uhs/hospital/ONE';
const ONE_SUCCESS = 'uhs/hospital/ONE_SUCCESS';
const ONE_FAIL = 'uhs/hospital/ONE_FAIL';

const FETCH = 'uhs/hospital/FETCH';
const FETCH_SUCCESS = 'uhs/hospital/FETCH_SUCCESS';
const FETCH_FAIL = 'uhs/hospital/FETCH_FAIL';

const LIST = 'uhs/hospital/LIST';
const LIST_SUCCESS = 'uhs/hospital/LIST_SUCCESS';
const LIST_FAIL = 'uhs/hospital/LIST_FAIL';

const DELETE = 'uhs/hospital/DELETE';
const DELETE_SUCCESS = 'uhs/hospital/DELETE_SUCCESS';
const DELETE_FAIL = 'uhs/hospital/DELETE_FAIL';

const SEARCH = 'uhs/hospital/SEARCH';
const SEARCH_SUCCESS = 'uhs/hospital/SEARCH_SUCCESS';
const SEARCH_FALL = 'uhs/hospital/SEARCH_FALL';

const COUNT_AS_CITY = 'uhs/hospital/COUNT_AS_CITY';
const COUNT_AS_CITY_SUCCESS = 'uhs/hospital/COUNT_AS_CITY_SUCCESS';
const COUNT_AS_CITY_FALL = 'uhs/hospital/COUNT_AS_CITY_FALL';

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
    case COUNT_AS_CITY:
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
    case COUNT_AS_CITY_SUCCESS:
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
    case COUNT_AS_CITY_FALL:
      return {
        ...state,
        loading: false,
        error: action.error.msg
      };
    default:
      return state;
  }
}

function _loadAll() {
  return {
    types: [FETCH, FETCH_SUCCESS, FETCH_FAIL],
    promise: (client, ctx) => client.get('/hospital/all', ctx)
  };
}

export function loadAll(callback) {
  return (dispatch) => {
    dispatch(_loadAll())
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
    promise: (client, ctx) => client.get('/hospital/list', {...ctx, params})
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

export function _addHospital(data) {
  return {
    types: [CREATE, CREATE_SUCCESS, CREATE_FAIL],
    promise: (client, ctx) => client.post('/hospital/create', {...ctx, data})
  };
}

export function addHospital(data) {
  return (dispatch) => {
    dispatch(_addHospital(data))
      .then(() => {
        Alert.success('添加成功', {
          position: 'bottom-right',
          effect: 'scale',
          timeout: 3000
        });
      });
  };
}
export function _loadHospital(params) {
  return {
    types: [ONE, ONE_SUCCESS, ONE_FAIL],
    promise: (client, ctx) => client.get('/hospital/one', {...ctx, params})
  };
}
export function loadHospital(params, callback) {
  return (dispatch) => {
    dispatch(_loadHospital(params))
      .then((args) => {
        if (callback) {
          callback(null, args);
        }
      });
  };
}
export function _updateHospital(data) {
  return {
    types: [UPDATE, UPDATE_SUCCESS, UPDATE_FAIL],
    promise: (client, ctx) => client.post('/hospital/update', {...ctx, data})
  };
}
export function updateHospital(data) {
  return (dispatch) => {
    dispatch(_updateHospital(data))
      .then(() => {
        Alert.success('更新成功', {
          position: 'bottom-right',
          effect: 'scale',
          timeout: 3000
        });
      });
  };
}

export function _deleteHospital(id) {
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    promise: (client, ctx) => client.post('/hospital/remove', {...ctx, data: {id}})
  };
}

export function deleteHospital(id, pageInfo, callback) {
  return (dispatch) => {
    dispatch(_deleteHospital(id))
      .then(() => {
        dispatch(loadPage(pageInfo, callback));
      });
  };
}

function _searchHospital(params) {
  return {
    types: [SEARCH, SEARCH_SUCCESS, SEARCH_FALL],
    promise: (client, ctx) => client.get('/hospital/search', {...ctx, params})
  };
}

export function searchHospital(params, callback) {
  return (dispatch) => {
    dispatch(_searchHospital(params))
      .then((args) => {
        if (callback) {
          callback(null, args);
        }
      });
  };
}

export function _countAsCity() {
  return {
    types: [COUNT_AS_CITY, COUNT_AS_CITY_SUCCESS, COUNT_AS_CITY_FALL],
    promise: (client, ctx) => client.get('/hospital/count_as_city', {...ctx})
  };
}

export function countAsCity(callback) {
  return (dispatch) => {
    dispatch(_countAsCity())
      .then(callback);
  };
}
