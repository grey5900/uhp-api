/**
 * Created by jiang_mac on 16/5/10.
 */
import React, {Component, PropTypes} from 'react';
import {VerticalInput, NormalButton} from 'components';
import {connect} from 'react-redux';
import * as labourTypeActions from 'redux/modules/labourType';
import {openAlert} from 'redux/modules/ui';
import {alertSuccess} from 'utils/ui';

@connect(
  () => ({}), {
    ...labourTypeActions,
    openAlert
  }
)
export default class LabourTypeModal extends Component {
  static propTypes = {
    type: PropTypes.object,
    onCancel: PropTypes.func,
    addLabourType: PropTypes.func,
    updateLabourType: PropTypes.func,
    openAlert: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    const {type} = props;
    if (type) {
      this.state = {...type};
    } else {
      this.state = {
        name: '',
      };
    }
  }

  _onChangeAddValue = (event) => {
    const {value, name} = event.target;
    const newState = {...this.state};
    newState[name] = value;
    this.setState(newState);
  };
  _handleSave = () => {
    if (this.state._id) {
      // update
      const args = {...this.state};
      delete args._id;
      this.props.updateLabourType({id: this.state._id, args}, () => {
        alertSuccess('更新成功!');
        this.props.onCancel();
      });
    } else {
      this.props.addLabourType(this.state, () => {
        alertSuccess('添加成功!');
        this.props.onCancel();
      });
    }
  };

  render() {
    const {name, comment, province, city, area, source, paid = ''} = this.state;
    return (
      <form className="ui form" >
        <div className="fields" >
          <VerticalInput label="名称" name="name" value={name} onChange={this._onChangeAddValue} />
          <VerticalInput label="来源" name="source" value={source} onChange={this._onChangeAddValue} />
          <VerticalInput label="备注" name="comment" value={comment} onChange={this._onChangeAddValue} />
        </div>
        <div className="fields" >
          <VerticalInput label="省" name="province" value={province} onChange={this._onChangeAddValue} />
          <VerticalInput label="市" name="city" value={city} onChange={this._onChangeAddValue} />
          <VerticalInput label="区" name="area" value={area} onChange={this._onChangeAddValue} />
        </div>
        <div className="fields" >
          <VerticalInput label="已发工资" name="paid" value={paid} onChange={this._onChangeAddValue} />
          <VerticalInput label="基地投入成本" name="base_cost" value={this.state.base_cost} onChange={this._onChangeAddValue} />
          <VerticalInput label="销售金额" name="sale_amount" value={this.state.sale_amount} onChange={this._onChangeAddValue} />
        </div>
        <div className="fields" >
          <div className="eight wide field" >
            <NormalButton onClick={this._handleSave} >保存</NormalButton>
          </div>
          <div className="eight wide field" >
            <NormalButton onClick={this.props.onCancel}
                          style={{marginRight: '20px', backgroundColor: '#ABABAB'}} >取消</NormalButton>
          </div>
        </div>
      </form>
    );
  }
}
