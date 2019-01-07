/**
 * Created by isaac on 16/3/7.
 */
import React, {Component} from 'react';

export default
class Logo extends Component {
  render() {
    // const image = require('../../../static/logo.png');
    const style = {width: '48px'};
    return (<img src="/logo.png" style={style} size="small" />);
  }
}
