import React, { Component } from 'react';
import { Tabs } from 'antd';
import _ from 'lodash';
import TestDynamicView from './TestDynamicView.jsx';
import TestCopyTextToClipboard from './TestCopyTextToClipboard.jsx';
import TestModalEx from './TestModalEx.jsx';
import TestFormEx from './TestFormEx.jsx';
import TestDynamicFormEx2 from './TestDynamicFormEx2.jsx';

const TabPane = Tabs.TabPane;

export default class Test extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {}

  render() {
    return (
      <div style={{padding: '20px', overflow: 'auto'}}>
        <h1>Components Test</h1>
        <br/>
        <Tabs
          defaultActiveKey="TestDynamicFormEx2"
          tabPosition={'left'}
          style={{ minHeight: 800 }}
        >
          <TabPane tab="DynamicView" key="1">
            <TestDynamicView />
          </TabPane>

          <TabPane tab="CopyTextToClipboard" key="2">
            <TestCopyTextToClipboard />
          </TabPane>

          <TabPane tab="ModalEx" key="ModalEx">
            <TestModalEx />
          </TabPane>

          <TabPane tab="FormEx2" key="FormEx2">
            <TestFormEx />
          </TabPane>

          <TabPane tab="TestDynamicFormEx2" key="TestDynamicFormEx2">
            <TestDynamicFormEx2 />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}