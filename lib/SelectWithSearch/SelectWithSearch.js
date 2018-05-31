var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * 选择框，下拉包含搜索及确定
 * 
 */
import React, { Component } from 'react';
import _ from 'lodash';
import { Dropdown, Input, Checkbox, Button, Icon } from 'antd';
import './style.scss';

var Search = Input.Search;

var Item = function (_React$PureComponent) {
  _inherits(Item, _React$PureComponent);

  function Item() {
    _classCallCheck(this, Item);

    return _possibleConstructorReturn(this, (Item.__proto__ || Object.getPrototypeOf(Item)).apply(this, arguments));
  }

  _createClass(Item, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return React.createElement(
        'div',
        { className: 'nasa-select-menu-item' },
        React.createElement(
          Checkbox,
          { checked: this.props.checked, onChange: function onChange() {
              return _this2.props.onChange(_this2.props.data);
            } },
          React.createElement(
            'span',
            { title: this.props.data[this.props.optionLabelKey] },
            this.props.data[this.props.optionLabelKey]
          )
        )
      );
    }
  }]);

  return Item;
}(React.PureComponent);

var SelectWithSearch = function (_Component) {
  _inherits(SelectWithSearch, _Component);

  function SelectWithSearch(props) {
    _classCallCheck(this, SelectWithSearch);

    var _this3 = _possibleConstructorReturn(this, (SelectWithSearch.__proto__ || Object.getPrototypeOf(SelectWithSearch)).call(this, props));

    _this3.onSearch = _.debounce(function () {
      _this3.setState({ currentShowIndex: 0 });
      var option = _this3.props.option.filter(function (x) {
        return x[_this3.props.optionLabelKey].match(_this3.state.searchKey);
      });
      _this3.setState({ option: option });
    }, 500);

    _this3.onSearchKeyChange = function (value) {
      _this3.setState({ searchKey: value }, function () {
        _this3.onSearch();
      });
    };

    _this3.onChecked = function (item) {
      var key = item[_this3.props.optionKey];
      var checkedList = _this3.state.checkedList;

      var index = checkedList.findIndex(function (x) {
        return x === key;
      });

      if (index < 0) {
        checkedList.push(key);
      } else {
        checkedList.splice(index, 1);
      }
      _this3.setState({ checkedList: checkedList });
    };

    _this3.onCheckedAll = function () {
      var checkedList = _this3.state.checkedList;

      var currentCheckAll = _this3.state.checkedList.length > 0 && _.isEqual(_this3.state.checkedList, _this3.state.option.map(function (x) {
        return x[_this3.props.optionKey];
      }));
      if (currentCheckAll) {
        checkedList = [];
      } else {
        checkedList = _this3.state.option.map(function (x) {
          return x[_this3.props.optionKey];
        });
      }
      _this3.setState({ checkedList: checkedList });
    };

    _this3.onOk = function () {
      _this3.setCheckStr();
      _this3.props.onChange && _this3.props.onChange(_this3.state.checkedList);
      _this3.setState({ visible: false, currentShowIndex: 0 });
      _this3.onSearchKeyChange('');
    };

    _this3.setCheckStr = function () {
      var checkStr = '';
      var checkedList = _this3.state.checkedList;

      // 全选状态

      if (checkedList.length === _this3.props.option.length) {
        checkedList = [];
        checkStr = _this3.props.checkAllPlaceholder || _this3.props.placeholder;
      }
      // 非全选
      else {
          if (_this3.props.optionKey) {
            var names = [];

            var _loop = function _loop(key) {
              var item = _this3.props.option.find(function (x) {
                return x[_this3.props.optionKey] === key;
              });
              names.push(item[_this3.props.optionLabelKey]);
            };

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = checkedList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var key = _step.value;

                _loop(key);
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }

            checkStr = names.splice(0, 10).join(';');
          } else if (_this3.props.optionLabelKey) {
            var _names = checkedList.map(function (x) {
              return x[_this3.props.optionLabelKey];
            });
            checkStr = _names.splice(0, 10).join(';');
          } else {
            checkStr = checkedList.splice(0, 10).join(';');
          }
        }
      _this3.setState({ checkStr: checkStr });
    };

    _this3.onOptionScroll = function (e) {
      if (e.target.scrollTop + 100 > e.target.scrollTopMax) {
        _this3.setState({ currentShowIndex: _this3.state.currentShowIndex + 1 });
      }
    };

    _this3.state = {
      option: _this3.props.option,
      checkedList: [],
      visible: false,
      searchKey: '',
      checkStr: '',
      currentShowIndex: 0 // 默认显示数量
    };
    _this3.id = 'select-with-search-' + Math.random();
    return _this3;
  }

  _createClass(SelectWithSearch, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this4 = this;

      if (!_.isEqual(this.props.option, nextProps.option)) {
        this.setState({ option: nextProps.option, searchKey: '' });
      }
      if (!_.isEqual(this.props.value, nextProps.value)) {
        this.setState({ value: nextProps.value, checkedList: nextProps.value, searchKey: '' }, function () {
          _this4.setCheckStr();
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      // let currentCheckAll = this.state.checkedList.length > 0 && this.state.checkedList.length === this.state.option.length;
      var currentCheckAll = this.state.checkedList.length > 0 && _.isEqual(this.state.checkedList, this.state.option.map(function (x) {
        return x[_this5.props.optionKey];
      }));

      var overlay = React.createElement(
        'div',
        { className: 'nasa-select-menu' },
        React.createElement(
          'div',
          { className: 'nasa-select-menu-search' },
          React.createElement(Input, {
            placeholder: this.props.placeholder,
            value: this.state.searchKey,
            onChange: function onChange(e) {
              return _this5.onSearchKeyChange(e.target.value);
            },
            style: { width: 240, margin: 10 },
            addonAfter: this.props.searchText
          }),
          this.state.searchKey !== '' && React.createElement(Icon, { type: 'close-circle', className: 'nasa-select-menu-search-clear', onClick: function onClick() {
              return _this5.onSearchKeyChange('');
            } })
        ),
        React.createElement(
          'div',
          { className: 'nasa-select-menu-item check-all' },
          React.createElement(
            Checkbox,
            { checked: currentCheckAll, onChange: this.onCheckedAll },
            '\u5168\u9009\uFF08',
            this.state.checkedList.length,
            '/',
            this.state.option.length,
            '\u9879\uFF09'
          )
        ),
        React.createElement(
          'div',
          { className: 'nasa-select-menu-options', onScroll: this.onOptionScroll },
          this.props.option.length === 0 && React.createElement(
            'div',
            { className: 'nasa-select-menu-item' },
            '\u6682\u65E0\u6570\u636E'
          ),
          this.state.option.length === 0 && this.props.option.length !== 0 && React.createElement(
            'div',
            { className: 'nasa-select-menu-item' },
            this.props.noSearchTip
          ),
          this.state.option.map(function (x, index) {
            return index <= (_this5.state.currentShowIndex + 1) * 100 && React.createElement(Item, {
              key: x[_this5.props.optionKey],
              checked: _this5.state.checkedList.findIndex(function (checked) {
                return x[_this5.props.optionKey] === checked;
              }) >= 0,
              onChange: _this5.onChecked.bind(_this5),
              data: x,
              optionLabelKey: _this5.props.optionLabelKey
            });
          })
        ),
        React.createElement(
          'div',
          { className: 'nasa-select-buttom' },
          React.createElement(
            Button,
            { type: 'primary', onClick: this.onOk },
            '\u786E\u5B9A'
          ),
          '\xA0',
          React.createElement(
            Button,
            { onClick: function onClick() {
                return _this5.setState({ visible: false });
              } },
            '\u53D6\u6D88'
          )
        )
      );
      return React.createElement(
        'div',
        { className: 'nasa-select-with-search ' + this.props.className, style: this.props.style },
        React.createElement('div', { id: this.id }),
        React.createElement(
          Dropdown,
          {
            overlay: overlay,
            trigger: ['click'],
            visible: this.state.visible,
            getPopupContainer: function getPopupContainer() {
              return document.getElementById(_this5.id);
            },
            onVisibleChange: function onVisibleChange(visible) {
              return _this5.setState({ visible: visible });
            }
          },
          React.createElement(
            'div',
            { className: 'nasa-select-selected' },
            React.createElement(
              'span',
              null,
              this.state.checkStr === '' ? this.props.placeholder : this.state.checkStr
            ),
            React.createElement(Icon, { type: 'down', className: this.state.visible ? 'rotate' : null })
          )
        )
      );
    }
  }]);

  return SelectWithSearch;
}(Component);

SelectWithSearch.defaultProps = {
  value: [],
  className: '',
  style: null,
  option: [],
  optionKey: 'value',
  optionLabelKey: 'value',
  onChange: function onChange(selIdList) {},
  placeholder: '全部',
  checkAllPlaceholder: null, // 全选时显示文本 该值为空时使用placeholder
  searchPlaceholder: '请输入',
  searchText: '搜索',
  noSearchTip: '暂无相关信息'
};
export default SelectWithSearch;
//# sourceMappingURL=SelectWithSearch.js.map