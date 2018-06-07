var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import { Table } from 'antd';
import _ from 'lodash';
import './style.scss';
import Fetch from '../Fetch';

var PAGINATION = {
  defaultPageSize: 20, // 默认页码
  defaultCurrent: 1, // 默认页
  current: 1,
  showSizeChanger: true,
  showQuickJumper: true
};

var TableEx = function (_Component) {
  _inherits(TableEx, _Component);

  function TableEx(props) {
    _classCallCheck(this, TableEx);

    var _this = _possibleConstructorReturn(this, (TableEx.__proto__ || Object.getPrototypeOf(TableEx)).call(this, props));

    _this.refresh = function () {
      var newParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var isMergeLast = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var params = newParams;
      if (isMergeLast) {
        params = Object.assign({}, _.last(_this.state.history), params);
      }
      _this.setState({ history: _this.state.history.concat([params]) });
    };

    _this.onChange = function (pagination, filters, sorter) {
      // 分页状态未变更，则为过滤条件变更
      if (_.isEqual(pagination, _this.state.pagination)) {
        var filterParam = _this.props.onChange(pagination, filters, sorter);
        if (!filterParam) {
          _this.refresh({
            filters: filters,
            sorter: { columnKey: sorter.columnKey, field: sorter.field, order: sorter.order }
          });
        }
      }
      // 分页请求
      else {
          // 受控页码处理, 页码不做变更，由外部控制，内部自动调整pageSize
          if (_.isNumber(_this.props.currentPage)) {
            if (_this.state.pagination.pageSize !== pagination.pageSize) {
              var newPagination = _extends({}, _this.state.pagination);
              newPagination.pageSize = pagination.pageSize;
              _this.setState({ pagination: newPagination }, _this.refresh);
            } else {
              _this.props.onCurrentPageChange && _this.props.onCurrentPageChange(pagination.current);
            }
          }
          // 非受控页码自动跳转
          else {
              _this.setState({ pagination: pagination }, _this.refresh);
            }
        }
    };

    _this.setData = function (data) {
      var dataSource = _.get(data, 'list', []);
      if (!_.isArray(dataSource)) {
        console.error('TableEx: data.list must be an Array');
        return;
      }
      _this.setState({
        pagination: Object.assign({}, _this.state.pagination, {
          current: _.get(data, 'current', 1),
          pageSize: _.get(data, 'pageSize', _this.state.pagination.defaultPageSize),
          total: _.get(data, 'total', 0)
        }),
        dataSource: dataSource
      });
    };

    _this.onFetchResponse = function (res, requestParams) {
      res = _this.props.onResponse(res, requestParams) || res;
      _this.setData(res);
    };

    _this.onFetchRequest = function (params) {
      params = Object.assign({
        pageSize: _.get(_this.state, 'pagination.pageSize', _this.state.pagination.defaultPageSize),
        current: _this.props.currentPage ? _this.props.currentPage : _.get(_this.state, 'pagination.current', 1)
      }, params);
      params = _this.props.onRequest(params) || params;
      return params;
    };

    _this.state = {
      history: props.history,
      loading: false,
      pagination: Object.assign({}, PAGINATION, props.pagination || {}),
      dataSource: []
    };
    return _this;
  }

  _createClass(TableEx, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      // 存在外部history与当前组件内history不一致的问题
      if (nextProps.history && !_.isEqual(this.props.history, nextProps.history)) {
        this.setState({ history: nextProps.history }); // 将直接替换掉内部history
      }
      // 数据未发生变更时，不做刷新
      if (nextProps.data && !_.isEqual(this.props.data, nextProps.data)) {
        this.setData(nextProps.data);
        return;
      }
      // 页码变更处理
      else if (_.isNumber(this.props.currentPage) && !_.isEqual(this.props.currentPage, nextProps.currentPage)) {
          setTimeout(function () {
            _this2.refresh({ current: nextProps.currentPage });
          });
          return;
        }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.data) {
        this.setData(this.props.data);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return React.createElement(
        'div',
        { className: 'nasa-grid ' + this.props.className, style: this.props.style },
        React.createElement(Fetch, {
          api: this.props.api,
          history: this.state.history,
          params: this.props.params,
          onRequest: this.onFetchRequest,
          onResponse: this.onFetchResponse,
          onLoadingChange: function onLoadingChange(loading) {
            return _this3.setState({ loading: loading });
          }
        }),
        React.createElement(Table, Object.assign({}, this.props, {
          onChange: this.onChange,
          loading: this.state.loading,
          pagination: this.props.pagination === false ? false : this.state.pagination,
          dataSource: this.state.dataSource
        }))
      );
    }
  }]);

  return TableEx;
}(Component);

TableEx.defaultProps = {
  className: '',
  style: {},
  data: null, // 包含分页,条目项等所有数据 {list: [], pageSize: 30, current: 1, total: 100}
  api: null, // 接口，当传入该参数时，请勿传入data。 () => {}
  history: [], // 该字段用于刷新表格数据，当向该字段中插入请求参数时，重新请求刷新表格。api参数必填
  params: {}, // 该参数优先级高于histroy中参数
  onChange: function onChange(pagination, filters, sorter) {
    return null;
  }, // 页码，条目数，排序，过滤器等变更事件，可返回请求参数

  currentPage: null, // 受控当前页码
  onCurrentPageChange: function onCurrentPageChange(num) {}, // 当前页码变更

  onRequest: function onRequest(params) {
    return params;
  }, // 请求参数{current, pageSize}针对业务进行格式化
  onResponse: function onResponse(res, reqParams) {
    return res;
  }, // 响应数据格式化为组件需要的格式{list: [], pageSize: 30, current: 1, total: 100}

  // 以下参数参照 ant table
  columns: [],
  pagination: PAGINATION
};
export default TableEx;
//# sourceMappingURL=index.js.map