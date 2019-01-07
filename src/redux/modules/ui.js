/**
 * Created by isaac on 2/26/16.
 */

const TOGGLE_NAVBAR = 'uhs/ui/TOGGLE_NAVBAR';
const TOGGLE_SIDEBAR = 'uhs/ui/TOGGLE_SIDEBAR';
const OPEN_MODAL = 'uhs/ui/OPEN_MODAL';
const CLOSE_MODAL = 'uhs/ui/CLOSE_MODAL';

const OPEN_ALERT = 'uhs/ui/OPEN_ALERT';
const CLOSE_ALERT = 'uhs/ui/CLOSE_ALERT';

const initialState = {
  isModalOpen: false,
  isAlertShow: false,
  alertContext: {},
  showNavBar: false,
  showSideBar: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case TOGGLE_NAVBAR:
      return {
        ...state,
        showNavBar: action.flag
      };
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        showSideBar: action.flag
      };
    case OPEN_MODAL:
      return {
        ...state,
        isModalOpen: true,
        componentCreator: action.componentCreator
      };
    case CLOSE_MODAL:
      return {
        ...state,
        isModalOpen: false,
        componentCreator: () => {
          return null;
        }
      };
    case OPEN_ALERT:
      return {
        ...state,
        alertContext: action.params,
        isAlertShow: true
      };
    case CLOSE_ALERT:
      return {
        ...state,
        alertContext: {},
        isAlertShow: false
      };
    default:
      return state;
  }
}

export function toggleNavBar(flag) {
  return {
    type: TOGGLE_NAVBAR,
    flag
  };
}

export function toggleSideBar(flag) {
  return {
    type: TOGGLE_SIDEBAR,
    flag
  };
}

export function openModal(componentCreator) {
  return {
    type: OPEN_MODAL,
    componentCreator
  };
}

export function closeModal() {
  return {type: CLOSE_MODAL};
}

export function openAlert(params) {
  return {type: OPEN_ALERT, params};
}

export function closeAlert() {
  if (typeof document !== 'undefined') {
    let element = document.getElementsByClassName('sweet-overlay')[0];
    if (element) {
      element.parentNode.removeChild(element);
    }
    element = document.getElementsByClassName('sweet-alert')[0];
    if (element) {
      element.parentNode.removeChild(element);
    }
  }
  return {type: CLOSE_ALERT};
}
