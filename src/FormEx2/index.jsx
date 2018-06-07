/**
 * 基于antd Form 表单组件，目前暂不使用
 */

import React, { Component } from 'react';
import { Form, Row, Col, Button, Icon, Checkbox, Input, Select, Radio, Switch } from 'antd';
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

/*
单个属性默认值
表单内部维护一份数据结构，与外部数据独立
表单提供接口给外部，允许外部设置内部数据
提供表单验证接口，如果通过，则回调事件
表单提供事件，当数据变更时触发
可配置表单验证触发点
针对单个属性，可配置规则

动态表单
支持Input，multselect，radio，Objec，array

项目表单中规则
失焦校验无效
所有采用动态校验
添加页面，首次进入，按钮置灰，当表单校验成功后，按钮可点击。重名校验将在提交数据时进行，如果需要单独接口校验，将存在前后台数据校验不一致的时差
编辑页面，首次进入，按钮置灰，当表单校验成功后，按钮可点击。当页面修改至与第一次进入页面时一致时，按钮状态也是可以点击状态，只验证是否编辑过，不验证数据是否一致
 */

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;


function isInstanceOfClass(instance, classConstructor) {
  if (_.isPlainObject(instance) && _.isFunction(instance.type)) {
    return instance.type === classConstructor;
  }
  return false;
}


class FormEx2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: _.cloneDeep(props.defaultValues)
    };
  }

  static defaultProps = {
    defaultValues: {}, // 表单初始数据
  }

  componentDidMount() {}

  componentDidUpdate() {}

  componentWillReceiveProps(nextProps) {
    // const { defaultValues } = nextProps;
    // this.setState({ data: defaultValues});
  }

  /**
   * 校验基本函数 外部请勿调用
   * @param  {String}   options.key      [本次校验的key值，将显示该内容框的校验结果]
   * @param  {Function} options.callback [校验完成后的回调函数]
   * @param  {Boolean}  options.isSubmit [是否为submit校验，sumit校验：将在页面上显示所有校验结果]
   */
  validate = ({ key = '', callback = () => {}, isSubmit = false } = {}) => {
    let validateResult = [];
    let itemLength = _.values(this.formItems).filter(x => x !== null && x !== undefined).length;

    const isAllCheck = (result) => {
      validateResult.push(result);
      // console.log(validateResult);
      if (validateResult.length === itemLength) {
        // 触发外部事件
        callback && callback(validateResult.every(x => x.status === 'success'), validateResult)
      }
    };
    for (let item of _.values(this.formItems)) {
      item && item.checkValidate(item.props.dataIndex === key || isSubmit, isAllCheck);
    }
  }

  /**
   * 设置表单的数据
   * @param  {Object} values [表单完成数据结构]
   * @param  {Boolen} isValidate [是否进行校验]
   */
  setValues = (values = {}, isValidate = false) => {
    this.setState({ data: values }, () => {
      isValidate && this.validate({ isSubmit: true });
    });
  }

  /**
   * 设置单个表单数据值，数据变更也是调用该函数
   * @param  {[String]} key   [对应数值在数据中的key,支持多层结构]
   * @param  {[Any]}    value [对应数值在数据中的value]
   */
  setValue = (key, value) => {
    let data = _.cloneDeep(this.state.data);
    _.set(data, key, value);
    // 数据未变更的情况下,不触发事件
    if (_.isEqual(data, this.state.data)) {
      return;
    }
    this.setState({ data }, () => {
      // 数据校验
      this.validate({
        key,
        callback: (isSuccess, validateResult) => {
          this.props.onValidate && this.props.onValidate(isSuccess, validateResult);
        },
        isSubmit: false
      });
      // 触发外部事件
      if (this.props.onChange) {
        // 必须拷贝数据，否则无法刷新
        this.props.onChange(_.cloneDeep(data), key, value);
      }
    });
  }

  /**
   * 获取key值对应的值
   * @param  {[String]} key          [想要获取值的key]
   * @param  {[Any]} defaultValue    [默认值]
   * @return {[Any]}
   */
  getValue = (key = null, defaultValue) => {
    if (key === null) {
      return undefined;
    }
    return _.get(this.state.data, key, defaultValue);
  }

  /**
   * 获取表单完整数据
   * @return {[Object]}
   */
  getValues = () => {
    return this.state.data;
  }

  delValue = (key) => {
    let values = this.state.data;
    let ids = key.split('.');
    if (ids.length === 1) {
      delete values[ids[0]];
    } else {
      let id = ids.splice(0, ids.length - 1).join('.');
      values = _.get(values, id, {});
      delete values[ids[ids.length - 1]];
    }
    this.setState({ data: values });
  }

  /**
   * 校验某个key的值
   * @param  {[type]} key [description]
   */
  validateValue = (key, callback) => {
    this.validate({
      key: key,
      callback: (isSuccess, validateResult) => {
        callback && callback(isSuccess, validateResult);
      },
      isSubmit: false
    });
  }

  /**
   * 外部接口 表单外部主动调用提交
   * @param  {[Function]} successCallback [校验成功后的回调函数]
   */
  submit = (successCallback) => {
    this.validate({
      key: null,
      callback: (isSuccess, validateResult) => {
        if (isSuccess) {
          successCallback && successCallback(this.state.data);
          this.props.onSubmit && this.props.onSubmit(this.state.data);
        }
      },
      isSubmit: true
    });
  }

  /**
   * 表单内按钮提交方式，将触发props上的onSubmit事件
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  handleSubmit = (e) => {
    e.preventDefault();
    this.validate({
      key: null,
      callback: (isSuccess, validateResult) => {
        isSuccess && this.props.onSubmit && this.props.onSubmit(this.state.data);
      },
      isSubmit: true
    });
  }

  deepClone = (elements) => {
    let newElements = [];
    React.Children.toArray(elements).forEach(ele => {
      if (!_.isObject(ele)) {
        newElements.push(ele);
      } else if (isInstanceOfClass(ele, FormEx2Item) && ele.props.dataIndex) {
        // dataIndex 未定义时不进行绑定事件
        let addProps = {
          _parent: this, // 存在该值得FromItem才进行自动事件绑定
          data: this.state.data,
          value: this.getValue(ele.props.dataIndex), // 数据中关联的值
          handleChange: this.setValue, // 数据变更调用该事件，在form中setState
          ref: item => this.formItems[ele.props.dataIndex] = item
        };
        let item = React.cloneElement(ele, addProps);
        newElements.push(item);
      } else {
        // fixed: br must with no children
        let children = ele.props.children ? this.deepClone(ele.props.children) : null;
        newElements.push(React.cloneElement(ele, null, children));
      }
    });
    return newElements;
  }

  render() {
    this.formItems = {};
    let children = this.deepClone(this.props.children);
    return (
      <Form
        onSubmit={this.handleSubmit}
      >
        {children}
      </Form>
    )
  }
}


class FormEx2Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props
    };
  }

  static defaultProps = {
    label: '',
    rules: [],
    trigger: 'onChange',
  }

  componentDidMount() {}

  componentDidUpdate() {}

  //数据校验及是否显示校验
  checkValidate = (isShowError = true, callback) => {
    let result = {
      dataIndex: this.props.dataIndex,
      status: 'success',
      message: ''
    };
    if (!this.validator) {
      this.rules = _.cloneDeep(this.props.rules);
      if (this.props.required === true) {
        this.rules.push({ required: 'true', message: '必填项' });
      }
      let descriptor = {
        [this.props.dataIndex]: this.rules
      };
      this.validator = new Schema(descriptor);
    }
    if (this.rules.length === 0) {
      callback && callback(result);
      return;
    }
    this.validator.validate({
      [this.props.dataIndex]: this.props.value
    }, (errors, fields) => {
      if (errors) {
        result = {
          dataIndex: this.props.dataIndex,
          status: 'error',
          message: errors[0].message,
          errors: errors
        };
      }
      if (isShowError) {
        this.setState({
          validateStatus: result.status,
          help: result.message
        });
      }
      callback && callback(result);
    });
  }

  onValueChange = (e) => {
    let value = e;
    if (e && e.target) {
      if (e.target.value !== undefined) {
        value = e.target.value;
      } else {
        value = e.target.checked;
      }
    }
    // FormItem上存在onChange时，调用，并优先使用其返回值
    if (this.props.onChange) {
      // 触发当前接口时，this.state.data为上一次的数据，如需获取本次变更后的数据，需异步处理
      let res = this.props.onChange(this.state.data, this.props.dataIndex, value);
      if (res !== undefined) {
        console.info('reset value', res);
        value = res;
      }
    }
    // 调用表单事件
    this.props.handleChange(this.props.dataIndex, value);
  }

  renderControl = (element) => {
    if (!element) {
      return null;
    }

    let newElement = element;

    // 默认值设定
    if (this.props._parent && this.props.value === undefined && this.props.defaultValue !== undefined) {
      setTimeout(() => {
        this.onValueChange(this.props.defaultValue);
      });
    }

    let props = Object.assign({}, element.props, {
      value: this.props.value,
      [this.props.trigger]: this.onValueChange
    });
    // 非Form生成的Item直接忽略
    if (!this.props._parent) {
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
      newElement = React.cloneElement(element, {
        checked: this.props.value,
        [this.props.trigger]: this.onValueChange
      });
    }
    // Input,Select等组件拷贝
    else {
      // console.log(element);
      newElement = React.cloneElement(element, props);
    }
    return newElement;
  }

  render() {
    let decorator = this.renderControl(this.props.decorator);
    return (
      <FormItem {...this.state}>
        {decorator}
        {this.props.children}
      </FormItem>
    )
  }
}
FormEx2.Item = FormEx2Item;

export default FormEx2;