/**
 * Created by isaac on 16/8/17.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {push as pushState} from 'react-router-redux';

@connect(() => ({}), {push: pushState})
export default
class Link extends Component {
  static propTypes = {
    to: PropTypes.string,
    push: PropTypes.func.isRequired,
    children: PropTypes.any
  };

  _gotoLink = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.push(this.props.to);
  };

  render() {
    const {to, push, children, ...rest} = this.props;
    void (push);
    return (<a href={to} onClick={this._gotoLink} {...rest}>{children}</a>);
  }
}
