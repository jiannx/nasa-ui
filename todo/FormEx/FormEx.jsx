import React, { Component } from 'react';
import { Form, Row, Col, Button, Icon, Checkbox, Input, Select } from 'antd';
import _ from 'lodash';
import Schema from 'async-validator';
import './form.scss';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
Checkbox._name = 'Checkbox';
Input._name = 'Input';
Select._name = 'Select';
TextArea._name = 'TextArea';

export default class FormEx extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.values = {};
  }

  static defaultProps = {
    onSubmit: () => {}, // 提交事件，进行校验
    onChange: (values, data, key) => {}, // 所有控件变更都会触发该事件
    rules: {}, // 表单校验规则
    values: {}, // 表单初始数据
  }

  componentDidMount() {
    this.setDefaultValues(this.defaultValues);
  }

  componentDidUpdate() {
    // 每次更新时，对未设置的字段进行数据初始化
    this.setDefaultValues(this.defaultValues);
  }

  // submit btn事件，针对所有表单空间校验并进行回调
  onFormValidate = (cb) => {
    let results = [];
    let count = 0;
    for (let x of this.items) {
      if (x.onValidate) {
        count = count + 1;
      }
    }
    for (let x of this.items) {
      if (x.onValidate) {
        x.onValidate(undefined, res => {
          results.push(res);
          if (results.length === count && results.every(x => x.status === 'success')) {
            this.props.onSubmit(this.props.values, cb);
          }
        });
      }
    }
  }

  // 调用form外部的事件
  onChange = (values, key, value) => {
    // 合并数据
    if (!values && key) {
      values = _.cloneDeep(this.props.values);
      _.set(values, key, value);
    }
    this.props.onChange(values, key, value);
  }

  deepClone = (doms) => {
    let cloneElements = [];
    React.Children.toArray(doms).forEach((element, index) => {
      let childProps = {};
      // 纯文字组件处理
      if (!_.isObject(element)) {
        cloneElements.push(element);
      }
      // submit 按钮处理 数据校验
      else if (element.props && element.props.htmlType === 'submit') {
        childProps = {
          onClick: (e) => {
            e.preventDefault();
            this.onFormValidate();
          }
        }
        cloneElements.push(React.cloneElement(element, childProps));
      }
      // 表单控件处理
      else if (element.type._name === FormExItem._name && element.props.bind) {
        // 初始化数据提取，之后统一设置（单独设置无法实现）
        this.defaultValues.push({ bind: element.props.bind, defaultValue: element.props.defaultValue });
        childProps = {
          value: _.get(this.props.values, element.props.bind),
          ruleOfForm: this.props.rules[element.props.bind],
          ref: item => {
            if (item)
              this.items.push(item);
          },
          items: this.items,
          values: this.props.values,
          rules: this.props.rules,
          emitChangeToParent: this.onChange,
          getValues: () => this.props.values,
          defaultValue: element.props.defaultValue
        };
        cloneElements.push(React.cloneElement(element, childProps));
      }
      // 数组 表单控件处理
      else if (element.type._name === FormExItemArray._name && element.props.bind) {
        // 初始化数据提取，之后统一设置（单独设置无法实现）
        this.defaultValues.push({ bind: element.props.bind, defaultValue: element.props.defaultValue });
        childProps = {
          value: _.get(this.props.values, element.props.bind),
          ruleOfForm: this.props.rules[element.props.bind],
          items: this.items,
          defaultValues: this.defaultValues,
          emitChangeToParent: this.onChange,
          getValues: () => this.props.values,
          values: this.props.values,
          rules: this.props.rules,
          defaultValue: element.props.defaultValue
        };
        cloneElements.push(React.cloneElement(element, childProps));
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

  setDefaultValues = (defaultValues) => {
    let values = _.cloneDeep(this.props.values);
    for (let x of defaultValues) {
      if (x.defaultValue !== undefined && _.get(values, x.bind) === undefined) {
        _.set(values, x.bind, x.defaultValue);
      }
    }
    if (!_.isEqual(this.props.values, values)) {
      this.onChange(values);
    }
  }

  render() {
    this.items = [];
    this.defaultValues = [];
    let children = this.deepClone(this.props.children);
    // console.log(children);
    return (
      <Form>
        {children}
      </Form>
    )
  }
}

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
  let descriptor = {
    [key]: rule
  };
  let validator = new Schema(descriptor);
  validator.validate({
    [key]: value
  }, (errors, fields) => {
    let result = {
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

class FormExItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: '', // success error
      message: '',
    };
  }

  static defaultProps = {
    bind: undefined, // 对应表单数据中的key
    onChange: undefined, // 单独事件处理 (values, key, value) => { return values; } 返回的values将作为表单全局onchange事件的第一个参数，如果返回null，则会生成默认数据
    rule: undefined, // 单独规则
    required: false, // 是否必填
    defaultValue: undefined, // 默认值
  }

  componentDidMount() {}

  // 校验接口，在 FormEx 中可能会调用
  onValidate = (value, cb) => {
    value = value === undefined ? this.props.value : value;
    // 生成规则 优先级 默认规则（是否必填） < 全局规则 < 自身规则  
    let rule = [];

    if (this.props.ruleOfForm) {
      if (_.isArray(this.props.ruleOfForm))
        rule = rule.concat(this.props.ruleOfForm);
      else if (_.isPlainObject(this.props.ruleOfForm)) {
        rule.push(this.props.ruleOfForm);
      }
    }
    if (this.props.rule) {
      if (_.isArray(this.props.rule))
        rule = rule.concat(this.props.rule);
      else if (_.isPlainObject(this.props.rule))
        rule.push(this.props.rule);
    }
    if (this.props.required) {
      rule.push({ required: true, message: '必填项' });
    }
    // 数据校验
    validate(rule, value, this.props.bind, (result) => {
      this.setState(result);
      cb && cb(result);
    });
  }

  onChange = (e) => {
    let value = e;
    if (e.target) {
      value = _.get(e, 'target.value');
      if (value === undefined) {
        value = _.get(e, 'target.checked');
      }
    }
    // 数据校验
    this.onValidate(value);
    // 触发自身onchange
    let values = null;
    if (this.props.onChange) {
      let lastValues = _.cloneDeep(this.props.getValues());
      _.set(lastValues, this.props.bind, value);
      values = this.props.onChange(lastValues, this.props.bind, value);
    }
    // 触发 FormEx 中事件
    this.props.emitChangeToParent(values, this.props.bind, value);
  }

  render() {
    // console.log('===========================')
    let children = this.props.children;
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
          checked: this.props.value === undefined ? this.props.defaultValue : this.props.value,
        });
      } else if (children.type._name === Select._name && children.props.mode === 'tags') {
        children = React.cloneElement(this.props.children, {
          onChange: this.onChange,
          defaultValue: this.props.value ? this.props.value : [],
        });
      } else if (children.type._name === Input._name || children.type._name === Select._name || children.type._name === TextArea._name) {
        children = React.cloneElement(this.props.children, {
          onChange: this.onChange,
          value: this.props.value === undefined ? this.props.defaultValue : this.props.value,
        });
      } else {
        children = React.cloneElement(this.props.children, {
          onChange: this.onChange,
          value: this.props.value === undefined ? this.props.defaultValue : this.props.value,
        });
      }
    }
    return (
      <FormItem {...this.props} help={this.state.message} validateStatus={this.state.status} onValidate={this.onValidate}>
        {children}
      </FormItem>
    )
  }
}

FormExItem._name = 'FormExItem';

class FormExItemArray extends Component {

  static defaultProps = {
    span: null, // 布局，[3,4,4] 如果为空，则根据子节点个数平均分配
    addText: '新增', // 布局，[3,4,4] 如果为空，则根据子节点个数平均分配
  }

  onAddItem = () => {
    let values = _.cloneDeep(this.props.values);
    let list = _.get(values, this.props.bind, []);
    list.push({});
    this.props.emitChangeToParent(values, this.props.bind, list);
  }

  onDelItem = (index) => {
    let values = _.cloneDeep(this.props.values);
    let list = _.get(values, this.props.bind);
    list.splice(index, 1);
    this.props.emitChangeToParent(values, this.props.bind, list);
  }

  render() {
    // console.info('this', this);
    // console.info('this.props', this.props);
    let children = [];
    let value = this.props.value || [];
    let items = React.Children.toArray(this.props.children);
    let span = this.props.span;
    if (this.props.span === null) {
      let s = Math.floor((24 - 2) / items.length);
      span = _.fill(new Array(items.length), s, 0);
    }
    value.forEach((x, i) => {
      let cols = [];
      items.forEach((element, index) => {
        let id = `${this.props.bind}[${i}].${element.props.bind}`;
        if (this.props.defaultValues) {
          this.props.defaultValues.push({ bind: id, defaultValue: element.props.defaultValue });
        }
        let item = React.cloneElement(element, {
          bind: id,
          value: _.get(this.props.values, id),
          ruleOfForm: this.props.rules[id],
          ref: item => {
            if (item)
              this.props.items.push(item);
          },
          defaultValue: _.get(this.props.values, id) || element.props.defaultValue,
          emitChangeToParent: this.props.emitChangeToParent,
          getValues: this.props.getValues
        });
        cols.push(<Col span={span[index]} key={id}>{item}</Col>);
      });
      cols.push(
        <Col span={2} key={i+'del'}>
          <Icon className="dynamic-delete-button" type="minus-circle-o" style={{marginLeft: '12px'}} onClick={() => { this.onDelItem(i); }}/>
        </Col>)
      let row = <Row gutter={8} key={i} style={{paddingBottom: '10px'}}>{cols}</Row>;
      children.push(row);
    });

    return (
      <FormExItem {...this.props} bind={null} items={children}>
        {children}
        <Button type="dashed" onClick={this.onAddItem} style={{ width: '50%' }}>
          <Icon type="plus" /> {this.props.addText}
        </Button>
      </FormExItem>
    )
  }
}

FormExItemArray._name = 'FormExItemArray';

FormEx.Item = FormExItem;
FormEx.ItemArray = FormExItemArray;