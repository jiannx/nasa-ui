import React, { Component } from 'react';
import _ from 'lodash';
import { Layout, Menu, Breadcrumb, Icon, Button } from 'antd';

import { InputWithClear } from 'nasa-ui';

export default class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '初始值'
    };
  }

  static defaultProps = {}

  componentWillReceiveProps(nextProps) {}

  componentDidMount() {}

  componentWillUnmount() {}

  onChange = (e) => {
    this.setState({ value: e.target.value });
  }


  render() {
    return (
      <div>
        <h3>普通输入框</h3>
        <InputWithClear size="small" iconStyle={{color: 'red'}}/>
        <InputWithClear />
        <InputWithClear size="large" onChange={(e) => console.log(e.target.value)}/>
        <br/>
        <h3>受控输入框</h3>
        <InputWithClear value={this.state.value} onChange={this.onChange}/>
      </div>
    )
  }
}