/*
 * Copyright(c) omk 2016
 * Filename: info.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期五, 24 六月 2016.
 */

import React from 'react';
import moment from 'moment';

export function columnCreator(editAction, deleteAction) {
  return [
    {name: '编号', field: '$index'},
    {
      name: '创建时间',
      display: (model) => {
        return (moment(model.create_time).format('YYYY-MM-DD'));
      }
    },
    {name: '负责人', field: 'name'},
    {
      name: '劳务类型',
      display: (model) => {
        let result = '';
        if (model.type) {
          result = <span>{model.type.name}</span>;
        }
        return result;
      }
    },
    {
      name: '任务状态',
      display: ({status}) => {
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
    {name: '薪酬', field: 'payment'},
    {
      name: '执行人',
      display: (model) => {
        let result = '';
        if (model.assignee) {
          result = <span>{model.assignee.real_name}</span>;
        }
        return (result);
      }
    },
    {
      name: '完成时间',
      display: (model) => {
        return (moment(model.dead_line).format('YYYY-MM-DD'));
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
