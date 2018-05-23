/*
标题组件 包含底部下划线及左侧圆线
*/
import React, { Component } from 'react';
import './Title.scss';

export default class Tab extends Component {
  static defaultProps = {
    style: null,
    className: '',
    value: '',
    size: 'default', // default small large
  }
  render() {
    let className = `nasa-title ${this.props.className} ${this.props.size}`;
    return (
      <div className={className} style={this.props.style}>
        {this.props.value}

        <div className="title-right">
          {this.props.children}
        </div>
      </div>
    )
  }
}
