/**
 * Created by isaac on 2/24/16.
 */
import React, {PropTypes} from 'react';
import { disableEvent } from 'utils/ui';
import {connect} from 'react-redux';

import { Component } from 'reactcss';
import { SideBarItem, Logo } from 'components';
import { Scrollbars } from 'react-custom-scrollbars';
import adminMenus from './menus';
import operatorMenus from './operatorMenus';
import visitorMenus from './visitorMenus';

@connect(
  state => ({user: state.auth.user}), {})
export default
class SideBar extends Component {
  static propTypes = {
    user: PropTypes.object,
    currentURL: PropTypes.string,
  };

  classes() {
    return {
      default: {
        open: {
          paddingLeft: '0',
          display: 'block',
          position: 'static',
          margin: '0',
          backgroundColor: 'transparent',
          width: '100%',
          borderRadius: '0',
          boxShadow: 'none',
          borderRight: 'none',
          borderTop: 'none'
        },
        logo: {
          width: '100%',
          textAlign: 'center',
          margin: 'auto',
          backgroundColor: '#272b35',
          borderBottom: '1px solid #232730',
          padding: '10px 0px 10px 0px'
        },
        menuWrapper: {
          height: 'calc(100% - 70px)'
        }
      }
    };
  }

  render() {
    const {user} = this.props;
    console.log('sidebar user', this.props.user);
    const styles = require('./style.scss');
    const result = [];
    let menus = null;
    switch (user.role) {
      case 'admin':
        menus = adminMenus;
        break;
      case 'visitor':
        menus = visitorMenus;
        break;
      case 'operator':
        menus = operatorMenus;
        break;
      default:
        menus = [];
        break;
    }
    menus.forEach((info, index) => {
      result.push(<div className={styles.header} key={`${index}.header`} >{info.header}</div>);
      info.menus.forEach((subinfo, subindex) => {
        const {link, name, icon} = subinfo;
        const key = `${index}.${subindex}`;
        result.push(<SideBarItem link={link} name={name} icon={icon} key={key} />);
      });
      if (index !== menus.length - 1) {
        result.push(<div className="ui divider" key={`${index}.divider`} />);
      }
    });
    return (
      <div className={styles.sidebar} onContextMenu={disableEvent} >
        <div is="logo" ><Logo /></div>
        <div is="menuWrapper" >
          <Scrollbars>
            <ul is="open" >
              {result}
            </ul>
          </Scrollbars>
        </div>
      </div>
    );
  }
}
