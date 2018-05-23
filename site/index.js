import React, { Component } from 'react';
import { Tabs } from 'antd';
import _ from 'lodash';
import ReactDOM from 'react-dom';
import { MarkdownParser } from 'nasa-ui';
import * as NasaUI from 'nasa-ui';
import CopyMd from '../components/CopyTextToClipboard/index.md';

const TabPane = Tabs.TabPane;

let markdown = {};
let names = Object.keys(NasaUI);

ReactDOM.render((
  <div style={{padding: '20px', overflow: 'auto'}}>
    <h1>NASA UI Components Doc</h1>
    <br/>
    <Tabs
      // defaultActiveKey="TestDynamicFormEx2"
      tabPosition={'left'}
      style={{ minHeight: 800 }}
    >
      {names.map(x => 
        <TabPane tab={x} key={x}>
          <MarkdownParser src={require(`../components/${x}/index.md`)}></MarkdownParser>
        </TabPane>
      )}
    </Tabs>
  </div>
), document.getElementById('root'));