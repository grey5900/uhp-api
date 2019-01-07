/**
 * Created by isaac on 16/3/7.
 */
import React, {Component, PropTypes} from 'react';
const defaultImage = require('./default.png');

export default class Avatar extends Component {
  static propTypes = {
    src: PropTypes.any,
    style: PropTypes.any
  };

  render() {
    const {style, src, ...rest} = this.props;
    return (<img src={src || defaultImage} style={style} {...rest} />);
  }
}
