/**
 * Created by isaac on 2/24/16.
 */
import React, {PropTypes} from 'react';
import {disableEvent} from 'utils/ui';
import {connect} from 'react-redux';
import {columnCreator} from './info';
import * as actions from 'redux/modules/patient';
import {push} from 'react-router-redux';
import {NormalButton, Content, TableView, FormInput} from 'components';
import {getPageCount} from 'utils/func';
import {alertSuccess} from 'utils/ui';
import {closeModal as _closeModal, openModal as _openModal, openAlert} from 'redux/modules/ui';

@connect(
  (state) => ({
    loaded: state.patient.loaded,
    currentPageIndex: state.patient.pageIndex
  }),
  {
    ...actions,
    openModal: _openModal,
    closeModal: _closeModal,
    openAlert,
    pushState: push
  })
export default
class Patients extends Content {
  static propTypes = {
    loaded: PropTypes.bool,
    loadPage: PropTypes.func.isRequired,
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
    openAlert: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    loadPatient: PropTypes.func.isRequired,
    deletePatient: PropTypes.func.isRequired,
    searchPatient: PropTypes.func.isRequired,
    setPageIndex: PropTypes.func.isRequired,
    currentPageIndex: PropTypes.number
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      pageSize: 30,
      totalPages: 0,
      currentPage: props.currentPageIndex || 0,
      collection: [],
      columns: [],
      search: null,
      deletePatientID: ''
    };
  }

  componentWillMount() {
    this._reloadData(this.state.currentPage);
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.state.currentPage, nextProps.currentPageIndex, 61);
    if (this.state.currentPage !== nextProps.currentPageIndex) {
      this._reloadData(nextProps.currentPageIndex);
    }
  }

  _reloadData = (pageIndex) => {
    const {pageSize} = this.state;
    this._loadPage(pageIndex, pageSize, (error, response) => {
      if (response) {
        const {total, patients} = response.data;
        this.setState({
          totalPages: getPageCount(total, pageSize),
          currentPage: pageIndex,
          collection: patients,
          columns: columnCreator(this.handleEditPatient, this.handleDeletePatient)
        });
      }
    });
  };

  _loadPage(pageIndex, pageSize, callback) {
    this.props.loadPage({skip: pageIndex * pageSize, limit: pageSize}, callback);
  }

  handleAddPatient = (event) => {
    event.preventDefault();
    this.props.pushState('/patient/add');
  };

  handleDeletePatient = (model) => {
    this.props.openAlert({
      title: '提示',
      type: 'warning',
      text: '你确定要删除所选患者吗? 患者所有信息将被从数据库中清除，且无法恢复',
      confirm: () => this.deleteSelections(model)
    });
  };
  deleteSelections = (model) => {
    const {closeModal} = this.props;
    const {currentPage, pageSize} = this.state;
    closeModal();
    this.props.deletePatient(model._id, {skip: currentPage * pageSize, limit: pageSize},
      (error, response) => {
        if (response) {
          const {patients} = response.data;
          this.setState({
            collection: patients
          });
          alertSuccess('删除成功!');
        }
      });
  };

  handleEditPatient = (model, event) => {
    event.preventDefault();
    this.props.pushState(`/patient/${model._id}`);
  };

  gotoPage = (index) => {
    const {search, totalPages, pageSize} = this.state;
    if (index >= 0 && index < totalPages) {
      if (search && search.length > 0) {
        // search mode
        this._loadSearch(search, index, (error, response) => {
          if (!error) {
            const {patients} = response.data;
            this.setState({
              currentPage: index,
              collection: patients
            });
            this.props.setPageIndex(index);
          }
        });
      } else {
        this._loadPage(index, pageSize, (error, response) => {
          if (response) {
            const {patients} = response.data;
            this.setState({
              currentPage: index,
              collection: patients
            });
            this.props.setPageIndex(index);
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
        const {total, patients} = response.data;
        const pageCount = getPageCount(total, pageSize);

        this.setState({
          search: input,
          totalPages: pageCount,
          currentPage: index,
          collection: patients
        });
      }
    });
  };
  searchResetCallback = () => {
    const index = 0;
    const {pageSize} = this.state;
    this._loadPage(index, pageSize, (error, response) => {
      if (response) {
        const {total, patients} = response.data;
        this.setState({
          totalPages: getPageCount(total, pageSize),
          currentPage: index,
          collection: patients,
          search: null
        });
      }
    });
  };

  _onChangePageSize = (event) => {
    const {value} = event.target;
    const pageSize = parseInt(value, 10);
    const {currentPage} = this.state;
    this._loadPage(currentPage, pageSize, (error, response) => {
      if (response) {
        const {total, patients} = response.data;
        this.setState({
          pageSize,
          totalPages: getPageCount(total, pageSize),
          currentPage,
          collection: patients,
          columns: columnCreator(this.handleEditPatient, this.handleDeletePatient)
        });
      }
    });
  };

  render() {
    const name = '患者信息管理';
    const {totalPages, currentPage, collection, columns, pageSize} = this.state;
    const style = {
      height: '40px',
      marginTop: '5px'
    };
    const pageSizeOption = [
      {name: 20, value: 20},
      {name: 30, value: 30},
      {name: 50, value: 50}
    ];

    return (
      <div is="content" onContextMenu={disableEvent} >
        <div className="panel panel-default" is="panel" >
          <div className="panel-heading" style={style} >
            <span is="panelTitle" >{name}</span>
            <div is="toolbarRight" >
              <NormalButton onClick={this.handleAddPatient} >新增</NormalButton>
            </div>
            <div is="toolbarNearRight" >
              <FormInput size={3} label="每页显示数量" value={pageSize} onChange={this._onChangePageSize}
                         name="pageSize" options={pageSizeOption} />
            </div>
          </div>
          <div className="panel-body" is="panelbody" >
            <TableView enableSearch
                       gotoPage={this.gotoPage}
                       pageCount={totalPages}
                       currentPage={currentPage}

                       pageSize={pageSize}
                       rows={collection}
                       columns={columns}

                       searchCallback={this.searchCallback}
                       searchResetCallback={this.searchResetCallback}
                       placeholder="请输入患者姓名,医院,手机号或身份证号进行搜索" />
          </div>
        </div>
      </div>
    );
  }
}
