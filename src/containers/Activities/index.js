/**
 * Created by isaac on 2/24/16.
 */
import React, {PropTypes} from 'react';
import {disableEvent} from 'utils/ui';
import {connect} from 'react-redux';
import {columnCreator} from './info';
import * as actions from 'redux/modules/activity';
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
class Activitys extends Content {
  static propTypes = {
    loaded: PropTypes.bool,
    loadPage: PropTypes.func.isRequired,
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
    openAlert: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    loadActivity: PropTypes.func.isRequired,
    deleteActivity: PropTypes.func.isRequired,
    searchActivity: PropTypes.func.isRequired
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
    deleteActivityID: ''
  };

  componentWillMount() {
    const {currentPage, pageSize} = this.state;
    this._loadPage(currentPage, pageSize, (error, response) => {
      if (response) {
        const {total, activitys} = response.data;
        this.setState({
          totalPages: getPageCount(total, pageSize),
          currentPage,
          collection: activitys,
          columns: columnCreator(this.handleEditActivity, this.handleDeleteActivity)
        });
      }
    });
  }

  _loadPage(pageIndex, pageSize, callback) {
    this.props.loadPage({skip: pageIndex * pageSize, limit: pageSize}, callback);
  }

  handleAddActivity = (event) => {
    event.preventDefault();
    this.props.pushState('/activity/add');
  };

  handleDeleteActivity = (model) => {
    this.props.openAlert({
      title: '提示',
      type: 'warning',
      text: '你确定要删除所选活动吗? 活动所有信息将被从数据库中清除，且无法恢复',
      confirm: () => this.deleteSelections(model)
    });
  };
  deleteSelections = (model) => {
    const {closeModal} = this.props;
    const {currentPage, pageSize} = this.state;
    closeModal();
    this.props.deleteActivity(model._id, {skip: currentPage * pageSize, limit: pageSize},
      (error, response) => {
        if (response) {
          const {activitys} = response.data;
          this.setState({
            collection: activitys
          });
          alertSuccess('删除成功!');
        }
      });
  };

  handleEditActivity = (model, event) => {
    event.preventDefault();
    this.props.pushState(`/activity/${model._id}`);
  };

  gotoPage = (index) => {
    const {search, totalPages, pageSize} = this.state;
    if (index >= 0 && index < totalPages) {
      if (search && search.length > 0) {
        // search mode
        this._loadSearch(search, index, (error, response) => {
          if (!error) {
            const {activitys} = response.data;

            this.setState({
              currentPage: index,
              collection: activitys
            });
          }
        });
      } else {
        this._loadPage(index, pageSize, (error, response) => {
          if (response) {
            const {activitys} = response.data;
            this.setState({
              currentPage: index,
              collection: activitys
            });
          }
        });
      }
    }
  };
  sortingCallback = () => {

  };
  _loadSearch = (input, index, callback) => {
    const {searchActivity} = this.props;
    const {pageSize} = this.state;
    const args = {skip: index * pageSize, limit: pageSize, search: input};
    searchActivity(args, callback);
  };
  searchCallback = (input) => {
    const {pageSize} = this.state;
    const index = 0;
    this._loadSearch(input, index, (error, response) => {
      if (!error) {
        const {total, activitys} = response.data;
        const pageCount = getPageCount(total, pageSize);

        this.setState({
          search: input,
          totalPages: pageCount,
          currentPage: index,
          collection: activitys
        });
      }
    });
  };
  searchResetCallback = () => {
    const index = 0;
    const {pageSize} = this.state;
    this._loadPage(index, pageSize, (error, response) => {
      if (response) {
        const {total, activitys} = response.data;
        this.setState({
          totalPages: getPageCount(total, pageSize),
          currentPage: index,
          collection: activitys,
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
        const {total, activitys} = response.data;
        this.setState({
          pageSize,
          totalPages: getPageCount(total, pageSize),
          currentPage,
          collection: activitys,
          columns: columnCreator(this.handleEditActivity, this.handleDeleteActivity)
        });
      }
    });
  };

  render() {
    const name = '活动信息管理';
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
    console.log('activity pageseize', pageSize);
    return (
      <div is="content" onContextMenu={disableEvent}>
        <div className="panel panel-default" is="panel">
          <div className="panel-heading" style={style}>
            <span is="panelTitle">{name}</span>
            <div is="toolbarRight">
              <NormalButton onClick={this.handleAddActivity}>新增</NormalButton>
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
                           placeholder="请输入活动地点,形式进行搜索" />
          </div>
        </div>
      </div>
    );
  }
}
