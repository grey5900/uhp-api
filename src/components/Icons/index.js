/**
 * Created by isaac on 16/4/25.
 */
import React, {Component, PropTypes} from 'react';
import cx from 'classnames';

function iconcreator(name, metaStyle) {
  return class extends Component {
    static propTypes = {
      className: PropTypes.string,
      style: PropTypes.object
    };

    render() {
      const {className, style, ...rest} = this.props;
      const result = cx(className, name, 'icon');
      const realStyle = {...style};
      Object.assign(realStyle, metaStyle);
      return (<i className={result} style={realStyle} {...rest} />);
    }
  };
}

export const Grid = iconcreator('grid layout');
export const Subtract = iconcreator('minus');
export const Add = iconcreator('plus');
export const Sort = iconcreator('sort content ascending', {padding: 0});
export const CheckBox = iconcreator('checkmark');
export const Remove = iconcreator('remove');
export const Filter = iconcreator('filter');

