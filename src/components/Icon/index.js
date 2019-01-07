/**
 * Created by isaac on 16/4/25.
 */
import React, {Component, PropTypes} from 'react';
import cx from 'classnames';

export default
class Icon extends Component {
  static propTypes = {
    children: PropTypes.any,
    className: PropTypes.string
  };

  render() {
    const {children, className, ...rest} = this.props;
    return (<i className={cx(className, 'icon')} {...rest} >{children}</i>);
  }
}
