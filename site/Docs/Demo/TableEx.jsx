import React, { Component } from 'react';
import _ from 'lodash';
import { Layout, Menu, Breadcrumb, Icon, Button } from 'antd';
import axios from 'axios';
import { TableEx } from 'nasa-ui';



function test(params) {
  return axios({ url: '/api/workorder/list', params });
  // return new Promise((resolve, reject) => {
  //   let res = {
  //     list: [{ name: 'name' + Math.random(), pro: 'add' }, { name: 'name' + Math.random(), pro: 'add' }, { name: 'name' + Math.random(), pro: 'add' }],
  //     pageSize: Math.ceil(Math.random() * 30),
  //     current: Math.ceil(Math.random() * 10),
  //     total: Math.ceil(Math.random() * 100)
  //   };
  //   console.info('发起请求', params);
  //   setTimeout(() => {
  //     resolve(res);
  //   }, 2000);
  // });
}

TableEx.defaultProps.onRequest = (params) => {
  return {
    ...params,
    page: params.current,
    page_rows: params.pageSize
  };
};

TableEx.defaultProps.onResponse = ({ data }) => {
  let res = data.data;
  return {
    list: res.data,
    pageSize: res.page_rows,
    current: res.page_now,
    total: res.records,
  };
};

export default class DemoTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: []
    };
  }

  static defaultProps = {}

  componentWillReceiveProps(nextProps) {}

  componentDidMount() {}

  componentWillUnmount() {}

  onTestApi = () => {
    this.setState({
      history: this.state.history.concat([{}])
    });
  }

  render() {
    let data1 = {
      list: [{ name: 'name1', pro: 'add' }, { name: 'name2', pro: 'add' }, { name: 'name3', pro: 'add' }],
      pageSize: 30,
      current: 2,
      total: 100
    }
    let columns = [
      { title: '名称', dataIndex: 'name', sorter: true },
      { title: '名称2', dataIndex: 'order_id', sorter: true },
      { title: '属性', dataIndex: 'pro', filters: [{ text: 'filter1', value: 'filter1' }, { text: 'filter2', value: 'filter2' }] },
    ];
    return (
      <div>
        <h2>data属性</h2>
        <TableEx
          columns={columns}
          data={data1}
        />
        <br/>
        <h2>不包含分页</h2>
        <TableEx
          columns={columns}
          data={data1}
          pagination={false}
        />
        <br/>
        <h2>异步请求 <Button onClick={this.onTestApi}>发起请求</Button></h2>
        <TableEx
          api={test}
          columns={columns}
          history={this.state.history}
          pagination={{
            defaultPageSize: 5
          }}
        />
        <h2>CDN分页测试 <Button onClick={this.onTestApi}>发起请求</Button></h2>
        <TableEx
          api={test}
          columns={columns}
          history={this.state.history}
          pagination={{
            size: 'small',
            defaultPageSize: 5
          }}
        />
        <h2>受控页码 <Button onClick={this.onTestApi}>发起请求</Button></h2>
        <TableEx
          api={test}
          columns={columns}
          history={this.state.history}
          pagination={{
            defaultPageSize: 5
          }}
          currentPage={this.state.currentPage || 1}
          onCurrentPageChange={num => {
            console.log(num)
            this.setState({currentPage: num});
          }}
        />
      </div>
    )
  }
}