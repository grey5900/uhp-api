/**
 * Created by isaac on 16/4/25.
 */
import React, {Component, PropTypes} from 'react';

export default
class FormField extends Component {
  static propTypes = {
    label: PropTypes.any,
    suffix: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    children: PropTypes.any
  };

  render() {
    const {label, suffix, children} = this.props;
    let className = null;
    if (suffix) {
      className = 'ui right labeled input';
    } else {
      className = 'ui labeled input';
    }
    return (<div className={className} >
      {label && <div className="ui label" >{label}{suffix && <span>({suffix})</span>}</div>}
      {children}
    </div>);
  }
}
