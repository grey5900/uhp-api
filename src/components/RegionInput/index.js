/**
 * Created by Grey on 16/6/2.
 */
import React, {Component, PropTypes} from 'react';

export default
class RegionInput extends Component {
  static propTypes = {
    prov: PropTypes.string,
    city: PropTypes.string,
    county: PropTypes.string,
    defaultText: PropTypes.array
  };

  getInitialState = () => {
    return {
      prov: this.props.options.prov,
      city: this.props.options.city,
      county: this.props.options.county
    };
  }
  selectProv = (evt) =>{
    this.setState({
      prov: evt.target.value,
      city: '',
      county: ''
    });
  }
  selectCity = (evt) => {
    this.setState({
      city: evt.target.value,
      county: ''
    });
  }
  selectCounty = (evt) => {
    this.setState({
      county: evt.target.value
    });
  }

  render() {
    const data = this.props.data;
    const options = $.extend({defaultName:['provinceId', 'cityId', 'countyId'], defaultText:['请选择', '请选择', '请选择']},this.props.options);
    let provs = [], citys = [], countys = [];
    for(let i in data.provinces){
      provs.push([i,data.provinces[i].name])
    }
    provs.map((item) => {
      return (<option value={item[0]}>{item[1]}</option>);
    });

    if(this.state.prov){
      for(let i in data.provinces[this.state.prov].citys){
        citys.push([i,data.provinces[this.state.prov].citys[i].name])
      }
      citys.map((item) => {
        return (<option value={item[0]}>{item[1]}</option>);
      });
    }
    if(this.state.prov && this.state.city){
      for(let i in data.provinces[this.state.prov].citys[this.state.city].countys){
        countys.push([i,data.provinces[this.state.prov].citys[this.state.city].countys[i].name])
      }
      countys.map((item) => {
        return (<option value={item[0]}>{item[1]}</option>);
      });
    }

    return (
      <div className="J_area_selector">
        <select className="J_area_prov" name={options.defaultName[0]} value={this.state.prov} onChange={this.selectProv}>
          <option value="">{options.defaultText[0]}</option>
          {provs}
        </select>
        <select className="J_area_city" name={options.defaultName[1]} value={this.state.city} onChange={this.selectCity}>
          <option value="">{options.defaultText[1]}</option>
          {citys}
        </select>
        <select className="J_area_county" name={options.defaultName[2]} value={this.state.visit_note} onChange={this.selectCounty}>
          <option value="">{options.defaultText[2]}</option>
          {countys}
        </select>
      </div>
    );
  }
}
