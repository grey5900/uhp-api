/** * Created by yons on 16/3/30.
 */
import React from 'react';

export function columnCreator(editAction, deleteAction) {
  return [
    {name: '编号', field: '$index'},
    {name: '时间', display: ({date}) => (date ? date.substr(0, 10) : '')},
    {name: '数额', field: 'amount'},
    {name: '银行卡', field: 'bank_card'},
    {name: '开户行', field: 'openning_bank'},
    {name: '项目', field: 'type'},
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
