import React from 'react';
import {Link} from 'components';

export function columnCreator(editAction, deleteAction) {
  return [
    {name: '编号', field: '$index'},
    {
      name: '姓名',
      display: (model) => {
        const link = `/admin/${model._id}`;
        return (<Link to={link} >{model.name}</Link>);
      }
    },
    {name: '登录邮箱', field: 'email'},
    {
      name: '性别',
      display: ({gender}) => {
        return gender === 'Male' ? '男' : '女';
      }
    },
    {
      name: '权限',
      display: ({role}) => {
        switch (role) {
          case 'admin':
            return '管理员';
          case 'visitor':
            return '访问者';
          case 'operator':
            return '操作员';
          default:
            return '';
        }
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
