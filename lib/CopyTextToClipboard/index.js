var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * 拷贝内容到剪切板
 */
import React, { Component } from 'react';
import { Icon, message } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './style.scss';

var defaultSuccessCallback = function defaultSuccessCallback() {
  message.success('复制成功');
};

function copyTextToClipboard(text) {
  var successCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultSuccessCallback;
  var failCallback = arguments[2];

  var textArea = document.createElement("textarea");
  textArea.style.width = '0';
  textArea.style.height = '0';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    if (document.execCommand('copy')) successCallback && successCallback();else failCallback && failCallback();
  } catch (err) {
    failCallback && failCallback();
  }
  document.body.removeChild(textArea);
}

var CopyTextToClipboard = function (_Component) {
  _inherits(CopyTextToClipboard, _Component);

  function CopyTextToClipboard() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, CopyTextToClipboard);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CopyTextToClipboard.__proto__ || Object.getPrototypeOf(CopyTextToClipboard)).call.apply(_ref, [this].concat(args))), _this), _this.onCopy = function () {
      copyTextToClipboard(_this.props.text, _this.props.successCallback, _this.props.failCallback);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(CopyTextToClipboard, [{
    key: 'render',
    value: function render() {
      return this.props.children ? React.createElement(
        'span',
        { className: classNames('nasa-copy-text', this.props.className), onClick: this.onCopy },
        this.props.children
      ) : React.createElement(
        'a',
        { className: classNames('nasa-copy-text', this.props.className), title: this.props.title, onClick: this.onCopy },
        React.createElement(Icon, { type: 'copy' })
      );
    }
  }]);

  return CopyTextToClipboard;
}(Component);

CopyTextToClipboard.defaultProps = {
  text: '', // 需要复制的内容
  successCallback: null, // 复制成功回调
  failCallback: null, // 复制失败回调
  title: '点击复制信息' // 鼠标hover文本
};
export default CopyTextToClipboard;


CopyTextToClipboard.propTypes = {
  text: PropTypes.string.isRequired,
  successCallback: PropTypes.func,
  failCallback: PropTypes.func,
  title: PropTypes.string
};
//# sourceMappingURL=index.js.map