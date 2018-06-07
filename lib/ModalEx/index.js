var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * 弹窗定制版 
 * 在antd的Modal上封装了弹出隐藏等基本逻辑
 * 参数参照antd Modal
 * Api:
 * ref.show(title)
 *      
<ModalEx title="日志下载" 
  ref={ modal => this.modalLog = modal} 
  onOk={(close) => { close(); }} 
  onInit={() => { console.log('init') }} 
  onShow={() => { console.log('show') }}
>
  children
</ModalEx>
<Button onClick={()=>{ this.modalLog.show('新标题') }}>下载日志</Button>
<Button onClick={()=>{ this.modalLog.show() }}>下载日志</Button>
 */

import React, { Component } from 'react';
import { Modal } from 'antd';
import confirm from './confirm.jsx';
import './style.scss';
import _message from './message.jsx';
export { _message as message };

var ModalEx = function (_Component) {
  _inherits(ModalEx, _Component);

  function ModalEx(props) {
    _classCallCheck(this, ModalEx);

    var _this = _possibleConstructorReturn(this, (ModalEx.__proto__ || Object.getPrototypeOf(ModalEx)).call(this, props));

    _this.show = function (title) {
      if (_this.state.isFirst === true) {
        _this.props.onInit && _this.props.onInit();
        _this.setState({
          isFirst: false
        });
      }
      _this.props.onShow && _this.props.onShow();

      title = title || _this.props.title;
      _this.setState({
        title: title,
        visible: true
      });
    };

    _this.onOk = function () {
      // this.setState({
      //   confirmLoading: true
      // });
      _this.props.onOk && _this.props.onOk(function () {
        _this.setState({
          visible: false,
          confirmLoading: false
        });
      });
    };

    _this.onCancel = function () {
      _this.setState({
        visible: false
      });
      _this.props.onCancel && _this.props.onCancel();
    };

    _this.state = {
      title: props.title,
      visible: false,
      confirmLoading: false,
      isFirst: true
    };
    return _this;
  }

  _createClass(ModalEx, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.visible === true) {
        this.show();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        Modal,
        Object.assign({}, this.props, {
          title: this.state.title,
          confirmLoading: this.state.confirmLoading,
          visible: this.state.visible,
          onOk: this.onOk,
          onCancel: this.onCancel
        }),
        this.props.children
      );
    }
  }]);

  return ModalEx;
}(Component);

ModalEx.defaultProps = {
  onInit: null, // 第一次弹出时调用的函数
  onShow: null, // 每次弹出调用的函数

  // 以下参照 antd Modal
  title: '',
  visible: false,
  okText: '确认',
  cancelText: '取消',
  onOk: function onOk() {},
  onCancel: function onCancel() {}
};
export default ModalEx;


ModalEx.confirm = confirm;

export var modalEx = {
  confirm: confirm
};
//# sourceMappingURL=index.js.map