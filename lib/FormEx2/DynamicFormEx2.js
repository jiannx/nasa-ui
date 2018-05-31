var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * 动态表单及显示 待完善
 */
import React, { Component } from 'react';
import _ from 'lodash';
import { FormEx } from 'src/components';
import { Button, Row, Col, Modal, Input, Radio, Select, Checkbox, Icon } from 'antd';
import FormEx2 from './FormEx2.jsx';

var FormItem = FormEx2.Item;
var RadioGroup = Radio.Group;
var Option = Select.Option;
var CheckboxGroup = Checkbox.Group;

var defaultItem = {
  type: 'input', //string, input||radio||checkbox||select||oneOf 多项只能配置一项||array列表项||br换行||selectTag多重输入
  label: '', // 标题文本
  bind: null, // 显示及编辑时对应数据中的索引
  children: null, // array, array 中子节点
  disabled: false, // 当前项是否可编辑
  required: false, // 编辑时是否必填
  rules: undefined, // 编辑时校验规则
  defaultValue: undefined, // 默认值

  // Object 两个文本框实现键值对形式 根据输入的值，生成对象 {key: value}
  keyLabel: 'key', // key值文本框文本 
  valueLabel: 'value', // value 文本框显示文本

  // radio select
  options: null, // radio label, value [{label: '描述', value: 'type1'}]

  // array可选参数 参照 FormExItemArray的参数
  span: undefined, // 编辑时布局 用于children元素 children: [{bind: 'id', label: 'ID', span: 4}]
  addText: '新增', // 编辑时新增文本

  // selectTag
  tokenSeparators: [','] // 分隔符
};

var layout = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 18 }
  }
};

var DynamicFormEx2 = function (_Component) {
  _inherits(DynamicFormEx2, _Component);

  function DynamicFormEx2(props) {
    _classCallCheck(this, DynamicFormEx2);

    var _this = _possibleConstructorReturn(this, (DynamicFormEx2.__proto__ || Object.getPrototypeOf(DynamicFormEx2)).call(this, props));

    _initialiseProps.call(_this);

    _this.state = {
      values: _.cloneDeep(props.defaultValues)
    };
    return _this;
  }

  _createClass(DynamicFormEx2, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {}
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {}

    // 类表添加行

    // 列表删除行


    // 根据列表数据生成对象数据结构


    // 根据索引删除属性 id = orign.ip

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var items = this.renderChildren();

      return React.createElement(
        'div',
        { className: this.props.className },
        React.createElement(
          FormEx2,
          {
            defaultValues: this.props.defaultValues,
            onChange: function onChange(values) {
              console.log(values);
              _this2.setState({ values: values });
              _this2.props.onChange && _this2.props.onChange(values);
            },
            ref: function ref(form) {
              return _this2.form = form;
            }
          },
          items
        )
      );
    }
  }]);

  return DynamicFormEx2;
}(Component);

DynamicFormEx2.defaultProps = {
  title: '', // 编辑时弹窗标题
  values: {}, // 完整数据
  items: [], // 配置项 
  onSubmit: function onSubmit(values) {}, // 编辑保存时提交事件
  gutter: 16, // row内填充
  span: 8 // 单个元素占据多大 总共24
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.onArrayAdd = function (dataIndex) {
    var listData = _.cloneDeep(_.get(_this3.state.values, dataIndex, []));
    listData.push({});
    _this3.form.setValue(dataIndex, listData);
  };

  this.onArrayDel = function (dataIndex, index) {
    var listData = _.get(_this3.state.values, dataIndex, []);
    listData.splice(index, 1);
    _this3.form.setValue(dataIndex, listData);
  };

  this.onSetObjectData = function (listDataIndex, dataIndex) {
    var listData = _.get(_this3.state.values, listDataIndex, []);
    var data = {};
    listData.forEach(function (x) {
      if (x && x !== '') {
        data[x.key] = x.value;
      }
    });
    _this3.form.setValue(dataIndex, data);
  };

  this.delProperty = function (values, id) {
    var ids = id.split('.');
    if (ids.length === 1) {
      delete values[ids[0]];
    } else {
      var _id = ids.splice(0, ids.length - 1).join('.');
      values = _.get(values, _id, {});
      delete values[ids[ids.length - 1]];
    }
  };

  this.onOneOfChange = function (props, values, key, selLabel) {
    console.log(selLabel);
    setTimeout(function () {
      _.set(values, key, selLabel);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = props.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var opt = _step.value;

          if (opt.label !== selLabel) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = opt.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var child = _step2.value;

                _this3.delProperty(_this3.state.values, child.bind);
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
          }
        }
        // this.from.setValues(this.state.values);
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
    }, 2000);
  };

  this.renderDecorator = function (props) {
    var self = _this3;
    var decorator = void 0;

    if (props.decorator) {
      decorator = _.isFunction(props.decorator) ? props.decorator(props) : props.decorator;
    }
    // input 
    else if (props.type === 'input') {
        decorator = React.createElement(Input, { placeholder: props.placeholder });
      }
      // radio
      else if (props.type === 'radio') {
          decorator = React.createElement(
            RadioGroup,
            null,
            props.options.map(function (x) {
              return React.createElement(
                Radio,
                { value: x.value, key: x.value },
                x.label
              );
            })
          );
        }
        // select 
        else if (props.type === 'select') {
            decorator = React.createElement(
              Select,
              null,
              props.options.map(function (x) {
                return React.createElement(
                  Option,
                  { value: x.value, key: x.value },
                  x.label
                );
              })
            );
          }
          // 多选
          else if (props.type === 'selectMult') {
              decorator = React.createElement(
                Select,
                { mode: 'tags' },
                props.options.map(function (x) {
                  return React.createElement(
                    Option,
                    { value: x.value, key: x.value },
                    x.label
                  );
                })
              );
            }
            // 多重输入 
            else if (props.type === 'selectTag') {
                decorator = React.createElement(
                  Select,
                  { mode: 'multiple' },
                  props.options.map(function (x) {
                    return React.createElement(
                      Option,
                      { value: x.value, key: x.value },
                      x.label
                    );
                  })
                );
              }
              // checkbox
              else if (props.type === 'checkbox') {
                  decorator = React.createElement(
                    Checkbox,
                    null,
                    props.label
                  );
                }
                // checknbox grop
                else if (props.type === 'checkboxGroup') {
                    decorator = React.createElement(
                      CheckboxGroup,
                      { options: props.options },
                      props.label
                    );
                  }
                  // one of 
                  else if (props.type === 'oneOf') {
                      decorator = React.createElement(
                        RadioGroup,
                        null,
                        props.options.map(function (x) {
                          return React.createElement(
                            Radio,
                            { value: x.value, key: x.value },
                            x.label
                          );
                        })
                      );
                    }
                    // array 
                    else if (props.type === 'array') {
                        var listData = _.get(_this3.state.values, props.bind, []); // todo 
                        var spanLength = Math.floor((24 - 2) / props.children.length);
                        decorator = React.createElement(
                          'div',
                          null,
                          listData.map(function (d, index) {
                            return React.createElement(
                              Row,
                              { gutter: 8, key: index },
                              props.children.map(function (x, i) {
                                return React.createElement(
                                  Col,
                                  { span: x.span ? x.span : spanLength, style: { paddingBottom: '4px' }, key: i },
                                  React.createElement(FormItem, {
                                    required: x.required,
                                    rules: x.rules,
                                    defaultValue: x.defaultValue,
                                    dataIndex: props.bind + '[' + index + '].' + x.bind,
                                    decorator: _this3.renderDecorator(x)
                                  })
                                );
                              }),
                              React.createElement(
                                Col,
                                { span: '2' },
                                React.createElement(Icon, { className: 'dynamic-delete-button', type: 'minus-circle-o', onClick: function onClick() {
                                    return _this3.onArrayDel(props.bind, index);
                                  } })
                              )
                            );
                          }),
                          React.createElement(
                            Button,
                            { type: 'dashed', onClick: function onClick() {
                                return _this3.onArrayAdd(props.bind);
                              } },
                            React.createElement(Icon, { type: 'plus' }),
                            ' ',
                            props.addText
                          )
                        );
                      }
                      // object 
                      else if (props.type === 'object') {
                          var dataIndex = '_dynamic.' + props.bind;
                          var _listData = _.get(_this3.state.values, dataIndex); // todo 
                          var _spanLength = Math.floor((24 - 2) / 2);
                          // 数据初始化
                          if (!_listData) {
                            _listData = [];
                            var data = _.get(_this3.state.values, props.bind, {});
                            var _iteratorNormalCompletion3 = true;
                            var _didIteratorError3 = false;
                            var _iteratorError3 = undefined;

                            try {
                              for (var _iterator3 = Object.keys(data)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var key = _step3.value;

                                _listData.push({ key: key, value: data[key] });
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

                            setTimeout(function () {
                              _this3.form.setValue(dataIndex, _listData);
                            });
                          }
                          decorator = React.createElement(
                            'div',
                            null,
                            _listData.map(function (d, index) {
                              return React.createElement(
                                Row,
                                { gutter: 8, key: index },
                                React.createElement(
                                  Col,
                                  { span: _spanLength, style: { paddingBottom: '4px' } },
                                  React.createElement(FormItem, {
                                    required: true,
                                    dataIndex: dataIndex + '[' + index + '].key',
                                    decorator: React.createElement(Input, { placeholder: props.keyLabel }),
                                    onChange: _.debounce(function () {
                                      self.onSetObjectData(dataIndex, props.bind);
                                    }, 2000)
                                  })
                                ),
                                React.createElement(
                                  Col,
                                  { span: _spanLength, style: { paddingBottom: '4px' } },
                                  React.createElement(FormItem, {
                                    required: true,
                                    dataIndex: dataIndex + '[' + index + '].value',
                                    decorator: React.createElement(Input, { placeholder: props.valueLabel }),
                                    onChange: _.debounce(function () {
                                      self.onSetObjectData(dataIndex, props.bind);
                                    }, 200)
                                  })
                                ),
                                React.createElement(
                                  Col,
                                  { span: '2' },
                                  React.createElement(Icon, { className: 'dynamic-delete-button', type: 'minus-circle-o', onClick: function onClick() {
                                      return _this3.onArrayDel(dataIndex, index);
                                    } })
                                )
                              );
                            }),
                            React.createElement(
                              Button,
                              { type: 'dashed', onClick: function onClick() {
                                  return _this3.onArrayAdd(dataIndex);
                                } },
                              React.createElement(Icon, { type: 'plus' }),
                              ' ',
                              props.addText
                            )
                          );
                        }

    return decorator;
  };

  this.renderItem = function (item) {
    var items = []; // 单项可能会生成多个表单控件
    var props = Object.assign({}, defaultItem, item); // 参数生成

    var withDataIndex = true;
    // 表单控件，还是只是布局所用。
    if (props.type === 'array' || props.type === 'object' || !props.bind) {
      withDataIndex = false;
    }
    // oneof 生成可选项
    if (props.type === 'oneOf') {
      withDataIndex = true;
      props.bind = '_dynamic.' + props.label;
      props.options = [];
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = props.children[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var opt = _step4.value;

          props.options.push({ label: opt.label, value: opt.label });
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
    if (props.type === 'radio' && !props.options) {
      props.options = [{ label: '是', value: true }, { label: '否', value: false }];
    }

    var decorator = _this3.renderDecorator(props);
    if (props.disabled === true) {
      decorator = React.cloneElement(decorator, {
        disabled: true
      });
    }
    items.push(React.createElement(
      FormItem,
      Object.assign({}, layout, {
        label: props.label,
        required: props.required,
        rules: props.rules,
        defaultValue: withDataIndex ? props.defaultValue : undefined,
        dataIndex: withDataIndex ? props.bind : undefined,
        decorator: withDataIndex ? decorator : undefined
      }),
      withDataIndex ? null : decorator
    ));

    if (props.type === 'oneOf') {
      var currentSel = _.get(_this3.state.values, '_dynamic.' + props.label);
      // console.log(currentSel);

      var _loop = function _loop(_opt) {
        var optChild = [];
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = _opt.children[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var child = _step6.value;

            // 数据初始化
            var value = _.get(_this3.state.values, child.bind);
            if (value !== undefined && !currentSel && currentSel !== _opt.label) {
              setTimeout(function () {
                _this3.form.setValue('_dynamic.' + props.label, _opt.label);
              });
            }
            optChild.push(React.createElement(FormItem, Object.assign({}, layout, {
              label: child.label,
              required: child.required,
              rules: child.rules,
              defaultValue: child.defaultValue,
              dataIndex: child.bind,
              decorator: _this3.renderDecorator(child)
            })));
          }
        } catch (err) {
          _didIteratorError6 = true;
          _iteratorError6 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion6 && _iterator6.return) {
              _iterator6.return();
            }
          } finally {
            if (_didIteratorError6) {
              throw _iteratorError6;
            }
          }
        }

        items.push(React.createElement(
          'div',
          null,
          _.get(_this3.state.values, '_dynamic.' + props.label) === _opt.label && optChild
        ));
      };

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = props.children[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _opt = _step5.value;

          _loop(_opt);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }
    return items;
  };

  this.renderChildren = function () {
    var items = [];
    _this3.props.items.forEach(function (item) {
      items = items.concat(item ? _this3.renderItem(item) : []);
    });
    return React.Children.toArray(items);
  };
};

export default DynamicFormEx2;
//# sourceMappingURL=DynamicFormEx2.js.map