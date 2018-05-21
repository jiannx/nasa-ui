import React, { Component } from 'react';
import { Icon, Tooltip } from 'antd';
import './Panel.scss';

class Panel extends Component {
  static defaultProps = {
    title: null, // 标题
    titleType: 'in', // 标题模式 in/out
    height: 'auto', // 正文高度，不包含标题
    desc: null, // 描述
    withContent: true,
    style: null,
    className: '',
    active:false,
  }

  render() {
    let title = (
      this.props.title ? (
        <div className="panel-title">
          {this.props.title}&nbsp;
          { this.props.desc !== null && 
            <Tooltip placement="right" title={this.props.desc}>
            <span className="cdn-info" />
            </Tooltip>
          }
          <div className="panel-title-right">
            {this.props.right}
          </div>
        </div>
      ) : null
    );
    return (
      <div className={`nasa-panel ${this.props.className}`} style={this.props.style} onClick={this.props.onClick && this.props.onClick}>
        { this.props.titleType === 'out' && 
          title
        }
        { this.props.withContent === true && 
          <div className="panel-content" style={{height: this.props.height}}>
            { this.props.titleType === 'in' && 
              title
            }
            {this.props.children}
          </div>
        }
      </div>
    )
  }
}

export default Panel;
