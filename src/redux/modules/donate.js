/*
 * Copyright(c) omk 2016
 * Filename: donate.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期二,  7 六月 2016.
 */

const CREATE = 'uhs/donate/CREATE';
const CREATE_SUCCESS = 'uhs/donate/CREATE_SUCCESS';
const CREATE_FAIL = 'uhs/donate/CREATE_FAIL';

const UPDATE = 'uhs/donate/UPDATE';
const UPDATE_SUCCESS = 'uhs/donate/UPDATE_SUCCESS';
const UPDATE_FAIL = 'uhs/donate/UPDATE_FAIL';

const ONE = 'uhs/donate/ONE';
const ONE_SUCCESS = 'uhs/donate/ONE_SUCCESS';
const ONE_FAIL = 'uhs/donate/ONE_FAIL';

const FETCH = 'uhs/donate/FETCH';
const FETCH_SUCCESS = 'uhs/donate/FETCH_SUCCESS';
const FETCH_FAIL = 'uhs/donate/FETCH_FAIL';

const LIST = 'uhs/donate/LIST';
const LIST_SUCCESS = 'uhs/donate/LIST_SUCCESS';
const LIST_FAIL = 'uhs/donate/LIST_FAIL';

const DELETE = 'uhs/donate/DELETE';
const DELETE_SUCCESS = 'uhs/donate/DELETE_SUCCESS';
const DELETE_FAIL = 'uhs/donate/DELETE_FAIL';

const SEARCH = 'uhs/donate/SEARCH';
const SEARCH_SUCCESS = 'uhs/donate/SEARCH_SUCCESS';
const SEARCH_FALL = 'uhs/donate/SEARCH_FALL';


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
    promise: (client, ctx) => client.get('/donate/all', {...ctx, params})
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
    promise: (client, ctx) => client.get('/donate/list', {...ctx, params})
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

export function addDonate(data, callback) {
  return (dispatch) => {
    dispatch({
      types: [CREATE, CREATE_SUCCESS, CREATE_FAIL],
      promise: (client, ctx) => client.post('/donate/create', {...ctx, data})
    }).then(callback);
  };
}
export function _loadDonate(params) {
  return {
    types: [ONE, ONE_SUCCESS, ONE_FAIL],
    promise: (client, ctx) => client.get('/donate/one', {...ctx, params})
  };
}
export function loadDonate(params, callback) {
  return (dispatch) => {
    dispatch(_loadDonate(params))
      .then((args) => {
        if (callback) {
          callback(null, args);
        }
      });
  };
}
export function updateDonate(data, callback) {
  return (dispatch) => {
    dispatch({
      types: [UPDATE, UPDATE_SUCCESS, UPDATE_FAIL],
      promise: (client, ctx) => client.post('/donate/update', {...ctx, data})
    }).then(callback);
  };
}

export function _deleteDonate(id) {
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    promise: (client, ctx) => client.post('/donate/remove', {...ctx, data: {id}})
  };
}

export function deleteDonate(id, pageInfo, callback) {
  return (dispatch) => {
    dispatch(_deleteDonate(id))
      .then(() => {
        dispatch(loadPage(pageInfo, callback));
      });
  };
}

function _searchDonate(params) {
  return {
    types: [SEARCH, SEARCH_SUCCESS, SEARCH_FALL],
    promise: (client, ctx) => client.get('/donate/search', {...ctx, params})
  };
}

export function searchDonate(params, callback) {
  return (dispatch) => {
    dispatch(_searchDonate(params))
      .then((args) => {
        if (callback) {
          callback(null, args);
        }
      });
  };
}
