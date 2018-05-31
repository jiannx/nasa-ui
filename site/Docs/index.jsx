import React, { Component } from 'react';
import { Tabs } from 'antd';
import _ from 'lodash';
import ReactDOM from 'react-dom';
import { MarkdownParser } from 'nasa-ui';
import * as NasaUI from 'nasa-ui';
import { Route, Switch } from 'react-router';

const TabPane = Tabs.TabPane;

let markdown = {};
let names = Object.keys(NasaUI);

export default class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {}

  componentWillReceiveProps(nextProps) {}

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
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
              <MarkdownParser src={require(`../../src/${x}/index.md`)}></MarkdownParser>
            </TabPane>
          )}
        </Tabs>
      </div>
    )
  }
}