import React from 'react';
import ReactDOM from 'react-dom';
// import './style/index.scss';
import { LocaleProvider } from 'antd';
import { CopyTextToClipboard } from 'src/index.js';

ReactDOM.render((
  <div>

    <CopyTextToClipboard text="sdfsdf">杀死对方</CopyTextToClipboard>
  </div>
), document.getElementById('root'));