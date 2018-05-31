import React, { Component } from 'react';
import _ from 'lodash';
import { Button, Row, Col, Modal, Input, Radio, Select, Checkbox, Icon } from 'antd';
import FormEx2 from './FormEx2.jsx';

const FormItem = FormEx2.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

const defaultItem = {
  type: 'input', //string, input||radio||checkbox||select||oneOf 多项只能配置一项||array列表项||br换行||selectTag多重输入
  label: '', // 标题文本
  bind: null, // 显示及编辑时对应数据中的索引
  children: null, // array, array 中子节点
  disabled: false, // 当前项是否可编辑
  required: false, // 编辑时是否必填
  rules: undefined, // 编辑时校验规则
  defaultValue: undefined, // 默认值

  // Object 两个文本框实现键值对形式 根据输入的值，生成对象 {key: value}
  keyLabel: 'key', // key值文本框文本 
  valueLabel: 'value', // value 文本框显示文本

  // radio select
  options: null, // radio label, value [{label: '描述', value: 'type1'}]

  // array可选参数 参照 FormExItemArray的参数
  span: undefined, // 编辑时布局 用于children元素 children: [{bind: 'id', label: 'ID', span: 4}]
  addText: '新增', // 编辑时新增文本

  // selectTag
  tokenSeparators: [','], // 分隔符
}

const layout = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 18 },
  },
};

// 包含 dataIndex
function fromItemWithData() {

}

function getFormItemProps(opt) {
  let props = {
    ...layout,
    label: opt.label,
    required: opt.required,
    rules: opt.rules,
    defaultValue: opt.defaultValue,
    dataIndex: opt.dataIndex,
  };
  return props;
}

function withDecorator(props) {
  return (
    <FormItem
      {...layout} 
      label={props.label} 
      required={props.required} 
      rules={props.rules}
      defaultValue={ props.dataIndex ? props.defaultValue : undefined} 
      dataIndex={ props.dataIndex ? props.bind : undefined} 
      decorator={ props.dataIndex ? props.decorator : undefined}
    >
      {props.dataIndex ? null: props.decorator}
    </FormItem>
  )
}


function render(item) {
  let props = Object.assign({}, defaultItem, item); // 参数生成
  props.dataIndex = props.bind;
  let itemProps = getFormItemProps(props);

  let formItem;
  if (props.decorator) {}
  // input 
  else if (props.type === 'input') {
    formItem = (
      <FormItem
        {...itemProps}
        decorator={<Input placeholder={props.placeholder}></Input>}
      />
    )
  }
  // radio
  else if (props.type === 'radio') {

  }
  // select 
  else if (props.type === 'select') {

  }
  // 多选
  else if (props.type === 'selectMult') {

  }
  // 多重输入 
  else if (props.type === 'selectTag') {

  }
  // checkbox
  else if (props.type === 'checkbox') {

  }
  // checknbox grop
  else if (props.type === 'checkboxGroup') {

  }
  // one of 
  else if (props.type === 'oneOf') {

  }
  // array 
  else if (props.type === 'array') {

  }
  // object 
  else if (props.type === 'object') {

  }
  <FormItem
        {...layout} 
        label={props.label} 
        required={props.required} 
        rules={props.rules}
        defaultValue={ withDataIndex ? props.defaultValue : undefined} 
        dataIndex={ withDataIndex ? props.bind : undefined} 
        decorator={ withDataIndex ? decorator : undefined}
      >
        {withDataIndex ? null: decorator}
      </FormItem>
}