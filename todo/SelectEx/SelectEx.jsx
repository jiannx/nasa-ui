/**
 * 支持对象绑定
 */
import React, { Component } from 'react';
import _ from 'lodash';
import { Select } from 'antd';
const Option = Select.Option;

export default class SelectEx extends Component {
  constructor(props) {
    super(props);
    let label = this.getShowValue(props.value, props);
    this.state = {
      value: label,
    };
  }

  static defaultProps = {
    options: [],
    bind: null, //  用于绑定的字段, 如果为空，则返回选中的对象
    label: null, // 用于显示的字段 必须唯一
    addonAfter: null
  }

  getShowValue = (value, props) => {
    if (value === null || value === undefined) {
      return undefined;
    }
    let item = null;
    let label = ' ';
    if (props.bind) {
      item = props.options.find(x => x[props.bind] === value || x[props.bind] === parseInt(value, 10));
      label = item ? item[props.label] : null;
    } else if (props.label) {
      item = props.options.find(x => x[props.label] === value[props.label]);
      label = item ? item[props.label] : null;
    } else {
      item = props.options.find(x => x === value);
      label = item;
    }
    return label;
  }

  setLabel = (value) => {
    let label = this.getShowValue(value, this.props);
    this.setState({
      value: label
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      let label = this.getShowValue(nextProps.value, nextProps);
      this.setState({
        value: label
      });
    } else {
      this.state = {
        value: null,
      };
    }
  }

  componentDidMount() {}

  onChange = (value) => {
    console.log('SelectEx select value = ' + value);

    let item = null;
    if (this.props.bind) {
      item = this.props.options.find(x => x[this.props.bind] === value || x[this.props.bind] === parseInt(value, 10));
    } else if (this.props.label) {
      item = this.props.options.find(x => x[this.props.label] === value || x[this.props.label] === parseInt(value, 10));
    } else {
      item = this.props.options.find(x => x === value || x === parseInt(value, 10));
    }

    if (this.props.bind) {
      this.setLabel(item[this.props.bind] || value);
    } else {
      this.setLabel(item || value);
    }
    if (this.props.onChange) {
      if (this.props.bind) {
        this.props.onChange(item[this.props.bind] || value);
      } else {
        this.props.onChange(item || value);
      }
    }
  }

  render() {
    // console.log('selectex');
    // console.log(this.state.value);
    return (
      <Select {...this.props} onChange={this.onChange} value={this.state.value}>
        { this.props.options.map( x => {
          if(this.props.bind){
            return <Option key={x[this.props.bind]} value={x[this.props.bind]}>{x[this.props.label]}</Option>
          } else if(this.props.label){
            return <Option key={x[this.props.label]}>{x[this.props.label]}</Option>
          } else {
            return <Option key={x}>{x}</Option>
          }
        })}
        {this.props.addonAfter}
      </Select>
    )
  }
}

SelectEx.OptionEx = Option;