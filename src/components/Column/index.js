/**
 * Created by isaac on 16/3/7.
 */
import React, {Component, PropTypes} from 'react';

export default
class Column extends Component {
  static propTypes = {
    percent: PropTypes.number,
    children: PropTypes.any
  };

  render() {
    const {percent, children} = this.props;
    const style = {
      width: `${(percent * 100 / 12.0)}%`,
      float: 'left',
    };
    return (
      <div style={style} {...this.props}>
        {children}
      </div>
    );
  }
}
