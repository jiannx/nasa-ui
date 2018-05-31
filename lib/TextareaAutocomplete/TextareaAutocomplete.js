var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
自定义输入 + 可选项 默认最小高度100px
支持选择输入及自定义输入
返回数组
*/
import React, { Component } from 'react';
import { Input, AutoComplete, Select } from 'antd';
import _ from 'lodash';

import './TextareaAutocomplete.scss';

var TextArea = Input.TextArea;

var Option = Select.Option;

var TextareaAutocomplete = function (_Component) {
  _inherits(TextareaAutocomplete, _Component);

  function TextareaAutocomplete(props) {
    _classCallCheck(this, TextareaAutocomplete);

    var _this = _possibleConstructorReturn(this, (TextareaAutocomplete.__proto__ || Object.getPrototypeOf(TextareaAutocomplete)).call(this, props));

    _this.handleSearch = function (value) {
      if (value === '') {
        _this.setState({
          dataSource: _this.props.dataSource
        });
      } else {
        _this.setState({
          dataSource: [value].concat(_this.props.dataSource)
        });
      }
    };

    _this.handleChange = function (list) {
      // console.log(list);
      _this.props.onChange(list);
    };

    _this.state = {
      dataSource: props.dataSource
    };
    return _this;
  }

  _createClass(TextareaAutocomplete, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      // 数据未发生变更时，不做刷新
      if (_.isEqual(this.state.dataSource, nextProps.dataSource)) {
        return;
      }
      this.setState({
        dataSource: this.props.dataSource
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var className = 'nasa-textarea-auto ' + this.props.className + ' ' + this.props.size;

      return React.createElement(
        'div',
        { className: className, style: this.props.style },
        React.createElement(
          Select,
          {
            mode: 'multiple'
            // style={{minHeight: '80px'}}
            // size={this.props.size}
            , placeholder: this.props.placeholder,
            onChange: this.handleChange,
            onSearch: this.handleSearch
          },
          this.state.dataSource.map(function (x, i) {
            return React.createElement(
              Option,
              { key: x + i },
              x
            );
          })
        )
      );
    }
  }]);

  return TextareaAutocomplete;
}(Component);

TextareaAutocomplete.defaultProps = {
  style: null,
  className: '',
  size: 'default', // default small large
  placeholder: '',
  dataSource: [],
  onChange: function onChange() {}
};
export default TextareaAutocomplete;
//# sourceMappingURL=TextareaAutocomplete.js.map