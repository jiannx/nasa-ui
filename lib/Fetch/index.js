var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * 数据获取组件
 */
import React, { Component } from 'react';
import _ from 'lodash';

var requesting = {};

var Fetch = function (_Component) {
  _inherits(Fetch, _Component);

  function Fetch(props) {
    _classCallCheck(this, Fetch);

    var _this = _possibleConstructorReturn(this, (Fetch.__proto__ || Object.getPrototypeOf(Fetch)).call(this, props));

    _this.getCache = function () {
      var key = _this.getActuallyCacheKey();
      var value = window.sessionStorage.getItem(key);
      if (!value) {
        return null;
      }
      return JSON.parse(window.sessionStorage.getItem(key) || '{}');
    };

    _this.setCache = function (value) {
      var key = _this.getActuallyCacheKey();
      window.sessionStorage.setItem(_this.getActuallyCacheKey(key), JSON.stringify(value));
    };

    _this.getActuallyCacheKey = function () {
      return JSON.stringify(_this.props.cacheKey) + '-' + JSON.stringify(_.last(_this.props.history)) + '-' + JSON.stringify(_this.props.params);
    };

    _this.requestSuccCallback = function (res, requestParams) {
      var response = _this.props.onResponse(res, requestParams);
      if (_this.props.cacheKey) {
        _this.setCache(response);
      }
      _this.setState({
        loading: false,
        response: response
      });
      _this.props.onLoadingChange && _this.props.onLoadingChange(false);
    };

    _this.requestErrCallback = function (res, requestParams) {
      _this.setState({ loading: false });
      _this.props.onLoadingChange && _this.props.onLoadingChange(false);
    };

    _this.request = function () {
      _this.setState({ loading: true });
      _this.props.onLoadingChange && _this.props.onLoadingChange(true);

      // 判定队列中是否有相同请求，如果开启缓存且队列中已存在，则不在请求
      var key = new Date().getTime();
      if (_this.props.cacheKey) {
        key = _this.getActuallyCacheKey();
      }
      if (!requesting[key]) {
        requesting[key] = [];
        var params = Object.assign({}, _.last(_this.props.history), _this.props.params);
        params = _this.props.onRequest(params) || params;
        _this.props.api(params).then(function (res) {
          requesting[key].forEach(function (item) {
            return item.success(res, params);
          });
          delete requesting[key];
        }).catch(function (res) {
          requesting[key].forEach(function (item) {
            return item.error(res, params);
          });
          delete requesting[key];
        });
      }
      requesting[key].push({ success: _this.requestSuccCallback, error: _this.requestErrCallback });
    };

    _this.getData = function () {
      if (!_this.props.api || !_.isArray(_this.props.history) || _this.props.history.length === 0) {
        return;
      }
      if (_this.props.cacheKey) {
        var response = _this.getCache();
        if (response) {
          _this.setState({ response: response });
          return;
        }
      }
      _this.request();
    };

    _this.state = {
      loading: false,
      response: {}
    };
    return _this;
  }

  _createClass(Fetch, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (!_.isEqual(this.props.history, nextProps.history)) {
        console.log(nextProps.history);
        setTimeout(this.getData);
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getData();
      this.props.onLoadingChange && this.props.onLoadingChange(false);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {}

    /**
     * 生成key
     * @return {[type]} [description]
     */

  }, {
    key: 'render',
    value: function render() {
      if (!this.props.component) {
        return null;
      }
      var props = _extends({ loading: this.state.loading }, this.state.response);
      return React.cloneElement(this.props.component, props);
    }
  }]);

  return Fetch;
}(Component);

Fetch.defaultProps = {
  api: null,
  history: [],
  params: null,
  cacheKey: null, // 定义该字段时，将在本地进行缓存，当history中最后一个对象+params+cacheKey这几个都未变更时，接口不发起
  onRequest: function onRequest(params) {
    return params;
  },
  onResponse: function onResponse(res) {
    return { data: res };
  },
  component: null, // 子元素组件
  onLoadingChange: null // 状态变更事件
};
export default Fetch;
//# sourceMappingURL=index.js.map