import React, { Component } from 'react';
import _ from 'lodash';
import { Input, Button, Radio, Slider, Row, Col, InputNumber } from 'antd';
import { ControlledForm, InputWithClear } from 'nasa-ui';

const FormItem = ControlledForm.Item;
const RadioGroup = Radio.Group;

export default class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form1Data: {
        info: { name1: '默认值' },
        require: { defaultValue: '默认值' },
        radio: { key1: 1 }
      },
      form1Status: null
    };
  }

  static defaultProps = {}

  componentWillReceiveProps(nextProps) {}

  componentDidMount() {

  }

  componentWillUnmount() {}

  render() {
    return (
      <div>
        <ControlledForm
          value={this.state.form1Data}
          itemProps={{ labelCol:{ span: 4 }, wrapperCol: {span: 16} }}
          onChange={(data, key, value) => {
            console.log('本次变更key: ' + key);
            this.setState({form1Data: data});
          }}
          onSubmit={(value) => {
            alert('sbumit');
          }}
          onValidate={isValidate => {
            this.setState({form1Status: isValidate})
          }}
          ref={form => this.form1 = form}
        >
          <h3>基本使用</h3>
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
            label="必填项1"
            dataIndex="require.key1"
            required
            decorator={<Input></Input>}
          />
          <FormItem
            label="withClear"
            dataIndex="require.withClear"
            required
            decorator={<InputWithClear/>}
          />
          <FormItem
            label="Radio"
            dataIndex="radio.key1"
            decorator={
              <RadioGroup>
                <Radio value={1}>A</Radio>
                <Radio value={2}>B</Radio>
                <Radio value={3}>C</Radio>
                <Radio value={4}>D</Radio>
              </RadioGroup>
            }
          />          
          <FormItem
            label="Radio"
          >
            <Row gutter={16}>
              <Col span={16}>
                <FormItem
                  dataIndex="slide"
                  wrapperCol={{span: 24}}
                  decorator={
                    <Slider min={1} max={20}/>
                  }
                />  
              </Col>
              <Col span={4}>
                <FormItem
                  dataIndex="slide"
                  decorator={<InputNumber min={1} max={20} />}
                /> 
              </Col>
            </Row>
          </FormItem>    
          
          <h3>校验</h3>
          <FormItem
            label="自定义规则1"
            dataIndex="rule1"
            required
            decorator={<Input></Input>}
            rules={[
              { required: true, message: '请填写该字段'},
              { pattern: /^[0-9a-zA-Z-_\u4e00-\u9fa5]+$/, message: '帐号名称由汉字、字母、数字、中划线或下划线组成' },
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

          <h3>onBlur</h3>
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
            label="完整数据"
          >
            {JSON.stringify(this.state.form1Data)}
          </FormItem>
          <FormItem
            wrapperCol={{span: 12, offset: 4}}
          >
            <Button type="primary" htmlType="submit" disabled={!this.state.form1Status}>确定1</Button>&nbsp;
            <Button type="primary" htmlType="submit">确定2</Button>
            <br/>
            <Button onClick={() => this.form1.validateForm(true)}>手动校验 全局表单</Button>
            <br/>
            <Button onClick={() => this.form1.validate('rule1')}>手动校验 自定义规则1 显示错误</Button>
            <br/>
            <Button onClick={() => this.form1.validate('rule1', false, res => alert(res.status))}>手动校验 自定义规则1 不显示错误</Button>
          </FormItem>

        </ControlledForm>

      </div>
    )
  }
}