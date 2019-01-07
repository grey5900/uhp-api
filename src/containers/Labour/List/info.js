import React from 'react';
import moment from 'moment';
import {Link} from 'components';

export function columnCreator(editAction, deleteAction) {
  return [
    {name: '编号', field: '$index'},
    {
      name: '时间',
      display: (model) => {
        const start = moment(model.create_time).format('YYYY-MM-DD');
        const end = moment(model.dead_line).format('MM-DD');
        return `${start} ~ ${end}`;
      }
    },
    {
      name: '时长',
      display: (model) => {
        return moment(model.dead_line).diff(model.create_time, 'days');
      }
    },
    {
      name: '执行人',
      display: ({assignee}) => {
        let result = '';
        if (assignee) {
          result = <Link to={`/patient/${assignee._id}/2`}>{assignee.real_name}</Link>;
        }
        return result;
      }
    },
    {
      name: '劳务项目',
      display: (model) => {
        let result = '';
        if (model.type) {
          result = <span>{model.type.name}</span>;
        }
        return result;
      }
    },
    {
      name: '所属基地',
      display: (model) => {
        const {city, area} = model.type;
        return `${city} ${area}`;
      }
    },
    {name: '薪酬', field: 'payment'},
    {
      name: '任务状态',
      display: (model) => {
        const {status} = model;
        let statusValue = '';
        if (status === 'Init') {
          statusValue = '未开始';
        } else if (status === 'Going') {
          statusValue = '进行中';
        } else if (status === 'NotFinished') {
          statusValue = '未完成';
        } else if (status === 'InReview') {
          statusValue = '审核中';
        } else if (status === 'InCheck') {
          statusValue = '验收中';
        } else if (status === 'Finished') {
          statusValue = '已完成';
        } else if (status === 'Canceled') {
          statusValue = '已取消';
        }
        return (<span>{statusValue}</span>);
      }
    },
    {
      name: '操作',
      display: (model) => {
        return (<div>
          <button className="ui primary button" onClick={editAction.bind(null, model)} >编辑</button>
          <button className="ui orange button" onClick={deleteAction.bind(null, model)} >删除</button>
        </div>);
      }
    }
  ];
}
