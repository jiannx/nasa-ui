/**
 * 动态表单及显示 待完善
 */
import React, { Component } from 'react';
import _ from 'lodash';
import { FormEx } from 'src/components';
import { Button, Row, Col, Modal, Input, Radio, Select, Checkbox, Icon } from 'antd';
import FormEx2 from './FormEx2.jsx';

const FormItem = FormEx2.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

const defaultItem = {
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
  tokenSeparators: [','], // 分隔符
}

const layout = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 18 },
  },
};


export default class DynamicFormEx2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: _.cloneDeep(props.defaultValues),
    };
  }

  static defaultProps = {
    title: '', // 编辑时弹窗标题
    values: {}, // 完整数据
    items: [], // 配置项 
    onSubmit: (values) => {}, // 编辑保存时提交事件
    gutter: 16, // row内填充
    span: 8, // 单个元素占据多大 总共24
  }

  componentWillReceiveProps(nextProps) {}

  componentDidMount() {}

  // 类表添加行
  onArrayAdd = (dataIndex) => {
    let listData = _.cloneDeep(_.get(this.state.values, dataIndex, []));
    listData.push({});
    this.form.setValue(dataIndex, listData);
  }
  // 列表删除行
  onArrayDel = (dataIndex, index) => {
    let listData = _.get(this.state.values, dataIndex, []);
    listData.splice(index, 1);
    this.form.setValue(dataIndex, listData);
  }

  // 根据列表数据生成对象数据结构
  onSetObjectData = (listDataIndex, dataIndex) => {
    let listData = _.get(this.state.values, listDataIndex, []);
    let data = {};
    listData.forEach(x => {
      if (x && x !== '') {
        data[x.key] = x.value
      }
    });
    this.form.setValue(dataIndex, data);
  }

  // 根据索引删除属性 id = orign.ip
  delProperty = (values, id) => {
    let ids = id.split('.');
    if (ids.length === 1) {
      delete values[ids[0]];
    } else {
      let id = ids.splice(0, ids.length - 1).join('.');
      values = _.get(values, id, {});
      delete values[ids[ids.length - 1]];
    }
  }

  onOneOfChange = (props, values, key, selLabel) => {
    console.log(selLabel);
    setTimeout(() => {
      _.set(values, key, selLabel);
      for (let opt of props.children) {
        if (opt.label !== selLabel) {
          for (let child of opt.children) {
            this.delProperty(this.state.values, child.bind);
          }
        }
      }
      // this.from.setValues(this.state.values);
    }, 2000);
  }

  renderDecorator = (props) => {
    let self = this;
    let decorator;

    if (props.decorator) {
      decorator = _.isFunction(props.decorator) ? props.decorator(props) : props.decorator;
    }
    // input 
    else if (props.type === 'input') {
      decorator = <Input placeholder={props.placeholder}></Input>;
    }
    // radio
    else if (props.type === 'radio') {
      decorator = (
        <RadioGroup>
          { props.options.map( x => <Radio value={x.value} key={x.value}>{x.label}</Radio>)}
        </RadioGroup>
      );
    }
    // select 
    else if (props.type === 'select') {
      decorator = (
        <Select>
          { props.options.map( x => <Option value={x.value} key={x.value}>{x.label}</Option>)}
        </Select>
      );
    }
    // 多选
    else if (props.type === 'selectMult') {
      decorator = (
        <Select mode="tags">
          { props.options.map( x => <Option value={x.value} key={x.value}>{x.label}</Option>)}
        </Select>
      );
    }
    // 多重输入 
    else if (props.type === 'selectTag') {
      decorator = (
        <Select mode="multiple">
          { props.options.map( x => <Option value={x.value} key={x.value}>{x.label}</Option>)}
        </Select>
      );
    }
    // checkbox
    else if (props.type === 'checkbox') {
      decorator = (
        <Checkbox>{props.label}</Checkbox>
      );
    }
    // checknbox grop
    else if (props.type === 'checkboxGroup') {
      decorator = (
        <CheckboxGroup options={props.options}>{props.label}</CheckboxGroup>
      );
    }
    // one of 
    else if (props.type === 'oneOf') {
      decorator = (
        <RadioGroup>
          { props.options.map( x => <Radio value={x.value} key={x.value}>{x.label}</Radio>)}
        </RadioGroup>
      );
    }
    // array 
    else if (props.type === 'array') {
      let listData = _.get(this.state.values, props.bind, []); // todo 
      let spanLength = Math.floor((24 - 2) / props.children.length);
      decorator = (
        <div>
          { listData.map((d, index) => (
            <Row gutter={8} key={index}>
              { props.children.map( (x, i) => {
                return <Col span={x.span ? x.span: spanLength} style={{paddingBottom: '4px'}} key={i}>
                  <FormItem
                    required={x.required} 
                    rules={x.rules}
                    defaultValue={x.defaultValue} 
                    dataIndex={`${props.bind}[${index}].${x.bind}`} 
                    decorator={this.renderDecorator(x)}
                  />
                </Col>
              })}
              <Col span="2">
                <Icon className="dynamic-delete-button" type="minus-circle-o" onClick={() => this.onArrayDel(props.bind, index)}/>
              </Col>
            </Row>
          ))}
          <Button type="dashed" onClick={() => this.onArrayAdd(props.bind)}><Icon type="plus"/> {props.addText}</Button>
        </div>
      )
    }
    // object 
    else if (props.type === 'object') {
      let dataIndex = '_dynamic.' + props.bind
      let listData = _.get(this.state.values, dataIndex); // todo 
      let spanLength = Math.floor((24 - 2) / 2);
      // 数据初始化
      if (!listData) {
        listData = [];
        let data = _.get(this.state.values, props.bind, {});
        for (let key of Object.keys(data)) {
          listData.push({ key: key, value: data[key] });
        }
        setTimeout(() => {
          this.form.setValue(dataIndex, listData);
        });
      }
      decorator = (
        <div>
          { listData.map((d, index) => (
            <Row gutter={8} key={index}>
              <Col span={spanLength} style={{paddingBottom: '4px'}}>
                <FormItem
                  required
                  dataIndex={`${dataIndex}[${index}].key`} 
                  decorator={
                    <Input placeholder={props.keyLabel}></Input>
                  }
                  onChange={ 
                    _.debounce(() => {
                      self.onSetObjectData(dataIndex, props.bind);
                    }, 2000)
                  }
                />
              </Col>
              <Col span={spanLength} style={{paddingBottom: '4px'}}>
                <FormItem
                  required
                  dataIndex={`${dataIndex}[${index}].value`} 
                  decorator={
                    <Input placeholder={props.valueLabel}></Input>
                  }
                  onChange={
                    _.debounce(() => {
                      self.onSetObjectData(dataIndex, props.bind);
                    }, 200)
                  }
                />
              </Col>
              <Col span="2">
                <Icon className="dynamic-delete-button" type="minus-circle-o" onClick={() => this.onArrayDel(dataIndex, index)}/>
              </Col>
            </Row>
          ))}
          <Button type="dashed" onClick={() => this.onArrayAdd(dataIndex)}><Icon type="plus"/> {props.addText}</Button>
        </div>
      )
    }

    return decorator;
  }

  renderItem = (item) => {
    let items = []; // 单项可能会生成多个表单控件
    let props = Object.assign({}, defaultItem, item); // 参数生成

    let withDataIndex = true;
    // 表单控件，还是只是布局所用。
    if (props.type === 'array' || props.type === 'object' || !props.bind) {
      withDataIndex = false;
    }
    // oneof 生成可选项
    if (props.type === 'oneOf') {
      withDataIndex = true;
      props.bind = `_dynamic.${props.label}`;
      props.options = [];
      for (let opt of props.children) {
        props.options.push({ label: opt.label, value: opt.label });
      }
    }
    if (props.type === 'radio' && !props.options) {
      props.options = [{ label: '是', value: true }, { label: '否', value: false }];
    }

    let decorator = this.renderDecorator(props);
    if (props.disabled === true) {
      decorator = React.cloneElement(decorator, {
        disabled: true
      });
    }
    items.push(
      <FormItem
        {...layout} 
        label={props.label} 
        required={props.required} 
        rules={props.rules}
        defaultValue={ withDataIndex ? props.defaultValue : undefined} 
        dataIndex={ withDataIndex ? props.bind : undefined} 
        decorator={ withDataIndex ? decorator : undefined}
      >
        {withDataIndex ? null: decorator}
      </FormItem>
    );

    if (props.type === 'oneOf') {
      let currentSel = _.get(this.state.values, `_dynamic.${props.label}`);
      // console.log(currentSel);
      for (let opt of props.children) {
        let optChild = [];
        for (let child of opt.children) {
          // 数据初始化
          let value = _.get(this.state.values, child.bind);
          if (value !== undefined && !currentSel && currentSel !== opt.label) {
            setTimeout(() => {
              this.form.setValue(`_dynamic.${props.label}`, opt.label);
            });
          }
          optChild.push(
            <FormItem
              {...layout} 
              label={child.label} 
              required={child.required} 
              rules={child.rules}
              defaultValue={ child.defaultValue } 
              dataIndex={ child.bind } 
              decorator={ this.renderDecorator(child)}
            >
            </FormItem>
          );
        }
        items.push(
          <div>{ _.get(this.state.values, `_dynamic.${props.label}`) === opt.label && optChild}</div>
        )
      }
    }
    return items;
  }

  renderChildren = () => {
    let items = [];
    this.props.items.forEach(item => {
      items = items.concat(item ? this.renderItem(item) : []);
    });
    return React.Children.toArray(items);
  }

  render() {
    let items = this.renderChildren();

    return (
      <div className={this.props.className}>
        <FormEx2
          defaultValues={this.props.defaultValues}
          onChange={ values => {
            console.log(values);
            this.setState({ values: values});
            this.props.onChange && this.props.onChange(values);
          }}
          ref={form => this.form = form}
        >
          {items}
        </FormEx2>
      </div>
    )
  }
}