/**
 * 在 antd的message的基础上添加关闭按钮，使用方式参照antd
 * message.success(content, duration, onClose, withClose = true)
 */
import React from 'react';
import _ from 'lodash';
import { message, Icon } from 'antd';

var msg = function msg(type) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var instance = null;

  function handleClose() {
    instance();
  }
  args[3] = args[3] === undefined ? true : args[3];

  var messageType = message[type];
  // if (args.length > 0 && _.isString(args[0])) {
  if (args.length > 0) {
    if (args[3] === true) {
      args[0] = React.createElement(
        'span',
        null,
        args[0],
        ' ',
        React.createElement(
          'a',
          { className: 'nase-message-close', onClick: handleClose },
          React.createElement(Icon, { type: 'close' })
        )
      );
    }
    instance = messageType.apply(undefined, args);
  }

  return instance;
};

export default {
  success: function success() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return msg.apply(undefined, ['success'].concat(args));
  },
  error: function error() {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return msg.apply(undefined, ['error'].concat(args));
  },
  info: function info() {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return msg.apply(undefined, ['info'].concat(args));
  },
  warning: function warning() {
    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    return msg.apply(undefined, ['warning'].concat(args));
  },
  warn: function warn() {
    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }

    return msg.apply(undefined, ['warn'].concat(args));
  },
  loading: function loading() {
    for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    return msg.apply(undefined, ['loading'].concat(args));
  }
};

// msg('success', 'aaa');
// msg('success', 'bbbb', 6, null, true);
//# sourceMappingURL=message.js.map