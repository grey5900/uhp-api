/*
 * Copyright(c) omk 2016
 * Filename: index.js
 * Author  : Lin Chen <lc@omk.io>
 * Create  : 星期二, 24 五月 2016.
 */
import React from 'react';

export default function AssessDenied() {
  return (
    <div className="container">
      <h1>Doh! 401!</h1>
      <p>您 <em>没有权限</em> 访问当前页面!</p>
    </div>
  );
}
