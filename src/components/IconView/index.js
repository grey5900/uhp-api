/**
 * Created by isaac on 16/3/3.
 */
import React, {Component, PropTypes} from 'react';
import InlineCSS from 'react-inline-css';

export default
class IconView extends Component {
  static propTypes = {
    icon: PropTypes.any.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    color: PropTypes.string
  };

  render() {
    const {icon, width, height, color, ...rest} = this.props;
    const IconComponent = icon;
    const style = `
    & {
        display: inline-block;
      }
    & svg {
            width: ${width};
            height: ${height};
            stroke: ${color};
          }
    `;

    return (<InlineCSS stylesheet={style} {...rest}><IconComponent /></InlineCSS>);
  }
}
