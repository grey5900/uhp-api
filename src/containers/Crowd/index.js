/**
 * Created by jiang_mac on 16/3/28.
 */
import React, {PropTypes} from 'react';
import {Content, NormalButton, VerticalInput} from 'components';
import {connect} from 'react-redux';
import {searchPatientCount} from 'redux/modules/patient';
import {loadAll as loadAllHospital} from 'redux/modules/hospital';
import {openAlert} from 'redux/modules/ui';
import {BarChart, PieChart} from 'react-d3-components';
import ReactDOM from 'react-dom';

const ALL = 'all';

const countStyle = {
  border: '1px solid #eeeeee',
  boxSizing: 'border-box',
  margin: '10px',
  padding: '10px',
  borderRadius: '6px'
};

const ageOptions = [
  {name: '全部', value: ALL},
  {name: '20以下', value: '0-20'},
  {name: '21~25', value: '21-25'},
  {name: '26~30', value: '26-30'},
  {name: '31~35', value: '31-35'},
  {name: '36~40', value: '36-40'},
  {name: '41~50', value: '41-50'},
  {name: '51~60', value: '51-60'},
  {name: '61~70', value: '61-70'},
  {name: '71~80', value: '71-80'},
  {name: '80以上', value: '81-120'}
];
const educationOptions = [
  {name: '全部', value: ALL},
  {name: '小学', value: 'primary'},
  {name: '初中', value: 'junior'},
  {name: '高中', value: 'senior'},
  {name: '大专', value: 'college'},
  {name: '本科', value: 'bachelor'},
  {name: '硕士', value: 'master'},
  {name: '博士', value: 'doctor'},
];

const groupTypes = [
  {name: '性别', value: 'gender'},
  {name: '地区', value: 'area'},
  {name: '年龄', value: 'age'},
  {name: '透析龄', value: 'first_treatment'},
  {name: '教育程度', value: 'education_degree'},
  {name: '透析方式', value: 'type'}
];

@connect(
  () => ({}),
  {
    searchPatientCount, loadAllHospital, openAlert
  })
export default class Crowd extends Content {
  static propTypes = {
    searchPatientCount: PropTypes.func.isRequired,
    loadAllHospital: PropTypes.func.isRequired,
    openAlert: PropTypes.func.isRequired
  };

  state = {
    query: {gender: ALL, area: '', hospital: ALL, age: ALL, education: ALL, type: ALL, group: ''},
    labourData: {
      label: '劳务详情',
      values: [{x: '', y: 0}]
    },
    contentWidth: 400,
    checkedValue: '',
    hospitals: []
  };

  componentDidMount() {
    this._setLabourContentWidth();
    $('.search_count').eq(0).addClass('count-bg');
    $('.search_count').click((e) => {
      $('.search_count').removeClass('count-bg');
      $(e.toElement).addClass('count-bg');
    });
    $(ReactDOM.findDOMNode(this.refs.groupSelect)).dropdown();
    $(ReactDOM.findDOMNode(this.refs.genderSelect)).dropdown();
    $(ReactDOM.findDOMNode(this.refs.typeSelect)).dropdown();
    $(ReactDOM.findDOMNode(this.refs.ageSelect)).dropdown();
    $(ReactDOM.findDOMNode(this.refs.educationSelect)).dropdown();
    $(ReactDOM.findDOMNode(this.refs.hospitalSelect)).dropdown();
    this.props.loadAllHospital((error, response) => {
      if (response) {
        this.setState({hospitals: response.data});
      }
    });
  }

  _setLabourContentWidth = () => {
    const ele = this.refs.labourContent;
    this.setState({
      contentWidth: ele.scrollWidth
    });
  };
  _search = () => {
    const {query: {group}} = this.state;
    if (group === '') {
      this.props.openAlert({
        title: '请选择绘图指标!',
        text: '',
        type: 'error'
      });
    } else {
      const query = {...this.state.query};
      let {area} = query;
      if (!area || area.length === 0) {
        area = 'all';
        query.area = area;
      }
      this.props.searchPatientCount(query, (response) => {
        const {data} = response;
        const keys = Object.keys(data);
        if (keys.length > 0) {
          const values = Object.keys(data).map((key) => ({x: key, y: data[key]}));
          this.setState({
            labourData: {
              ...this.state.labourData,
              values
            }
          });
        } else {
          this.props.openAlert({
            title: '查询结果为空!',
            text: '',
            type: 'warning'
          });
        }
      });
    }
    console.log('query: ', this.state.query);
  };
  _onFilterChange = (event) => {
    const {name, value} = event.target;
    const query = {...this.state.query};
    query[name] = value;
    this.setState({query});
  };
  _renderFilters = () => {
    const {query: {area, age, hospital, gender, education, type}, hospitals} = this.state;
    console.log(this.state.query);
    const element = [];
    element.push(<div className="equal width fields" style={{marginTop: '10px'}} >
        <div className="field" >
          <label>性别</label>
          <select className="ui search dropdown" ref="genderSelect" value={gender} name="gender"
                  onChange={this._onFilterChange} >
            <option value={ALL} >全部</option>
            <option value="Male" >男</option>
            <option value="Female" >女</option>
          </select>
        </div>
        <VerticalInput label="地区" name="area" value={area} onChange={this._onFilterChange} />
        <div className="field" >
          <label>医院</label>
          <select className="ui search dropdown" ref="hospitalSelect" name="hospital" value={hospital}
                  onChange={this._onFilterChange} >
            <option value={ALL} >全部</option>
                  {hospitals.map((group, idx) => <option key={idx} value={group._id} >{group.name}</option>)}
          </select>
        </div>
      </div>
    );
    element.push(<div className="equal width fields" >
        <div className="field" >
          <label>年龄范围</label>
          <select className="ui search dropdown" ref="ageSelect" name="age" value={age}
                  onChange={this._onFilterChange} >
                  {ageOptions.map((group, idx) => <option key={idx} value={group.value} >{group.name}</option>)}
          </select>
        </div>
        <div className="field" >
          <label>教育程度</label>
          <select className="ui search dropdown" ref="educationSelect" name="education" value={education}
                  onChange={this._onFilterChange} >
                  {educationOptions.map((group, idx) => <option key={idx} value={group.value} >{group.name}</option>)}
          </select>
        </div>
        <div className="field" >
          <label>透析方式:</label>
          <select className="ui search dropdown" ref="typeSelect" value={type} onChange={this._onFilterChange} >
            <option value={ALL} >全部</option>
            <option value="hemodialysis" >血透</option>
            <option value="peritoneal" >腹透</option>
          </select>
        </div>
      </div>
    );
    return element;
  };
  _renderColumn = () => {
    const {query: {group}} = this.state;
    return (
      <div className="fields" >
        <div className="field" >
          <label>绘图指标</label>
          <select className="ui search dropdown" ref="groupSelect" name="group" value={group}
                  onChange={this._onFilterChange} >
            <option value="" >请选择</option>
                  {groupTypes.map((item, idx) => <option key={idx} value={item.value} >{item.name}</option>)}
          </select>
        </div>
        <div className="field" >
          <label style={{height: '20px'}} > </label>
          <NormalButton onClick={this._search} >查询</NormalButton>
        </div>
      </div>
    );
  };

  _renderLabor = () => {
    const {labourData, contentWidth} = this.state;
    return (
      <div style={countStyle} className="wide field eight" >
        <div className="fields" ref="labourContent" >
          <BarChart
            data={labourData}
            width={contentWidth}
            height={300}
            margin={{top: 20, bottom: 20, left: 30, right: 10}} />
        </div>
      </div>
    );
  };

  _renderPie = () => {
    const {labourData, contentWidth} = this.state;
    return (
      <div style={countStyle} className="wide field eight" >
        <div className="fields" ref="labourContent" >
          <PieChart
            data={labourData}
            width={contentWidth}
            height={300}
            margin={{top: 20, bottom: 20, left: 30, right: 10}} />
        </div>
      </div>
    );
  };

  render() {
    return (
      <div is="content" >
        <form className="ui form" >
              {this._renderFilters()}
                <hr />
              {this._renderColumn()}
                <div className="fields" >
                     {this._renderLabor()}
                     {this._renderPie()}
                </div>
        </form>
      </div>
    );
  }
}
