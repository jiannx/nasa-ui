var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var MultiLineVerification = function (_Component) {
  _inherits(MultiLineVerification, _Component);

  function MultiLineVerification(props) {
    _classCallCheck(this, MultiLineVerification);

    var _this = _possibleConstructorReturn(this, (MultiLineVerification.__proto__ || Object.getPrototypeOf(MultiLineVerification)).call(this, props));

    _this.onSetValues = function (list) {
      _this.textarea.innerHTML = list.join('<br/>');
      _this.onVerify(list);
      _this.setState({
        value: list.join('/n'),
        rows: list
      });
    };

    _this.onVerify = _.debounce(function (list) {
      this.props.onVerify(list);
    }, _this.props.debounceSec);

    _this.onClear = function () {
      _this.textarea.innerText = '';
      _this.setState({
        value: '',
        rows: []
      });
    };

    _this.state = {
      values: props.values,
      value: '',
      rows: [''],
      verifyResult: props.verifyResult, // object[] [{text: text,success: true,error: '',tips: ''}]
      html: ''
    };
    return _this;
  }

  _createClass(MultiLineVerification, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (!_.isEqual(nextProps.verifyResult, this.props.verifyResult)) {
        this.setState({
          verifyResult: nextProps.verifyResult
        });
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.values) {
        this.onSetValues(this.props.values);
      }
    }
  }, {
    key: 'onChange',
    value: function onChange(e) {
      var list = e.target.innerText.split(/\n/);
      if (list.length > 1 && list[list.length - 1] === '') {
        list.pop();
      }
      this.setState({
        value: e.target.innerText,
        rows: list
      });
      this.onVerify(list);
      this.props.onChange && this.props.onChange(list);
    }
  }, {
    key: 'onPaste',
    value: function onPaste(e, value) {
      var _this2 = this;

      e.persist();
      setTimeout(function () {
        var str = _this2.props.willPaste(_this2.textarea.innerText);
        var encodeList = str.split(/\n/).map(function (x) {
          return htmlEncode(x);
        });
        if (encodeList.length > 0 && encodeList[encodeList.length - 1] === '') {
          encodeList.splice(encodeList.length - 1, 1);
        }
        _this2.onSetValues(encodeList);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var self = this;

      function Placeholder() {
        var placeholderList = self.props.placeholder;
        if (self.state.rows.join() !== '') {
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
        { className: 'nasa-multi-line2' },
        React.createElement(
          'div',
          { className: 'multi-line-result' },
          this.state.rows.map(function (x, i) {
            var tips = null;
            if (_this3.state.verifyResult[i]) {
              tips = _this3.props.render(_this3.state.verifyResult[i], i);
            }
            var className = ['multi-line-result-row'];
            if (_this3.state.verifyResult[i] && _this3.state.verifyResult[i].focus === true) {
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
        React.createElement('div', { className: 'multi-line-edit ' + this.props.className,
          contentEditable: 'true',
          onInput: this.onChange.bind(this),
          onPaste: this.onPaste.bind(this),
          ref: function ref(textarea) {
            _this3.textarea = textarea;
          }
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
  values: [],
  render: function render(result, index) {}, // 检验结果render函数
  verifyResult: [], // 校验结果
  onVerify: function onVerify(list) {}, // 校验函数 参数: items每行数据数组
  debounceSec: 500, // 校验间隔时间
  willPaste: function willPaste(str) {
    return str;
  } // 黏贴前的数据处理
};


export default MultiLineVerification;
//# sourceMappingURL=MultiLineVerification.js.map