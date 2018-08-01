/**
 * 输入框包含删除按钮
 */
import React, { Component } from 'react';
import { Input, Icon } from 'antd';
import './style.scss';

export default class InputWithClear extends Component {
  constructor(props) {
    super(props);
    let isControlled = Object.keys(props).includes('value');

    this.state = {
      value: this.props.value,
      isControlled, // 判断当前组件是否为受控
    };
  }

  static defaultProps = {
    iconStyle: {},
    iocnClassName: '',
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isControlled && this.state.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  componentDidMount(nextProps) {}

  onClear = (e) => {
    e.target.value = '';
    if (!this.state.isControlled) {
      this.setState({ value: e.target.value });
    }
    this.props.onChange && this.props.onChange(e);
  }

  onChange = (e) => {
    if (!this.state.isControlled) {
      this.setState({ value: e.target.value });
    }
    this.props.onChange && this.props.onChange(e);
  }

  render() {
    let props = { ...this.props };
    delete props.iconStyle;
    delete props.iocnClassName;

    return (
      <div className="nasa-input-with-clear">
        <Input {...props} value={this.state.value} onChange={this.onChange}></Input>
        {this.state.value && !this.props.disabled &&
          <Icon type="close-circle-o" onClick={this.onClear} className={`nasa-input-with-clear-btn ${this.props.iocnClassName}`} style={this.props.style}/>
        }
      </div>
    )
  }
}