/** * Created by yons on 16/3/30.
 */
import React from 'react';
import {Link} from 'components';
import moment from 'moment';
import config from 'config';
import {Avatar} from 'components';

export function columnCreator(editAction, deleteAction) {
  return [
    {name: '编号', field: '$index'},
    {
      name: '头像',
      display: ({avatar = {}}) => {
        let src = '';
        if (avatar.name) {
          src = `${config.rootURL}/${avatar.name}`;
        }
        return <Avatar style={{height: '32px'}} src={src} />;
      }
    },
    {
      name: '姓名',
      display: (model) => {
        const link = `/doctor/${model._id}`;
        return (<Link to={link} >{model.name}</Link>);
      }
    },
    {
      name: '性别',
      display: ({gender}) => {
        return gender === 'Male' ? '男' : '女';
      }
    },
    {
      name: '年龄',
      display: ({birthday}) => {
        return (moment(new Date()).diff(birthday, 'years'));
      }
    },
    {name: '职位', field: 'title'},
    {name: '科室', field: 'department'},
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
