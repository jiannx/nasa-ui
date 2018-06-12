import React, { Component } from 'react';
import { Form, Row, Col, Button, Icon, Checkbox, Input, Select, Switch } from 'antd';
import _ from 'lodash';
import Schema from 'async-validator';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
Checkbox._name = 'Checkbox';
Input._name = 'Input';
Select._name = 'Select';
TextArea._name = 'TextArea';

function isInstanceOfClass(instance, classConstructor) {
  if (_.isPlainObject(instance) && _.isFunction(instance.type)) {
    return instance.type === classConstructor;
  }
  return false;
}

export default class ControlledForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {
    onSubmit: () => {}, // 提交事件，进行校验
    onChange: (value) => {}, // 所有控件变更都会触发该事件
    value: {}, // 表单初始数据 Object
    onValidate: () => {},
    itemProps: null,
  }

  componentDidMount() {}

  componentDidUpdate() {}

  // 控件数据变更
  onItemChange = (key, value) => {
    let data = _.cloneDeep(this.props.value);
    _.set(data, key, value);
    this.props.onChange && this.props.onChange(data, key, value);
  }

  deepClone = (doms) => {
    let cloneElements = [];
    React.Children.toArray(doms).forEach((element, index) => {
      // 纯文字组件处理
      if (!_.isObject(element)) {
        cloneElements.push(element);
      }
      // submit 按钮处理 数据校验
      else if (element.props && element.props.htmlType === 'submit') {
        cloneElements.push(React.cloneElement(element, {
          onClick: e => {
            e.preventDefault();
            console.log('submit');
          }
        }));
      }
      // 表单控件处理
      else if (isInstanceOfClass(element, Item) && element.props.dataIndex) {
        cloneElements.push(React.cloneElement(element, {
          ref: item => {
            item && this.items.push(item);
          },
          data: this.props.value,
          emitChange: this.onItemChange,
          itemProps: this.props.itemProps
        }));
      }
      // 表单控件 非受控处理
      else if (isInstanceOfClass(element, Item) && !element.props.dataIndex) {
        cloneElements.push(React.cloneElement(element, {
          itemProps: this.props.itemProps
        }));
      }
      // 非表单节点处理 递归处理
      else {
        let children = this.deepClone(element.props.children);
        cloneElements.push(React.cloneElement(element, null, children));
      }
    });
    if (cloneElements.length === 1) {
      return cloneElements[0];
    }
    return cloneElements;
  }

  render() {
    this.items = [];
    let children = this.deepClone(this.props.children);
    return (
      <Form>
        {children}
      </Form>
    )
  }
}

function getValueFrom(e) {
  let value = e;
  if (e && e.target) {
    if (e.target.value !== undefined) {
      value = e.target.value;
    } else {
      value = e.target.checked;
    }
  }
  return value;
}

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: '', // success error
      message: '',
      focusing: false, // 捕获焦点
      stashValue: undefined, // 暂存数据
    };
  }

  static defaultProps = {
    label: '',
    dataIndex: null,
    rules: [],
    decorator: null,
    required: false,
    trigger: 'onChange',
  }

  componentDidMount() {}

  //数据校验及是否显示校验
  checkValidate = (value, isShowError = true, callback) => {
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
      [this.props.dataIndex]: value
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

  onChange = (e) => {
    let value = getValueFrom(e);
    this.checkValidate(value);
    // 触发数据变更
    this.props.emitChange(this.props.dataIndex, value);
  }


  // onBlur 下暂存变更
  onStashChange = (e) => {
    let value = getValueFrom(e);
    this.setState({ stashValue: value });
  }

  onBlur = () => {
    console.log('blur');
    this.onChange(this.state.stashValue);
    this.setState({ focusing: false, stashValue: undefined });
  }

  onFocus = (e) => {
    console.log('focus');
    this.props.onFocus && this.props.onFocus(e);
    this.setState({ focusing: true });
  }

  renderDecorator = (element) => {
    if (!element) {
      return null;
    }
    let value = _.get(this.props.data, this.props.dataIndex);
    let props = {
      [(isInstanceOfClass(element, Switch) || isInstanceOfClass(element, Checkbox)) ? 'checked' : 'value']: value,
      [this.props.trigger]: this.onChange
    };

    // 支持onBlur
    if (this.props.trigger === 'onBlur') {
      props.onChange = this.onStashChaneg;
      props.onBlur = this.onBlur;
      props.onFocus = this.onFocus;
    }

    return React.cloneElement(element, props);
  }


  render() {
    let decorator = this.renderDecorator(this.props.decorator);

    return (
      <FormItem {...this.props} {...this.props.itemProps} help={this.state.help} validateStatus={this.state.validateStatus}>
        {decorator}
        {this.props.children}
      </FormItem>
    )
  }
}

ControlledForm.Item = Item;