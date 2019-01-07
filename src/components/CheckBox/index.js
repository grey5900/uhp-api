/**
 * Created by isaac on 16/4/25.
 */
import React, {Component, PropTypes} from 'react';
import cx from 'classnames';

export default
class CheckBox extends Component {
  static propTypes = {
    label: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object
  };
  static contextTypes = {
    formViewMode: PropTypes.bool
  };

  render() {
    const {label, className, style, ...rest} = this.props;
    const {formViewMode} = this.context;
    let content = null;
    if (formViewMode && rest.checked) {
      content = (<span style={{color: '#666666'}}><i className="checkmark box icon"></i>{label}</span>);
    } else if (formViewMode && !rest.checked) {
      content = (<span style={{color: '#666666'}}><i className="minus square outline icon"></i>{label}</span>);
    } else {
      content = (<div className={cx('ui checkbox', className)} style={style} >
        <input type="checkbox" {...rest} />
        <label>{label}</label>
      </div>);
    }
    return content;
  }
}
