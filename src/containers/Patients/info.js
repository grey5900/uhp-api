import React from 'react';
import {Link} from 'components';
import moment from 'moment';

export function columnCreator(editAction, deleteAction) {
  return [
    {name: '编号', field: 'number'},
    {
      name: '姓名',
      sort: true,
      display: (model) => {
        const link = `/patient/${model._id}`;
        return (<Link to={link} >{model.real_name}</Link>);
      }
    },
    {
      name: '性别',
      display: ({gender}) => {
        return gender === 'Male' ? '男' : '女';
      }
    },
    {
      name: '医院',
      display: (model) => {
        const {hospital} = model;
        if (hospital) {
          const link = `/hospital/${hospital._id}`;
          return (<Link to={link} >{hospital.name}</Link>);
        }
        return '';
      }
    },
    {
      name: '年龄',
      display: ({birthday}) => {
        return (moment(new Date()).diff(birthday, 'years'));
      }
    },
    {
      name: '电话号码',
      field: 'mobile'
    },
    {
      name: '身份证',
      sort: true,
      field: 'person_id'
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
