/** * Created by yons on 16/3/30.
 */
import React from 'react';
import {Link} from 'components';

export function columnCreator(editAction, deleteAction) {
  return [
    {name: '编号', field: '$index'},
    {name: '时间', display: ({date}) => (date ? date.substr(0, 10) : '')},
    {name: '地点', field: 'address'},
    {
      name: '主题',
      display: (model) => <Link to={`/activity/${model._id}`} >{model.theme}</Link>
    },
    {name: '形式', field: 'style'},
    {name: '患者人数', field: 'participant_num'},
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
