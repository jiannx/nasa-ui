import _regeneratorRuntime from 'babel-runtime/regenerator';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import { Spin } from 'antd';
import _ from 'lodash';
import { loadEcharts } from './help.js';
import './style.scss';

function assert(condition, info) {
  if (!condition) {
    throw Error('Echarts Error: ' + info);
  }
}

var Echarts = function (_Component) {
  _inherits(Echarts, _Component);

  function Echarts(props) {
    _classCallCheck(this, Echarts);

    var _this = _possibleConstructorReturn(this, (Echarts.__proto__ || Object.getPrototypeOf(Echarts)).call(this, props));

    _this.resize = function () {
      var chart = _this.state.chart;

      var _document$getElementB = document.getElementById(_this.state.id),
          clientWidth = _document$getElementB.clientWidth,
          clientHeight = _document$getElementB.clientHeight;

      chart.resize({ height: clientHeight, width: clientWidth });
    };

    _this.refresh = function () {
      _this.draw();
    };

    _this.getInstance = function () {
      return _this.state.chart;
    };

    var id = new Date().valueOf();
    _this.state = {
      id: 'nase-chart-' + id + Math.random(),
      chart: null,
      loading: false,
      data: props.data
    };
    return _this;
  }

  _createClass(Echarts, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      // 数据未发生变更时，不做刷新
      if (_.isEqual(this.props.data, nextProps.data) && _.isEqual(this.props.history, nextProps.history) && _.isEqual(this.props.params, nextProps.params)) {
        return;
      }
      setTimeout(function () {
        _this2.entry();
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this3 = this;

      this.entry();
      this.onResize = _.debounce(function () {
        _this3.state.chart && _this3.state.chart.resize();
      }, 500);
      if (this.props.isAutoResize) {
        window.addEventListener('resize', this.onResize);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.state.echarts && this.state.echarts.dispose(this.state.chart);
      window.removeEventListener('resize', this.onResize);
    }
  }, {
    key: 'entry',
    value: function entry() {
      var _this4 = this;

      if (this.props.api) {
        this.request();
      } else {
        this.setState({
          data: this.props.data
        }, function () {
          if (_.isUndefined(_this4.state.data) || _.isNull(_this4.state.data)) {
            return;
          }
          _this4.draw();
        });
      }
    }
  }, {
    key: 'request',
    value: function request() {
      var _this5 = this;

      if (this.props.history.length === 0) {
        return;
      }
      this.setState({ loading: true });
      var params = this.props.history[this.props.history.length - 1];
      this.props.api(Object.assign({}, params || {}, this.props.params)).then(function (res) {
        var data = _this5.props.onResHandler(res);
        _this5.setState({
          data: data,
          loading: false
        }, function () {
          _this5.draw();
        });
      }).catch(function () {
        _this5.setState({ loading: false });
      });
    }
  }, {
    key: 'mergeOptions',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        var option;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                option = null;

                if (!this.props.option) {
                  _context.next = 9;
                  break;
                }

                if (!_.isFunction(this.props.option)) {
                  _context.next = 6;
                  break;
                }

                _context.next = 5;
                return this.props.option(this.state.data);

              case 5:
                option = _context.sent;

              case 6:
                if (_.isPlainObject(this.props.option)) {
                  option = _.merge({}, this.state.data, this.props.option);
                }
                _context.next = 10;
                break;

              case 9:
                option = this.state.data;

              case 10:
                return _context.abrupt('return', option);

              case 11:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function mergeOptions() {
        return _ref.apply(this, arguments);
      }

      return mergeOptions;
    }()
  }, {
    key: 'draw',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
        var chart, echarts, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, name, option;

        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                console.log('Echarts draw');
                // 获取echart实例
                chart = this.state.chart;

                if (chart) {
                  _context2.next = 32;
                  break;
                }

                _context2.next = 5;
                return loadEcharts(this.props.echartsUrl);

              case 5:
                echarts = _context2.sent;

                chart = echarts.init(document.getElementById(this.state.id));
                this.setState({ chart: chart, echarts: echarts });

                if (!this.props.events) {
                  _context2.next = 32;
                  break;
                }

                if (_.isPlainObject(this.props.events)) {
                  _context2.next = 13;
                  break;
                }

                console.log('Echarts props events must be Object');
                _context2.next = 32;
                break;

              case 13:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context2.prev = 16;

                for (_iterator = Object.keys(this.props.events)[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  name = _step.value;

                  chart.on(name, this.props.events[name]);
                }
                _context2.next = 24;
                break;

              case 20:
                _context2.prev = 20;
                _context2.t0 = _context2['catch'](16);
                _didIteratorError = true;
                _iteratorError = _context2.t0;

              case 24:
                _context2.prev = 24;
                _context2.prev = 25;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 27:
                _context2.prev = 27;

                if (!_didIteratorError) {
                  _context2.next = 30;
                  break;
                }

                throw _iteratorError;

              case 30:
                return _context2.finish(27);

              case 31:
                return _context2.finish(24);

              case 32:
                _context2.next = 34;
                return this.mergeOptions();

              case 34:
                option = _context2.sent;

                assert(_.isPlainObject(option), 'option must be Object');
                if (option.type === 'react') {
                  this.setState({
                    component: option.component
                  });
                } else {
                  this.setState({
                    component: null
                  });
                }
                chart.setOption(option, !this.props.optionIsMerge);

              case 38:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[16, 20, 24, 32], [25,, 27, 31]]);
      }));

      function draw() {
        return _ref2.apply(this, arguments);
      }

      return draw;
    }()

    // 调整大小，不重绘


    // 重绘

  }, {
    key: 'render',
    value: function render() {
      var loading = this.state.loading;
      if (this.props.loading === false || this.props.loading === true) {
        loading = this.props.loading;
      }

      return React.createElement(
        'div',
        { className: 'nase-chart ' + this.props.className, style: this.props.style },
        React.createElement(
          Spin,
          { spinning: loading, delay: 0, className: 'spin-loading' },
          React.createElement('div', { id: this.state.id, style: { width: '100%', height: '100%' } }),
          this.state.component && React.createElement(
            'div',
            { style: { width: '100%', height: '100%', position: 'absolute', left: '0', top: '0' } },
            this.state.component
          )
        )
      );
    }
  }]);

  return Echarts;
}(Component);

Echarts.defaultProps = {
  echartsUrl: 'vendor/echarts/echarts.min.js', // echart库文件地址
  className: '',
  style: null,
  api: null, // Api 请求接口
  params: {}, // Object 请求参数，将优先于history。
  history: [], // array[Object] 请求参数，api参数存在时才有效, 变更此数组，强制刷新图表。保存时间等公共参数
  option: function option() {}, // Object|Function 图表配置项，优先级 该参数>type中定义的配置项
  data: null, // Object 数据项或图表配置项
  loading: null, // bool 受控loading状态
  optionIsMerge: false, // setOption时是否合并数据 http://echarts.baidu.com/api.html#echartsInstance.setOption
  onResHandler: function onResHandler(res) {
    return res.data;
  }, // Function 响应后数据格式化，api参数存在时才有效
  isAutoResize: true // 自动调整浏览器大小
};


export default Echarts;
//# sourceMappingURL=index.js.map