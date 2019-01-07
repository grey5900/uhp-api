/**
 * Created by yons on 16/4/4.
 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import MaskedInput from 'react-maskedinput';
import {NormalButton, FormInput, Header} from 'components';
import {disableEvent, alertSuccess} from 'utils/ui';
import {Content} from 'components';
import {addActivity, updateActivity, loadActivity} from 'redux/modules/activity';
import {goBack} from 'react-router-redux';
import Helmet from 'react-helmet';

@connect(
  () => ({}),
  {
    addActivity, updateActivity, loadActivity,
    goBack
  }
)
export default class ActivityDetail extends Content {
  static propTypes = {
    params: PropTypes.object,
    getActivityInfo: PropTypes.func.isRequired,
    createActivity: PropTypes.func.isRequired,
    updateActivity: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      activity: {
        return_visit_rate: ''
      }
    };
  }

  componentWillMount() {
    const {activityID} = this.props.params;
    if (activityID) {
      this.props.loadActivity({id: activityID}, (error, response) => {
        if (response) {
          console.log('activity', response.data);
          const {data} = response;
          delete data._id;
          this.setState({
            activity: data
          });
        }
      });
    } else {
      this.setState({
        activity: {
          date: new Date().toString()
        },
      });
    }
  }

  _onActivityInfoUpdate = (event) => {
    const stateChange = {...this.state.activity};
    const {name, value} = event.target;
    stateChange[name] = value;
    if (name === 'participant_num' || name === 'return_visit_num') {
      const returnVisitNum = stateChange.return_visit_num;
      const participantNum = stateChange.participant_num;
      if (returnVisitNum && participantNum) {
        stateChange.return_visit_rate = (100 * returnVisitNum / participantNum).toFixed(2);
      }
    }
    this.setState({activity: stateChange});
  };


  handleSubmit = (event) => {
    event.preventDefault();
    const {activity} = this.state;
    const {activityID} = this.props.params;
    if (activityID) {
      console.log('update');
      this.props.updateActivity({id: activityID, args: activity}, () => {
        alertSuccess('更新成功!');
        this.props.goBack();
      });
    } else {
      this.props.addActivity(activity, () => {
        alertSuccess('创建成功!');
        this.props.goBack();
      });
    }
  };
  handleBack = () => {
    this.props.goBack();
  };

  _renderBasic() {
    const {activity} = this.state;
    const {date} = activity;
    const activityStyle = [
      {name: '', value: ''},
      {name: '知识宣讲', value: '知识宣讲'},
      {name: '义诊', value: '义诊'},
      {name: '见面会', value: '见面会'},
      {name: '户外活动', value: '户外活动'}
    ];
    return (
      <form className="ui form">
        <Header>
          <h5 className="ui blue header">活动基本信息</h5>
        </Header>
        <div className="fields" >
          <FormInput size={4} label="时间" inputElement={MaskedInput} value={date ? date.substring(0, 10) : ''}
            onChange={this._onActivityInfoUpdate} name="date" mask="1111-11-11" />
          <FormInput size={4} label="地点" value={activity.address} name="address" onChange={this._onActivityInfoUpdate} />
          <FormInput size={4} label="主题" value={activity.theme} onChange={this._onActivityInfoUpdate} name="theme" />
          <FormInput size={4} label="活动形式" value={activity.style} onChange={this._onActivityInfoUpdate} name="style" options={activityStyle} />
        </div>
        <div className="fields" >
          <FormInput size={4} label="活动人数" value={activity.participant_num} onChange={this._onActivityInfoUpdate} name="participant_num" suffix="人" />
          <FormInput size={4} label="讲师" value={activity.speaker} onChange={this._onActivityInfoUpdate} name="speaker" />
          <FormInput size={4} label="联系方式" value={activity.speaker_mobile} onChange={this._onActivityInfoUpdate} name="speaker_mobile" />
          <FormInput size={4} label="志愿者人数" value={activity.worker_num} onChange={this._onActivityInfoUpdate} name="worker_num" suffix="人" />
        </div>
        <div className="fields" >
          <FormInput size={4} label="活动成本" value={activity.cost} onChange={this._onActivityInfoUpdate} name="cost" suffix="元" />
          <FormInput size={4} label="赞助方" value={activity.sponsor} onChange={this._onActivityInfoUpdate} name="sponsor" />
          <FormInput size={4} label="赞助金额" value={activity.sponsor_money} onChange={this._onActivityInfoUpdate} name="sponsor_money" suffix="元" />
          <FormInput size={4} label="邀请方式" value={activity.invite_type} onChange={this._onActivityInfoUpdate} name="invite_type" />
        </div>
        {/* <Header>
        <h5>工作情况</h5>
        </Header>
        <div className="fields" >
        <FormInput size={4} label="市场推广周期" value={activity.market_period} onChange={this._onActivityInfoUpdate} name="market_period" suffix="天" />
        </div> */}
        <Header>
          <h5 className="ui blue header">活动资源</h5>
        </Header>
        <div className="fields">
          <FormInput size={4} label="活动效果" value={activity.effect} onChange={this._onActivityInfoUpdate} name="effect" />
          <FormInput size={4} label="医院病人" value={activity.our_patients} onChange={this._onActivityInfoUpdate} name="our_patients" suffix="人" />
          <FormInput size={4} label="新增病人" value={activity.newer_num} onChange={this._onActivityInfoUpdate} name="newer_num" suffix="人" />
        </div>
        <div className="fields">
          <FormInput size={4} label="客户回访数" value={activity.return_visit_num} onChange={this._onActivityInfoUpdate} name="return_visit_num" suffix="人" />
          <FormInput size={4} label="回访比" disabled value={activity.return_visit_rate || ''} suffix="%" />
          <FormInput size={4} label="媒体资源" value={activity.social_participant} onChange={this._onActivityInfoUpdate} name="social_participant" />
          {/* <FormInput size={4} label="回访备注" value={activity.return_visit_comment} onChange={this._onActivityInfoUpdate} name="return_visit_comment" />
          <FormInput size={4} label="回访种子用户" value={activity.return_visit_seed} onChange={this._onActivityInfoUpdate} name="return_visit_seed" /> */}
        </div>
      </form>
    );
  }

  render() {
    const style = {
      height: '40px',
      marginTop: '5px'
    };
    const {activityID} = this.props.params;
    const name = activityID ? '编辑活动信息' : '新增活动';
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
