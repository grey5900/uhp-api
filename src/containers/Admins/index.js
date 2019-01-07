import React, {PropTypes} from 'react';
import {disableEvent} from 'utils/ui';
import {connect} from 'react-redux';
import {columnCreator} from './info';
import * as actions from 'redux/modules/admin';
import {push} from 'react-router-redux';
import {NormalButton, Content, TableView, FormInput} from 'components';
import {getPageCount} from 'utils/func';
import {alertSuccess} from 'utils/ui';
import {closeModal as _closeModal, openModal as _openModal, openAlert} from 'redux/modules/ui';

@connect(
  () => ({}),
  {
    ...actions,
    openModal: _openModal,
    closeModal: _closeModal,
    openAlert,
    pushState: push
  })
export default
class Admins extends Content {
  static propTypes = {
    loaded: PropTypes.bool,
    loadPage: PropTypes.func.isRequired,
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
    openAlert: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    loadAdmin: PropTypes.func.isRequired,
    deleteAdmin: PropTypes.func.isRequired,
    searchAdmin: PropTypes.func.isRequired
  };
  state = {
    pageSize: 30,
    totalPages: 0,
    currentPage: 0,
    maximumPages: 0,
    sortKey: '',
    sortOrder: -1,
    collection: [],
    columns: [],
    search: null,
    deleteAdminID: ''
  };

  componentWillMount() {
    const {currentPage, pageSize} = this.state;
    this._loadPage(currentPage, pageSize, (error, response) => {
      if (response) {
        const {total, admins} = response.data;
        this.setState({
          totalPages: getPageCount(total, pageSize),
          currentPage,
          collection: admins,
          columns: columnCreator(this.handleEditAdmin, this.handleDeleteAdmin)
        });
      }
    });
  }

  _loadPage(pageIndex, pageSize, callback) {
    this.props.loadPage({skip: pageIndex * pageSize, limit: pageSize}, callback);
  }

  handleAddAdmin = (event) => {
    event.preventDefault();
    this.props.pushState('/admin/add');
  };

  handleDeleteAdmin = (model) => {
    this.props.openAlert({
      title: '提示',
      type: 'warning',
      text: '你确定要删除所选用户吗? 用户所有信息将被从数据库中清除，且无法恢复',
      confirm: () => this.deleteSelections(model)
    });
  };
  deleteSelections = (model) => {
    const {closeModal} = this.props;
    const {currentPage, pageSize} = this.state;
    closeModal();
    this.props.deleteAdmin(model._id, {skip: currentPage * pageSize, limit: pageSize},
      (error, response) => {
        if (response) {
          const {admins} = response.data;
          this.setState({
            collection: admins
          });
          alertSuccess('删除成功!');
        }
      });
  };

  handleEditAdmin = (model, event) => {
    event.preventDefault();
    this.props.pushState(`/admin/${model._id}`);
  };

  gotoPage = (index) => {
    const {search, totalPages, pageSize} = this.state;
    if (index >= 0 && index < totalPages) {
      if (search && search.length > 0) {
        // search mode
        this._loadSearch(search, index, (error, response) => {
          if (!error) {
            const {admins} = response.data;

            this.setState({
              currentPage: index,
              collection: admins
            });
          }
        });
      } else {
        this._loadPage(index, pageSize, (error, response) => {
          if (response) {
            const {admins} = response.data;
            this.setState({
              currentPage: index,
              collection: admins
            });
          }
        });
      }
    }
  };
  sortingCallback = () => {

  };
  _loadSearch = (input, index, callback) => {
    const {searchAdmin} = this.props;
    const {pageSize} = this.state;
    const args = {skip: index * pageSize, limit: pageSize, search: input};
    searchAdmin(args, callback);
  };
  searchCallback = (input) => {
    const {pageSize} = this.state;
    const index = 0;
    this._loadSearch(input, index, (error, response) => {
      if (!error) {
        const {total, admins} = response.data;
        const pageCount = getPageCount(total, pageSize);

        this.setState({
          search: input,
          totalPages: pageCount,
          currentPage: index,
          collection: admins
        });
      }
    });
  };
  searchResetCallback = () => {
    const index = 0;
    const {pageSize} = this.state;
    this._loadPage(index, pageSize, (error, response) => {
      if (response) {
        const {total, admins} = response.data;
        this.setState({
          totalPages: getPageCount(total, pageSize),
          currentPage: index,
          collection: admins,
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
        const {total, admins} = response.data;
        this.setState({
          pageSize,
          totalPages: getPageCount(total, pageSize),
          currentPage,
          collection: admins,
          columns: columnCreator(this.handleEditAdmin, this.handleDeleteAdmin)
        });
      }
    });
  };

  render() {
    const name = '权限管理';
    const {totalPages, currentPage, maximumPages, collection, sortKey, sortOrder, columns, pageSize} = this.state;
    const style = {
      height: '40px',
      marginTop: '5px'
    };
    const pageSizeOption = [
      {name: 20, value: 20},
      {name: 30, value: 30},
      {name: 50, value: 50}
    ];
    console.log('admin pageseize', pageSize);
    return (
      <div is="content" onContextMenu={disableEvent}>
        <div className="panel panel-default" is="panel">
          <div className="panel-heading" style={style}>
            <span is="panelTitle">{name}</span>
            <div is="toolbarRight">
              <NormalButton onClick={this.handleAddAdmin}>新增</NormalButton>
            </div>
            <div is="toolbarNearRight">
              <FormInput size={3} label="每页显示数量" value={pageSize} onChange={this._onChangePageSize}
                         name="pageSize" options={pageSizeOption} />
            </div>
          </div>
          <div className="panel-body" is="panelbody">
            <TableView enableSearch
                           gotoPage={this.gotoPage}
                           pageCount={totalPages}
                           currentPage={currentPage}
                           maximumPages={maximumPages}
                           pageSize={pageSize}
                           rows={collection}
                           columns={columns}
                           sortingCallback={this.sortingCallback}
                           sortKey={sortKey}
                           sortOrder={sortOrder}
                           searchCallback={this.searchCallback}
                           searchResetCallback={this.searchResetCallback}
                           placeholder="请输入用户姓名, 登录邮箱信息进行搜索" />
          </div>
        </div>
      </div>
    );
  }
}
