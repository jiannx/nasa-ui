var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 动态详情显示
// 动态表单 完善
// 上面两项组合
/**
<DynamicView
  className=""
  style=""
  align: 'left', // 对齐方式 String or Number，默认值:left。left:左对齐；number：数值，则该值为标题所占的百分比宽度，并进行以冒号为中心对齐
  values={this.state.values} // 完整数据 Object
  rowProps={{gutter: 16}} // Row 的 props
  colProps={{span: 8}} // Col 的props
  item={[
    { 
      type, // 字段类型 String = 'string'||'boolen'||'array'||'object'||'br'
      title, // 标题 String 如果标题为空，则不显示标题
      dataIndex, // 绑定字段的key String
      render, // 处理函数 (value) => '显示的内容'
      span, // Col的span参数
      defaultValue: '', // 未获取到数据情况
      children: []
    }
  ]}
>
**/

import React, { Component } from 'react';
import { Icon, Button, Row, Col, Select, Radio, Tooltip, Input } from 'antd';
import _ from 'lodash';
import { FormEx } from 'src/components';
import './style.scss';

var defultItem = {
  type: 'string',
  title: '',
  dataIndex: '',
  render: null,
  span: null,
  children: null,
  defaultValue: '',
  visiable: true // 是否可见
};

function ViewString(_ref) {
  var value = _ref.value;

  return React.createElement(
    'span',
    null,
    value
  );
}

function ViewBoolen(_ref2) {
  var value = _ref2.value;

  if (value === true) return React.createElement(
    'span',
    null,
    '\u662F'
  );
  if (value === false) return React.createElement(
    'span',
    null,
    '\u5426'
  );
  return null;
}

function ViewArray(props) {}

function ViewObject(props) {}

function ViewBr(props) {
  return React.createElement('div', { className: 'clear' });
}

function OneOf(props) {}

function ViewNode(_ref3) {
  var item = _ref3.item,
      align = _ref3.align;

  if (item.type === 'br') {
    return React.createElement(ViewBr, null);
  }
  // 在标题不存在的情况下，添加值偏移样式，使其与上一行标签对齐
  var valueClassName = ['dynamic-view-value'];
  if (!item.title) {
    valueClassName.push('dynamic-view-value-offset');
  }
  if (item.title) {
    item.title += ': ';
  }
  return React.createElement(
    Col,
    Object.assign({ className: 'dynamic-view-col' }, item.colProps),
    React.createElement(
      'span',
      { className: 'dynamic-view-title', style: item.titleStyle },
      item.title
    ),
    React.createElement(
      'span',
      { className: valueClassName.join(' ') },
      item.type === 'string' && React.createElement(ViewString, item),
      item.type === 'boolen' && React.createElement(ViewBoolen, item)
    )
  );
}

var DynamicView = function (_Component) {
  _inherits(DynamicView, _Component);

  function DynamicView() {
    var _ref4;

    var _temp, _this, _ret;

    _classCallCheck(this, DynamicView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref4 = DynamicView.__proto__ || Object.getPrototypeOf(DynamicView)).call.apply(_ref4, [this].concat(args))), _this), _this.get = function (id, defaultValue) {
      return _.get(_this.props.values, id, defaultValue);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(DynamicView, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var items = [];
      var spanSum = 0;

      this.props.items.forEach(function (item) {
        item = Object.assign({}, defultItem, item);
        if (item.visiable === false) {
          return;
        }
        var value = _this2.get(item.dataIndex, item.defaultValue);
        var props = _extends({}, item, {
          colProps: item.span ? Object.assign({}, _this2.props.colProps, { span: item.span }) : _this2.props.colProps,
          value: item.render ? item.render(value) : value,
          titleStyle: _.isNumber(_this2.props.align) ? { width: _this2.props.align * 100 + '%' } : null
        });
        if (item.type === 'br') {
          items.push(React.createElement(ViewBr, null));
          spanSum = 0;
          return;
        }
        items.push(React.createElement(ViewNode, { item: props, align: _this2.props.align }));

        // 加上当前节点超出一行，在当前节点之前插入换行使其对齐
        spanSum += props.colProps.span;
        if (spanSum > 24) {
          items.splice(items.length - 1, 0, React.createElement(ViewBr, null));
          spanSum = props.colProps.span;
        }
      });

      // 添加冒号对齐样式
      var className = ['nasa-dynamic-view', this.props.className];
      if (_.isNumber(this.props.align)) {
        className.push('nasa-dynamic-view-align-colon');
      }
      if (this.props.size === 'samll') {
        className.push('nasa-dynamic-view-small');
      }

      var paddingSide = 0;
      // 移除row的margin负值
      if (this.props.rowProps && this.props.rowProps.gutter) {
        paddingSide = this.props.rowProps.gutter / 2;
      }

      return React.createElement(
        'div',
        { style: { padding: '0 ' + paddingSide + 'px' } },
        React.createElement(
          Row,
          Object.assign({}, this.props.rowProps, { style: this.props.style, className: className.join(' ') }),
          React.Children.toArray(items)
        )
      );
    }
  }]);

  return DynamicView;
}(Component);

DynamicView.defaultProps = {
  className: '',
  style: null,
  align: 'left',
  values: {},
  items: [],
  rowProps: {},
  colProps: {
    span: 8
  },
  item: []
};
export default DynamicView;
//# sourceMappingURL=DynamicView.js.map