var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
import InputEx from '../InputEx/InputEx.jsx';
import _ from 'lodash';
import './MultiLineVerification.scss';

var TextAreaEx = InputEx.TextAreaEx;

var MultiLineVerification = function (_Component) {
  _inherits(MultiLineVerification, _Component);

  function MultiLineVerification(props) {
    _classCallCheck(this, MultiLineVerification);

    var _this = _possibleConstructorReturn(this, (MultiLineVerification.__proto__ || Object.getPrototypeOf(MultiLineVerification)).call(this, props));

    _this.onVerify = _.debounce(function (list) {
      this.props.onChange && this.props.onChange(list);
    }, _this.props.debounceSec);

    var value = props.value || [];
    if (props.defaultValue) {
      value = _.isArray(props.defaultValue) ? props.defaultValue : props.defaultValue.split(/\n/);
    }
    _this.state = {
      value: value,
      result: props.result // object[] [{}]
    };
    return _this;
  }

  _createClass(MultiLineVerification, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
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
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'onChange',
    value: function onChange(e) {
      var list = e.target.value.split(new RegExp('' + this.props.tokenSeparators.join('|')));
      if (!this.props.value) {
        this.setState({ value: list });
      }
      this.onVerify && this.onVerify(list);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var self = this;

      function Placeholder() {
        var placeholderList = self.props.placeholder;
        if (self.state.value.join() !== '') {
          return null;
        }
        if (_.isString(placeholderList)) {
          placeholderList = [placeholderList];
        }
        if (_.isArray(placeholderList)) {
          return React.createElement(
            'div',
            { className: 'multi-line-placeholder-box' },
            placeholderList.map(function (x, i) {
              return React.createElement(
                'div',
                { className: 'multi-line-placeholder', key: 'mult-line-placeholder-' + i },
                x
              );
            })
          );
        }
        return null;
      }

      return React.createElement(
        'div',
        { className: 'nasa-multi-line-textarea ' + this.props.className },
        React.createElement(
          'div',
          { className: 'multi-line-result' },
          this.state.value.map(function (x, i) {
            var tips = null;
            if (_this2.state.result[i]) {
              tips = _this2.props.resultRender(_this2.state.result[i], i);
            }
            var className = ['multi-line-result-row'];
            if (_this2.state.result[i] && _this2.state.result[i].focus === true) {
              className.push('red');
            }
            return React.createElement(
              'div',
              { className: className.join(' '), key: i + 'res' },
              React.createElement(
                'span',
                { className: 'text' },
                x
              ),
              React.createElement(
                'div',
                { className: 'multi-line-tooltip' },
                tips
              )
            );
          })
        ),
        React.createElement(TextAreaEx, {
          className: 'multi-line-edit',
          onChange: this.onChange.bind(this),
          value: this.state.value.join('\n')
        }),
        React.createElement(Placeholder, null)
      );
    }
  }]);

  return MultiLineVerification;
}(Component);

MultiLineVerification.defaultProps = {
  className: '',
  placeholder: '', // 字符串或者数组
  defaultValue: null,
  value: null,
  result: [], // 校验结果
  resultRender: function resultRender(resultItem, index) {}, // 检验结果render函数
  onChange: function onChange(list) {},
  debounceSec: 500, // 校验间隔时间
  tokenSeparators: ['\n'] // 自动分词的分隔符
};


export default MultiLineVerification;
//# sourceMappingURL=MultiLineVerification.by-textarea.js.map