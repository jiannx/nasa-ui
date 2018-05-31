var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import { Form, Row, Col, Button, Icon, Checkbox, Input, Select } from 'antd';
import _ from 'lodash';
import Schema from 'async-validator';
import './form.scss';

var FormItem = Form.Item;
var TextArea = Input.TextArea;
Checkbox._name = 'Checkbox';
Input._name = 'Input';
Select._name = 'Select';
TextArea._name = 'TextArea';

var FormEx = function (_Component) {
  _inherits(FormEx, _Component);

  function FormEx(props) {
    _classCallCheck(this, FormEx);

    var _this = _possibleConstructorReturn(this, (FormEx.__proto__ || Object.getPrototypeOf(FormEx)).call(this, props));

    _this.onFormValidate = function (cb) {
      var results = [];
      var count = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _this.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var x = _step.value;

          if (x.onValidate) {
            count = count + 1;
          }
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

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _this.items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _x = _step2.value;

          if (_x.onValidate) {
            _x.onValidate(undefined, function (res) {
              results.push(res);
              if (results.length === count && results.every(function (x) {
                return x.status === 'success';
              })) {
                _this.props.onSubmit(_this.props.values, cb);
              }
            });
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    };

    _this.onChange = function (values, key, value) {
      // 合并数据
      if (!values && key) {
        values = _.cloneDeep(_this.props.values);
        _.set(values, key, value);
      }
      _this.props.onChange(values, key, value);
    };

    _this.deepClone = function (doms) {
      var cloneElements = [];
      React.Children.toArray(doms).forEach(function (element, index) {
        var childProps = {};
        // 纯文字组件处理
        if (!_.isObject(element)) {
          cloneElements.push(element);
        }
        // submit 按钮处理 数据校验
        else if (element.props && element.props.htmlType === 'submit') {
            childProps = {
              onClick: function onClick(e) {
                e.preventDefault();
                _this.onFormValidate();
              }
            };
            cloneElements.push(React.cloneElement(element, childProps));
          }
          // 表单控件处理
          else if (element.type._name === FormExItem._name && element.props.bind) {
              // 初始化数据提取，之后统一设置（单独设置无法实现）
              _this.defaultValues.push({ bind: element.props.bind, defaultValue: element.props.defaultValue });
              childProps = {
                value: _.get(_this.props.values, element.props.bind),
                ruleOfForm: _this.props.rules[element.props.bind],
                ref: function ref(item) {
                  if (item) _this.items.push(item);
                },
                items: _this.items,
                values: _this.props.values,
                rules: _this.props.rules,
                emitChangeToParent: _this.onChange,
                getValues: function getValues() {
                  return _this.props.values;
                },
                defaultValue: element.props.defaultValue
              };
              cloneElements.push(React.cloneElement(element, childProps));
            }
            // 数组 表单控件处理
            else if (element.type._name === FormExItemArray._name && element.props.bind) {
                // 初始化数据提取，之后统一设置（单独设置无法实现）
                _this.defaultValues.push({ bind: element.props.bind, defaultValue: element.props.defaultValue });
                childProps = {
                  value: _.get(_this.props.values, element.props.bind),
                  ruleOfForm: _this.props.rules[element.props.bind],
                  items: _this.items,
                  defaultValues: _this.defaultValues,
                  emitChangeToParent: _this.onChange,
                  getValues: function getValues() {
                    return _this.props.values;
                  },
                  values: _this.props.values,
                  rules: _this.props.rules,
                  defaultValue: element.props.defaultValue
                };
                cloneElements.push(React.cloneElement(element, childProps));
              }
              // 非表单节点处理 递归处理
              else {
                  var children = _this.deepClone(element.props.children);
                  cloneElements.push(React.cloneElement(element, null, children));
                }
      });
      if (cloneElements.length === 1) {
        return cloneElements[0];
      }
      return cloneElements;
    };

    _this.setDefaultValues = function (defaultValues) {
      var values = _.cloneDeep(_this.props.values);
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = defaultValues[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var x = _step3.value;

          if (x.defaultValue !== undefined && _.get(values, x.bind) === undefined) {
            _.set(values, x.bind, x.defaultValue);
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      if (!_.isEqual(_this.props.values, values)) {
        _this.onChange(values);
      }
    };

    _this.state = {};
    _this.values = {};
    return _this;
  }

  _createClass(FormEx, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setDefaultValues(this.defaultValues);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      // 每次更新时，对未设置的字段进行数据初始化
      this.setDefaultValues(this.defaultValues);
    }

    // submit btn事件，针对所有表单空间校验并进行回调


    // 调用form外部的事件

  }, {
    key: 'render',
    value: function render() {
      this.items = [];
      this.defaultValues = [];
      var children = this.deepClone(this.props.children);
      // console.log(children);
      return React.createElement(
        Form,
        null,
        children
      );
    }
  }]);

  return FormEx;
}(Component);

FormEx.defaultProps = {
  onSubmit: function onSubmit() {}, // 提交事件，进行校验
  onChange: function onChange(values, data, key) {}, // 所有控件变更都会触发该事件
  rules: {}, // 表单校验规则
  values: {} // 表单初始数据
};
export default FormEx;


function validate(rule, value, key, cb) {
  if (!rule) {
    return;
  }
  if (rule.length === 0) {
    cb && cb({
      status: 'success',
      message: ''
    });
    return;
  }
  var descriptor = _defineProperty({}, key, rule);
  var validator = new Schema(descriptor);
  validator.validate(_defineProperty({}, key, value), function (errors, fields) {
    var result = {
      status: 'success',
      message: ''
    };
    if (errors) {
      result = {
        status: 'error',
        message: errors[0].message
      };
    }
    cb && cb(result);
  });
}

var FormExItem = function (_Component2) {
  _inherits(FormExItem, _Component2);

  function FormExItem(props) {
    _classCallCheck(this, FormExItem);

    var _this2 = _possibleConstructorReturn(this, (FormExItem.__proto__ || Object.getPrototypeOf(FormExItem)).call(this, props));

    _this2.onValidate = function (value, cb) {
      value = value === undefined ? _this2.props.value : value;
      // 生成规则 优先级 默认规则（是否必填） < 全局规则 < 自身规则  
      var rule = [];

      if (_this2.props.ruleOfForm) {
        if (_.isArray(_this2.props.ruleOfForm)) rule = rule.concat(_this2.props.ruleOfForm);else if (_.isPlainObject(_this2.props.ruleOfForm)) {
          rule.push(_this2.props.ruleOfForm);
        }
      }
      if (_this2.props.rule) {
        if (_.isArray(_this2.props.rule)) rule = rule.concat(_this2.props.rule);else if (_.isPlainObject(_this2.props.rule)) rule.push(_this2.props.rule);
      }
      if (_this2.props.required) {
        rule.push({ required: true, message: '必填项' });
      }
      // 数据校验
      validate(rule, value, _this2.props.bind, function (result) {
        _this2.setState(result);
        cb && cb(result);
      });
    };

    _this2.onChange = function (e) {
      var value = e;
      if (e.target) {
        value = _.get(e, 'target.value');
        if (value === undefined) {
          value = _.get(e, 'target.checked');
        }
      }
      // 数据校验
      _this2.onValidate(value);
      // 触发自身onchange
      var values = null;
      if (_this2.props.onChange) {
        var lastValues = _.cloneDeep(_this2.props.getValues());
        _.set(lastValues, _this2.props.bind, value);
        values = _this2.props.onChange(lastValues, _this2.props.bind, value);
      }
      // 触发 FormEx 中事件
      _this2.props.emitChangeToParent(values, _this2.props.bind, value);
    };

    _this2.state = {
      status: '', // success error
      message: ''
    };
    return _this2;
  }

  _createClass(FormExItem, [{
    key: 'componentDidMount',
    value: function componentDidMount() {}

    // 校验接口，在 FormEx 中可能会调用

  }, {
    key: 'render',
    value: function render() {
      // console.log('===========================')
      var children = this.props.children;
      // 如果存在bind值，则作为表单控件进行处理
      if (_.isPlainObject(children) && this.props.bind) {
        // console.log('------------------');
        // console.log(children);
        // console.log(Checkbox._name);
        // console.log(children.type._name === Checkbox._name);
        // console.log(children);
        if (children.type._name === Checkbox._name) {
          children = React.cloneElement(this.props.children, {
            onChange: this.onChange,
            checked: this.props.value === undefined ? this.props.defaultValue : this.props.value
          });
        } else if (children.type._name === Select._name && children.props.mode === 'tags') {
          children = React.cloneElement(this.props.children, {
            onChange: this.onChange,
            defaultValue: this.props.value ? this.props.value : []
          });
        } else if (children.type._name === Input._name || children.type._name === Select._name || children.type._name === TextArea._name) {
          children = React.cloneElement(this.props.children, {
            onChange: this.onChange,
            value: this.props.value === undefined ? this.props.defaultValue : this.props.value
          });
        } else {
          children = React.cloneElement(this.props.children, {
            onChange: this.onChange,
            value: this.props.value === undefined ? this.props.defaultValue : this.props.value
          });
        }
      }
      return React.createElement(
        FormItem,
        Object.assign({}, this.props, { help: this.state.message, validateStatus: this.state.status, onValidate: this.onValidate }),
        children
      );
    }
  }]);

  return FormExItem;
}(Component);

FormExItem.defaultProps = {
  bind: undefined, // 对应表单数据中的key
  onChange: undefined, // 单独事件处理 (values, key, value) => { return values; } 返回的values将作为表单全局onchange事件的第一个参数，如果返回null，则会生成默认数据
  rule: undefined, // 单独规则
  required: false, // 是否必填
  defaultValue: undefined // 默认值
};


FormExItem._name = 'FormExItem';

var FormExItemArray = function (_Component3) {
  _inherits(FormExItemArray, _Component3);

  function FormExItemArray() {
    var _ref;

    var _temp, _this3, _ret;

    _classCallCheck(this, FormExItemArray);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this3 = _possibleConstructorReturn(this, (_ref = FormExItemArray.__proto__ || Object.getPrototypeOf(FormExItemArray)).call.apply(_ref, [this].concat(args))), _this3), _this3.onAddItem = function () {
      var values = _.cloneDeep(_this3.props.values);
      var list = _.get(values, _this3.props.bind, []);
      list.push({});
      _this3.props.emitChangeToParent(values, _this3.props.bind, list);
    }, _this3.onDelItem = function (index) {
      var values = _.cloneDeep(_this3.props.values);
      var list = _.get(values, _this3.props.bind);
      list.splice(index, 1);
      _this3.props.emitChangeToParent(values, _this3.props.bind, list);
    }, _temp), _possibleConstructorReturn(_this3, _ret);
  }

  _createClass(FormExItemArray, [{
    key: 'render',
    value: function render() {
      var _this4 = this;

      // console.info('this', this);
      // console.info('this.props', this.props);
      var children = [];
      var value = this.props.value || [];
      var items = React.Children.toArray(this.props.children);
      var span = this.props.span;
      if (this.props.span === null) {
        var s = Math.floor((24 - 2) / items.length);
        span = _.fill(new Array(items.length), s, 0);
      }
      value.forEach(function (x, i) {
        var cols = [];
        items.forEach(function (element, index) {
          var id = _this4.props.bind + '[' + i + '].' + element.props.bind;
          if (_this4.props.defaultValues) {
            _this4.props.defaultValues.push({ bind: id, defaultValue: element.props.defaultValue });
          }
          var item = React.cloneElement(element, {
            bind: id,
            value: _.get(_this4.props.values, id),
            ruleOfForm: _this4.props.rules[id],
            ref: function ref(item) {
              if (item) _this4.props.items.push(item);
            },
            defaultValue: _.get(_this4.props.values, id) || element.props.defaultValue,
            emitChangeToParent: _this4.props.emitChangeToParent,
            getValues: _this4.props.getValues
          });
          cols.push(React.createElement(
            Col,
            { span: span[index], key: id },
            item
          ));
        });
        cols.push(React.createElement(
          Col,
          { span: 2, key: i + 'del' },
          React.createElement(Icon, { className: 'dynamic-delete-button', type: 'minus-circle-o', style: { marginLeft: '12px' }, onClick: function onClick() {
              _this4.onDelItem(i);
            } })
        ));
        var row = React.createElement(
          Row,
          { gutter: 8, key: i, style: { paddingBottom: '10px' } },
          cols
        );
        children.push(row);
      });

      return React.createElement(
        FormExItem,
        Object.assign({}, this.props, { bind: null, items: children }),
        children,
        React.createElement(
          Button,
          { type: 'dashed', onClick: this.onAddItem, style: { width: '50%' } },
          React.createElement(Icon, { type: 'plus' }),
          ' ',
          this.props.addText
        )
      );
    }
  }]);

  return FormExItemArray;
}(Component);

FormExItemArray.defaultProps = {
  span: null, // 布局，[3,4,4] 如果为空，则根据子节点个数平均分配
  addText: '新增' // 布局，[3,4,4] 如果为空，则根据子节点个数平均分配
};


FormExItemArray._name = 'FormExItemArray';

FormEx.Item = FormExItem;
FormEx.ItemArray = FormExItemArray;
//# sourceMappingURL=FormEx.js.map