/**
 * Created by isaac on 16/3/3.
 */
import Alert from 'react-s-alert';

const CREATE = 'uhs/activity/CREATE';
const CREATE_SUCCESS = 'uhs/activity/CREATE_SUCCESS';
const CREATE_FAIL = 'uhs/activity/CREATE_FAIL';

const UPDATE = 'uhs/activity/UPDATE';
const UPDATE_SUCCESS = 'uhs/activity/UPDATE_SUCCESS';
const UPDATE_FAIL = 'uhs/activity/UPDATE_FAIL';

const ONE = 'uhs/activity/ONE';
const ONE_SUCCESS = 'uhs/activity/ONE_SUCCESS';
const ONE_FAIL = 'uhs/activity/ONE_FAIL';

const FETCH = 'uhs/activity/FETCH';
const FETCH_SUCCESS = 'uhs/activity/FETCH_SUCCESS';
const FETCH_FAIL = 'uhs/activity/FETCH_FAIL';

const LIST = 'uhs/activity/LIST';
const LIST_SUCCESS = 'uhs/activity/LIST_SUCCESS';
const LIST_FAIL = 'uhs/activity/LIST_FAIL';

const DELETE = 'uhs/activity/DELETE';
const DELETE_SUCCESS = 'uhs/activity/DELETE_SUCCESS';
const DELETE_FAIL = 'uhs/activity/DELETE_FAIL';

const SEARCH = 'uhs/activity/SEARCH';
const SEARCH_SUCCESS = 'uhs/activity/SEARCH_SUCCESS';
const SEARCH_FALL = 'uhs/activity/SEARCH_FALL';


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
    promise: (client, ctx) => client.get('/activity/all', {...ctx, params})
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
    promise: (client, ctx) => client.get('/activity/list', {...ctx, params})
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

export function _addActivity(data) {
  return {
    types: [CREATE, CREATE_SUCCESS, CREATE_FAIL],
    promise: (client, ctx) => client.post('/activity/create', {...ctx, data})
  };
}

export function addActivity(data) {
  return (dispatch) => {
    dispatch(_addActivity(data))
      .then(() => {
        Alert.success('添加成功', {
          position: 'bottom-right',
          effect: 'scale',
          timeout: 3000
        });
      });
  };
}
export function _loadActivity(params) {
  return {
    types: [ONE, ONE_SUCCESS, ONE_FAIL],
    promise: (client, ctx) => client.get('/activity/one', {...ctx, params})
  };
}
export function loadActivity(params, callback) {
  return (dispatch) => {
    dispatch(_loadActivity(params))
      .then((args) => {
        if (callback) {
          callback(null, args);
        }
      });
  };
}
export function _updateActivity(data) {
  return {
    types: [UPDATE, UPDATE_SUCCESS, UPDATE_FAIL],
    promise: (client, ctx) => client.post('/activity/update', {...ctx, data})
  };
}
export function updateActivity(data) {
  return (dispatch) => {
    dispatch(_updateActivity(data))
      .then(() => {
        Alert.success('更新成功', {
          position: 'bottom-right',
          effect: 'scale',
          timeout: 3000
        });
      });
  };
}

export function _deleteActivity(id) {
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    promise: (client, ctx) => client.post('/activity/remove', {...ctx, data: {id}})
  };
}

export function deleteActivity(id, pageInfo, callback) {
  return (dispatch) => {
    dispatch(_deleteActivity(id))
      .then(() => {
        dispatch(loadPage(pageInfo, callback));
      });
  };
}

function _searchActivity(params) {
  return {
    types: [SEARCH, SEARCH_SUCCESS, SEARCH_FALL],
    promise: (client, ctx) => client.get('/activity/search', {...ctx, params})
  };
}

export function searchActivity(params, callback) {
  return (dispatch) => {
    dispatch(_searchActivity(params))
      .then((args) => {
        if (callback) {
          callback(null, args);
        }
      });
  };
}
