/*
调用方式1
<Grid api={this.getList} params={this.gridParams} history={this.history} columns={} />
手动刷新表格: this.history.push(new Date());

调用方式2 redux:
<Grid data={} onChange={} columns={} />
当页码，排序项，筛选器变更时将出发onChange函数 参数={page, pageSize}

最终请求参数
Object.assign({page, page_size, sort}, props.history[length-1], props.params)
*/
import React, { Component } from 'react';
import { Table } from 'antd';
import _ from 'lodash';
import { gridConfig } from '../config.js';
import './Grid.scss';

const PAGE_SIZE = gridConfig.defaultPageSize;
const KEYS = gridConfig;

export default class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pagination: props.pagination,
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

    // 以下参数参照 ant table
    columns: [],
    rowKey: '_key',
    dataSource: [], // 只有列表数据,在data中传入
    size: 'middle',
    loading: false,
    scroll: {},
    pagination: {
      defaultPageSize: PAGE_SIZE,
      defaultCurrent: 1,
      current: 1,
      onChange: () => {},
      showSizeChanger: true,
      showQuickJumper: true,
    },
    rowSelection: null
  }

  componentWillReceiveProps(nextProps) {
    // 数据未发生变更时，不做刷新
    if (_.isEqual(this.props.data, nextProps.data) &&
      _.isEqual(this.props.history, nextProps.history)) {
      return;
    }
    setTimeout(() => {
      this.componentDidMount(nextProps);
    });
  }

  componentDidMount(nextProps) {
    if (this.props.api) {
      this.getData();
      return;
    }
    if (_.isEmpty(this.props.data)) {
      return;
    }
    this.draw(this.props.data);
  }

  draw(data) {
    this.setState(state => {
      let pagination = false;
      if (this.props.pagination) {
        pagination = Object.assign({}, state.pagination, {
          size: this.props.size,
          current: data[KEYS.current],
          pageSize: data[KEYS.pageSize],
          total: data[KEYS.total],
        });
      }
      return {
        dataSource: data[KEYS.list],
        pagination
      }
    });
  }

  onChange = (pagination, filters, sorter) => {
    console.info('Grid onChange: ', { pagination, filters, sorter });
    let params = {
      [KEYS.getPage]: pagination.current,
      [KEYS.pageSize]: pagination.pageSize
    };
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
    params = Object.assign(params, paramsOfChange, paramsOfFilter, paramsOfSort);
    if (this.props.api) {
      this.getData(params);
    }
  }

  setPage = (num) => {
    let state = _.set(this.state, 'pagination.current', 1);
    this.setState(state);
  }

  getData(params) {
    if (this.props.history.length === 0) {
      return;
    }
    let lastHistory = this.props.history[this.props.history.length - 1];
    params = params || {
      [KEYS.getPage]: _.get(this.state, 'pagination.current', 1),
      [KEYS.pageSize]: _.get(this.state, 'pagination.pageSize', PAGE_SIZE)
    };
    this.setState({
      loading: true,
    });
    this.props.api(Object.assign({}, lastHistory, params, this.props.params)).then(res => {
      if (this.props.onResHandler) {
        res = this.props.onResHandler(res) || res;
      }
      res.data[KEYS.list].forEach((x, index) => {
        x._key = (res.data[KEYS.current] - 1) * res.data[KEYS.pageSize] + index;
      });
      this.setState({
        loading: false,
        data: res.data
      });
      this.draw(res.data);
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