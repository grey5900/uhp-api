/**
 * Created by isaac on 16/4/25.
 */
import React, {Component, PropTypes} from 'react';

export default
class RadioButton extends Component {
  static propTypes = {
    label: PropTypes.string,
    style: PropTypes.object
  };

  static contextTypes = {
    formViewMode: PropTypes.bool
  };
  render() {
    const {label, style, ...rest} = this.props;
    const {formViewMode} = this.context;
    let elements = null;
    if (formViewMode && rest.checked) {
      elements = (<span style={style}><i className="selected radio icon"></i>{label}</span>);
    } else if (formViewMode && !rest.checked) {
      elements = (<span style={style}><i className="radio icon"></i>{label}</span>);
    } else {
      elements = (<div className="ui radio checkbox" style={style} >
        <input type="radio" {...rest} />
        <label>{label}</label>
      </div>);
    }
    return elements;
  }
}
