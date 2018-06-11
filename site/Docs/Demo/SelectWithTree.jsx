import React, { Component } from 'react';
import _ from 'lodash';
import { Card } from 'antd';
import { SelectWithTree } from 'nasa-ui';

let list1 = [{
    title: 'node1',
    key: 'node1',
    children: [
      { title: 'node1-1', key: 'node1-1' },
      { title: 'node1-2', key: 'node1-2' },
      {
        title: 'node1-3',
        key: 'node1-3',
        children: [
          { title: 'node1-3-1', key: 'node1-3-1' },
          { title: 'node1-3-2', key: 'node1-3-2' },
          { title: 'node1-3-3', key: 'node1-3-3' },
          { title: 'node1-3-4', key: 'node1-3-4' },
        ]
      },
    ]
  },
  {
    title: 'node2',
    key: 'node2',
    children: [
      { title: 'node2-1', key: 'node2-1' },
      { title: 'node2-2', key: 'node2-2' },
    ]
  },
  {
    title: 'node3',
    key: 'node3',
    children: [
      { title: 'node3-1', key: 'node3-1' },
      { title: 'node3-2', key: 'node3-2' },
      {
        title: 'node3-3',
        key: 'node3-3',
        children: [
          { title: 'node3-3-1', key: 'node3-3-1' },
          { title: 'node3-3-2', key: 'node3-3-2' },
          { title: 'node3-3-3', key: 'node3-3-3' },
          { title: 'node3-3-4', key: 'node3-3-4' },
        ]
      },
    ]
  }
];

export default class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sel1: ['node1-1']
    };
  }

  static defaultProps = {}

  componentWillReceiveProps(nextProps) {}

  componentDidMount() {}

  componentWillUnmount() {}

  onChange = (key, list) => {
    console.log(list);
    let data = {
      [key]: list
    };
    this.setState(data);
  }

  render() {
    return (
      <div>
        <h2>基本使用</h2>
        <SelectWithTree list={list1} value={this.state.sel1} onChange={list => this.onChange('sel1', list)}/>
      </div>
    )
  }
}