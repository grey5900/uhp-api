/**
 * Created by yons on 16/4/6.
 */
import React from 'react';
import {Icon} from 'components';
const style = {marginRight: 0};

export default [
  {
    header: '信息',
    menus: [
      {
        icon: <Icon className="dashboard big icon" style={style} />,
        link: '/home',
        name: '首页'
      },
      {
        icon: <Icon className="hospital big" style={style} />,
        link: '/hospitals',
        urls: ['/hospitals', '/hospital'],
        name: '医院'
      },
      {
        icon: <Icon className="doctor big" style={style} />,
        link: '/doctors',
        urls: ['/doctors', '/doctor'],
        name: '医生'
      },
      {
        icon: <Icon className="user big" style={style} />,
        link: '/patients',
        urls: ['/patients', '/patient'],
        name: '患者'
      },
      {
        icon: <Icon className="payment big" style={style} />,
        link: '/labours',
        urls: ['/labours', '/labour', '/labourtype'],
        name: '劳务'
      },
      {
        icon: <Icon className="newspaper big" style={style} />,
        link: '/activities',
        urls: ['/activities', '/activity'],
        name: '活动'
      },
      {
        icon: <Icon className="bar chart big" style={style} />,
        link: '/chart',
        name: '画像'
      }
    ]
  },
  {
    header: '设置',
    menus: [
      {
        icon: <Icon className="lock big" style={style} />,
        link: '/admins',
        urls: ['/admins', '/admin'],
        name: '权限'
      }
    ]
  }
];
