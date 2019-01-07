/**
 * Created by isaac on 16/6/2.
 */
import React, {PropTypes} from 'react';
import {disableEvent, modalStyles} from 'utils/ui';
import {connect} from 'react-redux';
import {columnCreator} from './info';
import * as actions from 'redux/modules/labourType';
import {openAlert} from 'redux/modules/ui';
import {NormalButton, Content, TableView} from 'components';
import {alertSuccess} from 'utils/ui';
import LabourTypeModal from './LabourTypeModal';
import Modal from 'react-modal';

@connect(
  (state) => ({loaded: state.labour.loaded}),
  {
    ...actions,
    openAlert
  })
export default
class LabourType extends Content {
  static propTypes = {
    loadAll: PropTypes.func.isRequired,
    deleteLabourType: PropTypes.func.isRequired,
    openAlert: PropTypes.func.isRequired
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      pageSize: 30,
      totalPages: 0,
      currentPage: 0,
      maximumPages: 0,
      collection: [],
      columns: columnCreator(this.handleEdit, this.handleDelete),
      openLabourModal: false
    };
  }

  componentWillMount() {
    this._loadAll();
  }

  _loadAll() {
    const {loadAll} = this.props;
    loadAll(({data}) => {
      this.setState({
        collection: data,
        totalPages: 1,
        maximumPages: 1
      });
    });
  }

  handleEdit = (model) => {
    this.setState({
      selected: model,
      openLabourModal: true
    });
  };

  handleDelete = (model) => {
    this.props.openAlert({
      title: '提示',
      type: 'warning',
      text: '彻底删除此条劳务类型',
      confirm: () => {
        this.props.deleteLabourType(model._id, () => {
          alertSuccess('删除成功!');
          this._loadAll();
        });
      }
    });
  };
  handleAdd = () => {
    this.setState({openLabourModal: true});
  };
  _closeLabourModal = () => {
    this.setState({openLabourModal: false});
    this._loadAll();
  };
  render() {
    const {totalPages, currentPage, maximumPages, collection, columns, pageSize, openLabourModal, selected} = this.state;
    const style = {
      position: 'fixed',
      right: '51px',
      top: '64px'
    };
    return (
      <div className="full-height" onContextMenu={disableEvent}>
        <Modal isOpen={openLabourModal}
               onRequestClose={this._closeLabourModal}
               style={modalStyles}>
          <LabourTypeModal onCancel={this._closeLabourModal} type={selected} />
        </Modal>
        <div className="panel panel-default" is="panel">
          <div className="panel-heading" style={style}>
            <div is="toolbarRight">
              <NormalButton onClick={this.handleAdd}>新增</NormalButton>
            </div>
          </div>
          <div className="panel-body" is="panelbody">
            <TableView gotoPage={this.gotoPage}
                           pageCount={totalPages}
                           currentPage={currentPage}
                           maximumPages={maximumPages}
                           pageSize={pageSize}
                           rows={collection}
                           columns={columns} />
          </div>
        </div>
      </div>
    );
  }
}
