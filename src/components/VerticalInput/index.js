/**
 * Created by isaac on 16/4/29.
 */
import React, {Component, PropTypes} from 'react';

export default
class VerticalInput extends Component {
  static propTypes = {
    label: PropTypes.string
  };

  render() {
    const {label, ...rest} = this.props;
    return (<div className="field" >
      <label>{label}</label>
      <input type="text" {...rest} />
    </div>);
  }
}

