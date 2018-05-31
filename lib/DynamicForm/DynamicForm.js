var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * 动态表单及显示
 */
import React, { Component } from 'react';
import _ from 'lodash';
import { FormEx } from 'src/components';
import { Button, Row, Modal } from 'antd';

import { formNode, viewNode } from './controls.jsx';

var defaultItem = {
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

var DynamicForm = function (_Component) {
  _inherits(DynamicForm, _Component);

  function DynamicForm(props) {
    _classCallCheck(this, DynamicForm);

    var _this = _possibleConstructorReturn(this, (DynamicForm.__proto__ || Object.getPrototypeOf(DynamicForm)).call(this, props));

    _this.get = function (bind, defaultValue) {
      return _.get(_this.props.values, bind, defaultValue);
    };

    _this.getOfState = function (bind, defaultValue) {
      return _.get(_this.state.values, bind, defaultValue);
    };

    _this.renderView = function () {
      var doms = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _this.props.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          item = Object.assign({}, defaultItem, item);
          item.onArrayChildEdit = _this.onArrayChildEdit;
          item.onArrayChildDel = _this.onArrayChildDel;
          var node = viewNode({
            layout: layout,
            item: item,
            values: _this.props.values,
            get: _this.get,
            defaultItem: defaultItem,
            gutter: _this.props.gutter,
            span: _this.props.span
          });
          doms.push(node);
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

      return React.Children.toArray(doms);
    };

    _this.renderForm = function () {
      var doms = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _this.props.items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var item = _step2.value;

          item = Object.assign({}, defaultItem, item);
          if (!item.canEdit) continue;

          var node = formNode({
            layout: layout,
            item: item,
            values: _this.props.values,
            get: _this.getOfState,
            getValues: function getValues() {
              return _this.state.values;
            },
            defaultItem: defaultItem,
            setChange: _this.onValuesChange
          });
          doms.push(node);
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

      var form = React.createElement(
        FormEx,
        { values: _this.state.values, onChange: _this.onValuesChange },
        React.Children.toArray(doms)
      );
      return form;
    };

    _this.renderArrayChildForm = function () {
      var arrayItem = _.cloneDeep(_this.state.arrayChildItem); // 每次页面刷新都会操作items，必须拷贝一份
      var index = _this.state.arrayChildIndex;
      var doms = [];

      // console.log(arrayItem);
      // console.log(index);
      // console.log(this.state.values);

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = arrayItem.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var item = _step3.value;

          item.bind = arrayItem.bind + '[' + index + '].' + item.bind;
          if (item.type === 'oneOf' && item.children) {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = item.children[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var opt = _step4.value;
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                  for (var _iterator5 = opt.children[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var child = _step5.value;

                    console.log(child);
                    child.bind = arrayItem.bind + '[' + index + '].' + child.bind;
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
          var node = formNode({
            layout: layout,
            item: item,
            values: _this.props.values,
            get: _this.getOfState,
            getValues: function getValues() {
              return _this.state.values;
            },
            defaultItem: defaultItem,
            setChange: _this.onValuesChange
          });
          doms.push(node);
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

      var form = React.createElement(
        FormEx,
        { values: _this.state.values, onChange: _this.onValuesChange },
        React.Children.toArray(doms)
      );
      return form;
    };

    _this.onValuesChange = function (values, key, value) {
      // console.log(values);
      // console.log(key);
      // console.log(value);
      _this.setState({
        values: values
      });
    };

    _this.onFormEdit = function () {
      _this.setState({
        modalVisible: true,
        values: _.cloneDeep(_this.props.values) // 编辑的数据重置
      });
    };

    _this.onArrayChildEdit = function (id, index) {
      var arrayItem = void 0,
          title = void 0;
      if (id) {
        arrayItem = _.cloneDeep(_this.props.items.find(function (x) {
          return x.bind === id;
        }));
      } else {
        arrayItem = _.cloneDeep(_this.props.items.find(function (x) {
          return x.type === 'array';
        }));
      }
      // console.log(arrayItem);
      if (!arrayItem) {
        console.log('未找到可编辑数据');
        return;
      }
      if (index !== undefined) {
        title = arrayItem.editTitle ? arrayItem.editTitle : _this.props.title + '编辑';
      } else {
        title = arrayItem.addTitle ? arrayItem.editTitle : _this.props.title + '添加';
      }
      var currentValues = _this.get(arrayItem.bind, []);
      index = index === undefined ? currentValues.length : index;
      // console.log(index);
      _this.setState({
        values: _.cloneDeep(_this.props.values),
        arrayChildModal: true,
        arrayChildModalTitle: title,
        arrayChildId: id,
        arrayChildItem: arrayItem,
        arrayChildIndex: index
      });
    };

    _this.onArrayChildAdd = function (id) {
      _this.onArrayChildEdit(id);
    };

    _this.onArrayChildDel = function (id, index) {
      var arrayItem = void 0;
      if (id) {
        arrayItem = _.cloneDeep(_this.props.items.find(function (x) {
          return x.bind === id;
        }));
      } else {
        arrayItem = _.cloneDeep(_this.props.items.find(function (x) {
          return x.type === 'array';
        }));
      }
      if (!arrayItem) {
        console.log('未找到可编辑数据');
        return;
      }
      var values = _.cloneDeep(_this.props.values);
      var list = _.get(values, arrayItem.bind);
      list.splice(index, 1);
      _this.props.onSubmit(values, function () {});
      //let info = arrayItem.delConfirm ? arrayItem.editTitle : '确定删除该条目吗？';
      // Modal.confirm({
      //   content: info,
      //   onOk: () => {

      //   }
      // });
    };

    _this.onFormSubmit = function () {
      // console.log(this.state.values);
      // return;
      // let data;
      // if (typeof(this.props.formatSubmitData) === 'function') {
      //   data = this.props.formatSubmitData(_.deepClone(this.state.values));
      // } 
      _this.setState({
        confirmLoading: true
      });
      _this.props.onSubmit(_this.state.values, function () {
        _this.onFormCancel();
      });
    };

    _this.onFormCancel = function () {
      _this.setState({
        modalVisible: false,
        arrayChildModal: false,
        confirmLoading: false
      });
    };

    _this.deepClone = function (doms) {
      var cloneElements = [];
      React.Children.toArray(doms).forEach(function (element, index) {
        if (!_.isPlainObject(element)) {
          cloneElements.push(element);
        } else if (element.type.name === Button.name && element.props.htmlType === 'submit') {
          cloneElements.push(React.cloneElement(element, {
            onClick: _this.onFormEdit
          }));
        } else {
          var children = _this.deepClone(element.props.children);
          cloneElements.push(React.cloneElement(element, null, children));
        }
      });
      return cloneElements;
    };

    _this.state = {
      values: _.cloneDeep(props.values) // 用于编辑使用
    };
    return _this;
  }

  _createClass(DynamicForm, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {}
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {}

    // 显示生成


    // 表单生成


    // 生成数组数据单项添加表单，默认情况下，index存在为编辑，不存在为添加


    // 数组添加元素接口, 。id对应数据中的数组索引，默认为第一个array属性


    // 弹窗确定按钮事件


    // 遍历子节点，获取htmlType === 'submit'的按钮，绑定form编辑事件

  }, {
    key: 'render',
    value: function render() {
      var children = this.deepClone(this.props.children);

      return React.createElement(
        'div',
        { className: this.props.className },
        children,
        React.createElement(
          'div',
          { style: { padding: '0 8px' } },
          React.createElement(
            Row,
            { gutter: this.props.gutter },
            this.renderView()
          )
        ),
        this.state.modalVisible && React.createElement(
          Modal,
          {
            title: this.props.title,
            visible: true,
            confirmLoading: this.state.confirmLoading,
            onOk: this.onFormSubmit,
            onCancel: this.onFormCancel,
            okText: '\u4FDD\u5B58',
            cancelText: '\u53D6\u6D88',
            width: '800px'
          },
          this.renderForm()
        ),
        this.state.arrayChildModal && React.createElement(
          Modal,
          {
            title: this.state.arrayChildModalTitle,
            visible: true,
            confirmLoading: this.state.confirmLoading,
            onOk: this.onFormSubmit,
            onCancel: this.onFormCancel,
            okText: '\u4FDD\u5B58',
            cancelText: '\u53D6\u6D88',
            width: '800px'
          },
          this.renderArrayChildForm()
        )
      );
    }
  }]);

  return DynamicForm;
}(Component);

DynamicForm.defaultProps = {
  title: '', // 编辑时弹窗标题
  values: {}, // 完整数据
  items: [], // 配置项 
  onSubmit: function onSubmit(values) {}, // 编辑保存时提交事件
  gutter: 16, // row内填充
  span: 8 // 单个元素占据多大 总共24
};
export default DynamicForm;
//# sourceMappingURL=DynamicForm.js.map