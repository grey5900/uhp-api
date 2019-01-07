/**
 * Created by yons on 16/4/4.
 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {NormalButton, FormInput} from 'components';
import {disableEvent, alertSuccess} from 'utils/ui';
import {Content} from 'components';
import {addAdmin, updateAdmin, loadAdmin, forceResetPassword} from 'redux/modules/admin';
import {goBack} from 'react-router-redux';
import Helmet from 'react-helmet';
import CryptoJS from 'crypto-js';
import Alert from 'react-s-alert';

@connect(
  () => ({}),
  {
    addAdmin, updateAdmin, loadAdmin, forceResetPassword,
    goBack
  }
)
export default class AdminDetail extends Content {
  static propTypes = {
    params: PropTypes.object,
    loadAdmin: PropTypes.func.isRequired,
    addAdmin: PropTypes.func.isRequired,
    updateAdmin: PropTypes.func.isRequired,
    forceResetPassword: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      admin: {}
    };
  }

  componentWillMount() {
    const {adminID} = this.props.params;
    if (adminID) {
      this.props.loadAdmin({id: adminID}, (error, response) => {
        if (response) {
          console.log('admin', response.data);
          const {data} = response;
          this.setState({
            admin: data
          });
        }
      });
    } else {
      this.setState({
        admin: {},
      });
    }
  }

  _onAdminInfoUpdate = (event) => {
    const stateChange = {...this.state.admin};
    const {name, value} = event.target;
    stateChange[name] = value;
    this.setState({admin: stateChange});
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const {admin} = this.state;
    const adminID = admin._id;
    if (adminID) {
      console.log('update');
      this.props.updateAdmin({id: adminID, args: admin}, () => {
        alertSuccess('更新成功!');
        this.props.goBack();
      });
    } else {
      const sha1 = CryptoJS.SHA1;
      admin.password = sha1('123').toString().toUpperCase();
      this.props.addAdmin(admin, () => {
        alertSuccess('创建成功!');
        this.props.goBack();
      });
    }
  };
  handleBack = () => {
    this.props.goBack();
  };

  _resetPassword = () => {
    const {admin} = this.state;
    this.props.forceResetPassword({id: admin._id},
      (err, response) => {
        if (response) {
          Alert.success('密码已重置为123', {
            position: 'bottom-right',
            effect: 'scale',
            timeout: 3000
          });
        }
      });
  };

  _renderBasic() {
    const {admin} = this.state;
    const adminID = admin._id;
    const roleOptions = [
      {name: '访问者', value: 'visitor'},
      {name: '操作员', value: 'operator'},
      {name: '管理员', value: 'admin'}
    ];
    const genderOptions = [
      {name: '男', value: 'Male'},
      {name: '女', value: 'Female'}
    ];
    return (
      <form className="ui form">
        <br />
        <div className="fields" >
          {adminID &&
          <FormInput size={4} label="登录邮箱(必)" disabled value={admin.email} onChange={this._onAdminInfoUpdate}
                     name="email" />
          }
          {!adminID &&
          <FormInput size={4} label="登录邮箱(必)" value={admin.email} onChange={this._onAdminInfoUpdate}
                     name="email" />
          }
          <FormInput size={4} label="昵称" value={admin.nick_name} onChange={this._onAdminInfoUpdate}
                     name="nick_name" />
          <FormInput size={4} label="姓名" value={admin.name} onChange={this._onAdminInfoUpdate}
                     name="name" />
          <FormInput size={4} label="权限" value={admin.role} onChange={this._onAdminInfoUpdate}
                     name="role" options={roleOptions} />
        </div>
        <div className="fields">
          <FormInput size={4} label="电话" value={admin.mobile} onChange={this._onAdminInfoUpdate}
                     name="mobile" />
          <FormInput size={4} label="微信" value={admin.wechat} onChange={this._onAdminInfoUpdate}
                     name="wechat" />
          <FormInput size={4} label="性别" value={admin.gender} onChange={this._onAdminInfoUpdate}
                     name="gender" options={genderOptions} />
        </div>
        {adminID &&
          <div className="fields">
            <NormalButton onClick={this._resetPassword}>重置密码</NormalButton>
          </div>
        }
        {!adminID &&
        <div className="fields">
          <font color="red"> 密码初始化为123,请登录后自行修改!</font>
        </div>
        }
      </form>
    );
  }

  render() {
    const style = {
      height: '40px',
      marginTop: '5px'
    };
    const {adminID} = this.props.params;
    const name = adminID ? '编辑权限信息' : '新增系统用户';
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
