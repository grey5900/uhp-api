/**
 * Created by yons on 16/4/4.
 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {NormalButton, FormInput, Header} from 'components';
import {disableEvent, alertSuccess} from 'utils/ui';
import {Content} from 'components';
import {addHospital, updateHospital, loadHospital} from 'redux/modules/hospital';
import {loadAll as allDoctorsInHospital} from 'redux/modules/doctor';
import {goBack} from 'react-router-redux';
import Helmet from 'react-helmet';
import ReactDOM from 'react-dom';
import {visitedOptions} from '../../utils/constants';

@connect(
  () => ({}),
  {
    addHospital, updateHospital, loadHospital, allDoctorsInHospital,
    goBack
  }
)
export default class HospitalDetail extends Content {
  static propTypes = {
    params: PropTypes.object,
    loadHospital: PropTypes.func.isRequired,
    addHospital: PropTypes.func.isRequired,
    updateHospital: PropTypes.func.isRequired,
    allDoctorsInHospital: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      hospital: {},
      contactValues: [],
      contact: ''
    };
  }

  componentWillMount() {
    const {hospitalID} = this.props.params;
    if (hospitalID) {
      this.props.loadHospital({id: hospitalID}, (error, response) => {
        if (response) {
          console.log('hospital', response.data);
          const {data} = response;
          delete data._id;
          const {contact = {}} = data;
          this.props.allDoctorsInHospital({hospital: hospitalID}, (err, doctorResponse) => {
            const doctors = doctorResponse.data;
            if (doctors) {
              const contactValues = doctors.map((doctor) => {
                return {
                  value: doctor.name,
                  id: doctor._id
                };
              });
              this.setState({
                hospital: data,
                contactValues,
                contact: contact.name,
              });
            }
          });
        }
      });
    } else {
      this.setState({
        hospital: {},
      });
    }
  }

  componentDidUpdate() {
    $(ReactDOM.findDOMNode(this.refs.contactSelect)).dropdown();
  }

  onChangeUpdate = (event) => {
    const {hospital} = this.state;
    const stateChange = {...hospital};
    stateChange[event.target.name] = event.target.value;
    this.setState({
      hospital: stateChange
    });
  };

  _onHospitalInfoUpdate = (event) => {
    const stateChange = {...this.state.hospital};
    const {name, value} = event.target;
    stateChange[name] = value;
    this.setState({hospital: stateChange});
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const {hospital} = this.state;
    const {hospitalID} = this.props.params;
    if (hospitalID) {
      console.log('update');
      this.props.updateHospital({id: hospitalID, args: hospital}, () => {
        alertSuccess('更新成功!');
        this.props.goBack();
      });
    } else {
      this.props.addHospital(hospital, () => {
        alertSuccess('创建成功!');
        this.props.goBack();
      });
    }
  };
  handleBack = () => {
    this.props.goBack();
  };


  _renderBasic() {
    const {hospital, contact = {}, contactValues = []} = this.state;
    const {hospitalID} = this.props.params;
    return (
      <form className="ui form">
        <Header>
          <h5 className="ui blue header">基础信息:</h5>
        </Header>
        <div className="five fields" >
          <FormInput label="名称" error="* 必填项" value={hospital.name} onChange={this._onHospitalInfoUpdate}
                     name="name" />
          <FormInput label="省" value={hospital.province} onChange={this._onHospitalInfoUpdate}
                     name="province" />
          <FormInput label="市" value={hospital.city} onChange={this._onHospitalInfoUpdate}
                     name="city" />
          <FormInput label="区" value={hospital.area} onChange={this._onHospitalInfoUpdate}
                     name="area" />
          <FormInput label="地址" value={hospital.address} onChange={this._onHospitalInfoUpdate} name="address" />
        </div>
        <div className="five fields">
          <div className="field">
            <label>联系人</label>
            {hospitalID &&
            <select className="ui search dropdown" ref="contactSelect" name="contact"
                    onChange={::this._onHospitalInfoUpdate} >
              {contactValues &&
              <option value={contact.name ? contact._id : ''} >{contact.name ? contact.name : '联系人'}</option>}
              {contactValues && contactValues.map((item) => <option value={item.id} key={item.id} >{item.value}</option>)}
            </select>
            }
          </div>
          <div className="field">
            <label>走访情况</label>
            <select className="ui search dropdown" name="visited" onChange={this._onHospitalInfoUpdate} >
              <option value={hospital.visited || ''} >{hospital.visited || '请选择'}</option>
              {visitedOptions && visitedOptions.map((item, i) => <option value={item.value} key={i} >{item.name}</option>)}
            </select>
          </div>
          <FormInput label="病床情况" value={hospital.beds} onChange={this.onChangeUpdate} name="beds" />
          <FormInput label="病人情况" value={hospital.patients_info} onChange={this.onChangeUpdate} name="patients_info" />
          <FormInput label="医护情况" value={hospital.medical} onChange={this.onChangeUpdate} name="medical" />
        </div>
        <div className="five fields">
          <FormInput label="医院等级" value={hospital.level} onChange={this.onChangeUpdate} name="level" />
          <FormInput label="装修布局" value={hospital.layout} onChange={this.onChangeUpdate} name="layout" />
          <FormInput label="主要设备" value={hospital.equipment} onChange={this.onChangeUpdate} name="equipment" />
          <FormInput label="透析班次" value={hospital.scheduling} onChange={this.onChangeUpdate} name="scheduling" />
        </div>
        <Header>
          <h5 className="ui blue header">运营信息:</h5>
        </Header>
        <div className="five fields">
          <FormInput label="特色技术" value={hospital.features} onChange={this.onChangeUpdate} name="features" />
          <FormInput label="收费标准" value={hospital.charge} onChange={this.onChangeUpdate} name="charge" />
          <FormInput label="服务特色" value={hospital.service} onChange={this.onChangeUpdate} name="service" />
          <FormInput label="销售/推广渠道" value={hospital.marketing} onChange={this.onChangeUpdate} name="marketing" />
        </div>
        <div className="five fields">
          <FormInput label="市场占有率" value={hospital.share} onChange={this.onChangeUpdate} name="share" />
        </div>
      </form>
    );
  }

  render() {
    const style = {
      height: '40px',
      marginTop: '5px'
    };
    const {hospitalID} = this.props.params;
    const name = hospitalID ? '编辑医院信息' : '新增医院';
    return (<div is="content" onContextMenu={disableEvent}>
      <Helmet title={name} />
      <div className="panel panel-default" is="panel">
        <div className="panel-heading" style={style}>
          <span is="panelTitle">{name}</span>
        </div>
        <div className="panel-body" is="panelbody">
          {this._renderBasic()}
          <br />
          <div className="fields" >
            <div className="col-sm-3 pull-right" >
              <NormalButton style={{marginRight: '26px', backgroundColor: '#ABABAB'}}
                            onClick={this.handleBack}>返回</NormalButton>
              <NormalButton onClick={this.handleSubmit}>提交</NormalButton>
            </div>
          </div>
        </div>
      </div>
    </div>);
  }
}
