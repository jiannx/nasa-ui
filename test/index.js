import React from 'react';
import ReactDOM from 'react-dom';
// import './style/index.scss';
import { LocaleProvider } from 'antd';
import { CopyTextToClipboard } from '../lib/index.js';

ReactDOM.render((
  <div>
    <CopyTextToClipboard text="sdfsdf">test</CopyTextToClipboard>
  </div>
), document.getElementById('root'));