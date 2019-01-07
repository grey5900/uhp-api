/**
 * Created by isaac on 16/6/2.
 */
import React from 'react';
import moment from 'moment';
import {Link} from 'components';

export function columnCreator(editAction, deleteAction) {
  return [
    {name: '编号', field: '$index'},
    {
      name: '创建时间',
      display: ({create_time}) => {
        return (moment(create_time).format('YYYY-MM-DD'));
      }
    },
    {
      name: '名称',
      display: (model) => {
        const link = `/labourtype/${model._id}`;
        return (<Link to={link} >{model.name}</Link>);
      }
    },
    {
      name: '地区',
      display: ({province, city, area}) => {
        return `${province} ${city} ${area}`;
      }
    },
    {name: '已发工资', field: 'paid'},
    {name: '劳务人数', field: 'patients.length'},
    {name: '基地投入成本', field: 'base_cost'},
    {name: '销售金额', field: 'sale_amount'},
    {name: '备注', field: 'comment'},
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
