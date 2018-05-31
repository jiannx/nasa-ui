var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * 支持对象绑定
 */
import React, { Component } from 'react';
import _ from 'lodash';
import { Select } from 'antd';
var Option = Select.Option;

var SelectEx = function (_Component) {
  _inherits(SelectEx, _Component);

  function SelectEx(props) {
    _classCallCheck(this, SelectEx);

    var _this = _possibleConstructorReturn(this, (SelectEx.__proto__ || Object.getPrototypeOf(SelectEx)).call(this, props));

    _initialiseProps.call(_this);

    var label = _this.getShowValue(props.value, props);
    _this.state = {
      value: label
    };
    return _this;
  }

  _createClass(SelectEx, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.value) {
        var label = this.getShowValue(nextProps.value, nextProps);
        this.setState({
          value: label
        });
      } else {
        this.state = {
          value: null
        };
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      // console.log('selectex');
      // console.log(this.state.value);
      return React.createElement(
        Select,
        Object.assign({}, this.props, { onChange: this.onChange, value: this.state.value }),
        this.props.options.map(function (x) {
          if (_this2.props.bind) {
            return React.createElement(
              Option,
              { key: x[_this2.props.bind], value: x[_this2.props.bind] },
              x[_this2.props.label]
            );
          } else if (_this2.props.label) {
            return React.createElement(
              Option,
              { key: x[_this2.props.label] },
              x[_this2.props.label]
            );
          } else {
            return React.createElement(
              Option,
              { key: x },
              x
            );
          }
        }),
        this.props.addonAfter
      );
    }
  }]);

  return SelectEx;
}(Component);

SelectEx.defaultProps = {
  options: [],
  bind: null, //  用于绑定的字段, 如果为空，则返回选中的对象
  label: null, // 用于显示的字段 必须唯一
  addonAfter: null
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.getShowValue = function (value, props) {
    if (value === null || value === undefined) {
      return undefined;
    }
    var item = null;
    var label = ' ';
    if (props.bind) {
      item = props.options.find(function (x) {
        return x[props.bind] === value || x[props.bind] === parseInt(value, 10);
      });
      label = item ? item[props.label] : null;
    } else if (props.label) {
      item = props.options.find(function (x) {
        return x[props.label] === value[props.label];
      });
      label = item ? item[props.label] : null;
    } else {
      item = props.options.find(function (x) {
        return x === value;
      });
      label = item;
    }
    return label;
  };

  this.setLabel = function (value) {
    var label = _this3.getShowValue(value, _this3.props);
    _this3.setState({
      value: label
    });
  };

  this.onChange = function (value) {
    console.log('SelectEx select value = ' + value);

    var item = null;
    if (_this3.props.bind) {
      item = _this3.props.options.find(function (x) {
        return x[_this3.props.bind] === value || x[_this3.props.bind] === parseInt(value, 10);
      });
    } else if (_this3.props.label) {
      item = _this3.props.options.find(function (x) {
        return x[_this3.props.label] === value || x[_this3.props.label] === parseInt(value, 10);
      });
    } else {
      item = _this3.props.options.find(function (x) {
        return x === value || x === parseInt(value, 10);
      });
    }

    if (_this3.props.bind) {
      _this3.setLabel(item[_this3.props.bind] || value);
    } else {
      _this3.setLabel(item || value);
    }
    if (_this3.props.onChange) {
      if (_this3.props.bind) {
        _this3.props.onChange(item[_this3.props.bind] || value);
      } else {
        _this3.props.onChange(item || value);
      }
    }
  };
};

export default SelectEx;


SelectEx.OptionEx = Option;
//# sourceMappingURL=SelectEx.js.map