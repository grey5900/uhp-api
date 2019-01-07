/**
 * Created by isaac on 16/3/3.
 */
import Alert from 'react-s-alert';

const LABOUR_CREATE = 'uhs/labour/LABOUR_CREATE';
const LABOUR_CREATE_SUCCESS = 'uhs/labour/LABOUR_CREATE_SUCCESS';
const LABOUR_CREATE_FAIL = 'uhs/labour/LABOUR_CREATE_FAIL';

const LABOUR_UPDATE = 'uhs/labour/LABOUR_UPDATE';
const LABOUR_UPDATE_SUCCESS = 'uhs/labour/LABOUR_UPDATE_SUCCESS';
const LABOUR_UPDATE_FAIL = 'uhs/labour/LABOUR_UPDATE_FAIL';

const LABOUR_ONE = 'uhs/labour/LABOUR_ONE';
const LABOUR_ONE_SUCCESS = 'uhs/labour/LABOUR_ONE_SUCCESS';
const LABOUR_ONE_FAIL = 'uhs/labour/LABOUR_ONE_FAIL';

const LABOUR_FETCH = 'uhs/labour/LABOUR_FETCH';
const LABOUR_FETCH_SUCCESS = 'uhs/labour/LABOUR_FETCH_SUCCESS';
const LABOUR_FETCH_FAIL = 'uhs/labour/LABOUR_FETCH_FAIL';

const LABOUR_LIST = 'uhs/labour/LABOUR_LIST';
const LABOUR_LIST_SUCCESS = 'uhs/labour/LABOUR_LIST_SUCCESS';
const LABOUR_LIST_FAIL = 'uhs/labour/LABOUR_LIST_FAIL';

const LABOUR_DELETE = 'uhs/labour/LABOUR_DELETE';
const LABOUR_DELETE_SUCCESS = 'uhs/labour/LABOUR_DELETE_SUCCESS';
const LABOUR_DELETE_FAIL = 'uhs/labour/LABOUR_DELETE_FAIL';

const LABOUR_COUNT = 'uhs/labour/LABOUR_COUNT';
const LABOUR_COUNT_SUCCESS = 'uhs/labour/LABOUR_COUNT_SUCCESS';
const LABOUR_COUNT_FAIL = 'uhs/labour/LABOUR_COUNT_FAIL';

const WEEK = 'uhs/labour/WEEK';
const WEEK_SUCCESS = 'uhs/labour/WEEK_SUCCESS';
const WEEK_FAIL = 'uhs/labour/WEEK_FAIL';

const SEARCH = 'uhs/labour/SEARCH';
const SEARCH_SUCCESS = 'uhs/labour/SEARCH_SUCCESS';
const SEARCH_FAIL = 'uhs/labour/SEARCH_FAIL';

const initialState = {
  loading: false
};

export default function reducer(state = initialState, action = {}) {
  const {callback} = action;
  switch (action.type) {
    case LABOUR_FETCH:
    case LABOUR_LIST:
    case WEEK:
    case LABOUR_DELETE:
    case LABOUR_CREATE:
    case LABOUR_UPDATE:
    case LABOUR_ONE:
    case LABOUR_COUNT:
    case SEARCH:
      return {
        ...state,
        loading: true
      };
    case LABOUR_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        all: action.result.data
      };
    case LABOUR_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        list: action.result.data
      };
    case LABOUR_DELETE_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case LABOUR_COUNT_SUCCESS:
    case LABOUR_CREATE_SUCCESS:
    case LABOUR_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case LABOUR_ONE_SUCCESS:
      if (callback) {
        callback(null, action.result);
      }
      return {
        ...state,
        loading: false,
        current: action.result.data
      };
    case LABOUR_COUNT_FAIL:
    case LABOUR_ONE_FAIL:
    case LABOUR_FETCH_FAIL:
    case LABOUR_LIST_FAIL:
    case LABOUR_DELETE_FAIL:
    case LABOUR_CREATE_FAIL:
    case LABOUR_UPDATE_FAIL:
    case WEEK_FAIL:
    case SEARCH_FAIL:
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
  return state.labour && state.labour.all;
}

function _loadAll() {
  return {
    types: [LABOUR_FETCH, LABOUR_FETCH_SUCCESS, LABOUR_FETCH_FAIL],
    promise: (client, ctx) => client.get('/labour/all', ctx)
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
    types: [LABOUR_LIST, LABOUR_LIST_SUCCESS, LABOUR_LIST_FAIL],
    promise: (client, ctx) => client.get('/labour/list', {...ctx, params})
  };
}
export function loadPage(params, callback) {
  return (dispatch) => {
    dispatch(_loadPage(params)).then(callback);
  };
}

export function _addLabour(data) {
  return {
    types: [LABOUR_CREATE, LABOUR_CREATE_SUCCESS, LABOUR_CREATE_FAIL],
    promise: (client, ctx) => client.post('/labour/create', {...ctx, data})
  };
}

export function addLabour(data, pageInfo, callback) {
  return (dispatch) => {
    dispatch(_addLabour(data))
      .then(() => {
        Alert.success('添加成功', {
          position: 'bottom-right',
          effect: 'scale',
          timeout: 3000
        });
        dispatch(loadPage(pageInfo, callback));
      });
  };
}
export function _loadLabour(params) {
  return {
    types: [LABOUR_ONE, LABOUR_ONE_SUCCESS, LABOUR_ONE_FAIL],
    promise: (client, ctx) => client.get('/labour/one', {...ctx, params})
  };
}
export function loadLabour(params, callback) {
  return (dispatch) => {
    dispatch(_loadLabour(params))
      .then((args) => {
        if (callback) {
          callback(null, args);
        }
      });
  };
}
export function _updateLabour(data) {
  return {
    types: [LABOUR_UPDATE, LABOUR_UPDATE_SUCCESS, LABOUR_UPDATE_FAIL],
    promise: (client, ctx) => client.post('/labour/update', {...ctx, data})
  };
}
export function updateLabour(data, pageInfo, callback) {
  return (dispatch) => {
    dispatch(_updateLabour(data))
      .then(() => {
        Alert.success('更新成功', {
          position: 'bottom-right',
          effect: 'scale',
          timeout: 3000
        });
        dispatch(loadPage(pageInfo, callback));
      });
  };
}

export function _deleteLabour(id) {
  return {
    types: [LABOUR_DELETE, LABOUR_DELETE_SUCCESS, LABOUR_DELETE_FAIL],
    promise: (client, ctx) => client.post('/labour/remove', {...ctx, data: {id}})
  };
}

export function deleteLabour(id, pageInfo, callback) {
  return (dispatch) => {
    dispatch(_deleteLabour(id)).then(callback);
  };
}

function _loadLabourCount(params) {
  return {
    types: [LABOUR_COUNT, LABOUR_COUNT_SUCCESS, LABOUR_COUNT_FAIL],
    promise: (client, ctx) => client.get('/labour/count', {...ctx, params})
  };
}
export function loadLabourCount(params, callback) {
  return (dispatch) => {
    dispatch(_loadLabourCount(params))
      .then((args) => {
        if (callback) {
          callback(null, args);
        }
      });
  };
}

function _loadLabourWeek(params) {
  return {
    types: [WEEK, WEEK_SUCCESS, WEEK_FAIL],
    promise: (client, ctx) => client.get('/labour/week', {...ctx, params})
  };
}
export function loadLabourWeek(params, callback) {
  return (dispatch) => {
    dispatch(_loadLabourWeek(params))
      .then((args) => {
        if (callback) {
          callback(args);
        }
      });
  };
}

export function searchByPatient(params, callback) {
  return (dispatch) => {
    dispatch({
      types: [SEARCH, SEARCH_SUCCESS, SEARCH_FAIL],
      promise: (client, ctx) => client.get('/labour/search', {...ctx, params})
    }).then(callback);
  };
}
