/**
 * Created by isaac on 2/24/16.
 */
import React, {PropTypes} from 'react';
import {disableEvent} from 'utils/ui';
import {connect} from 'react-redux';
import {columnCreator} from './info';
import * as actions from 'redux/modules/donate';
import {push} from 'react-router-redux';
import MaskedInput from 'react-maskedinput';
import {NormalButton, Content, TableView, FormInput, Header} from 'components';
import {getPageCount} from 'utils/func';
import {alertSuccess} from 'utils/ui';
import Modal from 'react-modal';
import {closeModal as _closeModal, openModal as _openModal, openAlert} from 'redux/modules/ui';
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    width: '70%',
    height: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

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
class Donates extends Content {
  static propTypes = {
    patient: PropTypes.object,
    loaded: PropTypes.bool,
    loadPage: PropTypes.func.isRequired,
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
    openAlert: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    loadDonate: PropTypes.func.isRequired,
    deleteDonate: PropTypes.func.isRequired,
    searchDonate: PropTypes.func.isRequired
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
    deleteDonateID: '',
    detailFlag: false,
    donate: {}
  };

  componentWillMount() {
    const {currentPage, pageSize} = this.state;
    this._loadPage(currentPage, pageSize, (error, response) => {
      if (response) {
        const {total, donates} = response.data;
        this.setState({
          totalPages: getPageCount(total, pageSize),
          currentPage,
          collection: donates,
          columns: columnCreator(this.handleEditDonate, this.handleDeleteDonate)
        });
      }
    });
  }

  _loadPage(pageIndex, pageSize, callback) {
    const {patient} = this.props;
    this.props.loadPage({patientID: patient._id, skip: pageIndex * pageSize, limit: pageSize}, callback);
  }

  handleAddDonate = (event) => {
    event.preventDefault();
    const {patient} = this.props;
    this.setState({
      donate: {
        patient: patient._id,
        date: new Date().toString()
      },
      detailFlag: true
    });
  };

  handleDeleteDonate = (model) => {
    this.props.openAlert({
      title: '提示',
      type: 'warning',
      text: '你确定要删除所选捐助吗? 捐助信息将被从数据库中清除，且无法恢复',
      confirm: () => this.deleteSelections(model)
    });
  };
  deleteSelections = (model) => {
    const {closeModal} = this.props;
    const {currentPage, pageSize} = this.state;
    closeModal();
    this.props.deleteDonate(model._id, {skip: currentPage * pageSize, limit: pageSize},
                            (error, response) => {
                              if (response) {
                                const {donates} = response.data;
                                this.setState({
                                  collection: donates
                                });
                                alertSuccess('删除成功!');
                              }
                            });
  };

  handleEditDonate = (model, event) => {
    event.preventDefault();
    this.setState({
      donate: model,
      detailFlag: true
    });
  };

  gotoPage = (index) => {
    const {search, totalPages, pageSize} = this.state;
    if (index >= 0 && index < totalPages) {
      if (search && search.length > 0) {
        // search mode
        this._loadSearch(search, index, (error, response) => {
          if (!error) {
            const {donates} = response.data;

            this.setState({
              currentPage: index,
              collection: donates
            });
          }
        });
      } else {
        this._loadPage(index, pageSize, (error, response) => {
          if (response) {
            const {donates} = response.data;
            this.setState({
              currentPage: index,
              collection: donates
            });
          }
        });
      }
    }
  };
  sortingCallback = () => {

  };
  _loadSearch = (input, index, callback) => {
    const {searchDonate} = this.props;
    const {pageSize} = this.state;
    const args = {skip: index * pageSize, limit: pageSize, search: input};
    searchDonate(args, callback);
  };
  searchCallback = (input) => {
    const {pageSize} = this.state;
    const index = 0;
    this._loadSearch(input, index, (error, response) => {
      if (!error) {
        const {total, donates} = response.data;
        const pageCount = getPageCount(total, pageSize);

        this.setState({
          search: input,
          totalPages: pageCount,
          currentPage: index,
          collection: donates
        });
      }
    });
  };
  searchResetCallback = () => {
    const index = 0;
    const {pageSize} = this.state;
    this._loadPage(index, pageSize, (error, response) => {
      if (response) {
        const {total, donates} = response.data;
        this.setState({
          totalPages: getPageCount(total, pageSize),
          currentPage: index,
          collection: donates,
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
        const {total, donates} = response.data;
        this.setState({
          pageSize,
          totalPages: getPageCount(total, pageSize),
          currentPage,
          collection: donates,
          columns: columnCreator(this.handleEditDonate, this.handleDeleteDonate)
        });
      }
    });
  };

  _closeDetail = () => {
    this.setState({
      detailFlag: false
    });
  }

  _onDonateInfoUpdate = (event) => {
    const stateChange = {...this.state.donate};
    const {name, value} = event.target;
    stateChange[name] = value;
    this.setState({donate: stateChange});
  };


  handleSubmit = (event) => {
    event.preventDefault();
    const {donate} = this.state;
    const {currentPage, pageSize} = this.state;
    if (donate._id) {
      console.log('update');
      this.props.updateDonate({id: donate._id, args: donate}, () => {
        alertSuccess('更新成功');
        this._loadPage(currentPage, pageSize, (error, response) => {
          if (response) {
            const {donates} = response.data;
            this.setState({
              collection: donates,
              detailFlag: false
            });
          }
        });
      });
    } else {
      this.props.addDonate(donate, () => {
        alertSuccess('创建成功');
        this._loadPage(currentPage, pageSize, (error, response) => {
          if (response) {
            const {total, donates} = response.data;
            this.setState({
              totalPages: getPageCount(total, pageSize),
              collection: donates,
              detailFlag: false
            });
          }
        });
      });
    }
  };
  render() {
    const name = '患者捐助信息管理';
    const {totalPages, currentPage, maximumPages, collection, sortKey, sortOrder, columns, pageSize, detailFlag, donate} = this.state;
    const {date} = donate;
    const donateStyle = [
      {name: '', value: ''},
      {name: '贫困救助', value: '贫困救助'},
      {name: '劳务救济', value: '劳务救济'},
      {name: '造瘘救助', value: '造瘘救助'}
    ];
    const style = {
      height: '40px',
      marginTop: '5px'
    };
    const pageSizeOption = [
      {name: 20, value: 20},
      {name: 30, value: 30},
      {name: 50, value: 50}
    ];
    console.log('donate pageseize', pageSize);
    return (
      <div className="full-height" onContextMenu={disableEvent}>
        <div className="panel panel-default" is="panel">
          <div className="panel-heading" style={style}>
            <span is="panelTitle">{name}</span>
            <div is="toolbarRight">
              <NormalButton onClick={this.handleAddDonate}>新增</NormalButton>
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
              placeholder="请输入捐助信息进行搜索" />
          </div>
        </div>
        {detailFlag &&
         <Modal
           isOpen={detailFlag}
           onRequestClose={this._closeDetail}
           style={customStyles} >
           <form className="ui form">
             <Header>
               <h5>捐助情况</h5>
             </Header>
             <div className="fields" >
               <FormInput size={5} label="时间" inputElement={MaskedInput} value={date ? date.substring(0, 10) : ''}
                 onChange={this._onDonateInfoUpdate} name="date" mask="1111-11-11" />
               <FormInput size={5} label="金额" value={donate.amount} name="amount" onChange={this._onDonateInfoUpdate} suffix="元" />
               <FormInput size={5} label="项目" value={donate.type} onChange={this._onDonateInfoUpdate} name="type" options={donateStyle} />
             </div>
             <div className="fields" >
               <FormInput size={5} label="银行卡" value={donate.bank_card} onChange={this._onDonateInfoUpdate} name="bank_card" />
               <FormInput size={5} label="开户行" value={donate.openning_bank} onChange={this._onDonateInfoUpdate} name="openning_bank" />
             </div>
             <div className="fields" >
               <div className="col-sm-3 pull-right" >
                 <NormalButton style={{marginRight: '26px', backgroundColor: '#ABABAB'}}
                   onClick={this._closeDetail}>返回</NormalButton>
                 <NormalButton onClick={this.handleSubmit}>提交</NormalButton>
               </div>
             </div>
           </form>
         </Modal>
        }
      </div>
    );
  }
}
