import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button } from 'antd';
import _ from 'lodash';

var CONFIRM_OPTIONS = {
  title: '',
  data: {},
  closeBtn: true, // 是否包含右上角关闭及取消按钮
  onOk: function onOk() {}
};
var DIV_ID = 'modal-ex-container';

function createElement() {
  var t = new Date();
  var id = DIV_ID + '-' + t.valueOf();
  var el = document.getElementById(id);
  if (!el) {
    el = document.createElement('div');
    el.setAttribute('id', id);
    document.body.appendChild(el);
  }
  return el;
}

var confirm = function confirm(options) {
  options = Object.assign({}, CONFIRM_OPTIONS, options);
  var el = createElement();
  var content = null;

  var handleCancel = function handleCancel() {
    ReactDOM.unmountComponentAtNode(el);
    options.onCancel && options.onCancel();
  };

  // content 内部逻辑完成后回调
  var handleSuccess = function handleSuccess() {
    // 出发option中回调并关闭弹窗
    options.onOk && options.onOk();
    ReactDOM.unmountComponentAtNode(el);
  };

  var handleOk = function handleOk() {
    // 每个content需提供一个handleOk
    if (content && content.handleOk && _.isFunction(content.handleOk)) {
      content.handleOk(handleSuccess);
    } else {
      options.onOk && options.onOk(function () {
        ReactDOM.unmountComponentAtNode(el);
      });
      // console.log('modalEx confirm: content 未定义handleOk');
    }
  };

  var contentElement = null;
  if (_.isString(options.content)) {
    contentElement = options.content;
  } else {
    contentElement = React.cloneElement(options.content, {
      ref: function ref(t) {
        content = t;
      },
      // 给内部content调用，调用当时this.props.modal.close();
      modal: {
        ok: handleOk,
        close: handleCancel
      }
    });
  }
  // 是否包含取消按钮
  if (options.closeBtn === false) {
    options.footer = React.createElement(
      Button,
      { size: 'large', type: options.okType ? options.okType : 'primary', onClick: handleOk },
      options.okText ? options.okText : '确定'
    );
    if (!options.className) {
      options.className = 'nasa-modal-no-close';
    } else {
      options.className += ' nasa-modal-no-close';
    }
  }

  ReactDOM.render(React.createElement(
    Modal,
    Object.assign({
      maskClosable: true
    }, options, {
      visible: true,
      onOk: handleOk,
      onCancel: handleCancel
    }),
    contentElement
  ), el);
};

export default confirm;
//# sourceMappingURL=confirm.js.map