import React from 'react';
import { message, Avatar, Input } from 'antd';
import { DynamicFormEx2, MarkdownParser, FormEx2 } from '../index.js';
import md from '../DynamicView/index.md';

var FormItem = FormEx2.Item;

export default function TestDynamicFormEx2() {
  var state = {
    id: 1001,
    list: [{ id1: '111', id2: '222' }],
    object: {
      dataDefault: {
        header1: 'value1',
        header2: 'value2'
      }
    },
    ipStart: '0.0.0.0',
    type1: {
      id: 1
    }
  };
  var items = [{ type: 'input', bind: 'id', label: 'ID', required: true }, { type: 'input', bind: 'name', label: '名称', defaultValue: 'wsewe' }, {
    type: 'input',
    label: 'IP范围',
    decorator: React.createElement(
      'span',
      null,
      React.createElement(FormItem, { dataIndex: 'ipStart', decorator: React.createElement(Input, null), style: { width: '200px' } }),
      ' -',
      React.createElement(FormItem, { dataIndex: 'ipend', decorator: React.createElement(Input, null), style: { width: '200px' }, required: true })
    )
  }, { type: 'radio', bind: 'isOpen', label: 'Radio', options: [{ value: 'yes', label: '开启' }, { value: 'no', label: '关闭' }] }, false ? { type: 'input', bind: 'id', label: 'ID', required: true } : null, {
    type: 'radio',
    bind: 'isOpen2',
    label: 'Radio默认值',
    options: [{ value: 'yes', label: '开启' }, { value: 'no', label: '关闭' }],
    defaultValue: 'no'
  }, {
    type: 'radio',
    bind: 'isOpen3',
    label: 'Radio默认Options',
    defaultValue: true
  }, { type: 'select', bind: 'slect', label: 'select单选', options: [{ value: 'type1', label: '类型1' }, { value: 'type2', label: '类型2' }] }, { type: 'selectTag', bind: 'slectTag', label: 'select多选', options: [{ value: 'type1', label: '类型1' }, { value: 'type2', label: '类型2' }] }, { type: 'selectMult', bind: 'slectMult', label: 'select多输入', options: [{ value: 'type1', label: '类型1' }, { value: 'type2', label: '类型2' }] }, { type: 'checkbox', bind: 'check', label: 'checkbox', defaultValue: false }, { type: 'checkboxGroup', bind: 'checkgroup', label: 'checkbox Group', defaultValue: ['type1'], options: [{ value: 'type1', label: '类型1' }, { value: 'type2', label: '类型2' }] }, {
    type: 'array',
    bind: 'list',
    label: '列表',
    children: [{ type: 'checkbox', bind: 'isUse', label: '是否使用', defaultValue: true, span: 4 }, { type: 'input', bind: 'id1', label: 'ID', required: true, defaultValue: 'id1', span: 4 }, { type: 'input', bind: 'id2', label: 'ID', required: true }]
  }, { type: 'object', bind: 'object.data', label: 'object' }, { type: 'object', bind: 'object.dataDefault', label: 'object 默认值' }, {
    type: 'oneOf',
    label: '其中一份',
    defaultValue: '类型1',
    children: [{
      label: '类型1',
      children: [{ type: 'input', bind: 'type1.id', label: 'ID1', required: true }]
    }, {
      label: '类型2',
      children: [{ type: 'input', bind: 'type2.id', label: 'ID2', required: true }]
    }, {
      label: '类型3',
      children: [{ type: 'input', bind: 'type3.id', label: 'ID3', required: true }]
    }, {
      label: '类型4',
      children: [{ type: 'input', bind: 'type4.id', label: 'ID4', required: true }]
    }]
  }];
  return React.createElement(
    'div',
    null,
    React.createElement(
      'h2',
      null,
      '\u52A8\u6001\u8868\u5355\u751F\u6210'
    ),
    React.createElement(DynamicFormEx2, {
      defaultValues: state,
      items: items
    })
  );
}
//# sourceMappingURL=TestDynamicFormEx2.js.map