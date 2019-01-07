/**
 * Created by isaac on 16/6/2.
 */
import React, {Component} from 'react';
import Tabs, {TabPane} from 'rc-tabs';
import Helmet from 'react-helmet';
import LabourType from './LabourType';
import List from './List';

export default
class LabourView extends Component {
  render() {
    return (<div className="uhs-content" >
      <Helmet title="劳务信息" />
      <Tabs defaultActiveKey="0" className="full-height" >
        <TabPane tab="劳务记录" key="0" ><List /></TabPane>
        <TabPane tab="劳务类型" key="1" ><LabourType /></TabPane>
      </Tabs>
    </div>);
  }
}
