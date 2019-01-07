/*
 * Copyright(c) omk 2016
 * Filename: visitor_menus.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期三, 18 五月 2016.
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
        name: '医院'
      },
      {
        icon: <Icon className="doctor big" style={style} />,
        link: '/doctors',
        name: '医生'
      },
      {
        icon: <Icon className="user big" style={style} />,
        link: '/patients',
        name: '患者'
      },
      {
        icon: <Icon className="payment big" style={style} />,
        link: '/labours',
        name: '劳务'
      },
      {
        icon: <Icon className="newspaper big" style={style} />,
        link: '/activities',
        name: '活动'
      },
      {
        icon: <Icon className="bar chart big" style={style} />,
        link: '/chart',
        name: '人群画像'
      }
    ]
  },
];
