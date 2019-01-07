/**
 * Created by isaac on 16/4/25.
 */
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

export default
class SearchInput extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    api: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func,
    fields: PropTypes.object,
    urlData: PropTypes.object
  };

  componentDidMount() {
    this._initWithProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this._initWithProps(nextProps);
  }

  _initWithProps = (obj) => {
    const {value = '', api, urlData} = obj;
    const node = $(ReactDOM.findDOMNode(this.refs.search));
    node.search({
      apiSettings: {
        url: api,
        urlData
      },
      fields: obj.fields,
      onSelect: (result, response) => {
        this.props.onChange(node.search('get value'), result, response);
      }
    });
    node.search('set value', value);
  };

  _clearInput = (event) => {
    event.preventDefault();
    const node = $(ReactDOM.findDOMNode(this.refs.search));
    node.search('set value', '');
    this.props.onChange(null, null);
  };

  render() {
    const {placeholder} = this.props;
    return (
      <div className="ui search" ref="search" >
        <div className="ui right icon input" >
          <input type="text" className="prompt" placeholder={placeholder} style={{borderRadius: 0}} />
          <i className="icon remove" style={{pointerEvents: 'all'}} onClick={this._clearInput} />
        </div>
      </div>
    );
  }
}
