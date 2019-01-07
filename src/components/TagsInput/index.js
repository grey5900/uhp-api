/*
 * Copyright(c) omk 2016
 * Filename: index.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期三,  6 七月 2016.
 */
import React, {Component, PropTypes} from 'react';
import Tags from 'react-tagsinput';

export default
class TagsInput extends Component {
  static contextTypes = {
    formViewMode: PropTypes.bool
  };

  render() {
    const {...rest} = this.props;
    const {formViewMode} = this.context;
    let elements = null;
    if (formViewMode) {
      elements = (
        <div className="ui tag labels">
          {rest.value.map((tag) =>
             <a className="ui label"> {tag} </a>
           )}
        </div>
      );
    } else {
      elements = (
        <Tags {...rest} inputProps={{className: 'react-tagsinput-input', placeholder: '回车添加' }} />
      );
    }
    return elements;
  }
}
