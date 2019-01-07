/**
 * Created by isaac on 16/4/12.
 */

const SEARCH = 'uhs/search/SEARCH';
const SEARCH_SUCCESS = 'uhs/search/SEARCH_SUCCESS';
const SEARCH_FAIL = 'uhs/search/SEARCH_FAIL';

const initialState = {
  loading: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SEARCH:
      return {
        ...state,
        loading: true
      };
    case SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        result: action.result.data
      };
    case SEARCH_FAIL:
      return {
        ...state,
        loading: false,
        error: action.result.error
      };
    default:
      return state;
  }
}

function _search(params) {
  return {
    types: [SEARCH, SEARCH_SUCCESS, SEARCH_FAIL],
    promise: (client, ctx) => client.get('/search', {...ctx, params})
  };
}

export function advanceSearch(params, callback) {
  console.log(params);
  return (dispatch) => {
    dispatch(_search(params)).then(callback);
  };
}
