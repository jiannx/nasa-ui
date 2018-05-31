var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var MultiLineVerification = function (_Component) {
  _inherits(MultiLineVerification, _Component);

  function MultiLineVerification(props) {
    _classCallCheck(this, MultiLineVerification);

    var _this = _possibleConstructorReturn(this, (MultiLineVerification.__proto__ || Object.getPrototypeOf(MultiLineVerification)).call(this, props));

    _this.onVerify = _.debounce(function (list) {
      var result = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var text = _step.value;

          result.push({
            text: text,
            success: true,
            error: '',
            tips: ''
          });
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.props.onVerify(result);
    }, 500);

    _this.state = {
      value: '',
      rows: [''],
      verifyResult: []
    };
    return _this;
  }

  _createClass(MultiLineVerification, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({
        verifyResult: nextProps.verifyResult
      });
    }
  }, {
    key: 'onTextareaChange',
    value: function onTextareaChange(e) {
      var list = e.target.value.split(/\n/);
      this.onVerify(list);
      this.setState({
        value: e.target.value,
        rows: list
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var self = this;

      function AnotherPlaceholder() {
        if (self.state.value !== '' || _.isArray(self.props.placeholder) === false) {
          return null;
        }
        if (_.isArray(self.props.placeholder)) {
          return React.createElement(
            'span',
            null,
            self.props.placeholder.slice(1).map(function (x, i) {
              return React.createElement(
                'div',
                { className: 'multi-line-placeholder', key: 'mult-line-placeholder-' + i, style: { top: 32 * (i + 1) + 'px' } },
                x
              );
            })
          );
        }
        return null;
      }

      return React.createElement(
        'div',
        { className: 'nasa-multi-line ' + this.props.className },
        React.createElement(
          'div',
          { className: 'multi-line-textarea', style: { height: 32 * this.state.rows.length + 'px' } },
          React.createElement('textarea', { onChange: this.onTextareaChange.bind(this),
            value: this.state.value,
            placeholder: _.isArray(this.props.placeholder) ? this.props.placeholder[0] : this.props.placeholder }),
          this.state.rows.map(function (x, i) {
            var top = 32 * (i + 1) + 'px';
            return React.createElement('div', { className: 'multi-line-line', style: { top: top }, key: i });
          }),
          this.state.verifyResult.map(function (x, i) {
            var top = 32 * (i + 1) + 'px';
            return React.createElement(
              'div',
              { className: 'multi-line-result ' + (x.success ? '' : 'with-red-line'),
                style: { top: top, 'display': i > _this2.state.rows.length - 1 ? 'none' : 'block' },
                key: i + ' res'
              },
              x.success === false && React.createElement(
                'div',
                { className: 'multi-line-tooltip' },
                React.createElement(
                  Tooltip,
                  { placement: 'right', title: x.tips },
                  React.createElement(
                    Tag,
                    { color: 'red' },
                    x.error
                  )
                )
              )
            );
          }),
          React.createElement(AnotherPlaceholder, null)
        )
      );
    }
  }]);

  return MultiLineVerification;
}(Component);

MultiLineVerification.defaultProps = {
  className: '',
  placeholder: '', // 字符串或者数组
  verifyResult: [], // 校验结果
  onVerify: function onVerify() {} // 校验函数 参数: items每行数据数组
};


export default MultiLineVerification;
//# sourceMappingURL=MultiLineVerification.js.map