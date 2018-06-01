/*
自定义输入 + 可选项 默认最小高度100px
支持选择输入及自定义输入
返回数组
*/
import React, { Component } from 'react';
import { Input, AutoComplete, Select } from 'antd';
import _ from 'lodash';

import './TextareaAutocomplete.scss';

const { TextArea } = Input;
const Option = Select.Option;

export default class TextareaAutocomplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: props.dataSource
    };
  }

  static defaultProps = {
    style: null,
    className: '',
    size: 'default', // default small large
    placeholder: '',
    dataSource: [],
    onChange: () => {}
  }

  componentWillReceiveProps(nextProps) {
    // 数据未发生变更时，不做刷新
    if (_.isEqual(this.state.dataSource, nextProps.dataSource)) {
      return;
    }
    this.setState({
      dataSource: this.props.dataSource
    });
  }

  handleSearch = (value) => {
    if (value === '') {
      this.setState({
        dataSource: this.props.dataSource
      });
    } else {
      this.setState({
        dataSource: [value].concat(this.props.dataSource)
      });
    }
  }

  handleChange = (list) => {
    // console.log(list);
    this.props.onChange(list)
  }

  render() {
    let className = `nasa-textarea-auto ${this.props.className} ${this.props.size}`;

    return (
      <div className={className} style={this.props.style}>
        <Select
          mode="multiple"
          // style={{minHeight: '80px'}}
          // size={this.props.size}
          placeholder={this.props.placeholder}
          onChange={this.handleChange}
          onSearch={this.handleSearch}
        >
          {this.state.dataSource.map((x, i) => 
            <Option key={x + i}>{x}</Option>
          )}
        </Select>
      </div>
    )
  }
}
