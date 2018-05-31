var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import { Button, message } from 'antd';
import { MarkdownParser, modalEx } from '../index.js';
import md from '../ModalEx/index.md';

function UserDetail(props) {
  return React.createElement(
    'div',
    null,
    React.createElement(
      'p',
      null,
      '\u5F53\u524Did\uFF1A ',
      props.id
    )
  );
}

var UserAdd = function (_Component) {
  _inherits(UserAdd, _Component);

  function UserAdd() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, UserAdd);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = UserAdd.__proto__ || Object.getPrototypeOf(UserAdd)).call.apply(_ref, [this].concat(args))), _this), _this.handleOk = function (close) {
      console.log('表单提交成功');
      close();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(UserAdd, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'p',
          null,
          '\u7528\u6237ID: ',
          this.props.id
        )
      );
    }
  }]);

  return UserAdd;
}(Component);

export default function TestModal() {
  var state = {};

  var showDefault = function showDefault() {
    modalEx.confirm({
      title: '用户详情',
      content: React.createElement(UserDetail, { id: 999 }),
      onOk: function onOk(close) {
        console.log('用户详情成功');
        message.success('用户详情成功');
        close();
      },
      onCancel: function onCancel() {
        console.log('弹窗关闭');
      }
    });
  };

  var showFrom = function showFrom() {
    modalEx.confirm({
      title: '用户添加',
      content: React.createElement(UserAdd, { id: 999 }),
      onOk: function onOk() {
        console.log('用户添加成功');
        message.success('用户添加成功');
      },
      onCancel: function onCancel() {
        console.log('弹窗关闭');
      }
    });
  };

  var showNoClose = function showNoClose() {
    modalEx.confirm({
      title: '用户添加',
      content: React.createElement(UserAdd, { id: 999 }),
      closeBtn: false,
      onOk: function onOk() {
        console.log('用户添加成功');
      },
      onCancel: function onCancel() {
        console.log('弹窗关闭');
      }
    });
  };

  return React.createElement(
    'div',
    null,
    React.createElement(
      'h1',
      null,
      '\u5F39\u7A97\u7EC4\u4EF6'
    ),
    React.createElement('br', null),
    React.createElement(
      Button,
      { onClick: showDefault },
      '\u6807\u51C6\u5F39\u7A97'
    ),
    '\xA0',
    React.createElement(
      Button,
      { onClick: showFrom },
      '\u8868\u5355\u5F39\u7A97'
    ),
    '\xA0',
    React.createElement(
      Button,
      { onClick: showNoClose },
      '\u5F3A\u5236\u5F39\u7A97\uFF0C\u4E0D\u5305\u542B\u5173\u95ED\u6309\u94AE'
    ),
    '\xA0',
    React.createElement('br', null),
    React.createElement('br', null),
    React.createElement(MarkdownParser, { src: md })
  );
}
//# sourceMappingURL=TestModalEx.js.map