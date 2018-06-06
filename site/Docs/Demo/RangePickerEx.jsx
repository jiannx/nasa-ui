import React, { Component } from 'react';
import _ from 'lodash';
import { Layout, Menu, Breadcrumb, Icon, Button } from 'antd';

import { RangePickerEx } from 'nasa-ui';

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
        <h2>设置时间跨度20天</h2>
        <RangePickerEx range={10}></RangePickerEx>
        <h2>自定义前后跨度</h2>
        <RangePickerEx range={[2, 10]}></RangePickerEx>
      </div>
    )
  }
}