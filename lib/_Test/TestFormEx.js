var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import { Button, message, Input, Switch, Select, Radio, Rate, Slider, Checkbox } from 'antd';
import { FormEx2, ModalEx } from '../index.js';

var FormItem = FormEx2.Item;
var Option = Select.Option;
var RadioGroup = Radio.Group;

var formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 8 }
};

var ModalForm = function (_Component) {
  _inherits(ModalForm, _Component);

  function ModalForm(props) {
    _classCallCheck(this, ModalForm);

    var _this = _possibleConstructorReturn(this, (ModalForm.__proto__ || Object.getPrototypeOf(ModalForm)).call(this, props));

    _this.handleOk = function (close) {
      _this.form.submit(function () {
        console.log('ModalForm success');
        close && close();
      });
    };

    return _this;
  }

  _createClass(ModalForm, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return React.createElement(
        FormEx2,
        {
          onValidate: function onValidate(status) {
            _this2.setState({ formValidate: status });
          },
          ref: function ref(f) {
            _this2.form = f;
          }
        },
        React.createElement(FormItem, {
          label: '\u540D\u79F0',
          labelCol: { span: 4 },
          wrapperCol: { span: 8 },
          dataIndex: 'name',
          required: true,
          decorator: React.createElement(Input, { onFocus: function onFocus() {
              console.log('input focus');
            } })
        })
      );
    }
  }]);

  return ModalForm;
}(Component);

var ModalFormWithButton = function (_Component2) {
  _inherits(ModalFormWithButton, _Component2);

  function ModalFormWithButton(props) {
    _classCallCheck(this, ModalFormWithButton);

    var _this3 = _possibleConstructorReturn(this, (ModalFormWithButton.__proto__ || Object.getPrototypeOf(ModalFormWithButton)).call(this, props));

    _this3.state = {
      formValidate: false
    };
    return _this3;
  }

  _createClass(ModalFormWithButton, [{
    key: 'render',
    value: function render() {
      var _this4 = this;

      return React.createElement(
        FormEx2,
        {
          onValidate: function onValidate(status) {
            _this4.setState({ formValidate: status });
          },
          onSubmit: function onSubmit(values) {
            console.log(_this4.form);
            console.info('ModalFormWithButton 提交数据', values);
            _this4.props.modal.ok();
          },
          ref: function ref(f) {
            _this4.form = f;
          }
        },
        React.createElement(FormItem, {
          label: '\u540D\u79F0',
          labelCol: { span: 4 },
          wrapperCol: { span: 8 },
          dataIndex: 'name',
          required: true,
          decorator: React.createElement(Input, { onFocus: function onFocus() {
              console.log('input focus');
            } })
        }),
        React.createElement(Input, { onFocus: function onFocus() {
            console.log('input focus');
          } }),
        React.createElement(
          'div',
          { className: 'ant-modal-footer', style: { margin: '0 -16px -16px -16px' } },
          React.createElement(
            Button,
            { size: 'large', onClick: this.props.modal.close },
            '\u53D6\u6D88'
          ),
          React.createElement(
            Button,
            { size: 'large', type: 'primary', htmlType: 'submit', disabled: !this.state.formValidate },
            '\u63D0\u4EA4'
          )
        )
      );
    }
  }]);

  return ModalFormWithButton;
}(Component);

var TestFormEx = function (_Component3) {
  _inherits(TestFormEx, _Component3);

  function TestFormEx(props) {
    _classCallCheck(this, TestFormEx);

    var _this5 = _possibleConstructorReturn(this, (TestFormEx.__proto__ || Object.getPrototypeOf(TestFormEx)).call(this, props));

    _this5.modalForm = function () {
      ModalEx.confirm({
        title: '弹窗表单',
        content: React.createElement(ModalForm, null),
        onOk: function onOk(close) {
          close && close();
          console.log('ModalEx ok');
        }
      });
    };

    _this5.modalFormWithButton = function () {
      ModalEx.confirm({
        title: '弹窗表单',
        content: React.createElement(ModalFormWithButton, null),
        footer: null,
        onOk: function onOk(close) {
          close && close();
          console.log('ModalEx ok');
        }
      });
    };

    _this5.state = {};
    return _this5;
  }

  _createClass(TestFormEx, [{
    key: 'render',
    value: function render() {
      var _this6 = this;

      return React.createElement(
        'div',
        null,
        React.createElement(
          'h1',
          null,
          '\u8868\u5355'
        ),
        React.createElement('br', null),
        React.createElement(
          'h2',
          null,
          '\u8868\u5355\u4E00 \u5F39\u7A97\u8868\u5355'
        ),
        React.createElement(
          Button,
          { onClick: this.modalForm },
          '\u5F39\u7A97\u8868\u5355'
        ),
        React.createElement('br', null),
        React.createElement(
          'h2',
          null,
          '\u8868\u5355\u4E8C \u5F39\u7A97\u8868\u5355 \u5173\u8054\u6309\u94AE'
        ),
        React.createElement(
          Button,
          { onClick: this.modalFormWithButton },
          '\u5F39\u7A97\u8868\u5355 \u5173\u8054\u6309\u94AE'
        ),
        React.createElement('br', null),
        React.createElement(
          'h2',
          null,
          '\u8868\u5355\u4E09 \u57FA\u672C\u8868\u5355'
        ),
        React.createElement(
          FormEx2,
          {
            defaultValues: { name: '', isOk: true },
            onValidate: function onValidate(status) {
              console.log('\u8868\u5355\u6821\u9A8C\u72B6\u6001 ' + status);
              _this6.setState({ formValidate: status });
            },
            onSubmit: function onSubmit(data) {
              console.info('button submit', data);
            },
            ref: function ref(f) {
              return _this6.form = f;
            }
          },
          React.createElement(FormItem, Object.assign({
            label: '\u540D\u79F0',
            dataIndex: 'name'
          }, formItemLayout, {
            required: true,
            decorator: React.createElement(Input, { onFocus: function onFocus() {
                console.log('input focus');
              } })
          })),
          React.createElement(FormItem, Object.assign({
            label: '\u5931\u7126\u6821\u9A8C',
            dataIndex: 'nameBlur'
          }, formItemLayout, {
            required: true,
            trigger: 'onBlur',
            rules: [{ min: 6, max: 16, message: '请输入6-16位密码' }, { pattern: /^[a-zA-Z0-9#@!~%^&*_\\.-]{6,16}$/, message: '请输入英文、数字、特殊字符的任意组合' }, {
              validator: function validator(rule, value, callback, source, options) {
                if (value === 'aaaaaa') {
                  callback(false);
                } else {
                  callback();
                }
              },
              message: '名称已存在' }],
            decorator: React.createElement(Input, { onFocus: function onFocus() {
                console.log('input focus');
              }, onBlur: function onBlur() {
                console.log('input blur');
              }, placeholder: '\u8F93\u5165aaaaaa\u663E\u793A\u5DF2\u5B58\u5728' })
          })),
          React.createElement(FormItem, Object.assign({
            label: '\u5F00\u542F',
            dataIndex: 'isOk'
          }, formItemLayout, {
            decorator: React.createElement(Switch, null)
          })),
          React.createElement(FormItem, Object.assign({
            label: '\u5F00\u542F(\u9ED8\u8BA4\u503C)',
            dataIndex: 'isOkDefault',
            defaultValue: true
          }, formItemLayout, {
            decorator: React.createElement(Switch, null)
          })),
          React.createElement(FormItem, Object.assign({
            label: 'radio group 1',
            dataIndex: 'radiogroup.child.aa',
            required: true
          }, formItemLayout, {
            decorator: React.createElement(
              Radio.Group,
              null,
              React.createElement(
                Radio.Button,
                { value: 'horizontal' },
                'Horizontal'
              ),
              React.createElement(
                Radio.Button,
                { value: 'vertical' },
                'Vertical'
              ),
              React.createElement(
                Radio.Button,
                { value: 'inline' },
                'Inline'
              )
            )
          })),
          React.createElement(FormItem, Object.assign({
            label: 'radio group 2',
            dataIndex: 'radiogroup.child.bb',
            defaultValue: 1
          }, formItemLayout, {
            decorator: React.createElement(
              RadioGroup,
              null,
              React.createElement(
                Radio,
                { value: 1 },
                'A'
              ),
              React.createElement(
                Radio,
                { value: 2 },
                'B'
              ),
              React.createElement(
                Radio,
                { value: 3 },
                'C'
              ),
              React.createElement(
                Radio,
                { value: 4 },
                'D'
              )
            )
          })),
          React.createElement(FormItem, Object.assign({
            label: 'select normal',
            dataIndex: 'select.normal',
            defaultValue: 'jack'
          }, formItemLayout, {
            decorator: React.createElement(
              Select,
              { style: { width: 200 } },
              React.createElement(
                Option,
                { value: 'jack' },
                'Jack'
              ),
              React.createElement(
                Option,
                { value: 'lucy' },
                'Lucy'
              ),
              React.createElement(
                Option,
                { value: 'disabled', disabled: true },
                'Disabled'
              ),
              React.createElement(
                Option,
                { value: 'Yiminghe' },
                'yiminghe'
              )
            )
          })),
          React.createElement(FormItem, Object.assign({
            label: 'select multiple',
            dataIndex: 'select.multiple',
            defaultValue: ['lucy']
          }, formItemLayout, {
            decorator: React.createElement(
              Select,
              {
                mode: 'multiple',
                placeholder: 'Please select'
              },
              React.createElement(
                Option,
                { value: 'jack' },
                'Jack'
              ),
              React.createElement(
                Option,
                { value: 'lucy' },
                'Lucy'
              ),
              React.createElement(
                Option,
                { value: 'disabled', disabled: true },
                'Disabled'
              ),
              React.createElement(
                Option,
                { value: 'Yiminghe' },
                'yiminghe'
              )
            )
          })),
          React.createElement(FormItem, Object.assign({
            label: 'checkbox',
            dataIndex: 'checkbox',
            defaultValue: true
          }, formItemLayout, {
            decorator: React.createElement(
              Checkbox,
              null,
              '\u662F\u5426\u9009\u4E2D'
            )
          })),
          React.createElement(FormItem, Object.assign({
            label: 'Rate',
            dataIndex: 'rate',
            defaultValue: 1,
            required: true
          }, formItemLayout, {
            decorator: React.createElement(Rate, { onChange: this.handleChange })
          })),
          React.createElement(FormItem, Object.assign({
            label: 'Slider',
            dataIndex: 'slider'
          }, formItemLayout, {
            decorator: React.createElement(Slider, null)
          })),
          React.createElement(
            FormItem,
            Object.assign({}, formItemLayout, {
              wrapperCol: { offset: 2 }
            }),
            React.createElement(
              Button,
              { type: 'primary', htmlType: 'submit', disabled: !this.state.formValidate },
              '\u8868\u5355\u5185\u63D0\u4EA4\uFF0C\u5C06\u4F1A\u8C03\u7528Form\u4E0A\u7684onSubmit\u4E8B\u4EF6'
            )
          ),
          React.createElement(
            Button,
            {
              onClick: function onClick() {
                _this6.form.submit(function (data) {
                  console.info('手动提交', data);
                });
              }
            },
            '\u624B\u52A8\u63D0\u4EA4\uFF0C\u5E76\u4F20\u5165\u56DE\u8C03\u51FD\u6570'
          ),
          React.createElement('br', null),
          React.createElement(
            Button,
            {
              onClick: function onClick() {
                _this6.form.setValues({ name: '重设的名称' }, true);
              }
            },
            '\u91CD\u8BBE\u8868\u5355\u7684\u6240\u6709\u503C'
          ),
          React.createElement('br', null),
          React.createElement(
            Button,
            {
              onClick: function onClick() {
                _this6.form.setValue('name', '只设置nanme');
              }
            },
            '\u91CD\u8BBE\u8868\u5355\u7684 name \u503C'
          ),
          React.createElement('br', null),
          React.createElement(
            Button,
            {
              onClick: function onClick() {
                _this6.form.validateValue('name', function (isSuccess, result) {
                  console.info('校验结果', result);
                });
              }
            },
            '\u53EA\u6821\u9A8C name \u503C'
          ),
          React.createElement('br', null)
        )
      );
    }
  }]);

  return TestFormEx;
}(Component);

export default TestFormEx;
//# sourceMappingURL=TestFormEx.js.map