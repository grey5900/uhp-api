import React from 'react';
import {Link} from 'components';

export function columnCreator(editAction, deleteAction) {
  return [
    {name: '编号', field: '$index'},
    {
      name: '名称',
      display: (model) => {
        const link = `/hospital/${model._id}`;
        return (<Link to={link} >{model.name}</Link>);
      }
    },
    {name: '省', field: 'province'},
    {name: '市', field: 'city'},
    {name: '区', field: 'area'},
    {
      name: '联系人',
      display: ({contact}) => {
        if (contact) {
          const link = `/doctor/${contact._id}`;
          return (<Link to={link} >{contact.name}</Link>);
        }
        return '';
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
