import React, { Component } from 'react';
import { Table } from 'antd';
import _ from 'lodash';
import './style.scss';

const PAGE_SIZE = 30;
const KEYS = {
  defaultPageSize: 30,
  list: 'data',
  size: 'size',
  current: 'page_now',
  getPage: 'page',
  pageSize: 'page_rows',
  total: 'records'
};

const PAGINATION = {
  size: 'middle',
  defaultPageSize: 30, // 默认页码
  defaultCurrent: 1, // 默认页
  current: 1,
  showSizeChanger: true,
  showQuickJumper: true,
};
/*
初始工作
TableEx.defaultProps.onReqHandler = () => ({})
TableEx.defaultProps.onResHandler = () => ({})

 */

export default class TableEx extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pagination: Object.assign({}, PAGINATION, props.pagination || {}),
      dataSource: []
    };
  }

  static defaultProps = {
    className: '',
    style: {},
    api: null, // 接口，当传入该参数时，请勿传入data。 () => {}
    history: [], // 该字段用于刷新表格数据，当向该字段中插入请求参数时，重新请求刷新表格。api参数必填
    params: {}, // 该参数优先级高于histroy中参数
    data: null, // 包含分页,条目项等所有数据 { data: [], page_now, page_rows, records }
    onChange: (pagination, filters, sorter) => {}, // 页码，条目数，排序，过滤器等变更事件，可返回请求参数
    onSort: (sorter) => {}, // 排序变更事件，可返回请求参数，该参数将合并页码等参数
    onFilter: (filters) => {}, // 过滤器变更事件，可返回参数，该参数将合并页码等参数
    // 受控当前页码
    currentPage: null,
    // 当前页码变更
    onCurrentPageChange: num => {},
    // 请求前参数处理
    onReqHandler: (params) => params, // 请求参数{current, pageSize} 针对业务进行格式化
    // 响应后数据处理
    onResHandler: (res, reqParams) => res, // 响应数据格式化为组件需要的格式{list: [], pageSize: 30, current: 1, total: 100}

    // 以下参数参照 ant table
    columns: [],
    rowKey: '_key',
    dataSource: [], // 只有列表数据,在data中传入
    size: 'middle',
    loading: false,
    scroll: {},
    pagination: PAGINATION,
    rowSelection: null
  }

  componentWillReceiveProps(nextProps) {
    // 数据未发生变更时，不做刷新
    if (_.isEqual(this.props.data, nextProps.data) &&
      _.isEqual(this.props.history, nextProps.history)) {
      return;
    }
    setTimeout(() => {
      this.componentDidMount();
    });
  }

  componentDidMount() {
    if (this.props.api) {
      this.getData();
      return;
    }
    this.draw(this.props.data);
  }

  draw(data) {
    this.setState({
      dataSource: _.get(data, 'list', []),
      pagination: this.props.pagination ?
        Object.assign({}, this.state.pagination, {
          size: this.state.pagination.size,
          current: _.get(data, 'current', 1),
          pageSize: _.get(data, 'pageSize', 10),
          total: _.get(data, 'total', 0),
        }) : false
    });
  }

  // TODO !!! onFilter，onSort是否需要返回数据
  onChange = (pagination, filters, sorter) => {
    let paramsOfFilter, paramsOfSort, paramsOfChange;
    if (Object.keys(filters).length > 0 && this.props.onFilter) {
      paramsOfFilter = this.props.onFilter(filters) || {};
    }
    if (Object.keys(sorter).length > 0 && this.props.onSort) {
      paramsOfSort = this.props.onSort(sorter) || {};
    }
    if (this.props.onChange) {
      paramsOfChange = this.props.onChange(pagination, filters, sorter) || {};
    }
    let page = Object.assign({}, paramsOfChange, paramsOfFilter, paramsOfSort);

    this.setState({
      pagination: { ...this.state.pagination, current: pagination.current, pageSize: pagination.pageSize }
    }, () => {
      this.getData(page)
    });
  }

  getData(otherParams = {}) {
    if (this.props.history.length === 0) {
      return;
    }
    let params = Object.assign({
      current: _.get(this.state, 'pagination.current', 1),
      pageSize: _.get(this.state, 'pagination.pageSize', PAGE_SIZE)
    }, otherParams, _.last(this.props.history), this.props.params);

    params = this.props.onReqHandler(params);
    if (!params) {
      console.error('TableEx: onReqHandler must be return an Object');
      return;
    }
    this.setState({
      loading: true,
    });
    this.props.api(params).then(res => {
      let data = this.props.onResHandler(res, params) || res;
      this.setState({
        loading: false,
        data: data
      });
      this.draw(data);
    }).catch(err => {
      this.setState({
        loading: false,
      });
    });
  }

  render() {
    return (
      <div className={`nasa-grid ${this.props.className}`} style={this.props.style}>
        <Table
          {...this.props}
          onChange={this.onChange}
          loading={this.state.loading}
          pagination={this.state.pagination} 
          dataSource={this.state.dataSource} 
        />
      </div>
    )
  }
}