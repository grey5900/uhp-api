import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {push} from 'react-router-redux';
import config from '../../config';
import {NavBar, SideBar} from 'containers';
import Modal from 'react-modal';
import {closeModal, closeAlert} from 'redux/modules/ui';
import Alert from 'react-s-alert';
import {isLoaded as isAuthLoaded, load as loadAuth} from 'redux/modules/auth';
import Audio from 'utils/audio';
import {modalStyles} from 'utils/ui';
import Login from '../Login';

let SweetAlert = null;
if (__CLIENT__) {
  SweetAlert = require('sweetalert-react');
  Audio.init();
  const Pace = require('lib/pace.js');
  Pace.start();
}

import {asyncConnect} from 'redux-connect';

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];

    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }
    return Promise.all(promises);
  }
}])
@connect(
  state => ({
    user: state.auth.user,
    isModalOpen: state.ui.isModalOpen,
    componentCreator: state.ui.componentCreator,
    isAlertShow: state.ui.isAlertShow,
    alertContext: state.ui.alertContext
  }),
  {
    pushState: push,
    closeModal, closeAlert
  })
export default class App extends Component {
  static propTypes = {
    store: PropTypes.object,
    isModalOpen: PropTypes.bool,
    componentCreator: PropTypes.func,
    closeModal: PropTypes.func,
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    pushState: PropTypes.func.isRequired,
    registerNotifyObserver: PropTypes.func,
    isAlertShow: PropTypes.bool.isRequired,
    alertContext: PropTypes.object.isRequired,
    closeAlert: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentDidMount() {
    if (typeof document !== 'undefined') {
      document.body.className += ' loaded';
      setTimeout(() => {
        const element = document.getElementById('loader-wrapper');
        element.parentNode.removeChild(element);
      }, 700);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // has login
      if (nextProps.user.role !== 'operator') {
        this.props.pushState('/home');
      } else {
        this.props.pushState('/patients');
      }
    } else if (this.props.user && !nextProps.user) {
      // redirect to login page
      console.log('will redirect: ', nextProps, window.location);
      this.props.pushState('/login');
    }
  }
  _getCurrentURL = () => {
    let currentURL = '';
    if (typeof window !== 'undefined') {
      currentURL = window.location.pathname;
    }
    return currentURL;
  };
  renderWithUser() {
    const appContentStyle = {
      height: '100%',
      width: '100%',
      whiteSpace: 'nowrap'
    };
    const mainStyle = {
      width: '100%',
      boxSizing: 'border-box',
      display: 'inline-block',
      height: '100%',
      fontSize: '14px',
      whiteSpace: 'normal',
      paddingLeft: '70px',
      marginLeft: '-70px',
      backgroundColor: '#F7F7F7'
    };
    return (<div style={appContentStyle} >
      <SideBar currentURL={this._getCurrentURL()} />
      <div style={mainStyle} >
        <NavBar />
        {this.props.children}
      </div>
    </div>);
  }

  renderAlertIfNeeded = () => {
    let result = null;
    const {isAlertShow} = this.props;
    if (isAlertShow && SweetAlert) {
      const close = this.props.closeAlert;
      const {title, type, text, confirm} = this.props.alertContext;
      result = (<SweetAlert show={isAlertShow} title={title} type={type} text={text}
                            showCancelButton
                            cancelButtonText="取消"
                            confirmButtonText="确定"
                            onConfirm={(inputValue) => {confirm(inputValue); close();}}
                            onCancel={close}
                            onEscapeKey={close}
                            onOutsideClick={close}
      />);
    }
    return result;
  };

  render() {
    const customStyles = {
      overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        backgroundColor: 'rgba(100, 100, 100, 0.75)'
      },
      content: modalStyles.content
    };
    const appStyle = {
      position: 'absolute',
      boxSizing: 'border-box',
      width: '100%',
      minHeight: '100%',
      boxShadow: '0 3px 20px #000',
      backgroundClip: 'content-box',
      height: '100%',
      overflow: 'hidden',
      zIndex: '0'
    };
    const {user, isModalOpen, componentCreator} = this.props;
    return (
      <div style={appStyle} >
        <Helmet {...config.app.head} />
        {user && this.renderWithUser()}
        {!user && <Login />}
        {isModalOpen && <Modal
          isOpen={isModalOpen}
          onRequestClose={this.props.closeModal}
          style={customStyles} >
          {componentCreator && componentCreator()}
        </Modal>
        }
        {this.renderAlertIfNeeded()}
        <Alert stack={{limit: 3}} />
      </div>
    );
  }
}
