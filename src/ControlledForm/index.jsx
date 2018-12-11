import React, { Component } from 'react';
import { Form, Checkbox, Input, Select, Switch } from 'antd';
import _ from 'lodash';
import Schema from 'async-validator';
import locale from '../locale';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

Checkbox._name = 'Checkbox';
Input._name = 'Input';
Select._name = 'Select';
TextArea._name = 'TextArea';

function isInstanceOfClass(instance, classConstructor) {
  if (_.isPlainObject(instance) && _.isFunction(instance.type)) {
    return instance.type === classConstructor || _.get(instance, 'type.__proto__') === classConstructor;
  }
  return false;
}

// todo性能优化
function clone(data, key) {
  return { ...data };
  // return _.cloneDeep(data);
}

export default class ControlledForm extends Component {
  static defaultProps = {
    className: '',
    onSubmit: null, // 提交事件，进行校验
    onChange: null, // 所有控件变更都会触发该事件
    value: {}, // 表单初始数据 Object
    onValidate: null, // (res) => { console.log(res) }
    itemProps: null,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.onCheckFormValidateHandler = _.debounce(this.onCheckFormValidate, 100);
  }

  // componentDidMount() {
  // }

  // 表单校验
  validateForm = (isShowError = false, callback, data) => {
    data = data || this.props.value;
    let result = [];
    let items = this.items.filter(x => x !== null && x !== undefined);

    const allCheck = (res) => {
      result.push(res);
      if (result.length === items.length) {
        // 触发外部事件
        callback && callback(result.every(x => x.status === 'success'), result);
      }
    };
    for (let node of items) {
      node && node.checkValidate(_.get(data, node.props.dataIndex), isShowError, allCheck);
    }
  }

  // 校验某个字段
  validate = (dataIndex, isShowError = true, callback) => {
    let item = this.items.find(x => x && x.props && x.props.dataIndex === dataIndex);
    if (item) {
      item.checkValidate(_.get(this.props.value, dataIndex), isShowError, callback);
    }
  }

  onCheckFormValidate = () => {
    // console.log('!!!!!----')
    let items = this.items.filter(x => x !== null && x !== undefined);
    let result = items.map(x => x.validateStatus);
    this.props.onValidate && this.props.onValidate(result.every(x => x.status === 'success'), result);
  }

  onSubmit = () => {
    let data = clone(this.props.value);
    this.validateForm(true, formStatus => {
      if (formStatus) {
        this.props.onSubmit && this.props.onSubmit(this.props.value);
      }
    }, data);
  }

  // 控件数据变更
  onItemChange(key, value) {
    let data = clone(this.props.value);
    _.set(data, key, value);
    this.props.onChange && this.props.onChange(data, key, value);
  }

  deepClone(doms) {
    if (doms === null || doms === undefined) {
      return null;
    }
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
            this.onSubmit();
          }
        }));
      }
      // 表单控件处理
      else if (isInstanceOfClass(element, Item) && element.props.dataIndex) {
        let children = this.deepClone(element.props.children);
        cloneElements.push(React.cloneElement(element, {
          ref: item => {
            item && this.items.push(item);
          },
          value: _.get(this.props.value, element.props.dataIndex),
          emitChange: this.onItemChange.bind(this),
          itemProps: this.props.itemProps,
          onCheckFormValidateHandler: this.onCheckFormValidateHandler
        }, children));
      }
      // 表单控件 非受控处理
      else if (isInstanceOfClass(element, Item) && !element.props.dataIndex) {
        let children = this.deepClone(element.props.children);
        cloneElements.push(React.cloneElement(element, {
          itemProps: this.props.itemProps
        }, children));
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
      <Form layout={this.props.layout} className={this.props.className}>
        {children}
      </Form>
    );
  }
}

function getValueFromEvent(e) {
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
  static defaultProps = {
    label: null,
    dataIndex: null,
    rules: [],
    decorator: null,
    required: false,
    trigger: 'onChange',
  }

  constructor(props) {
    super(props);
    this.state = {
      status: '', // success error
      message: '',
      focusing: false, // 捕获焦点
      stashValue: undefined, // 暂存数据
    };
    this.validateStatus = null; // 用于组件存储校验状态
    this.inputValue = null; // 存储onchange输入的值，在下一次进入校验时，显示错误信息
  }

  componentDidMount() {
    this.checkValidate(this.props.value, false, this.props.onCheckFormValidateHandler);
  }

  componentWillReceiveProps(nextProps) {
    // 数据变更，重新获取校验状态
    if (nextProps.value !== this.props.value) {
      let showError = false;
      // @todo 确定是否会存在bug，当前判断逻辑：判断本次数据和刷新前用户输入数据是否一致，如果一致，则判定为需要显示错误框；否则不显示错误信息
      if (this.inputValue !== null && this.inputValue === nextProps.value) {
        showError = true;
      }
      this.checkValidate(nextProps.value, showError, this.props.onCheckFormValidateHandler);
    }
    this.inputValue = null;
  }

  checkValidateCallback = (result, isShowError = true, callback) => {
    this.validateStatus = result;
    callback && callback(result);
    if (isShowError) {
      this.setState({
        validateStatus: result.status,
        help: result.message
      });
    }
  }

  // 数据校验及是否显示校验
  checkValidate = (value, isShowError = true, callback) => {
    let result = {
      dataIndex: this.props.dataIndex,
      status: 'success',
      message: ''
    };
    // 未添加任何校验条件的情况
    if (this.props.rules.length === 0 && this.props.required !== true) {
      this.checkValidateCallback(result, isShowError, callback);
      return;
    }
    // 添加删除节点时组件复用但是dataIndex变更，校验前再次确认规则中key值是否与dataIndex一致
    if (!this.validator || !_.get(this.validator, `rules.${this.props.dataIndex}`)) {
      this.rules = [...this.props.rules];
      if (this.props.required === true) {
        this.rules.push({ required: 'true', message: locale.get('required') });
      }
      let descriptor = {
        [this.props.dataIndex]: this.rules
      };
      this.validator = new Schema(descriptor);
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
      this.checkValidateCallback(result, isShowError, callback);
    });
  }

  onChange = (e) => {
    let value = getValueFromEvent(e);
    this.inputValue = value;
    this.props.emitChange(this.props.dataIndex, value);
  }

  // onBlur 下暂存变更
  onStashChange = (e) => {
    let value = getValueFromEvent(e);
    this.setState({ stashValue: value });
  }

  onBlur = (e) => {
    this.props.onBlur && this.props.onBlur(e);
    this.onChange(this.state.stashValue);
    this.setState({ focusing: false, stashValue: undefined });
  }

  onFocus = (e) => {
    this.props.onFocus && this.props.onFocus(e);
    this.setState({ stashValue: this.props.value });
    this.setState({ focusing: true });
  }

  renderDecorator = (element) => {
    if (!element) {
      return null;
    }
    let value = this.props.value;
    let props = {
      [(isInstanceOfClass(element, Switch) || isInstanceOfClass(element, Checkbox)) ? 'checked' : 'value']: value,
      [this.props.trigger]: this.onChange
    };

    // 支持onBlur
    if (this.props.trigger === 'onBlur') {
      props.onChange = this.onStashChange;
      props.onBlur = this.onBlur;
      props.onFocus = this.onFocus;
      if (this.state.focusing) {
        props[(isInstanceOfClass(element, Switch) || isInstanceOfClass(element, Checkbox)) ? 'checked' : 'value'] = this.state.stashValue;
      }
    }

    return React.cloneElement(element, props);
  }


  render() {
    let decorator = this.renderDecorator(this.props.decorator);

    return (
      <FormItem {...this.props.itemProps} {...this.props} help={this.state.help} validateStatus={this.state.validateStatus}>
        {decorator}
        {this.props.children}
      </FormItem>
    );
  }
}

ControlledForm.Item = Item;
