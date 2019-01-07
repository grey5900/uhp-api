/**
 * Created by isaac on 2016/4/5.
 */
import React, {Component, PropTypes} from 'react';
import cx from 'classnames';

const sizeMap = {
  1: 'one wide ',
  2: 'two wide ',
  3: 'three wide ',
  4: 'four wide ',
  5: 'five wide ',
  6: 'six wide ',
  7: 'seven wide ',
  8: 'eight wide ',
  9: 'nine wide ',
  10: 'ten wide ',
  11: 'eleven wide ',
  12: 'twelve wide ',
  13: 'thirteen wide ',
  14: 'fourteen wide ',
  15: 'fifteen wide ',
  16: 'sixteen wide '
};

export default
class FormInput extends Component {
  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.number,
    label: PropTypes.any,
    type: PropTypes.string,
    suffix: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    prefixIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    inputElement: PropTypes.any,
    options: PropTypes.array
  };
  static contextTypes = {
    formViewMode: PropTypes.bool
  };
  _renderInput = (inputElement, props) => {
    const rest = {...props};
    if (!rest.type) {
      rest.type = 'text';
    }
    if (!rest.value) {
      rest.value = '';
    }
    const InputComponent = inputElement;
    let result = null;
    if (InputComponent) {
      result = (<InputComponent {...rest} />);
    } else {
      result = (<input {...rest} />);
    }
    return result;
  };
  _renderIconInput = (inputElement, props) => {
    const rest = {...props};
    if (!rest.type) {
      rest.type = 'text';
    }
    if (!rest.value) {
      rest.value = '';
    }
    const InputComponent = inputElement;
    let result = null;
    if (InputComponent) {
      result = (<InputComponent {...rest} />);
    } else {
      result = (<input {...rest} />);
    }
    return result;
  };
  _renderSelect = (options, props) => {
    let result = null;
    if (options) {
      result = (<select {...props} className="ui fluid dropdown" >
        {options.map((info, index) => <option key={index} value={info.value} >{info.name}</option>)}
      </select>);
    }
    return result;
  };

  render() {
    const {size, label, className, inputElement, options, suffix, prefixIcon, ...rest} = this.props;
    const {formViewMode} = this.context;
    let elements = null;

    if (formViewMode) {
      let value = rest.value || '-----';
      if (inputElement) {
        value = value.substr(0, rest.mask.length);
      }
      elements = (<div className={cx(sizeMap[size], className, 'field')} >
        <label style={{color: '#666666', fontSize: '14px'}}>{label}</label>
        <div style={{color: '#666666', fontSize: '12px'}}>{value}{suffix || ''}</div>
      </div>);
    } else if (prefixIcon) {
      elements = (<div className={cx(sizeMap[size], className, 'field')} >
        {label && <label>{label}</label>}
        <div className="ui left icon input">
          {this._renderIconInput(inputElement, rest)}
          {prefixIcon && <i className={cx('icon', prefixIcon)} style={{height: '38px'}} />}
        </div>
      </div>);
    } else {
      elements = (<div className={cx(sizeMap[size], className, 'field')} >
        <label>{label}{suffix && <span>({suffix})</span>}</label>
        {!options && this._renderInput(inputElement, rest)}
        {options && this._renderSelect(options, rest)}
      </div>);
    }
    return elements;
  }
}
