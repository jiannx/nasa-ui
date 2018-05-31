/**
 * 动态表单及显示
 */
import React, { Component } from 'react';
import _ from 'lodash';
import { FormEx } from 'src/components';
import { Button, Row, Modal } from 'antd';

import { formNode, viewNode } from './controls.jsx';

const defaultItem = {
  type: 'input', //string, input||radio||checkbox||select||oneOf 多项只能配置一项||array列表项||br换行||selectTag多重输入
  label: '', // 标题文本
  bind: null, // 显示及编辑时对应数据中的索引
  render: null, // 显示时处理函数
  children: null, // array, array 中子节点
  canEdit: true, // 当前项是否可编辑
  required: false, // 编辑时是否必填
  rule: [], // 编辑时校验规则
  defaultValue: null, // 默认值
  // Object 两个文本框实现键值对形式 
  keyText: 'key', // key值文本框文本 
  valueText: 'value', // value 文本框显示文本
  // select
  options: null,
  selectLabel: null, // 对应selectEx组件中 label
  selectBind: null, // 对应selectEx组件中 bind
  // array可选参数 参照 FormExItemArray的参数
  rowKey: null, // table显示时的rowKey
  span: null, // 编辑时布局
  addText: '新增', // 编辑时新增文本
  withEditCol: false, // 是否添加编辑列
  addTitle: null, // 添加标题
  editTitle: null, // 编辑标题
  delConfirm: null, // 删除前确认信息
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

export default class DynamicForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: _.cloneDeep(props.values), // 用于编辑使用
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

  get = (bind, defaultValue) => {
    return _.get(this.props.values, bind, defaultValue);
  }

  getOfState = (bind, defaultValue) => {
    return _.get(this.state.values, bind, defaultValue);
  }

  // 显示生成
  renderView = () => {
    let doms = [];
    for (let item of this.props.items) {
      item = Object.assign({}, defaultItem, item);
      item.onArrayChildEdit = this.onArrayChildEdit;
      item.onArrayChildDel = this.onArrayChildDel;
      let node = viewNode({
        layout,
        item,
        values: this.props.values,
        get: this.get,
        defaultItem,
        gutter: this.props.gutter,
        span: this.props.span
      });
      doms.push(node);
    }
    return React.Children.toArray(doms);
  }

  // 表单生成
  renderForm = () => {
    let doms = [];
    for (let item of this.props.items) {
      item = Object.assign({}, defaultItem, item);
      if (!item.canEdit) continue;

      let node = formNode({
        layout,
        item,
        values: this.props.values,
        get: this.getOfState,
        getValues: () => this.state.values,
        defaultItem,
        setChange: this.onValuesChange
      });
      doms.push(node);
    }
    let form = <FormEx values={this.state.values} onChange={this.onValuesChange}>{React.Children.toArray(doms)}</FormEx>
    return form;
  }

  // 生成数组数据单项添加表单，默认情况下，index存在为编辑，不存在为添加
  renderArrayChildForm = () => {
    let arrayItem = _.cloneDeep(this.state.arrayChildItem); // 每次页面刷新都会操作items，必须拷贝一份
    let index = this.state.arrayChildIndex;
    let doms = [];

    // console.log(arrayItem);
    // console.log(index);
    // console.log(this.state.values);

    for (let item of arrayItem.children) {
      item.bind = `${arrayItem.bind}[${index}].${item.bind}`;
      if (item.type === 'oneOf' && item.children) {
        for (let opt of item.children) {
          for (let child of opt.children) {
            console.log(child);
            child.bind = `${arrayItem.bind}[${index}].${child.bind}`
          }
        }
      }
      let node = formNode({
        layout,
        item,
        values: this.props.values,
        get: this.getOfState,
        getValues: () => this.state.values,
        defaultItem,
        setChange: this.onValuesChange
      });
      doms.push(node);
    }
    let form = <FormEx values={this.state.values} onChange={this.onValuesChange}>{React.Children.toArray(doms)}</FormEx>
    return form;
  }

  onValuesChange = (values, key, value) => {
    // console.log(values);
    // console.log(key);
    // console.log(value);
    this.setState({
      values: values
    });
  }

  onFormEdit = () => {
    this.setState({
      modalVisible: true,
      values: _.cloneDeep(this.props.values), // 编辑的数据重置
    });
  }

  // 数组添加元素接口, 。id对应数据中的数组索引，默认为第一个array属性
  onArrayChildEdit = (id, index) => {
    let arrayItem, title;
    if (id) {
      arrayItem = _.cloneDeep(this.props.items.find(x => x.bind === id))
    } else {
      arrayItem = _.cloneDeep(this.props.items.find(x => x.type === 'array'));
    }
    // console.log(arrayItem);
    if (!arrayItem) {
      console.log('未找到可编辑数据');
      return;
    }
    if (index !== undefined) {
      title = arrayItem.editTitle ? arrayItem.editTitle : this.props.title + '编辑';
    } else {
      title = arrayItem.addTitle ? arrayItem.editTitle : this.props.title + '添加';
    }
    let currentValues = this.get(arrayItem.bind, []);
    index = index === undefined ? currentValues.length : index;
    // console.log(index);
    this.setState({
      values: _.cloneDeep(this.props.values),
      arrayChildModal: true,
      arrayChildModalTitle: title,
      arrayChildId: id,
      arrayChildItem: arrayItem,
      arrayChildIndex: index,
    });
  }

  onArrayChildAdd = (id) => {
    this.onArrayChildEdit(id);
  }

  onArrayChildDel = (id, index) => {
    let arrayItem;
    if (id) {
      arrayItem = _.cloneDeep(this.props.items.find(x => x.bind === id))
    } else {
      arrayItem = _.cloneDeep(this.props.items.find(x => x.type === 'array'));
    }
    if (!arrayItem) {
      console.log('未找到可编辑数据');
      return;
    }
    let values = _.cloneDeep(this.props.values);
    let list = _.get(values, arrayItem.bind);
    list.splice(index, 1);
    this.props.onSubmit(values, () => {});
    //let info = arrayItem.delConfirm ? arrayItem.editTitle : '确定删除该条目吗？';
    // Modal.confirm({
    //   content: info,
    //   onOk: () => {

    //   }
    // });
  }

  // 弹窗确定按钮事件
  onFormSubmit = () => {
    // console.log(this.state.values);
    // return;
    // let data;
    // if (typeof(this.props.formatSubmitData) === 'function') {
    //   data = this.props.formatSubmitData(_.deepClone(this.state.values));
    // } 
    this.setState({
      confirmLoading: true,
    });
    this.props.onSubmit(this.state.values, () => {
      this.onFormCancel();
    });
  }

  onFormCancel = () => {
    this.setState({
      modalVisible: false,
      arrayChildModal: false,
      confirmLoading: false,
    });
  }

  // 遍历子节点，获取htmlType === 'submit'的按钮，绑定form编辑事件
  deepClone = (doms) => {
    let cloneElements = [];
    React.Children.toArray(doms).forEach((element, index) => {
      if (!_.isPlainObject(element)) {
        cloneElements.push(element);
      } else if (element.type.name === Button.name && element.props.htmlType === 'submit') {
        cloneElements.push(React.cloneElement(element, {
          onClick: this.onFormEdit
        }));
      } else {
        let children = this.deepClone(element.props.children);
        cloneElements.push(React.cloneElement(element, null, children));
      }
    });
    return cloneElements;
  }

  render() {
    let children = this.deepClone(this.props.children);

    return (
      <div className={this.props.className}>
        {children}
        <div style={{padding: '0 8px'}}>
          <Row gutter={this.props.gutter}>
            {this.renderView()}
          </Row>
        </div>
        { this.state.modalVisible && 
          <Modal
            title={this.props.title}
            visible={true}
            confirmLoading={this.state.confirmLoading}
            onOk={this.onFormSubmit}
            onCancel={this.onFormCancel}
            okText="保存"
            cancelText="取消"
            width="800px"
          >
            {this.renderForm()}
          </Modal>
        }
        { this.state.arrayChildModal && 
          <Modal
            title={this.state.arrayChildModalTitle}
            visible={true}
            confirmLoading={this.state.confirmLoading}
            onOk={this.onFormSubmit}
            onCancel={this.onFormCancel}
            okText="保存"
            cancelText="取消"
            width="800px"
          >
            {this.renderArrayChildForm()}
          </Modal>
        }
      </div>
    )
  }
}
