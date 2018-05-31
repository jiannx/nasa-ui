import React from 'react';
import { message } from 'antd';
import { CopyTextToClipboard, MarkdownParser } from '../index.js';
import md from '../CopyTextToClipboard/index.md';

export default function TestCopyTextToClipboard() {
  const detail = {
    username: 'username',
    password: 'password'
  };
  return (
    <div>
      <MarkdownParser src={md}></MarkdownParser>
      <br/>
      <CopyTextToClipboard 
        text={`用户名: ${detail.username}\n密码: ${detail.password}`}
      />
      <br/>
      <CopyTextToClipboard 
        text={`用户名: ${detail.username}\n密码: ${detail.password}`}
        successCallback={() => message.success('复制成功, hahahah')}
      >
        <a title="点击复制鉴权信息">自定义内容</a>
      </CopyTextToClipboard>
    </div>
  )
}