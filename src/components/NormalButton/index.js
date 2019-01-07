/**
 * Created by jiang_mac on 16/3/14.
 */
import React, {Component, PropTypes} from 'react';
import cx from 'classnames';

export default class NormalButton extends Component {
  static propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.any
  };

  _handleClickEvent = (event) => {
    event.preventDefault();
    const {onClick} = this.props;
    if (onClick) {
      onClick(event);
    }
  };
  render() {
    const {children, className, onClick, ...rest} = this.props;
    let result = null;
    if (onClick) {
      result = <button className={cx('ui button', className || 'primary')} onClick={this._handleClickEvent} {...rest}>{children}</button>;
    } else {
      result = <button className={cx('ui button', className || 'primary')} {...rest}>{children}</button>;
    }
    return result;
  }
}
