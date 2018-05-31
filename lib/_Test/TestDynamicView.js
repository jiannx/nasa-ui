import React from 'react';
import { message, Avatar } from 'antd';
import { DynamicView, MarkdownParser } from '../index.js';
import md from '../DynamicView/index.md';

export default function TestCopyTextToClipboard() {
  var state = {
    dynamicView: {
      id: 100,
      icon: '',
      available: true,
      username: 'test-name',
      name: '测试名',
      note: '备注1备注1备注1备注1备注1备注1备注1备注1备注1备注1',
      note2: '备注2无标题',
      list: [{ name: 'list1-name', value: 'list1-value' }, { name: 'list2-name', value: 'list2-value' }],
      object: {
        cookie: 'test-cookie'
      }
    }
  };
  return React.createElement(
    'div',
    null,
    React.createElement(MarkdownParser, { src: md }),
    React.createElement('br', null),
    React.createElement(
      'h2',
      null,
      '\u5DE6\u4FA7\u7684\u5BF9\u5176'
    ),
    React.createElement(DynamicView, {
      style: { marginBottom: '20px' },
      className: 'test',
      values: state.dynamicView,
      rowProps: { gutter: 16 },
      colProps: { span: 8 },
      items: [{ title: '图标', dataIndex: 'icon', span: 24, render: function render(src) {
          return React.createElement(Avatar, { icon: 'user' });
        } }, { title: 'ID', dataIndex: 'id' }, { type: 'boolen', title: '状态', dataIndex: 'available' }, { title: '用户名', dataIndex: 'username' }, { title: '名称', dataIndex: 'name' }, { title: '备注超长标题名称', dataIndex: 'note' }, { dataIndex: 'note2' }, { dataIndex: 'note2' }, { dataIndex: 'note2' }, { dataIndex: 'note2' }]
    }),
    React.createElement(
      'h2',
      null,
      '\u5C45\u4E2D\u5BF9\u9F50'
    ),
    React.createElement(DynamicView, {
      style: { marginBottom: '20px' },
      className: 'test',
      align: 0.4,
      values: state.dynamicView,
      rowProps: { gutter: 16 },
      colProps: { span: 8 },
      items: [{ title: '图标', dataIndex: 'icon', render: function render(src) {
          return React.createElement(Avatar, { icon: 'user' });
        } }, { title: 'ID', dataIndex: 'id' }, { title: '用户名', dataIndex: 'username' }, { title: '名称', dataIndex: 'name' }, { title: '备注', dataIndex: 'note' }]
    })
  );
}
//# sourceMappingURL=TestDynamicView.js.map