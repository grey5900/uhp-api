/**
 * Created by jiang_mac on 16/3/11.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import MaskedInput from 'react-maskedinput';
import {NormalButton, Header, FormInput, Photo, Avatar} from 'components';
import {Scrollbars} from 'react-custom-scrollbars';
import QRCode from 'qrcode.react';
import {printElement} from 'utils/ui';
import QRcodePrint from './QRcodePrint';
import ReactDOM from 'react-dom';

import {
  patientTypeOptions,
  maritalStatusOptions,
  educationDegreeOptions,
  patientSourceOptions,
  knowAboutFundOptions,
  medicareTypeOptions,
  relationOptions
} from 'utils/constants';

import {loadAll as allHospital} from 'redux/modules/hospital';
import * as patientActions from 'redux/modules/patient';
import config from 'config';

@connect(
  () => ({}), {
    ...patientActions,
    allHospital
  }
)
export default class PatientBasic extends Component {
  static propTypes = {
    patient: PropTypes.object,
    updatePatient: PropTypes.func,
    addPatient: PropTypes.func,
    allHospital: PropTypes.func
  };

  state = this.state = {
    patient: {},
    contact: [{}],
    basicInfo: {
      personIdError: '* 必填项',
      open: false
    },
    hospitalId: '',
    hospital: '',
    hospitalValues: [],
    camera: false,
  };

  componentWillMount() {
    this.props.allHospital((error, hospitalsData = {}) => {
      if (!error) {
        const hospitals = hospitalsData.data;
        const hospitalValues = this._setHospitals(hospitals);
        this.setState({
          hospitalValues
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const patient = nextProps.patient;
    if (patient) {
      this._setBasicState(patient);
    }
    this.props.allHospital((error, hospitalsData = {}) => {
      if (!error) {
        const hospitals = hospitalsData.data;
        const hospitalValues = this._setHospitals(hospitals);
        this.setState({
          hospitalValues
        });
      }
    });
  }

  componentDidUpdate() {
    $(ReactDOM.findDOMNode(this.refs.hospitalSelect)).dropdown();
  }

  _printDetail = () => {
    const patientID = this.state.patient._id;
    const element = <QRcodePrint patientID={patientID} />;
    printElement(element);
  };

  _setHospitals = (hospitals = []) => {
    return hospitals.map((hospital) => {
      return {
        value: hospital.name,
        id: hospital._id
      };
    });
  };

  _setBasicState(patient) {
    const {contact, hospital = {}} = patient;
    this.setState({
      patient: {
        ...this.state.patient,
        ...patient,
      },
      contact: [{
        ...contact[0]
      }],
      hospital: hospital.name
    });
  }

  _onPatientUpdate(event) {
    const {patient} = this.state;
    const stateChange = {...patient};
    stateChange[event.target.name] = event.target.value;
    this.setState({
      patient: stateChange
    });
  }

  _onMedicareTypeUpdate = (event) => {
    const {value} = event.target;
    stateChange[event.target.name] = value;
    this.setState({
      medicare_type: stateChange
    });
  };

  _onContactUpdate(event) {
    const {contact} = this.state;
    const stateChange = {...contact};
    stateChange[0][event.target.name] = event.target.value;
    this.setState({
      contact: [stateChange[0]]
    });
  }

  _dateCheck(event) {
    const personId = event.target.value;
    const today = new Date();
    const pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    let {gender, birthday, age} = this.state.patient;
    let {personIdError} = this.state.basicInfo;

    if (pattern.test(personId)) {
      const ic = personId;
      const genderData = ic.slice(14, 17) % 2 ? '1' : '2';
      birthday = `${ic.substring(6, 10)}-${ic.substring(10, 12)}-${ic.substring(12, 14)}`;
      const date = new Date(birthday);
      personIdError = '* 必填';
      age = today.getFullYear() - date.getFullYear();
      if (genderData === '1') {
        gender = 'Male';
      } else {
        gender = 'Female';
      }
    } else {
      personIdError = '身份证号码错误';
    }

    const {patient, basicInfo} = this.state;
    this.setState({
      patient: {
        ...patient,
        person_id: personId,
        age,
        birthday,
        gender
      },
      basicInfo: {
        ...basicInfo,
        personIdError
      }
    });
  }

  _isOwnEmpty(obj) {
    for (const name in obj) {
      if (obj.hasOwnProperty(name)) {
        return false;
      }
    }
    return true;
  }

  handleAddSubmit = (event) => {
    event.preventDefault();

    const {patient, contact} = this.state;
    delete patient.contact;
    const data = {
      patient,
      contact: contact[0]
    };

    console.log('addPatient', patient);
    if (this._isOwnEmpty(data.contact)) {
      data.contact = '';
    }
    this.props.addPatient(data);
  };

  handleUpdateSubmit = (event) => {
    event.preventDefault();
    const {patient, contact} = this.state;
    const id = patient._id;
    delete patient.contact;
    const data = {
      patient: {
        ...patient,
        id
      },
      contact: contact[0]
    };

    if (this._isOwnEmpty(data.contact)) {
      data.contact = '';
    }
    console.log(data, 'patient data update....');
    this.props.updatePatient(data);
  };

  _openCamera = () => {
    this.setState({
      camera: true
    });
  };

  _closeCamera = () => {
    this.setState({
      camera: false
    });
  };

  _checkPhoto = (photo) => {
    this.setState({
      patient: {
        ...this.state.patient,
        avatarData: photo
      }
    });
  };

  _checkImgSrc = () => {
    const {avatar = {}, avatarData} = this.state.patient;
    let src = '';
    if (avatarData) {
      src = avatarData;
    } else if (avatar.name) {
      src = `${config.rootURL}/${avatar.name}`;
    }
    return src;
  };

  _generateAge(birthday) {
    const today = new Date();
    const date = new Date(birthday);
    const age = today.getFullYear() - date.getFullYear();
    return age;
  }
  _renderBasic() {
    const {patient, contact} = this.state;
    const {type} = patient;
    const patientID = patient._id;
    const avatarStyle = {
      width: '188px',
      height: '140px',
      border: '1px solid #ececec',
      borderRadius: '5px',
      display: 'inline-block',
      marginBottom: '2px',
      overflow: 'hidden',
      backgroundColor: '#eeeeee'
    };

    return (
      <form className="ui form" >
        <Header>
          <h5 className="ui blue header">基础信息:</h5>
        </Header>
        <div className="fields" >
          <FormInput size={3} label="姓名" value={patient.real_name} onChange={::this._onPatientUpdate}
                     name="real_name" />
          <FormInput size={4} label="身份证" value={patient.person_id} onChange={::this._dateCheck} name="person_id"
                     ref="person_id" />
          <FormInput size={3} label="患者类型" value={type} name="type" onChange={::this._onPatientUpdate}
                     options={patientTypeOptions} />
          <div className="three wide field"
               style={{height: '1px', textAlign: 'center', position: 'relative', zIndex: '99'}} >
            <div style={avatarStyle} >
              <Avatar style={{width: '100%', height: '100%'}} src={this._checkImgSrc()} />
            </div>
            <br />
            <NormalButton onClick={this._openCamera} >照相</NormalButton>
          </div>
          <div className="three wide field"
               style={{height: '1px', textAlign: 'center', position: 'relative', zIndex: '99'}} >
            <QRCode value={`uhs://patient?id=${patientID}`} size={140} /><br />
            <NormalButton onClick={this._printDetail} >打印二维码</NormalButton>
          </div>
        </div>
        <div className="fields" >
          <FormInput size={3} label="手机号" inputElement={MaskedInput} value={patient.mobile} mask="111-1111-1111"
                     onChange={::this._onPatientUpdate} name="mobile" />
          <FormInput size={4} label="微信" value={patient.wechat} onChange={::this._onPatientUpdate} name="wechat" />
          <FormInput size={3} label="QQ" value={patient.qq} onChange={::this._onPatientUpdate} name="qq" />
        </div>
        <div className="fields" >
          <FormInput size={3} label="性别" disabled value={patient.gender === 'Male' ? '男' : '女'} />
          <FormInput size={4} label="出生日期" inputElement={MaskedInput} value={patient.birthday} onChange={::this._onPatientUpdate} name="birthday" mask="1111-11-11" />
          <FormInput size={3} label="年龄" disabled value={this._generateAge(patient.birthday)} suffix="岁" />
        </div>
        <div className="fields">
          <FormInput size={10} label="通讯地址" value={patient.address_detail} name="address_detail" onChange={::this._onPatientUpdate} />
          <FormInput size={4} label="地区" value={patient.area} name="area" onChange={::this._onPatientUpdate} />
        </div>
        <div className="fields">
          <FormInput size={3} label="婚姻状况" value={patient.marital_status} name="marital_status"
                     onChange={::this._onPatientUpdate} options={maritalStatusOptions} />
          <FormInput size={4} label="文化程度" value={patient.education_degree} name="education_degree"
                     onChange={::this._onPatientUpdate} options={educationDegreeOptions} />
          <FormInput size={3} label="患者来源" value={patient.source} name="source"
                     onChange={::this._onPatientUpdate} options={patientSourceOptions} />
        </div>
        <div className="fields">
          <FormInput size={5} label="对基金认知度" value={patient.know_fund} name="know_fund"
                     onChange={::this._onPatientUpdate} options={knowAboutFundOptions} />
          <FormInput size={5} label="客服回访程度" value={patient.return_visit_comment} name="return_visit_comment"
                     onChange={::this._onPatientUpdate} />
        </div>
        <Header>
          <h5 className="ui blue header">联系人信息</h5>
        </Header>
        <div className="fields" >
          <FormInput size={4} label="亲属姓名" value={contact[0].name} name="name" onChange={::this._onContactUpdate} />
          <FormInput size={4} label="与患者关系" value={contact[0].relationship} name="relationship"
                     onChange={::this._onContactUpdate} options={relationOptions} />
          <FormInput size={4} label="联系人电话" value={contact[0].phone} name="phone"
                     onChange={::this._onContactUpdate} />
          <FormInput size={4} label="联系人固定电话" value={contact[0].mobile} name="mobile"
                     onChange={::this._onContactUpdate} />
        </div>
      </form>
    );
  }

  _renderHospital() {
    const {patient, hospitalValues} = this.state;
    const {hospital = {}} = patient;
    return (
      <form className="ui form" >
        <Header>
          <h5 className="ui blue header">医疗信息:</h5>
        </Header>
        <div className="fields" >
          <div className="four wide field" >
            <label>所属医院</label>
            <select className="ui search dropdown" ref="hospitalSelect" name="hospital"
                    onChange={::this._onPatientUpdate} >
              {hospitalValues &&
              <option value={hospital.name ? hospital._id : ''} >{hospital.name ? hospital.name : '请选择'}</option>}
              {hospitalValues && hospitalValues.map((item) => <option
                value={item.id} key={item.id} >{item.value}</option>)}
            </select>
          </div>
          <FormInput size={4} label="首次透析时间" inputElement={MaskedInput} value={patient.first_treatment}
                     name="first_treatment" onChange={::this._onPatientUpdate} mask="1111-11-11" />
          <FormInput size={4} label="透析龄" disabled value={this._generateAge(patient.first_treatment)} suffix="年" />
          <FormInput size={4} label="透析日" value={patient.dialysis_schedule_days} name="dialysis_schedule_days"
                     onChange={::this._onPatientUpdate} />
        </div>
        <div className="fields">
          <FormInput size={4} label="医疗付费方式" value={patient.mode_pay} name="mode_pay"
                     onChange={::this._onPatientUpdate} />
          <FormInput label="医保类型" className="required" value={patient.medicare_type} name="medicare_type"
                     onChange={this._onMedicareTypeUpdate} options={medicareTypeOptions} />
          <FormInput size={4} label="其他疾病" value={patient.other_disease} name="other_disease"
                     onChange={::this._onPatientUpdate} />
        </div>
        <Header>
          <h5 className="ui blue header">劳务详情</h5>
        </Header>
        <div className="fields">
          <FormInput size={4} label="工作技能" value={patient.skill} name="skill"
                     onChange={::this._onPatientUpdate} />
          <FormInput size={4} label="工作意向" value={patient.job_intention} name="job_intention"
                     onChange={::this._onPatientUpdate} />
        </div>
      </form>
    );
  }

  _renderButton() {
    const {patient} = this.state;
    return (
      <div className="ui form" >
        <div className="fields" >
          <div className="eight wide field" >
            <br />
            <NormalButton
              onClick={patient._id ? this.handleUpdateSubmit : this.handleAddSubmit} >提交</NormalButton>
          </div>
        </div>
      </div>
    );
  }

  _renderCamera = () => {
    const {camera} = this.state;
    return (
      <form className="ui form" >
        {camera &&
        <Photo onCancel={this._closeCamera} checkPhoto={this._checkPhoto} />
        }
      </form>
    );
  };

  render() {
    return (
      <Scrollbars>
        {this._renderBasic()}
        {this._renderHospital()}
        {this._renderCamera()}
        {this._renderButton()}
      </Scrollbars>
    );
  }
}
