/**
 * 正文插件
 */
import React, { Component } from 'react';
import './Content.scss';

class Content extends Component {
  static defaultProps = {
    className: '',
    style: null,
    footer: 'Please Set Footer',
    size: 'auto', // 尺寸 默认auto自动高度，full占满剩余空间
  }

  render() {
    let className = ['nasa-content', 'nasa-fade-in', this.props.className];
    if (this.props.size === 'full') {
      className.push('nasa-content-full');
    }
    return (
      <div className={className.join(' ')} style={this.props.style}>
        {this.props.children}
        <div className="nase-footer">
          {this.props.footer}
        </div>
      </div>
    )
  }
}

export default Content;
