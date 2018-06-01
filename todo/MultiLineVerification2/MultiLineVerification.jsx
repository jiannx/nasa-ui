/*
<MultiLineVerification 
  verifyResult={this.state.result} 
  onVerify={this.onVerify.bind(this)}
  placeholder={['http://example.com/test', 'http://example.com/test.png']} 
/>
*/
import React, { Component } from 'react';
import _ from 'lodash';
import './MultiLineVerification.scss';

function htmlEncode(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}


class MultiLineVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: props.values,
      value: '',
      rows: [''],
      verifyResult: props.verifyResult, // object[] [{text: text,success: true,error: '',tips: ''}]
      html: ''
    };
  }

  static defaultProps = {
    className: '',
    placeholder: '', // 字符串或者数组
    values: [],
    render: (result, index) => {}, // 检验结果render函数
    verifyResult: [], // 校验结果
    onVerify: (list) => {}, // 校验函数 参数: items每行数据数组
    debounceSec: 500, // 校验间隔时间
    willPaste: (str) => str, // 黏贴前的数据处理
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.verifyResult, this.props.verifyResult)) {
      this.setState({
        verifyResult: nextProps.verifyResult
      });
    }
  }

  componentDidMount() {
    if (this.props.values) {
      this.onSetValues(this.props.values);
    }
  }

  onSetValues = (list) => {
    this.textarea.innerHTML = list.join('<br/>');
    this.onVerify(list);
    this.setState({
      value: list.join('/n'),
      rows: list,
    });
  }

  onVerify = _.debounce(function(list) {
    this.props.onVerify(list);
  }, this.props.debounceSec);

  onClear = () => {
    this.textarea.innerText = '';
    this.setState({
      value: '',
      rows: [],
    });
  }

  onChange(e) {
    let list = e.target.innerText.split(/\n/);
    if (list.length > 1 && list[list.length - 1] === '') {
      list.pop();
    }
    this.setState({
      value: e.target.innerText,
      rows: list,
    });
    this.onVerify(list);
    this.props.onChange && this.props.onChange(list);
  }

  onPaste(e, value) {
    e.persist();
    setTimeout(() => {
      let str = this.props.willPaste(this.textarea.innerText);
      let encodeList = str.split(/\n/).map(x => htmlEncode(x));
      if (encodeList.length > 0 && encodeList[encodeList.length - 1] === '') {
        encodeList.splice(encodeList.length - 1, 1);
      }
      this.onSetValues(encodeList);
    });
  }

  render() {
    let self = this;

    function Placeholder() {
      let placeholderList = self.props.placeholder
      if (self.state.rows.join() !== '') {
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
      <div className="nasa-multi-line2">
        <div className="multi-line-result">
          {this.state.rows.map((x, i) => {
            let tips = null;
            if(this.state.verifyResult[i]){
              tips = this.props.render(this.state.verifyResult[i], i);
            }
            let className = ['multi-line-result-row'];
            if(this.state.verifyResult[i] && this.state.verifyResult[i].focus === true){
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
        <div className={`multi-line-edit ${this.props.className}`}
          contentEditable="true"
          onInput={this.onChange.bind(this)}
          onPaste={this.onPaste.bind(this)}
          ref={(textarea)=> { this.textarea = textarea;}}
        >
        </div>
        <Placeholder />
      </div>
    )
  }
}

export default MultiLineVerification;