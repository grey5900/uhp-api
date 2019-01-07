/**
 * Created by isaac on 2/24/16.
 */
import React, {PropTypes} from 'react';
import {disableEvent} from 'utils/ui';
import {connect} from 'react-redux';
import {columnCreator} from './info';
import * as actions from 'redux/modules/labour';
import {push} from 'react-router-redux';
import {NormalButton, Content, TableView, FormInput} from 'components';
import {getPageCount} from 'utils/func';
import {alertSuccess, modalStyles} from 'utils/ui';
import {closeModal as _closeModal, openModal as _openModal, openAlert} from 'redux/modules/ui';
import LabourModal from './LabourModal';
import Modal from 'react-modal';

@connect(
  (state) => ({loaded: state.labour.loaded}),
  {
    ...actions,
    openModal: _openModal,
    closeModal: _closeModal,
    openAlert,
    pushState: push
  })
export default
class LaborListView extends Content {
  static propTypes = {
    params: PropTypes.object,
    loaded: PropTypes.bool,
    loadPage: PropTypes.func.isRequired,
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
    openAlert: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    loadLabour: PropTypes.func.isRequired,
    searchByPatient: PropTypes.func.isRequired,
    addLabour: PropTypes.func,
    updateLabour: PropTypes.func,
    deleteLabour: PropTypes.func
  };
  state = {
    pageSize: 30,
    totalPages: 0,
    currentPage: 0,
    collection: [],
    columns: [],
    search: null,
    deletePatientID: '',
    openLabourModal: false,
    oneLabourData: ''
  };

  componentWillMount() {
    const {currentPage, pageSize} = this.state;
    this._loadPage(currentPage, pageSize, (response) => {
      const {total, labours} = response.data;
      this.setState({
        totalPages: getPageCount(total, pageSize),
        currentPage,
        collection: labours,
        columns: columnCreator(this.handleEditLabour, this.handleDeleteLabour)
      });
    });
  }

  _loadPage(pageIndex, pageSize, callback) {
    const {params} = this.props;
    const args = {skip: pageIndex * pageSize, limit: pageSize};
    if (params) {
      const {typeID} = params;
      args.type = typeID;
    }
    this.props.loadPage(args, callback);
  }

  _submitLabour = (labourData) => {
    const {updateLabour, addLabour} = this.props;
    const {currentPage, pageSize} = this.state;
    if (labourData._id) {
      updateLabour({id: labourData._id, args: labourData}, {skip: currentPage * pageSize, limit: pageSize},
        (error, response) => {
          if (response) {
            const {labours} = response.data;
            this.setState({
              collection: labours
            });
          }
        });
    } else {
      addLabour({labourRecord: labourData}, {skip: currentPage * pageSize, limit: pageSize},
        (error, response) => {
          if (response) {
            const {labours} = response.data;
            this.setState({
              collection: labours
            });
          }
        });
    }
    this._closeLabourModal();
  };

  handleAddLabour = (event) => {
    event.preventDefault();
    this.setState({
      openLabourModal: true,
      oneLabourData: ''
    });
  };

  _closeLabourModal = () => {
    this.setState({
      openLabourModal: false
    });
  };

  handleDeleteLabour = (model) => {
    this.props.openAlert({
      title: '提示',
      type: 'warning',
      text: '彻底删除此条劳务',
      confirm: () => this.deleteSelections(model)
    });
  };
  deleteSelections = (model) => {
    const {closeModal} = this.props;
    const {currentPage, pageSize} = this.state;
    closeModal();
    this.props.deleteLabour(model._id, {skip: currentPage * pageSize, limit: pageSize}, (response) => {
      this.gotoPage(currentPage);
      alertSuccess('删除成功!');
    });
  };

  handleEditLabour = (model, event) => {
    event.preventDefault();
    const newModel = {...model};
    const {type} = newModel;
    if (newModel.type) {
      newModel.type = type._id;
    }

    this.setState({
      openLabourModal: true,
      oneLabourData: newModel
    });
  };

  gotoPage = (index) => {
    const {search, totalPages, pageSize} = this.state;
    if (index >= 0 && index < totalPages) {
      if (search && search.length > 0) {
        // search mode
        this._loadSearch(search, index, (response) => {
          const {labours} = response;
          this.setState({
            currentPage: index,
            collection: labours
          });
        });
      } else {
        this._loadPage(index, pageSize, (response) => {
          const {labours} = response.data;
          this.setState({
            currentPage: index,
            collection: labours
          });
        });
      }
    }
  };
  _loadSearch = (input, index, callback) => {
    const {pageSize} = this.state;
    const args = {skip: index * pageSize, limit: pageSize, search: input};
    this.props.searchByPatient(args, callback);
  };
  searchCallback = (input) => {
    const {pageSize} = this.state;
    const index = 0;
    this._loadSearch(input, index, (response) => {
      const {labours} = response;
      const pageCount = getPageCount(labours.length, pageSize);

      this.setState({
        search: input,
        totalPages: pageCount,
        currentPage: index,
        collection: labours
      });
    });
  };
  searchResetCallback = () => {
    const index = 0;
    const {pageSize} = this.state;
    this._loadPage(index, pageSize, (response) => {
      const {total, labours} = response.data;
      this.setState({
        totalPages: getPageCount(total, pageSize),
        currentPage: index,
        collection: labours,
        search: null
      });
    });
  };

  _onChangePageSize = (event) => {
    const {value} = event.target;
    const pageSize = parseInt(value, 10);
    const {currentPage} = this.state;
    this._loadPage(currentPage, pageSize, (response) => {
      const {total, labours} = response.data;
      this.setState({
        pageSize,
        totalPages: getPageCount(total, pageSize),
        currentPage,
        collection: labours,
        columns: columnCreator(this.handleEditLabour, this.handleDeleteLabour)
      });
    });
  };

  render() {
    const {totalPages, currentPage, collection, columns, pageSize, openLabourModal, oneLabourData} = this.state;
    const style = {
      position: 'fixed',
      right: '51px',
      top: '64px'
    };
    const pageSizeOption = [
      {name: 20, value: 20},
      {name: 30, value: 30},
      {name: 50, value: 50}
    ];
    let bodyStyle = {height: 'calc(100% - 40px)'};
    if (this.props.params) {
      bodyStyle = {
        margin: '60px 20px 0 20px',
        height: 'calc(100% - 120px)'
      };
    }
    return (
      <div className="full-height" onContextMenu={disableEvent} >
        <Modal isOpen={openLabourModal}
               onRequestClose={this._closeLabourModal}
               style={modalStyles} >
          <LabourModal onCancel={this._closeLabourModal} submitData={this._submitLabour} data={oneLabourData} />
        </Modal>
        <div className="panel panel-default" is="panel" >
          <div className="panel-heading" style={style} >
            <div is="toolbarRight" >
              <div style={{display: 'flex'}} >
                <label style={{lineHeight: '38px'}} >每页显示数目</label>
                <FormInput value={pageSize} onChange={this._onChangePageSize} name="pageSize"
                           options={pageSizeOption} />
                <NormalButton style={{marginLeft: '15px'}} onClick={this.handleAddLabour} >新增劳务</NormalButton>
              </div>
            </div>
          </div>
          <div className="panel-body" style={bodyStyle} >
            <TableView enableSearch
                       gotoPage={this.gotoPage}
                       pageCount={totalPages}
                       currentPage={currentPage}
                       pageSize={pageSize}
                       rows={collection}
                       columns={columns}
                       searchCallback={this.searchCallback}
                       searchResetCallback={this.searchResetCallback}
                       placeholder="请输入患者姓名、手机号或身份证号进行搜索" />
          </div>
        </div>
      </div>
    );
  }
}
