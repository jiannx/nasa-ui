import React, { Component } from 'react';
import _ from 'lodash';
import { Card, Spin, Input } from 'antd';
import { ControlledForm } from 'nasa-ui';

const FormItem = ControlledForm.Item;

export default class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form1Data: {
        info: { name1: '默认值' },
        require: { defaultValue: '默认值' },
      },
    };
  }

  static defaultProps = {}

  componentWillReceiveProps(nextProps) {}

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div>
        <ControlledForm
          value={this.state.form1Data}
          onChange={(data, key, value) => {
            console.log('本次变更key: ' + key);
            this.setState({form1Data: data});
          }}
          itemProps={{ labelCol:{ span: 4 }, wrapperCol: {span: 16} }}
        >
          <div><h4>测试表单1</h4></div>
          <FormItem
            label="不受控字段1"
          >
            <Input ></Input>
          </FormItem>
          <FormItem
            label="名称1 默认值"
            dataIndex="info.name1"
            decorator={<Input></Input>}
          />
          <FormItem
            label="名称1"
            dataIndex="info.name2"
            decorator={<Input></Input>}
          />
          <FormItem
            label="必填项1"
            dataIndex="require.key1"
            required
            decorator={<Input></Input>}
          />
          <FormItem
            label="onBlur触发"
            dataIndex="require.key2"
            required
            trigger="onBlur"
            decorator={<Input></Input>}
          />
          <FormItem
            label="onBlur触发"
            dataIndex="require.defaultValue"
            required
            trigger="onBlur"
            decorator={<Input></Input>}
          />
          <FormItem
            label="自定义规则1"
            dataIndex="rule1"
            required
            decorator={<Input></Input>}
            rules={[
              { required: true, message: '请填写该字段'},
              { pattern: /^[0-9a-zA-Z-_\u4e00-\u9fa5]+$/, message: '帐号名称由汉字、字母、数字、中划线或下划线组成' },
              { validator(rule, value, callback, source, options) {
                  try {
                    JSON.parse(value);
                    callback();
                  } catch(err) {
                    callback(['请填写正确的json参数']);
                  }
                }
              }
            ]}
          />
          <FormItem
            label="自定义规则2 json"
            dataIndex="rule2"
            decorator={<Input></Input>}
            rules={[
              { validator(rule, value, callback, source, options) {
                  try {
                    JSON.parse(value);
                    callback();
                  } catch(err) {
                    callback(['请填写正确的json参数']);
                  }
                }
              }
            ]}
          />
          <div>
            {JSON.stringify(this.state.form1Data)}
          </div>
        </ControlledForm>
      </div>
    )
  }
}