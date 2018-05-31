var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * 基于antd Form 表单组件，目前暂不使用
 */

import React, { Component } from 'react';
import { Form, Row, Col, Button, Icon, Checkbox, Input, Select, Radio, Switch } from 'antd';
import { InputEx } from 'src/components';
import _ from 'lodash';
import Schema from 'async-validator';

/*
<FormEx
  defaultValues={} // 表单初始数据，默认为空对象
  values={} // 双向绑定数据，todo
  onChange={(values, key, value) => {}}
  onValidate={(isSuccess, validateResult) => {}}
  onSubmit={(values) => {}}
  ref={form => this.form = form}
>
  <FormItem 
    // 以下属性参照 antd FormItem
    label="" // 文本
    labelCol // label 标签布局
    wrapperCol // 需要为输入控件设置布局样式时
    help // 提示信息
    extra // 额外的提示信息
    validateStatus // 校验状态
    hasFeedback // 配合 validateStatus 属性使用，展示校验状态图标
    colon={true} // 是否包含冒号
    required={false} // 是否必填
    // 以下是在antd FormItem基础上添加的
    valuePropName="value" // 子节点的值的属性，如 Switch 的是 'checked'
    dataIndex=""  // 绑定字段
    defaultValue={} // 数据不存在时的默认值
    rules={[]|{}} // 规则
    trigger="onChange" // 收集子节点的值的时机
    onChange={(values, key, value) => {}} // 数据变更时回调 
    decorator={<Input></Input>} // 输入控件 请使用InputEx代替Input，TextAreaEx代替TextArea，会自动添加onChange事件，所以请勿定义该事件
  />
</FormEx>

this.form.setValues(values); // 设置表单所有数据
this.form.setValue(key, value); // 设置表单单个数据
this.form.submit(successCallback = (values) => {}); // 表单验证并回调事件

 */
/*
数据逻辑
输入 => FormItem.onchange => Form.onChange => Form.setState（更新数据至FormItem） => Form调用FormItem的validate生成表单校验结果(更新FormItem的校验状态)，触发外部事件
 */

var FormItem = Form.Item;
var TextArea = Input.TextArea;
var TextAreaEx = InputEx.TextAreaEx;
var RadioGroup = Radio.Group;

function isInstanceOfClass(instance, classConstructor) {
  if (_.isPlainObject(instance) && _.isFunction(instance.type)) {
    return instance.type === classConstructor;
  }
  return false;
}

var FormEx2 = function (_Component) {
  _inherits(FormEx2, _Component);

  function FormEx2(props) {
    _classCallCheck(this, FormEx2);

    var _this = _possibleConstructorReturn(this, (FormEx2.__proto__ || Object.getPrototypeOf(FormEx2)).call(this, props));

    _this.validate = function () {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$key = _ref.key,
          key = _ref$key === undefined ? '' : _ref$key,
          _ref$callback = _ref.callback,
          callback = _ref$callback === undefined ? function () {} : _ref$callback,
          _ref$isSubmit = _ref.isSubmit,
          isSubmit = _ref$isSubmit === undefined ? false : _ref$isSubmit;

      var validateResult = [];
      var itemLength = _.values(_this.formItems).filter(function (x) {
        return x !== null && x !== undefined;
      }).length;

      var isAllCheck = function isAllCheck(result) {
        validateResult.push(result);
        // console.log(validateResult);
        if (validateResult.length === itemLength) {
          // 触发外部事件
          callback && callback(validateResult.every(function (x) {
            return x.status === 'success';
          }), validateResult);
        }
      };
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _.values(_this.formItems)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          item && item.checkValidate(item.props.dataIndex === key || isSubmit, isAllCheck);
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
    };

    _this.setValues = function () {
      var values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var isValidate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      _this.setState({ data: values }, function () {
        isValidate && _this.validate({ isSubmit: true });
      });
    };

    _this.setValue = function (key, value) {
      var data = _.cloneDeep(_this.state.data);
      _.set(data, key, value);
      // 数据未变更的情况下,不触发事件
      if (_.isEqual(data, _this.state.data)) {
        return;
      }
      _this.setState({ data: data }, function () {
        // 数据校验
        _this.validate({
          key: key,
          callback: function callback(isSuccess, validateResult) {
            _this.props.onValidate && _this.props.onValidate(isSuccess, validateResult);
          },
          isSubmit: false
        });
        // 触发外部事件
        if (_this.props.onChange) {
          // 必须拷贝数据，否则无法刷新
          _this.props.onChange(_.cloneDeep(data), key, value);
        }
      });
    };

    _this.getValue = function () {
      var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var defaultValue = arguments[1];

      if (key === null) {
        return undefined;
      }
      return _.get(_this.state.data, key, defaultValue);
    };

    _this.getValues = function () {
      return _this.state.data;
    };

    _this.delValue = function (key) {
      var values = _this.state.data;
      var ids = key.split('.');
      if (ids.length === 1) {
        delete values[ids[0]];
      } else {
        var id = ids.splice(0, ids.length - 1).join('.');
        values = _.get(values, id, {});
        delete values[ids[ids.length - 1]];
      }
      _this.setState({ data: values });
    };

    _this.validateValue = function (key, _callback) {
      _this.validate({
        key: key,
        callback: function callback(isSuccess, validateResult) {
          _callback && _callback(isSuccess, validateResult);
        },
        isSubmit: false
      });
    };

    _this.submit = function (successCallback) {
      _this.validate({
        key: null,
        callback: function callback(isSuccess, validateResult) {
          if (isSuccess) {
            successCallback && successCallback(_this.state.data);
            _this.props.onSubmit && _this.props.onSubmit(_this.state.data);
          }
        },
        isSubmit: true
      });
    };

    _this.handleSubmit = function (e) {
      e.preventDefault();
      _this.validate({
        key: null,
        callback: function callback(isSuccess, validateResult) {
          isSuccess && _this.props.onSubmit && _this.props.onSubmit(_this.state.data);
        },
        isSubmit: true
      });
    };

    _this.deepClone = function (elements) {
      var newElements = [];
      React.Children.toArray(elements).forEach(function (ele) {
        if (!_.isObject(ele)) {
          newElements.push(ele);
        } else if (isInstanceOfClass(ele, FormEx2Item) && ele.props.dataIndex) {
          // dataIndex 未定义时不进行绑定事件
          var addProps = {
            _parent: _this, // 存在该值得FromItem才进行自动事件绑定
            data: _this.state.data,
            value: _this.getValue(ele.props.dataIndex), // 数据中关联的值
            handleChange: _this.setValue, // 数据变更调用该事件，在form中setState
            ref: function ref(item) {
              return _this.formItems[ele.props.dataIndex] = item;
            }
          };
          var item = React.cloneElement(ele, addProps);
          newElements.push(item);
        } else {
          // fixed: br must with no children
          var children = ele.props.children ? _this.deepClone(ele.props.children) : null;
          newElements.push(React.cloneElement(ele, null, children));
        }
      });
      return newElements;
    };

    _this.state = {
      data: _.cloneDeep(props.defaultValues)
    };
    return _this;
  }

  _createClass(FormEx2, [{
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {}
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {}
    // const { defaultValues } = nextProps;
    // this.setState({ data: defaultValues});


    /**
     * 校验基本函数 外部请勿调用
     * @param  {String}   options.key      [本次校验的key值，将显示该内容框的校验结果]
     * @param  {Function} options.callback [校验完成后的回调函数]
     * @param  {Boolean}  options.isSubmit [是否为submit校验，sumit校验：将在页面上显示所有校验结果]
     */


    /**
     * 设置表单的数据
     * @param  {Object} values [表单完成数据结构]
     * @param  {Boolen} isValidate [是否进行校验]
     */


    /**
     * 设置单个表单数据值，数据变更也是调用该函数
     * @param  {[String]} key   [对应数值在数据中的key,支持多层结构]
     * @param  {[Any]}    value [对应数值在数据中的value]
     */


    /**
     * 获取key值对应的值
     * @param  {[String]} key          [想要获取值的key]
     * @param  {[Any]} defaultValue    [默认值]
     * @return {[Any]}
     */


    /**
     * 获取表单完整数据
     * @return {[Object]}
     */


    /**
     * 校验某个key的值
     * @param  {[type]} key [description]
     */


    /**
     * 外部接口 表单外部主动调用提交
     * @param  {[Function]} successCallback [校验成功后的回调函数]
     */


    /**
     * 表单内按钮提交方式，将触发props上的onSubmit事件
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */

  }, {
    key: 'render',
    value: function render() {
      this.formItems = {};
      var children = this.deepClone(this.props.children);
      return React.createElement(
        Form,
        {
          onSubmit: this.handleSubmit
        },
        children
      );
    }
  }]);

  return FormEx2;
}(Component);

FormEx2.defaultProps = {
  defaultValues: {} // 表单初始数据
};

var FormEx2Item = function (_Component2) {
  _inherits(FormEx2Item, _Component2);

  function FormEx2Item(props) {
    _classCallCheck(this, FormEx2Item);

    var _this2 = _possibleConstructorReturn(this, (FormEx2Item.__proto__ || Object.getPrototypeOf(FormEx2Item)).call(this, props));

    _initialiseProps.call(_this2);

    _this2.state = _extends({}, props);
    return _this2;
  }

  _createClass(FormEx2Item, [{
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {}

    //数据校验及是否显示校验

  }, {
    key: 'render',
    value: function render() {
      var decorator = this.renderControl(this.props.decorator);
      return React.createElement(
        FormItem,
        this.state,
        decorator,
        this.props.children
      );
    }
  }]);

  return FormEx2Item;
}(Component);

FormEx2Item.defaultProps = {
  label: '',
  rules: [],
  trigger: 'onChange'
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.checkValidate = function () {
    var isShowError = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var callback = arguments[1];

    var result = {
      dataIndex: _this3.props.dataIndex,
      status: 'success',
      message: ''
    };
    if (!_this3.validator) {
      _this3.rules = _.cloneDeep(_this3.props.rules);
      if (_this3.props.required === true) {
        _this3.rules.push({ required: 'true', message: '必填项' });
      }
      var descriptor = _defineProperty({}, _this3.props.dataIndex, _this3.rules);
      _this3.validator = new Schema(descriptor);
    }
    if (_this3.rules.length === 0) {
      callback && callback(result);
      return;
    }
    _this3.validator.validate(_defineProperty({}, _this3.props.dataIndex, _this3.props.value), function (errors, fields) {
      if (errors) {
        result = {
          dataIndex: _this3.props.dataIndex,
          status: 'error',
          message: errors[0].message,
          errors: errors
        };
      }
      if (isShowError) {
        _this3.setState({
          validateStatus: result.status,
          help: result.message
        });
      }
      callback && callback(result);
    });
  };

  this.onValueChange = function (e) {
    var value = e;
    if (e && e.target) {
      if (e.target.value !== undefined) {
        value = e.target.value;
      } else {
        value = e.target.checked;
      }
    }
    // FormItem上存在onChange时，调用，并优先使用其返回值
    if (_this3.props.onChange) {
      // 触发当前接口时，this.state.data为上一次的数据，如需获取本次变更后的数据，需异步处理
      var res = _this3.props.onChange(_this3.state.data, _this3.props.dataIndex, value);
      if (res !== undefined) {
        console.info('reset value', res);
        value = res;
      }
    }
    // 调用表单事件
    _this3.props.handleChange(_this3.props.dataIndex, value);
  };

  this.renderControl = function (element) {
    if (!element) {
      return null;
    }

    var newElement = element;

    // 默认值设定
    if (_this3.props._parent && _this3.props.value === undefined && _this3.props.defaultValue !== undefined) {
      setTimeout(function () {
        _this3.onValueChange(_this3.props.defaultValue);
      });
    }

    var props = Object.assign({}, element.props, _defineProperty({
      value: _this3.props.value
    }, _this3.props.trigger, _this3.onValueChange));
    // 非Form生成的Item直接忽略
    if (!_this3.props._parent) {
      newElement = element;
    }
    // 替换Input为InputEx
    else if (isInstanceOfClass(element, Input)) {
        newElement = React.createElement(Input, props);
      }
      // TextArea为TextAreaEx
      else if (isInstanceOfClass(element, TextArea)) {
          newElement = React.createElement(TextArea, props);
        }
        // checked处理
        else if (isInstanceOfClass(element, Switch) || isInstanceOfClass(element, Checkbox)) {
            newElement = React.cloneElement(element, _defineProperty({
              checked: _this3.props.value
            }, _this3.props.trigger, _this3.onValueChange));
          }
          // Input,Select等组件拷贝
          else {
              // console.log(element);
              newElement = React.cloneElement(element, props);
            }
    return newElement;
  };
};

FormEx2.Item = FormEx2Item;

export default FormEx2;
//# sourceMappingURL=FormEx2.js.map