/**
 * Created by isaac on 3/10/16.
 */
import React, {Component, PropTypes} from 'react';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';
import {Icon} from 'stardust';
const iconStyle = {marginRight: 0};

@connect(() => ({}), {push})
export default
class SideBarItem extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    icon: PropTypes.any.isRequired,
    urls: PropTypes.array,
    push: PropTypes.func.isRequired,
    currentURL: PropTypes.string
  };
  static contextTypes = {
    router: PropTypes.object
  };
  _handleLink = (event) => {
    event.preventDefault();
    const {link} = this.props;
    this.props.push(link);
  };

  render() {
    const {router} = this.context;
    const {urls, link, name, icon, currentURL} = this.props;
    const nameStyle = {
      marginTop: '2px',
      textDecoration: 'none !important'
    };

    let active = router.isActive(link);
    if (currentURL && urls && urls.length > 0) {
      for (let idx = 0; idx < urls.length; ++idx) {
        const url = urls[idx];
        if (currentURL.indexOf(url) === 0) {
          active = true;
          break;
        }
      }
    }
    const className = active ? 'active' : null;
    let realIcon = icon;
    if (typeof icon === 'string') {
      realIcon = (<Icon className={icon} style={iconStyle} />);
    }

    return (<li role="presentation" className={className} style={{textAlign: 'center'}} onClick={this._handleLink} >
      <a role="menuitem" tabIndex="-1" href={link} >{realIcon}
        <div style={nameStyle} >{name}</div>
      </a>
    </li>);
  }
}
