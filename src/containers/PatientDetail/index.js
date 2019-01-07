/**
 * Created by jiang_mac on 16/3/3.
 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Tabs, {TabPane} from 'rc-tabs';
import PatientBasic from './PatientBasic';
import {Content} from 'components';
import Helmet from 'react-helmet';
import * as patientActions from 'redux/modules/patient';
import Labour from './Labour';
import Donate from './Donates';

@connect(
  state => ({
    patient: state.patient.patient
  }), patientActions
)
export default
class PatientDetail extends Content {
  static propTypes = {
    params: PropTypes.object,
    patient: PropTypes.object,
    loadPatient: PropTypes.func
  };

  state = this.state = {
    patient: {}
  };

  componentWillMount() {
    const {loadPatient} = this.props;
    const {patientID} = this.props.params;
    if (patientID) {
      loadPatient({id: patientID}, (error, patient) => {
        console.log('load .....', patient.data);
        if (!error) {
          this.setState({
            patient: patient.data
          });
        }
      });
    }
  }

  render() {
    const {patient} = this.state;
    let element = null;
    if (patient) {
      const children = [];
      children.push(<TabPane tab="基本信息" key="1" ><PatientBasic patient={patient} /></TabPane>);
      children.push(<TabPane tab="劳务信息" key="2" ><Labour patient={patient} /></TabPane>);
      children.push(<TabPane tab="捐助信息" key="3" ><Donate patient={patient} /></TabPane>);
      const {params} = this.props;
      let tabIndex = '1';
      if (params) {
        if (params.tabIndex) {
          tabIndex = params.tabIndex;
        }
      }
      element = (
        <div is="content" >
          <Helmet title="患者详情" />
          <Tabs defaultActiveKey={tabIndex} className="full-height" ref={tab => this.tab = tab} >
            {children}
          </Tabs>
        </div>
      );
    } else {
      element = (<div></div>);
    }
    return element;
  }
}
