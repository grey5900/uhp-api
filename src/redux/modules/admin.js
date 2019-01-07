/**
 * Created by chris on 16/3/8.
 */
import Alert from 'react-s-alert';

const FETCH = 'uhs/admin/FETCH';
const FETCH_SUCCESS = 'uhs/admin/FETCH_SUCCESS';
const FETCH_FAIL = 'uhs/admin/FETCH_FAIL';

const CREATE = 'uhs/admin/CREATE';
const CREATE_SUCCESS = 'uhs/admin/CREATE_SUCCESS';
const CREATE_FAIL = 'uhs/admin/CREATE_FAIL';

const LOAD = 'uhs/admin/LOAD';
const LOAD_SUCCESS = 'uhs/admin/LOAD_SUCCESS';
const LOAD_FAIL = 'uhs/admin/LOAD_FAIL';

const UPDATE = '/uhs/admin/UPDATE';
const UPDATE_SUCCESS = '/uhs/admin/UPDATE_SUCCESS';
const UPDATE_FAIL = '/uhs/admin/UPDATE_FAIL';

const DELETE = '/uhs/admin/DELETE';
const DELETE_SUCCESS = '/uhs/admin/DELETE_SUCCESS';
const DELETE_FAIL = '/uhs/admin/DELETE_FAIL';

const RESET_PASSWORD = '/uhs/admin/RESET_PASSWORD';
const RESET_PASSWORD_SUCCESS = '/uhs/admin/RESET_PASSWORD_SUCCESS';
const RESET_PASSWORD_FAIL = '/uhs/admin/RESET_PASSWORD_FAIL';

const CHANGE_PASSWORD = '/uhs/admin/CHANGE_PASSWORD';
const CHANGE_PASSWORD_SUCCESS = '/uhs/admin/CHANGE_PASSWORD_SUCCESS';
const CHANGE_PASSWORD_FAIL = '/uhs/admin/CHANGE_PASSWORD_FAIL';

const SEARCH = 'uhs/admin/SEARCH';
const SEARCH_SUCCESS = 'uhs/admin/SEARCH_SUCCESS';
const SEARCH_FAIL = 'uhs/admin/SEARCH_FAIL';

const initialState = {
  loading: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case FETCH:
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.result
      };
    case CREATE:
      return {
        ...state,
        loading: true
      };
    case CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.result
      };
    case SEARCH_FAIL:
    case RESET_PASSWORD_FAIL:
    case CHANGE_PASSWORD_FAIL:
    case UPDATE_FAIL:
    case DELETE_FAIL:
    case FETCH_FAIL:
    case CREATE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error.msg
      };
    case UPDATE:
      return {
        ...state,
        loading: true
      };
    case UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        status: action.result.code
      };
    case DELETE:
      return {
        ...state,
        loading: true
      };
    case DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        status: action.result.code
      };
    case RESET_PASSWORD:
    case CHANGE_PASSWORD:
      return {
        ...state,
        loading: true
      };
    case RESET_PASSWORD_SUCCESS:
    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        status: action.result.code
      };
    case SEARCH:
      return {
        ...state,
        loading: true
      };
    case SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        search: action.result.data
      };
    default:
      return state;
  }
}

function _loadPage(params) {
  return {
    types: [FETCH, FETCH_SUCCESS, FETCH_FAIL],
    promise: (client, ctx) => client.get('/admin/list', {...ctx, params}),
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
function _addAdmin(data) {
  return {
    types: [CREATE, CREATE_SUCCESS, CREATE_FAIL],
    promise: (client, ctx) => client.post('/admin/register', {...ctx, data})
  };
}

export function addAdmin(data) {
  return (dispatch) => {
    dispatch(_addAdmin(data))
      .then(() => {
        Alert.success('添加成功', {
          position: 'bottom-right',
          effect: 'scale',
          timeout: 3000
        });
      });
  };
}

function _loadAdmin(params) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client, ctx) => client.get('/admin/one', {...ctx, params})
  };
}

export function loadAdmin(params, callback) {
  return (dispatch) => {
    dispatch(_loadAdmin(params))
      .then((args) => {
        if (callback) {
          callback(null, args);
        }
      });
  };
}

function _updateAdmin(data) {
  return {
    types: [UPDATE, UPDATE_SUCCESS, UPDATE_FAIL],
    promise: (client, ctx) => client.post('/admin/update', {...ctx, data})
  };
}
export function updateAdmin(data) {
  return (dispatch) => {
    dispatch(_updateAdmin(data))
      .then(() => {
        Alert.success('更新成功', {
          position: 'bottom-right',
          effect: 'scale',
          timeout: 3000
        });
      });
  };
}

function _deleteAdmin(id) {
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    promise: (client, ctx) => client.post('/admin/remove', {...ctx, data: {id}})
  };
}

export function deleteAdmin(id, pageInfo, callback) {
  return (dispatch) => {
    dispatch(_deleteAdmin(id))
      .then(() => {
        dispatch(loadPage(pageInfo, callback));
      });
  };
}

function _forceResetPassword(data) {
  return {
    types: [RESET_PASSWORD, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAIL],
    promise: (client, ctx) => client.post('/admin/forceresetpassword', {...ctx, data})
  };
}
export function forceResetPassword(data, callback) {
  return (dispatch) => {
    dispatch(_forceResetPassword(data))
      .then((args) => {
        if (callback) {
          callback(null, args);
        }
      });
  };
}

function _changePassword(data) {
  return {
    types: [CHANGE_PASSWORD, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAIL],
    promise: (client, ctx) => client.post('/admin/resetpassword', {...ctx, data})
  };
}
export function changePassword(data) {
  return (dispatch) => {
    dispatch(_changePassword(data))
      .then(() => {
        Alert.success('密码修改成功', {
          position: 'bottom-right',
          effect: 'scale',
          timeout: 3000
        });
      });
  };
}

function _searchAdmin(params) {
  return {
    types: [SEARCH, SEARCH_SUCCESS, SEARCH_FAIL],
    promise: (client, ctx) => client.get('/admin/search', {...ctx, params})
  };
}

export function searchAdmin(params, callback) {
  return (dispatch) => {
    dispatch(_searchAdmin(params))
      .then((args) => {
        if (callback) {
          callback(null, args);
        }
      });
  };
}
