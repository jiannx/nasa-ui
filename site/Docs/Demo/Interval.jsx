import React, { Component } from 'react';
import _ from 'lodash';
import { Layout, Menu, Breadcrumb, Icon, Button } from 'antd';

import { Interval } from 'nasa-ui';

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
      <div>
        <h2>默认倒计时</h2>
        <Interval ></Interval>
        <h2>设置时间</h2>
        <Interval interval={60}></Interval>
        <h2>循环</h2>
        <Interval interval={10} countdownFormat="mm:ss" repeat={true} render={time => time} onTrigger={() => console.log('Interval next repeat')}></Interval>
        <h2>自定义</h2>
        <Interval countdownFormat="mm--ss"></Interval>
      </div>
    )
  }
}