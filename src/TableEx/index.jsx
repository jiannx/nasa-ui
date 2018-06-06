import React, { Component } from 'react';
import { Table } from 'antd';
import _ from 'lodash';
import './style.scss';
import Fetch from '../Fetch';

/*
项目配置
TableEx.defaultProps.onReqHandler = () => ({})
TableEx.defaultProps.onResHandler = () => ({})
 */

const PAGINATION = {
  defaultPageSize: 20, // 默认页码
  defaultCurrent: 1, // 默认页
  current: 1,
  showSizeChanger: true,
  showQuickJumper: true,
};

export default class TableEx extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: props.history,
      loading: false,
      pagination: Object.assign({}, PAGINATION, props.pagination || {}),
      dataSource: []
    };
  }

  static defaultProps = {
    className: '',
    style: {},
    data: null, // 包含分页,条目项等所有数据 {list: [], pageSize: 30, current: 1, total: 100}
    api: null, // 接口，当传入该参数时，请勿传入data。 () => {}
    history: [], // 该字段用于刷新表格数据，当向该字段中插入请求参数时，重新请求刷新表格。api参数必填
    params: {}, // 该参数优先级高于histroy中参数
    onChange: (pagination, filters, sorter) => null, // 页码，条目数，排序，过滤器等变更事件，可返回请求参数

    currentPage: null, // 受控当前页码
    onCurrentPageChange: num => {}, // 当前页码变更

    onRequest: (params) => params, // 请求参数{current, pageSize}针对业务进行格式化
    onResponse: (res, reqParams) => res, // 响应数据格式化为组件需要的格式{list: [], pageSize: 30, current: 1, total: 100}

    // 以下参数参照 ant table
    columns: [],
    pagination: PAGINATION,
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ history: nextProps.history });
    // 数据未发生变更时，不做刷新
    if (_.isEqual(this.props.data, nextProps.data)) {
      return;
    }
    setTimeout(() => {
      this.componentDidMount();
    });
  }

  componentDidMount() {
    if (this.props.data) {
      this.setData(this.props.data)
    }
  }

  onChange = (pagination, filters, sorter) => {

    // 分页状态未变更，则为过滤条件变更
    if (_.isEqual(pagination, this.state.pagination)) {
      let filterParam = this.props.onChange(pagination, filters, sorter);
      if (!filterParam) {
        let newParams = Object.assign({},
          _.last(this.state.history), {
            filters,
            sorter: { columnKey: sorter.columnKey, field: sorter.field, order: sorter.order }
          });
        this.setState({ history: this.state.history.concat([newParams]) });
      }
    } else {
      // 分页请求
      this.setState({ pagination }, () => {
        this.setState({ history: [...this.state.history, _.last(this.state.history)] })
      });
    }
  }

  setData = (data) => {
    let dataSource = _.get(data, 'list', []);
    if (!_.isArray(dataSource)) {
      console.error('TableEx: data.list must be an Array');
      return;
    }
    this.setState({
      pagination: Object.assign({}, this.state.pagination, {
        current: _.get(data, 'current', 1),
        pageSize: _.get(data, 'pageSize', this.state.pagination.defaultPageSize),
        total: _.get(data, 'total', 0),
      }),
      dataSource
    });
  }

  onFetchResponse = (res, requestParams) => {
    res = this.props.onResponse(res, requestParams) || res;
    this.setData(res);
  }

  onFetchRequest = (params) => {
    params = Object.assign({
      pageSize: _.get(this.state, 'pagination.pageSize', this.state.pagination.defaultPageSize),
      current: _.get(this.state, 'pagination.current', 1),
    }, params);
    params = this.props.onRequest(params) || params;
    return params;
  }

  render() {
    return (
      <div className={`nasa-grid ${this.props.className}`} style={this.props.style}>
        <Fetch 
          api={this.props.api}
          history={this.state.history}
          params={this.props.params}
          onRequest={this.onFetchRequest}
          onResponse={this.onFetchResponse}
          onLoadingChange={loading => this.setState({ loading })}
        />
        <Table
          {...this.props}
          onChange={this.onChange}
          loading={this.state.loading}
          pagination={this.props.pagination === false ? false : this.state.pagination} 
          dataSource={this.state.dataSource} 
        />
      </div>
    )
  }
}