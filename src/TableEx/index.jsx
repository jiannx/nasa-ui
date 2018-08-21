import React, { Component } from 'react';
import { Table } from 'antd';
import _ from 'lodash';
import './style.scss';
import Fetch from '../Fetch';

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
      historyOfFetch: [],
      history: props.history,
      loading: false,
      dataSource: [],
      pagination: Object.assign({}, PAGINATION, props.pagination || {}),
      filters: null,
      sorter: null,
    };
  }

  static defaultProps = {
    className: '',
    style: {},
    data: null, // 包含分页,条目项等所有数据 {list: [], pageSize: 30, current: 1, total: 100}
    api: null, // 接口，当传入该参数时，请勿传入data。 () => {}
    history: [], // 该字段用于刷新表格数据，当向该字段中插入请求参数时，重新请求刷新表格。api参数必填
    params: {}, // 该参数优先级高于histroy中参数
    onChange: ({ pagination, filters, sorter }) => null, // 排序，过滤器等变更事件，如果返回请求参数，则以此请求参数进行获取数据

    // 此参数用于控制页面
    currentPage: null, // 受控当前页码
    onCurrentPageChange: null, // 当前页码变更

    // defaultProps 和组件中props将区分使用
    onRequest: (params) => null, // 请求参数{current, pageSize}针对业务进行格式化
    onResponse: (res, reqParams) => null, // 响应数据格式化为组件需要的格式{list: [], pageSize: 30, current: 1, total: 100}

    // 以下参数参照 ant table
    columns: [],
    pagination: {},
  }

  componentWillReceiveProps(nextProps) {
    // ！！！所有刷新入口都为 this.onChange
    // 存在外部history与当前组件内history不一致的问题
    if (nextProps.history && !_.isEqual(this.props.history, nextProps.history)) {
      this.setState({ history: nextProps.history }, () => {
        this.onChange();
      });
      return;
    }
    // 数据未发生变更时，不做刷新
    if (nextProps.data && !_.isEqual(this.props.data, nextProps.data)) {
      this.setData(nextProps.data);
      return;
    }

    // 页码变更处理
    if (_.isNumber(this.props.currentPage) && !_.isEqual(this.props.currentPage, nextProps.currentPage)) {
      this.setState({
        pagination: { ...this.state.pagination, current: nextProps.currentPage }
      }, () => {
        this.onChange();
      });
      return;
    }
  }

  componentDidMount() {
    if (this.props.data) {
      this.setData(this.props.data);
      return;
    }
    if (this.state.history && _.isArray(this.state.history) && this.state.history.length > 0) {
      this.onChange();
    }
  }

  // 刷新，请求参数处理
  refresh = (params = {}, isMergeLast = true) => {
    params = params || {
      current: _.get(this.state, 'pagination.current', 1),
      pageSize: _.get(this.state, 'pagination.pageSize', this.state.pagination.defaultPageSize),
    };

    if (isMergeLast) {
      params = Object.assign(params, _.last(this.state.history));
    }

    this.setState({ historyOfFetch: this.state.historyOfFetch.concat([params]) });
  }

  // TODO 如何真正判定是分页请求
  isPageChange = (pagination, filters, sorter) => {
    return !_.isEqual(pagination.current, this.state.pagination.current);
  }

  onChange = (pagination, filters, sorter) => {
    console.log('TableEx onChange');
    pagination = pagination || this.state.pagination;
    filters = filters || this.state.filters;
    if (filters) {
      filters = Object.keys(filters).length > 0 ? filters : null;
    } else {
      filters = this.state.filters;
    }
    // 精简sorter参数
    if (sorter) {
      sorter = Object.keys(sorter).length > 0 ? { columnKey: sorter.columnKey, field: sorter.field, order: sorter.order } : null;
    } else {
      sorter = this.state.sorter;
    }

    // 非请求类型组件，则直接触发外部事件
    if (!this.props.api) {
      let params = {
        current: pagination.current,
        pageSize: pagination.pageSize || pagination.defaultPageSize,
        filters,
        sorter
      };
      this.props.onChange && this.props.onChange(params);
      return;
    }
    // 分页受控且分页变更事件，触发外部 onCurrentPageChange
    if (_.isNumber(this.props.currentPage) && this.isPageChange(pagination, filters, sorter)) {
      this.props.onCurrentPageChange && this.props.onCurrentPageChange(pagination.current);
      return;
    }

    this.setState({ pagination, filters, sorter }, () => {
      let params = {
        current: pagination.current,
        pageSize: pagination.pageSize || pagination.defaultPageSize,
        filters,
        sorter
      };
      let paramOfChange = this.props.onChange(params);
      // 如果onChange返回数据，则以此数据作为onRequest参数；以{current,pageSize,filters,sorter}作为参数
      this.refresh(paramOfChange || params);
    });
  }

  getData = () => {
    return this.state.data;
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

  onFetchRequest = (params) => {
    // onRequest返回对象，则忽略defaultProps.onRequest，将返回对象作为请求参数
    // onRequest未返回对象，则按默认流程，传入defaultProps.onRequest
    let selfParams = this.props.onRequest(params);
    if (selfParams) {
      return selfParams;
    }
    return TableEx.defaultProps.onRequest(params);
  }

  onFetchResponse = (res, requestParams) => {
    // onResponse返回对象，则忽略defaultProps.onResponse，将返回对象作为表格的完整数据
    // onResponse未返回对象，则按默认流程，将接口响应数据作为defaultProps.onResponse的参数
    let selfRes = this.props.onResponse(res, requestParams);
    if (selfRes) {
      this.setData(selfRes);
      return;
    }
    res = TableEx.defaultProps.onResponse(res, requestParams);
    this.setData(res);
  }

  render() {
    return (
      <div className={`nasa-grid ${this.props.className}`} style={this.props.style}>
        <Fetch 
          api={this.props.api}
          history={this.state.historyOfFetch}
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