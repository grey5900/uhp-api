/**
 * Created by jiang_mac on 16/5/10.
 */
import React, {Component, PropTypes} from 'react';
import {FormInput, NormalButton} from 'components';
import moment from 'moment';
import {connect} from 'react-redux';
import * as labourTypeActions from 'redux/modules/labourType';
import {searchPatient} from 'redux/modules/patient';
import ReactDOM from 'react-dom';

const baseOptions = [
  {name: '', value: ''},
  {name: '南充康复爱心基地', value: '南充康复爱心基地'},
  {name: '南充南部爱心基地', value: '南充南部爱心基地'},
  {name: '成都爱心基地', value: '成都爱心基地'},
  {name: '遂宁爱心基地', value: '遂宁爱心基地'}
];

@connect(
  () => ({}), {
    ...labourTypeActions,
    searchPatient
  }
)
export default class LabourModal extends Component {
  static propTypes = {
    data: PropTypes.any,
    submitData: PropTypes.func,
    onCancel: PropTypes.func,
    loadAll: PropTypes.func,
    searchPatient: PropTypes.func
  };

  state = {
    data: this.props.data || {
      type: {},
      start_time: new Date(),
      name: '',
      assignee: '',
      status: 'Init',
      payment: null,
      comment: ''
    },
    typeOptions: [],
    patientOptions: []
  };

  componentWillMount() {
    const {loadAll} = this.props;
    loadAll(({data}) => {
      const newData = data.map((type) => ({value: type._id, name: type.name}));
      newData.unshift({value: '', name: ''});
      this.setState({
        typeOptions: newData
      });
    });
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.patientSelect)).dropdown();
    $('.search').on('input', (event) => {
      console.log('jkj', event.target.value);
      if (event.target.value.length > 0) {
        this.props.searchPatient({search: event.target.value}, (error, patientsData) => {
          if (!error) {
            const data = patientsData.data.patients || [];
            console.log('data', data);
            const newData = data.map((patient) => {
              return {
                value: patient._id,
                name: patient.real_name
              };
            });

            this.setState({
              patientOptions: newData
            });
          }
        });
      }
    });
  }

  _onChangeValue = (event) => {
    const {name, value} = event.target;
    const newState = {...this.state};
    newState.data[name] = value;
    this.setState(newState);
  };

  _submitData = () => {
    const {data} = this.state;
    const {submitData} = this.props;
    if (submitData) {
      submitData(data);
    }
  };

  _getStatusOptions = () => {
    const options = [
      {value: 'Init', name: '未开始'},
      {value: 'Going', name: '进行中'},
      {value: 'NotFinished', name: '未完成'},
      {value: 'InReview', name: '审核中'},
      {value: 'InCheck', name: '验收中'},
      {value: 'Finished', name: '已完成'},
      {value: 'Canceled', name: '取消'},
    ];
    return options;
  };

  render() {
    const {data, typeOptions, patientOptions} = this.state;
    console.log('assignee, state', this.state.data);
    return (
      <form className="ui form">
        <div className="fields">
          <FormInput size={4} label="劳务项目" options={typeOptions} value={data.type} name="type"
                     onChange={this._onChangeValue} />
          <FormInput size={4} label="创建时间" value={moment(data.start_time).format('YYYY-M-DD')}
                     disable name="start_time" />
          <FormInput size={4} label="所属基地" value={data.base} name="base" onChange={this._onChangeValue} options={baseOptions} />
          <div className="four wide field">
            <label>执行人</label>
            <select className="ui search dropdown" ref="patientSelect" name="assignee"
                    onChange={this._onChangeValue}>
              {patientOptions &&
              <option
                value={data.assignee ? data.assignee._id : ''}>{data.assignee ? data.assignee.real_name : '执行人'}</option>}
              {patientOptions && patientOptions.map((item) => <option value={item.value}
                                                                      key={item.value}>{item.name}</option>)}
            </select>
          </div>
        </div>
        <div className="fields">
          <FormInput size={4} label="项目状态" options={this._getStatusOptions()} value={data.status} name="status"
                     onChange={this._onChangeValue} />
          <FormInput size={4} label="薪酬" value={data.payment} name="payment" onChange={this._onChangeValue} />
          <FormInput size={4} label="备注" value={data.comment} name="comment" onChange={this._onChangeValue} />
        </div>
        <div className="fields">
          <FormInput size={4} label="起始时间" value={moment(data.start_time).format('YYYY-M-DD')} name="start_time" onChange={this._onChangeValue} />
          <FormInput size={4} label="截止时间" value={data.end_time} name="end_time" onChange={this._onChangeValue} />
        </div>
        <div className="fields">
          <div className="sixteen wide field">
            <NormalButton onClick={this.props.onCancel}
                          style={{marginRight: '20px', backgroundColor: '#ABABAB'}}>取消</NormalButton>
            <NormalButton onClick={this._submitData}>保存</NormalButton>
          </div>
        </div>
      </form>
    );
  }
}
