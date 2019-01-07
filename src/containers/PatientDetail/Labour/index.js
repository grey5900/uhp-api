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
import LabourModal from '../../Labour/List/LabourModal';
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
class ListView extends Content {
  static propTypes = {
    params: PropTypes.object,
    patient: PropTypes.object.isRequired,
    loaded: PropTypes.bool,
    loadPage: PropTypes.func.isRequired,
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
    openAlert: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    loadLabour: PropTypes.func.isRequired,
    searchPatient: PropTypes.func.isRequired,
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
    this._loadPage(this._getPatientID(this.props), currentPage, pageSize, (response) => {
      const {total, labours} = response.data;
      this.setState({
        totalPages: getPageCount(total, pageSize),
        currentPage,
        collection: labours,
        columns: columnCreator(this.handleEditLabour, this.handleDeleteLabour)
      });
    });
  }
  componentWillReceiveProps(nextProps) {
    const {currentPage, pageSize} = this.state;
    this._loadPage(this._getPatientID(nextProps), currentPage, pageSize, (response) => {
      const {total, labours} = response.data;
      this.setState({
        totalPages: getPageCount(total, pageSize),
        currentPage,
        collection: labours,
        columns: columnCreator(this.handleEditLabour, this.handleDeleteLabour)
      });
    });
  }
  _getPatientID = (props) => {
    const {patient} = props;
    let patientID = null;
    if (patient) {
      patientID = patient._id;
    } else {
      const {params} = this.props;
      patientID = params.patientID;
    }
    return patientID;
  };
  _loadPage(patientID, pageIndex, pageSize, callback) {
    this.props.loadPage({skip: pageIndex * pageSize, limit: pageSize, patient: patientID}, callback);
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
    this.props.deleteLabour(model._id, {skip: currentPage * pageSize, limit: pageSize},
      (error, response) => {
        if (response) {
          const {labours} = response.data;
          this.setState({
            collection: labours
          });
          alertSuccess('删除成功!');
        }
      });
  };

  handleEditLabour = (model, event) => {
    event.preventDefault();
    console.log(model);
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
        this._loadSearch(search, index, (error, response) => {
          if (!error) {
            const {labours} = response.data;

            this.setState({
              currentPage: index,
              collection: labours
            });
          }
        });
      } else {
        this._loadPage(this._getPatientID(this.props), index, pageSize, (error, response) => {
          if (response) {
            const {labours} = response.data;
            this.setState({
              currentPage: index,
              collection: labours
            });
          }
        });
      }
    }
  };

  _loadSearch = (input, index, callback) => {
    const {searchPatient} = this.props;
    const {pageSize} = this.state;
    const args = {skip: index * pageSize, limit: pageSize, search: input};
    searchPatient(args, callback);
  };
  searchCallback = (input) => {
    const {pageSize} = this.state;
    const index = 0;
    this._loadSearch(input, index, (error, response) => {
      if (!error) {
        const {total, labours} = response.data;
        const pageCount = getPageCount(total, pageSize);

        this.setState({
          search: input,
          totalPages: pageCount,
          currentPage: index,
          collection: labours
        });
      }
    });
  };
  searchResetCallback = () => {
    const index = 0;
    const {pageSize} = this.state;
    this._loadPage(this._getPatientID(this.props), index, pageSize, (error, response) => {
      if (response) {
        const {total, labours} = response.data;
        this.setState({
          totalPages: getPageCount(total, pageSize),
          currentPage: index,
          collection: labours,
          search: null
        });
      }
    });
  };

  _onChangePageSize = (event) => {
    const {value} = event.target;
    const pageSize = parseInt(value, 10);
    const {currentPage} = this.state;
    this._loadPage(this._getPatientID(this.props), currentPage, pageSize, (error, response) => {
      if (response) {
        const {total, labours} = response.data;
        this.setState({
          pageSize,
          totalPages: getPageCount(total, pageSize),
          currentPage,
          collection: labours,
          columns: columnCreator(this.handleEditLabour, this.handleDeleteLabour)
        });
      }
    });
  };

  render() {
    const {totalPages, currentPage, collection, columns, pageSize, openLabourModal, oneLabourData} = this.state;
    const style = {
      height: '40px',
      marginTop: '5px'
    };
    const pageSizeOption = [
      {name: 20, value: 20},
      {name: 30, value: 30},
      {name: 50, value: 50}
    ];
    console.log('pageseize', pageSize);
    return (
      <div className="full-height" onContextMenu={disableEvent}>
        <Modal isOpen={openLabourModal}
               onRequestClose={this._closeLabourModal}
               style={modalStyles}>
          <LabourModal onCancel={this._closeLabourModal} submitData={this._submitLabour} data={oneLabourData} />
        </Modal>
        <div className="panel panel-default" is="panel">
          <div className="panel-heading" style={style}>
            <div is="toolbarRight">
              <div style={{display: 'flex'}} >
                <label style={{lineHeight: '38px'}} >每页显示数目</label>
                <FormInput value={pageSize} onChange={this._onChangePageSize} name="pageSize"
                           options={pageSizeOption} />
                <NormalButton style={{marginLeft: '15px'}} onClick={this.handleAddLabour} >新增劳务</NormalButton>
              </div>
            </div>
          </div>
          <div className="panel-body" is="panelbody">
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
