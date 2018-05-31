var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* 时间跨度选择控件，在antd RangePicker基础上添加 可选时间跨度功能

<RangePickerEx range={3}/>
<RangePickerEx 
  range={[1, 5]}  
  disabledDate={(endValue) => {
    return endValue.valueOf() >= moment().valueOf();
}}/>
 */

import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { DatePicker } from 'antd';

var RangePicker = DatePicker.RangePicker;

var RangePickerEx = function (_Component) {
  _inherits(RangePickerEx, _Component);

  function RangePickerEx(props) {
    _classCallCheck(this, RangePickerEx);

    var _this = _possibleConstructorReturn(this, (RangePickerEx.__proto__ || Object.getPrototypeOf(RangePickerEx)).call(this, props));

    _this.setDisabledDate = function (node) {
      if (node.className.match(/disabled/)) {
        return;
      }
      var range = [];
      if (_.isArray(_this.props.range)) {
        range = _this.props.range;
      } else {
        range = [_this.props.range, _this.props.range];
      }

      var str = node.title;
      str = str.replace(/年|月/g, '-');
      str = str.replace(/日/g, '');
      var end = moment(str).add(range[1] + 1, 'days');
      var start = moment(str).subtract(range[0], 'days');

      _this.setState({
        disabledDate: function disabledDate(endValue) {
          var res = endValue.valueOf() >= end.valueOf() || endValue.valueOf() <= start.valueOf();
          if (_this.props.disabledDate) {
            return res || _this.props.disabledDate(endValue);
          }
          return res;
        }
      });
    };

    _this.handleClick = function (e) {
      if (!_this.props.range || _this.props.range === '') {
        console.info('RangePicker Ex: range must be number or array');
        return;
      }
      if (e.target && e.target.className.match(/ant-calendar-cell/)) {
        _this.setDisabledDate(e.target);
      } else if (e.target.parentNode && e.target.parentNode.className.match(/ant-calendar-cell/)) {
        _this.setDisabledDate(e.target.parentNode);
      }
    };

    _this.onOpenChange = function (status) {
      _this.setState({
        disabledDate: _this.props.disabledDate
      });
      _this.props.onOpenChange && _this.props.onOpenChange(status);
    };

    _this.state = {
      disabledDate: props.disabledDate
    };
    return _this;
  }

  _createClass(RangePickerEx, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {}
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.id = 'nasa-rangepicker-' + Math.random();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {}
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return React.createElement(
        'span',
        { id: this.id, onClick: this.handleClick, style: this.props.style, className: this.props.className },
        React.createElement(RangePicker, Object.assign({}, this.props, {
          onOpenChange: this.onOpenChange,
          getCalendarContainer: function getCalendarContainer() {
            return document.getElementById(_this2.id);
          },
          disabledDate: this.state.disabledDate
        }))
      );
    }
  }]);

  return RangePickerEx;
}(Component);

RangePickerEx.defaultProps = {
  disabledDate: null,
  range: null // 时间跨度 默认天 number or array
};


export default RangePickerEx;
//# sourceMappingURL=RangePickerEx.js.map