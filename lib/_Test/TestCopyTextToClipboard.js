import React from 'react';
import { message } from 'antd';
import { CopyTextToClipboard, MarkdownParser } from '../index.js';
import md from '../CopyTextToClipboard/index.md';

export default function TestCopyTextToClipboard() {
  var detail = {
    username: 'username',
    password: 'password'
  };
  return React.createElement(
    'div',
    null,
    React.createElement(MarkdownParser, { src: md }),
    React.createElement('br', null),
    React.createElement(CopyTextToClipboard, {
      text: '\u7528\u6237\u540D: ' + detail.username + '\n\u5BC6\u7801: ' + detail.password
    }),
    React.createElement('br', null),
    React.createElement(
      CopyTextToClipboard,
      {
        text: '\u7528\u6237\u540D: ' + detail.username + '\n\u5BC6\u7801: ' + detail.password,
        successCallback: function successCallback() {
          return message.success('复制成功, hahahah');
        }
      },
      React.createElement(
        'a',
        { title: '\u70B9\u51FB\u590D\u5236\u9274\u6743\u4FE1\u606F' },
        '\u81EA\u5B9A\u4E49\u5185\u5BB9'
      )
    )
  );
}
//# sourceMappingURL=TestCopyTextToClipboard.js.map