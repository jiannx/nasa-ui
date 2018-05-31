// 动态详情显示
// 动态表单 完善
// 上面两项组合
/**
<DynamicView
  className=""
  style=""
  align: 'left', // 对齐方式 String or Number，默认值:left。left:左对齐；number：数值，则该值为标题所占的百分比宽度，并进行以冒号为中心对齐
  values={this.state.values} // 完整数据 Object
  rowProps={{gutter: 16}} // Row 的 props
  colProps={{span: 8}} // Col 的props
  item={[
    { 
      type, // 字段类型 String = 'string'||'boolen'||'array'||'object'||'br'
      title, // 标题 String 如果标题为空，则不显示标题
      dataIndex, // 绑定字段的key String
      render, // 处理函数 (value) => '显示的内容'
      span, // Col的span参数
      defaultValue: '', // 未获取到数据情况
      children: []
    }
  ]}
>
**/

import React, { Component } from 'react';
import { Icon, Button, Row, Col, Select, Radio, Tooltip, Input } from 'antd';
import _ from 'lodash';
import { FormEx } from 'src/components';
import './style.scss';


const defultItem = {
  type: 'string',
  title: '',
  dataIndex: '',
  render: null,
  span: null,
  children: null,
  defaultValue: '',
  visiable: true, // 是否可见
}

function ViewString({ value }) {
  return <span>{value}</span>;
}

function ViewBoolen({ value }) {
  if (value === true)
    return <span>是</span>;
  if (value === false)
    return <span>否</span>;
  return null;
}

function ViewArray(props) {

}

function ViewObject(props) {

}

function ViewBr(props) {
  return <div className="clear"></div>
}

function OneOf(props) {

}

function ViewNode({ item, align }) {
  if (item.type === 'br') {
    return <ViewBr/>
  }
  // 在标题不存在的情况下，添加值偏移样式，使其与上一行标签对齐
  let valueClassName = ['dynamic-view-value'];
  if (!item.title) {
    valueClassName.push('dynamic-view-value-offset');
  }
  if (item.title) {
    item.title += ': '
  }
  return (
    <Col className="dynamic-view-col" {...item.colProps}>
      <span className="dynamic-view-title" style={item.titleStyle}>
        {item.title}
      </span>
      <span className={valueClassName.join(' ')}>
        { item.type === 'string' && 
          <ViewString {...item} />
        }
        { item.type === 'boolen' && 
          <ViewBoolen {...item} />
        }
      </span>
    </Col>
  )
}

export default class DynamicView extends Component {
  static defaultProps = {
    className: '',
    style: null,
    align: 'left',
    values: {},
    items: [],
    rowProps: {},
    colProps: {
      span: 8
    },
    item: [],
  }

  get = (id, defaultValue) => {
    return _.get(this.props.values, id, defaultValue);
  }

  render() {
    let items = [];
    let spanSum = 0;

    this.props.items.forEach(item => {
      item = Object.assign({}, defultItem, item);
      if (item.visiable === false) {
        return;
      }
      let value = this.get(item.dataIndex, item.defaultValue);
      let props = {
        ...item,
        colProps: item.span ? Object.assign({}, this.props.colProps, { span: item.span }) : this.props.colProps,
        value: item.render ? item.render(value) : value,
        titleStyle: _.isNumber(this.props.align) ? { width: this.props.align * 100 + '%' } : null
      }
      if (item.type === 'br') {
        items.push(<ViewBr/>);
        spanSum = 0;
        return;
      }
      items.push(<ViewNode item={props} align={this.props.align}/>);

      // 加上当前节点超出一行，在当前节点之前插入换行使其对齐
      spanSum += props.colProps.span;
      if (spanSum > 24) {
        items.splice(items.length - 1, 0, <ViewBr />);
        spanSum = props.colProps.span;
      }
    });

    // 添加冒号对齐样式
    const className = ['nasa-dynamic-view', this.props.className];
    if (_.isNumber(this.props.align)) {
      className.push('nasa-dynamic-view-align-colon');
    }
    if (this.props.size === 'samll') {
      className.push('nasa-dynamic-view-small');
    }

    let paddingSide = 0;
    // 移除row的margin负值
    if (this.props.rowProps && this.props.rowProps.gutter) {
      paddingSide = this.props.rowProps.gutter / 2;
    }

    return (
      <div style={{padding: `0 ${paddingSide}px`}}>
        <Row {...this.props.rowProps} style={this.props.style} className={className.join(' ')}>
          {React.Children.toArray(items)}
        </Row>
      </div>
    )
  }
}