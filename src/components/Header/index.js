/**
 * Created by isaac on 16/4/25.
 */

import React, {Component, PropTypes} from 'react';

export default
class Header extends Component {
  static propTypes = {
    children: PropTypes.any
  };

  render() {
    return (<div style={{padding: '10px 0 10px 0', color: 'black'}} >{this.props.children}</div>);
  }
}

