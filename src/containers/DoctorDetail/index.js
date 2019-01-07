/**
 * Created by yons on 16/4/4.
 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import MaskedInput from 'react-maskedinput';
import {NormalButton, FormInput, Photo, Avatar} from 'components';
import {disableEvent, alertSuccess} from 'utils/ui';
import {Content} from 'components';
import {addDoctor, updateDoctor, loadDoctor} from 'redux/modules/doctor';
import moment from 'moment';
import {goBack} from 'react-router-redux';
import Helmet from 'react-helmet';
import {genderOptions} from 'utils/constants';
import config from 'config';

@connect(
  () => ({}),
  {
    addDoctor, updateDoctor, loadDoctor,
    goBack
  }
)
export default class DoctorDetail extends Content {
  static propTypes = {
    params: PropTypes.object,
    getDoctorInfo: PropTypes.func.isRequired,
    createDoctor: PropTypes.func.isRequired,
    updateDoctor: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      doctor: {},
      basicInfo: {},
      camera: false
    };
  }

  componentWillMount() {
    const {doctorID} = this.props.params;
    if (doctorID) {
      this.props.loadDoctor({id: doctorID}, (error, response) => {
        if (response) {
          console.log('doctor', response.data);
          const {data} = response;
          delete data._id;
          this.setState({
            doctor: data,
            basicInfo: {}
          });
        }
      });
    } else {
      this.setState({
        doctor: {
          birthday: new Date().toString()
        },
        basicInfo: {}
      });
    }
  }

  _onDoctorInfoUpdate = (event) => {
    const stateChange = {...this.state.doctor};
    const {name, value} = event.target;
    stateChange[name] = value;
    this.setState({doctor: stateChange});
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const {doctor} = this.state;
    const {doctorID} = this.props.params;
    if (doctorID) {
      console.log('update');
      this.props.updateDoctor({id: doctorID, args: doctor}, () => {
        alertSuccess('更新成功!');
        this.props.goBack();
      });
    } else {
      this.props.addDoctor(doctor, () => {
        alertSuccess('创建成功!');
        this.props.goBack();
      });
    }
  };
  handleBack = () => {
    this.props.goBack();
  };

  _checkImgSrc = () => {
    const {avatar = {}, avatarData} = this.state.doctor;
    let src = '';
    if (avatarData) {
      src = avatarData;
    } else if (avatar.name) {
      src = `${config.rootURL}/${avatar.name}`;
    }
    return src;
  };

  _renderBasic() {
    const {doctor} = this.state;
    const {birthday} = doctor;
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
      <form className="ui form">
        <br />
        <div className="fields" >
          <FormInput size={2} label="姓名" error="* 必填项" value={doctor.name} onChange={this._onDoctorInfoUpdate}
                     name="name" />
          <FormInput size={2} label="性别" value={doctor.gender} name="gender" onChange={this._onDoctorInfoUpdate}
                     options={genderOptions} />
          <FormInput size={4} label="身份证号" inputElement={MaskedInput} value={doctor.person_id}
                     onChange={this._onDoctorInfoUpdate} name="person_id"
                     mask="111111-1111-1111-111#" />
          <FormInput size={4} label="医师职格证" value={doctor.qualification} onChange={this._onDoctorInfoUpdate}
                     name="qualification" />
          <div className="four wide field" style={{height: '1px', textAlign: 'center'}}>
            <div style={avatarStyle}>
              <Avatar style={{width: '100%', height: '100%'}} src={this._checkImgSrc()} />
            </div>
            <br />
            <NormalButton onClick={this._openCamera}>照相</NormalButton>
          </div>
        </div>
        <br />
        <div className="fields" >
          <FormInput size={2} label="职称" value={doctor.title} onChange={this._onDoctorInfoUpdate} name="title" />
          <FormInput size={2} label="科室" value={doctor.department} onChange={this._onDoctorInfoUpdate} name="department" />
          <FormInput size={4} label="出生日期" inputElement={MaskedInput} value={birthday ? birthday.substring(0, 10) : ''}
                     onChange={this._onDoctorInfoUpdate} name="birthday" mask="1111-11-11" />
          <FormInput size={2} label="年龄" disabled value={moment(new Date()).diff(birthday, 'years')} />
        </div>
        <br />
        <div className="fields" >
          <FormInput size={3} label="手机号" inputElement={MaskedInput} value={doctor.mobile}
                     onChange={this._onDoctorInfoUpdate} name="mobile" mask="111-1111-1111" />
          <FormInput size={3} label="邮箱" value={doctor.email} onChange={this._onDoctorInfoUpdate} name="email"
                     type="email" />
          <FormInput size={3} label="微信" value={doctor.wechat} onChange={this._onDoctorInfoUpdate} name="wechat" />
          <FormInput size={3} label="QQ" value={doctor.qq} onChange={this._onDoctorInfoUpdate} name="qq" />
        </div>
        <br />
        <div className="fields" >
          <FormInput size={8} label="备注" value={doctor.comment} onChange={this._onDoctorInfoUpdate} name="comment" />
        </div>
      </form>
    );
  }

  _renderCamera = () => {
    const {camera} = this.state;
    return (
      <div>
        {camera &&
        <Photo onCancel={this._closeCamera} checkPhoto={this._checkPhoto} />
        }
      </div>
    );
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
      doctor: {
        ...this.state.doctor,
        avatarData: photo
      }
    });
  };

  render() {
    const style = {
      height: '40px',
      marginTop: '5px'
    };
    const {doctorID} = this.props.params;
    const name = doctorID ? '编辑医生信息' : '新增医生';
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
      {this._renderCamera()}
    </div>);
  }
}
