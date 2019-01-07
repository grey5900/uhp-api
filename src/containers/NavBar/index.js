/**
 * Created by isaac on 2/24/16.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import {logout} from 'redux/modules/auth';
import moment from 'moment';

const weekDays = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
];

const wrapper = {
  height: '60px',
  width: '100%',
  backgroundColor: '#FFFFFF',
  borderBottom: '1px solid rgba(230,230,230,0.7)'
};
const dropdown = {
  marginTop: '18px',
  marginRight: '10px'
};
const section = {
  display: 'inline-block',
  float: 'left',
  height: '100%',
  lineHeight: '60px',
  padding: '0 10px',
  color: '#222',
};
const hospitalStyle = {
  ...section,
  fontSize: '22px',
  padding: '0 30px'
};

@connect(
  state => ({user: state.auth.user}),
  {logout, pushState: push})
export default
class NavBar extends Component {
  static propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  };

  componentDidMount() {
    $('.ui.inline.dropdown').dropdown();
  }

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  };
  changePassword = (event) => {
    event.preventDefault();
    this.props.pushState('/change_password');
  }
  render() {
    const {user} = this.props;
    const obj = moment();
    const date = obj.format('YYYY-MM-DD');
    const idx = obj.toDate().getDay();
    const week = weekDays[idx];
    return (
      <div style={wrapper} >
        <div style={hospitalStyle} >肾斗士基金管理系统</div>
        <div className="pull-right" style={dropdown} >
          <div className="ui inline dropdown" >
            <div className="text" >
              <img className="ui avatar image" src={user ? user.avatar : ''} />
              {user ? user.name : ''}
            </div>
            <i className="dropdown icon" />
            <div className="menu" >
              <div className="item" onClick={this.changePassword}>修改密码</div>
              <div className="item" onClick={this.handleLogout} >登出</div>
            </div>
          </div>
        </div>
        <div className="pull-right" >
          <div style={section} >{date}</div>
          <div style={section} >{week}</div>
        </div>
      </div>
    );
  }
}
