/**
 * 表单组件
 */
import React, { Component } from 'react';
import _ from 'lodash';
import { FormEx, SelectEx, InputEx } from 'src/components';
import { Input, Select, Col, Table, Radio, Checkbox, Popconfirm } from 'antd';

const Item = FormEx.Item;
const ItemArray = FormEx.ItemArray;
const RadioGroup = Radio.Group;


function ViewBr({ item }) {
  return <Col span={24}>{item.label}</Col>
}

function ViewText({ item, get, values, gutter, span }) {
  if (item.render) {
    return <Col span={span}>{item.label}：{item.render(get(item.bind), values)}</Col>
  }

  return <Col span={span}>{item.label}：{ get(item.bind, '') === null ? null : get(item.bind, '').toString() }</Col> //兼容一下null的情况
}

function ViewArray({ item, get, values, gutter, span }) {
  if (item.render) {
    return <Col span={span}><div style={{float: 'left'}}>{item.label}：</div><div style={{float: 'left'}}>{item.render(get(item.bind), values)}</div></Col>
  }
  const render = (x = '') => {
    if (_.isString(x) || _.isBoolean(x)) {
      return x.toString();
    } else if (_.isArray(x)) {
      return x.join(', ');
    } else if (_.isPlainObject(x)) {
      return Object.keys(x).map(key => `${key}:${x[key]}; `)
    }
  }
  let columns = item.children.map((x, i) => {
    x._index = i;
    return {
      title: x.label,
      dataIndex: x.bind,
      render: x.render ? x.render : render
    }
  });
  if (item.withEditCol) {
    columns.push({
      title: '操作',
      render: (text, record, index) => <span>
        <a onClick={() => {item.onArrayChildEdit(item.bind, index)}}>编辑</a>&nbsp;
        <Popconfirm placement="top" title={item.delConfirm ? 'item.delConfirm' : '确定删除该条目吗？'} onConfirm={() => {item.onArrayChildDel(item.bind, index)}} okText="确定" cancelText="取消">
          <a>删除</a>
        </Popconfirm>
      </span>
    });
  }
  return (
    <Col span={24}>
      <Table dataSource={get(item.bind)} size="small" rowKey={item.rowKey || '_index'} pagination={false} columns={columns}/>
    </Col>
  )
}

export function viewNode({ item, get, values, gutter, span }) {
  let node;
  if (item.type === 'br') {
    node = <ViewBr item={item}/>
  } else if (item.type === 'array') {
    node = <ViewArray item={item} get={get} values={values} gutter={gutter} span={span}/>
  } else if (item.type === 'object') {
    if (!item.render)
      item.render = (x = {}) => Object.keys(x).map(key => `${key}: ${x[key]}, `);
    node = <ViewText item={item} get={get} values={values} gutter={gutter} span={span} />
  } else if (item.type === 'oneOf') {
    node = [];
    for (let opt of item.children) {
      for (let x of opt.children) {
        node.push(<ViewText item={x} get={get} values={values}gutter={gutter} span={span} />)
      }
    }
  } else {
    node = <ViewText item={item} get={get} values={values} gutter={gutter} span={span}/>
  }
  return node;
}

const baseControls = ['input', 'radio', 'select', 'checkbox', 'selectTag', 'br'];
// 基本组件
function formBase({ item, layout, values, get, defaultItem, setChange, getValues, isArrayChild = false } = {}) {
  function set(id, value) {
    // console.log(id);
    // console.log(value);
    values = _.cloneDeep(getValues());
    // console.log(values);
    _.set(values, id, value);
    setChange(values);
  }

  let control = null;
  if (_.isFunction(item.control)) {
    control = item.control(getValues(), set);
  } else if (item.control) {
    control = item.control;
  } else {
    switch (item.type) {
      case 'input':
        control = <InputEx type="text" placeholder={item.placeholder || item.label} addonBefore={item.addonBefore} addonAfter={item.addonAfter} disabled={item.disabled}/>;
        break;
      case 'radio':
        if (!item.options) {
          item.options = [{ value: true, label: '是' }, { value: false, label: '否' }];
        }
        control = (
          <RadioGroup> {isArrayChild && <span>{item.label}: </span>}
            { item.options.map( x => <Radio value={x.value} key={x.value}>{x.label}</Radio>)}
          </RadioGroup>)
        break;
      case 'oneOf':
        if (!item.options) {
          item.options = [{ value: true, label: '是' }, { value: false, label: '否' }];
        }
        control = (
          <RadioGroup>
            { item.options.map( x => <Radio value={x.value} key={x.value}>{x.label}</Radio>)}
          </RadioGroup>)
        break;
      case 'select':
        if (!item.options) {
          item.options = [];
        }
        control = <SelectEx options={item.options} label={item.selectLabel} bind={item.selectBind}/>;
        break;
      case 'checkbox':
        control = <Checkbox >{item.label}</Checkbox>;
        break;
      case 'selectTag':
        control = <Select mode="tags" style={{ width: '100%' }} tokenSeparators={item.tokenSeparators} placeholder={item.label} />;
        break;
      default:
        break;
    }
  }
  let props = { bind: item.bind, required: item.required, rule: item.rule, onChange: item.onChange, defaultValue: item.defaultValue };
  if (isArrayChild) {
    return <Item {...props}>{control}</Item>
  }
  return <Item {...layout} {...props} label={item.label}>{control}</Item>
}

function formArray({ item, layout, defaultItem, get }) {
  let nodes = [];
  item.children.forEach(child => {
    child = Object.assign({}, defaultItem, child);
    if (child.withLabel) {
      let node = formBase({
        item: child,
        layout: child.layout || {
          labelCol: {
            xs: { span: 12 },
            sm: { span: 12 },
          },
          wrapperCol: {
            xs: { span: 12 },
            sm: { span: 12 },
          },
        },
        isArrayChild: false,
        get
      });
      nodes.push(node);
    } else if (_.indexOf(baseControls, child.type) >= 0) {
      let node = formBase({ item: child, layout, isArrayChild: true, get });
      nodes.push(node);
    } else {
      console.log('DynamicForm: formArray 存在未定义type');
    }
  });
  return (
    <ItemArray {...layout} label={item.label} bind={item.bind} defaultValue={item.defaultValue || []}>
      { React.Children.toArray(nodes)}
    </ItemArray>)
}

function formObject({ item, layout, values, get }) {
  item.bindCopy = item.bind;
  item.bind = '_dynamic.array_' + item.bindCopy + item.label;
  item.children = [
    { type: 'input', label: item.keyText, bind: 'key', required: true },
    { type: 'input', label: item.valueText, bind: 'value', required: true },
  ]
  // 初始化列表数据
  let obj = get(item.bindCopy, {});
  let list = Object.keys(obj).map(key => {
    return { key, value: obj[key] };
  });
  item.defaultValue = list;
  // 数据变更时，将数组形式转化为对象形式
  function onChange(values, key, v) {
    let obj = {};
    _.get(values, item.bind, []).forEach(x => {
      obj[x.key] = x.value;
    });
    _.set(values, item.bindCopy, obj);
    return values;
  }
  item.children.forEach(child => {
    child.onChange = onChange;
  });
  return formArray({ item, layout, values, get });
}

// 根据索引删除属性 id = orign.ip
function delProperty(values, id) {
  let ids = id.split('.');
  if (ids.length === 1) {
    delete values[ids[0]];
  } else {
    let id = ids.splice(0, ids.length - 1).join('.');
    values = _.get(values, id, {});
    delete values[ids[ids.length - 1]];
  }
}

function formOne({ item, layout, values, get }) {
  //生成 radio
  item.bind = '_dynamic.oneof_radio_' + item.label;
  item.onChange = function(newValues, key, value) {
    // 移除未选中类型中的属性
    for (let option of item.children) {
      if (option.label !== value) {
        option.children.forEach(x => {
          delProperty(newValues, x.bind);
        });
      }
    }
    return newValues;
  }
  item.options = item.children.map(x => {
    return { value: x.label, label: x.label };
  });
  // 设置初始选中项
  item.defaultValue = item.children[0].label;
  let list = [];
  for (let option of item.children) {
    let optionChildren = option.children.map(childItem => formNode({ item: childItem, layout, values, get }));
    let controls = (
      <div>
        { get(item.bind) === option.label && 
          React.Children.toArray(optionChildren)
        }
      </div>)
    list.push(controls);
  }
  let radio = formBase({ item, layout, values, get });

  return [radio, list];
}

// setChange：手动设置values，传入变更后的values
export function formNode({ item, layout, values, get, defaultItem, setChange, getValues }) {
  item = Object.assign({}, defaultItem, item);
  let type = item.type;
  if (_.indexOf(baseControls, type) >= 0) {
    return formBase({ item, layout, values, get, defaultItem, setChange, getValues })
  } else if (type === 'array') {
    return formArray({ item, layout, values, get, defaultItem, setChange, getValues });
  } else if (type === 'object') {
    return formObject({ item, layout, values, get, defaultItem, setChange, getValues });
  } else if (type === 'oneOf') {
    return formOne({ item, layout, values, get, defaultItem, setChange, getValues });
  } else {
    console.log('DynamicForm: 存在未定义type');
    console.log(item);
  }
}