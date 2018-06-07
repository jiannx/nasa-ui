var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import { Table } from 'antd';
import _ from 'lodash';
import './style.scss';

var PAGE_SIZE = 30;

var Grid = function (_Component) {
  _inherits(Grid, _Component);

  function Grid(props) {
    _classCallCheck(this, Grid);

    var _this = _possibleConstructorReturn(this, (Grid.__proto__ || Object.getPrototypeOf(Grid)).call(this, props));

    _this.onChange = function (pagination, filters, sorter) {
      var _params;

      console.info('Grid onChange: ', { pagination: pagination, filters: filters, sorter: sorter });
      var params = (_params = {}, _defineProperty(_params, _this.props.config.getPage, pagination.current), _defineProperty(_params, _this.props.config.pageSize, pagination.pageSize), _params);
      var paramsOfFilter = void 0,
          paramsOfSort = void 0,
          paramsOfChange = void 0;
      if (Object.keys(filters).length > 0 && _this.props.onFilter) {
        paramsOfFilter = _this.props.onFilter(filters) || {};
      }
      if (Object.keys(sorter).length > 0 && _this.props.onSort) {
        paramsOfSort = _this.props.onSort(sorter) || {};
      }
      if (_this.props.onChange) {
        paramsOfChange = _this.props.onChange(pagination, filters, sorter) || {};
      }
      params = Object.assign(params, paramsOfChange, paramsOfFilter, paramsOfSort);
      if (_this.props.api) {
        _this.getData(params);
      }
    };

    _this.setPage = function (num) {
      var state = _.set(_this.state, 'pagination.current', 1);
      _this.setState(state);
    };

    _this.state = {
      loading: false,
      pagination: props.pagination,
      dataSource: []
    };
    return _this;
  }

  _createClass(Grid, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      // 数据未发生变更时，不做刷新
      if (_.isEqual(this.props.data, nextProps.data) && _.isEqual(this.props.history, nextProps.history)) {
        return;
      }
      setTimeout(function () {
        _this2.componentDidMount(nextProps);
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount(nextProps) {
      if (this.props.api) {
        this.getData();
        return;
      }
      if (_.isEmpty(this.props.data)) {
        return;
      }
      this.draw(this.props.data);
    }
  }, {
    key: 'draw',
    value: function draw(data) {
      var _this3 = this;

      this.setState(function (state) {
        var pagination = false;
        if (_this3.props.pagination) {
          pagination = Object.assign({}, state.pagination, {
            size: _this3.props.size,
            current: data[_this3.props.config.current],
            pageSize: data[_this3.props.config.pageSize],
            total: data[_this3.props.config.total]
          });
        }
        return {
          dataSource: data[_this3.props.config.list],
          pagination: pagination
        };
      });
    }
  }, {
    key: 'getData',
    value: function getData(params) {
      var _ref,
          _this4 = this;

      if (this.props.history.length === 0) {
        return;
      }
      var lastHistory = this.props.history[this.props.history.length - 1];
      params = params || (_ref = {}, _defineProperty(_ref, this.props.config.getPage, _.get(this.state, 'pagination.current', 1)), _defineProperty(_ref, this.props.config.pageSize, _.get(this.state, 'pagination.pageSize', PAGE_SIZE)), _ref);
      this.setState({
        loading: true
      });
      this.props.api(Object.assign({}, lastHistory, params, this.props.params)).then(function (res) {
        if (_this4.props.onResHandler) {
          res = _this4.props.onResHandler(res) || res;
        }
        res[_this4.props.config.list].forEach(function (x, index) {
          x._key = (res[_this4.props.config.current] - 1) * res[_this4.props.config.pageSize] + index;
        });
        _this4.setState({
          loading: false,
          data: res
        });
        _this4.draw(res);
      }).catch(function (err) {
        _this4.setState({
          loading: false
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'nasa-grid ' + this.props.className, style: this.props.style },
        React.createElement(Table, Object.assign({}, this.props, {
          onChange: this.onChange,
          loading: this.state.loading,
          pagination: this.state.pagination,
          dataSource: this.state.dataSource
        }))
      );
    }
  }]);

  return Grid;
}(Component);

Grid.defaultProps = {
  className: '',
  style: {},
  api: null, // 接口，当传入该参数时，请勿传入data。 () => {}
  history: [], // 该字段用于刷新表格数据，当向该字段中插入请求参数时，重新请求刷新表格。api参数必填
  params: {}, // 该参数优先级高于histroy中参数
  data: null, // 包含分页,条目项等所有数据 { data: [], page_now, page_rows, records }
  onChange: function onChange(pagination, filters, sorter) {}, // 页码，条目数，排序，过滤器等变更事件，可返回请求参数
  onSort: function onSort(sorter) {}, // 排序变更事件，可返回请求参数，该参数将合并页码等参数
  onFilter: function onFilter(filters) {}, // 过滤器变更事件，可返回参数，该参数将合并页码等参数
  config: {
    defaultPageSize: 30,
    list: 'list',
    size: 'size',
    current: 'current',
    getPage: 'getPage',
    pageSize: 'pageSize',
    total: 'records'
  },
  onResHandler: function onResHandler(res) {
    return res;
  },
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
    onChange: function onChange() {},
    showSizeChanger: true,
    showQuickJumper: true
  },
  rowSelection: null
};
export default Grid;
//# sourceMappingURL=index.js.map