/*
!!! 弃用
<MultiLineVerification 
  verifyResult={this.state.result} 
  onVerify={this.onVerify.bind(this)}
  placeholder={['http://example.com/test', 'http://example.com/test.png']} 
/>
*/
import React, { Component } from 'react';
import { Tag, Tooltip } from 'antd';
import _ from 'lodash';
import './MultiLineVerification.scss';

class MultiLineVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      rows: [''],
      verifyResult: []
    };
  }

  static defaultProps = {
    className: '',
    placeholder: '', // 字符串或者数组
    verifyResult: [], // 校验结果
    onVerify: () => {}, // 校验函数 参数: items每行数据数组
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      verifyResult: nextProps.verifyResult
    });
  }

  onVerify = _.debounce(function(list) {
    let result = [];
    for (let text of list) {
      result.push({
        text: text,
        success: true,
        error: '',
        tips: ''
      });
    }
    this.props.onVerify(result);
  }, 500);

  onTextareaChange(e) {
    let list = e.target.value.split(/\n/);
    this.onVerify(list);
    this.setState({
      value: e.target.value,
      rows: list,
    });
  }

  render() {
    let self = this;

    function AnotherPlaceholder() {
      if (self.state.value !== '' || _.isArray(self.props.placeholder) === false) {
        return null;
      }
      if (_.isArray(self.props.placeholder)) {
        return (
          <span>{self.props.placeholder.slice(1).map((x, i) => 
            <div className="multi-line-placeholder" key={`mult-line-placeholder-${i}`} style={{top: 32 * (i+1) + 'px'}}>{x}</div>
          )}
          </span>
        );
      }
      return null;
    }

    return (
      <div className={`nasa-multi-line ${this.props.className}`}>
        <div className="multi-line-textarea" style={{height: 32 * this.state.rows.length + 'px'}}>
          <textarea onChange={this.onTextareaChange.bind(this)} 
            value={this.state.value} 
            placeholder={ _.isArray(this.props.placeholder) ? this.props.placeholder[0]: this.props.placeholder}>
          </textarea>
          {this.state.rows.map( (x, i) => {
            let top = 32 * (i + 1) + 'px';
            return (
              <div className="multi-line-line" style={{top}} key={i}></div>
            )
          })}
          {this.state.verifyResult.map((x, i) => {
            let top = 32 * (i + 1) + 'px';
            return (
              <div className={'multi-line-result ' + (x.success ? '': 'with-red-line')} 
                style={{top, 'display': i > this.state.rows.length - 1 ? 'none': 'block'}} 
                key={i + ' res'}
              >
                { x.success === false && 
                  <div className="multi-line-tooltip">
                    <Tooltip placement="right" title={x.tips}>
                      <Tag color="red">{x.error}</Tag>
                    </Tooltip>
                  </div>
                }
              </div>
            )
          })}
          <AnotherPlaceholder />
        </div>
      </div>
    )
  }
}

export default MultiLineVerification;
