/*
基于textare 实现 多行为本校验功能

参数：
className: '', // String 类名 
placeholder: '', // String|Array[String] 字符串或者数组
defaultValue: null, // String|Array[String] 默认值
value: null,  // Array[String] 双向绑定值
result: [], // 校验结果
resultRender: (resultItem, index) => { return Component}, // 检验结果显示组件render函数，
onChange: (list) => {}, // 数据变更时调用函数
debounceSec: 500, // 校验间隔时间
tokenSeparators: ['\n'], // 自动分词的分隔符

实例：
<MultiLineVerificationTextarea
  result={this.state.result} 
  onChange={this.onVerify.bind(this)}
  defaultValue={this.state.editData.ip}
  placeholder="请输入服务器IP"
  resultRender={this.onResultRander}
  tokenSeparators={['\n', ',', ';']}
/>
<MultiLineVerificationTextarea
  result={this.state.result} 
  onChange={this.onVerify.bind(this)}
  value={[]}
  placeholder="请输入服务器IP"
  resultRender={this.onResultRander}
/>
*/
import React, { Component } from 'react';
import { Input } from 'antd';
import _ from 'lodash';
import './style.scss';

const TextAreaEx = Input.TextAreaEx;

export default class TextAreaWithVerify extends Component {
  constructor(props) {
    super(props);
    let value = props.value || [];
    if (props.defaultValue) {
      value = _.isArray(props.defaultValue) ? props.defaultValue : props.defaultValue.split(/\n/);
    }
    this.state = {
      value,
      result: props.result, // object[] [{}]
    };
  }

  static defaultProps = {
    className: '',
    placeholder: '', // 字符串或者数组
    defaultValue: undefined,
    value: undefined,
    result: [], // 校验结果
    resultRender: (resultItem, index) => {}, // 检验结果render函数
    onChange: (list) => {},
    debounceSec: 500, // 校验间隔时间
    tokenSeparators: ['\n'], // 自动分词的分隔符
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.result, this.props.result)) {
      this.setState({
        result: nextProps.result
      });
    }
    if (!_.isEqual(nextProps.value, this.props.value)) {
      this.setState({
        value: nextProps.value
      });
    }
  }

  componentDidMount() {}

  onVerify = _.debounce(function(list) {
    this.props.onChange && this.props.onChange(list);
  }, this.props.debounceSec);


  onChange(e) {
    let list = e.target.value.split(new RegExp(`${this.props.tokenSeparators.join('|')}`));
    if (!this.props.value) {
      this.setState({ value: list });
    }
    this.onVerify && this.onVerify(list);
  }

  render() {
    let self = this;

    function Placeholder() {
      let placeholderList = self.props.placeholder;
      if (self.state.value.join() !== '') {
        return null;
      }
      if (_.isString(placeholderList)) {
        placeholderList = [placeholderList];
      }
      if (_.isArray(placeholderList)) {
        return (
          <div className="multi-line-placeholder-box">
            {placeholderList.map((x, i) => 
              <div className="multi-line-placeholder" key={`mult-line-placeholder-${i}`}>{x}</div>
            )}
          </div>
        );
      }
      return null;
    }

    return (
      <div className={`nasa-multi-line-textarea ${this.props.className}`}>
        <div className="multi-line-result">
          {this.state.value.map((x, i) => {
            let tips = null;
            if(this.state.result[i]){
              tips = this.props.resultRender(this.state.result[i], i);
            }
            let className = ['multi-line-result-row'];
            if(this.state.result[i] && this.state.result[i].focus === true){
              className.push('red');
            }
            return (
              <div className={className.join(' ')} key={i+'res'}>
                <span className="text">{x}</span>
                <div className="multi-line-tooltip">
                  {tips}
                </div>
              </div>
            )
          })}
        </div>
        <TextAreaEx 
          className="multi-line-edit"
          onChange={this.onChange.bind(this)}
          value={this.state.value.join('\n')}
        />
        <Placeholder />
      </div>
    )
  }
}