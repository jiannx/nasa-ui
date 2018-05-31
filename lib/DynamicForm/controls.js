/**
 * 表单组件
 */
import React, { Component } from 'react';
import _ from 'lodash';
import { FormEx, SelectEx, InputEx } from 'src/components';
import { Input, Select, Col, Table, Radio, Checkbox, Popconfirm } from 'antd';

var Item = FormEx.Item;
var ItemArray = FormEx.ItemArray;
var RadioGroup = Radio.Group;

function ViewBr(_ref) {
  var item = _ref.item;

  return React.createElement(
    Col,
    { span: 24 },
    item.label
  );
}

function ViewText(_ref2) {
  var item = _ref2.item,
      get = _ref2.get,
      values = _ref2.values,
      gutter = _ref2.gutter,
      span = _ref2.span;

  if (item.render) {
    return React.createElement(
      Col,
      { span: span },
      item.label,
      '\uFF1A',
      item.render(get(item.bind), values)
    );
  }

  return React.createElement(
    Col,
    { span: span },
    item.label,
    '\uFF1A',
    get(item.bind, '') === null ? null : get(item.bind, '').toString()
  ); //兼容一下null的情况
}

function ViewArray(_ref3) {
  var item = _ref3.item,
      get = _ref3.get,
      values = _ref3.values,
      gutter = _ref3.gutter,
      span = _ref3.span;

  if (item.render) {
    return React.createElement(
      Col,
      { span: span },
      React.createElement(
        'div',
        { style: { float: 'left' } },
        item.label,
        '\uFF1A'
      ),
      React.createElement(
        'div',
        { style: { float: 'left' } },
        item.render(get(item.bind), values)
      )
    );
  }
  var render = function render() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    if (_.isString(x) || _.isBoolean(x)) {
      return x.toString();
    } else if (_.isArray(x)) {
      return x.join(', ');
    } else if (_.isPlainObject(x)) {
      return Object.keys(x).map(function (key) {
        return key + ':' + x[key] + '; ';
      });
    }
  };
  var columns = item.children.map(function (x, i) {
    x._index = i;
    return {
      title: x.label,
      dataIndex: x.bind,
      render: x.render ? x.render : render
    };
  });
  if (item.withEditCol) {
    columns.push({
      title: '操作',
      render: function render(text, record, index) {
        return React.createElement(
          'span',
          null,
          React.createElement(
            'a',
            { onClick: function onClick() {
                item.onArrayChildEdit(item.bind, index);
              } },
            '\u7F16\u8F91'
          ),
          '\xA0',
          React.createElement(
            Popconfirm,
            { placement: 'top', title: item.delConfirm ? 'item.delConfirm' : '确定删除该条目吗？', onConfirm: function onConfirm() {
                item.onArrayChildDel(item.bind, index);
              }, okText: '\u786E\u5B9A', cancelText: '\u53D6\u6D88' },
            React.createElement(
              'a',
              null,
              '\u5220\u9664'
            )
          )
        );
      }
    });
  }
  return React.createElement(
    Col,
    { span: 24 },
    React.createElement(Table, { dataSource: get(item.bind), size: 'small', rowKey: item.rowKey || '_index', pagination: false, columns: columns })
  );
}

export function viewNode(_ref4) {
  var item = _ref4.item,
      get = _ref4.get,
      values = _ref4.values,
      gutter = _ref4.gutter,
      span = _ref4.span;

  var node = void 0;
  if (item.type === 'br') {
    node = React.createElement(ViewBr, { item: item });
  } else if (item.type === 'array') {
    node = React.createElement(ViewArray, { item: item, get: get, values: values, gutter: gutter, span: span });
  } else if (item.type === 'object') {
    if (!item.render) item.render = function () {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return Object.keys(x).map(function (key) {
        return key + ': ' + x[key] + ', ';
      });
    };
    node = React.createElement(ViewText, { item: item, get: get, values: values, gutter: gutter, span: span });
  } else if (item.type === 'oneOf') {
    node = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = item.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var opt = _step.value;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = opt.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var x = _step2.value;

            node.push(React.createElement(ViewText, { item: x, get: get, values: values, gutter: gutter, span: span }));
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
  } else {
    node = React.createElement(ViewText, { item: item, get: get, values: values, gutter: gutter, span: span });
  }
  return node;
}

var baseControls = ['input', 'radio', 'select', 'checkbox', 'selectTag', 'br'];
// 基本组件
function formBase() {
  var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      item = _ref5.item,
      layout = _ref5.layout,
      values = _ref5.values,
      get = _ref5.get,
      defaultItem = _ref5.defaultItem,
      setChange = _ref5.setChange,
      getValues = _ref5.getValues,
      _ref5$isArrayChild = _ref5.isArrayChild,
      isArrayChild = _ref5$isArrayChild === undefined ? false : _ref5$isArrayChild;

  function set(id, value) {
    // console.log(id);
    // console.log(value);
    values = _.cloneDeep(getValues());
    // console.log(values);
    _.set(values, id, value);
    setChange(values);
  }

  var control = null;
  if (_.isFunction(item.control)) {
    control = item.control(getValues(), set);
  } else if (item.control) {
    control = item.control;
  } else {
    switch (item.type) {
      case 'input':
        control = React.createElement(InputEx, { type: 'text', placeholder: item.placeholder || item.label, addonBefore: item.addonBefore, addonAfter: item.addonAfter, disabled: item.disabled });
        break;
      case 'radio':
        if (!item.options) {
          item.options = [{ value: true, label: '是' }, { value: false, label: '否' }];
        }
        control = React.createElement(
          RadioGroup,
          null,
          ' ',
          isArrayChild && React.createElement(
            'span',
            null,
            item.label,
            ': '
          ),
          item.options.map(function (x) {
            return React.createElement(
              Radio,
              { value: x.value, key: x.value },
              x.label
            );
          })
        );
        break;
      case 'oneOf':
        if (!item.options) {
          item.options = [{ value: true, label: '是' }, { value: false, label: '否' }];
        }
        control = React.createElement(
          RadioGroup,
          null,
          item.options.map(function (x) {
            return React.createElement(
              Radio,
              { value: x.value, key: x.value },
              x.label
            );
          })
        );
        break;
      case 'select':
        if (!item.options) {
          item.options = [];
        }
        control = React.createElement(SelectEx, { options: item.options, label: item.selectLabel, bind: item.selectBind });
        break;
      case 'checkbox':
        control = React.createElement(
          Checkbox,
          null,
          item.label
        );
        break;
      case 'selectTag':
        control = React.createElement(Select, { mode: 'tags', style: { width: '100%' }, tokenSeparators: item.tokenSeparators, placeholder: item.label });
        break;
      default:
        break;
    }
  }
  var props = { bind: item.bind, required: item.required, rule: item.rule, onChange: item.onChange, defaultValue: item.defaultValue };
  if (isArrayChild) {
    return React.createElement(
      Item,
      props,
      control
    );
  }
  return React.createElement(
    Item,
    Object.assign({}, layout, props, { label: item.label }),
    control
  );
}

function formArray(_ref6) {
  var item = _ref6.item,
      layout = _ref6.layout,
      defaultItem = _ref6.defaultItem,
      get = _ref6.get;

  var nodes = [];
  item.children.forEach(function (child) {
    child = Object.assign({}, defaultItem, child);
    if (child.withLabel) {
      var node = formBase({
        item: child,
        layout: child.layout || {
          labelCol: {
            xs: { span: 12 },
            sm: { span: 12 }
          },
          wrapperCol: {
            xs: { span: 12 },
            sm: { span: 12 }
          }
        },
        isArrayChild: false,
        get: get
      });
      nodes.push(node);
    } else if (_.indexOf(baseControls, child.type) >= 0) {
      var _node = formBase({ item: child, layout: layout, isArrayChild: true, get: get });
      nodes.push(_node);
    } else {
      console.log('DynamicForm: formArray 存在未定义type');
    }
  });
  return React.createElement(
    ItemArray,
    Object.assign({}, layout, { label: item.label, bind: item.bind, defaultValue: item.defaultValue || [] }),
    React.Children.toArray(nodes)
  );
}

function formObject(_ref7) {
  var item = _ref7.item,
      layout = _ref7.layout,
      values = _ref7.values,
      get = _ref7.get;

  item.bindCopy = item.bind;
  item.bind = '_dynamic.array_' + item.bindCopy + item.label;
  item.children = [{ type: 'input', label: item.keyText, bind: 'key', required: true }, { type: 'input', label: item.valueText, bind: 'value', required: true }];
  // 初始化列表数据
  var obj = get(item.bindCopy, {});
  var list = Object.keys(obj).map(function (key) {
    return { key: key, value: obj[key] };
  });
  item.defaultValue = list;
  // 数据变更时，将数组形式转化为对象形式
  function onChange(values, key, v) {
    var obj = {};
    _.get(values, item.bind, []).forEach(function (x) {
      obj[x.key] = x.value;
    });
    _.set(values, item.bindCopy, obj);
    return values;
  }
  item.children.forEach(function (child) {
    child.onChange = onChange;
  });
  return formArray({ item: item, layout: layout, values: values, get: get });
}

// 根据索引删除属性 id = orign.ip
function delProperty(values, id) {
  var ids = id.split('.');
  if (ids.length === 1) {
    delete values[ids[0]];
  } else {
    var _id = ids.splice(0, ids.length - 1).join('.');
    values = _.get(values, _id, {});
    delete values[ids[ids.length - 1]];
  }
}

function formOne(_ref8) {
  var item = _ref8.item,
      layout = _ref8.layout,
      values = _ref8.values,
      get = _ref8.get;

  //生成 radio
  item.bind = '_dynamic.oneof_radio_' + item.label;
  item.onChange = function (newValues, key, value) {
    // 移除未选中类型中的属性
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = item.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var option = _step3.value;

        if (option.label !== value) {
          option.children.forEach(function (x) {
            delProperty(newValues, x.bind);
          });
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

    return newValues;
  };
  item.options = item.children.map(function (x) {
    return { value: x.label, label: x.label };
  });
  // 设置初始选中项
  item.defaultValue = item.children[0].label;
  var list = [];
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = item.children[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var option = _step4.value;

      var optionChildren = option.children.map(function (childItem) {
        return formNode({ item: childItem, layout: layout, values: values, get: get });
      });
      var controls = React.createElement(
        'div',
        null,
        get(item.bind) === option.label && React.Children.toArray(optionChildren)
      );
      list.push(controls);
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

  var radio = formBase({ item: item, layout: layout, values: values, get: get });

  return [radio, list];
}

// setChange：手动设置values，传入变更后的values
export function formNode(_ref9) {
  var item = _ref9.item,
      layout = _ref9.layout,
      values = _ref9.values,
      get = _ref9.get,
      defaultItem = _ref9.defaultItem,
      setChange = _ref9.setChange,
      getValues = _ref9.getValues;

  item = Object.assign({}, defaultItem, item);
  var type = item.type;
  if (_.indexOf(baseControls, type) >= 0) {
    return formBase({ item: item, layout: layout, values: values, get: get, defaultItem: defaultItem, setChange: setChange, getValues: getValues });
  } else if (type === 'array') {
    return formArray({ item: item, layout: layout, values: values, get: get, defaultItem: defaultItem, setChange: setChange, getValues: getValues });
  } else if (type === 'object') {
    return formObject({ item: item, layout: layout, values: values, get: get, defaultItem: defaultItem, setChange: setChange, getValues: getValues });
  } else if (type === 'oneOf') {
    return formOne({ item: item, layout: layout, values: values, get: get, defaultItem: defaultItem, setChange: setChange, getValues: getValues });
  } else {
    console.log('DynamicForm: 存在未定义type');
    console.log(item);
  }
}
//# sourceMappingURL=controls.js.map