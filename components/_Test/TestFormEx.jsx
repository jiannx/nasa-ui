import React, { Component } from 'react';
import { Button, message, Input, Switch, Select, Radio, Rate, Slider, Checkbox } from 'antd';
import { FormEx2, ModalEx } from '../index.js';

const FormItem = FormEx2.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 8 },
};


class ModalForm extends Component {
  constructor(props) {
    super(props);
  }

  handleOk = (close) => {
    this.form.submit(() => {
      console.log('ModalForm success');
      close && close();
    });
  }

  render() {
    return (
      <FormEx2
        onValidate={(status)=> { 
          this.setState({formValidate: status});
        }}
        ref={(f) => { this.form = f}}
      >
        <FormItem
          label="名称"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          dataIndex="name"
          required
          decorator={
            <Input onFocus={()=> { console.log('input focus')}}></Input>
          }
        />
      </FormEx2>
    )
  }
}


class ModalFormWithButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValidate: false,
    }
  }
  render() {
    return (
      <FormEx2
        onValidate={(status)=> { 
          this.setState({formValidate: status});
        }}
        onSubmit={(values)=>{
          console.log(this.form);
          console.info('ModalFormWithButton 提交数据', values);
          this.props.modal.ok();
        }}
        ref={(f) => { this.form = f}}
      >
        <FormItem
          label="名称"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          dataIndex="name"
          required
          decorator={
            <Input onFocus={()=> { console.log('input focus')}}></Input>
          }
        />
        <Input onFocus={()=> { console.log('input focus')}}></Input>
        <div className="ant-modal-footer" style={{margin: '0 -16px -16px -16px'}}>
          <Button size="large" onClick={this.props.modal.close}>取消</Button>
          <Button size="large" type="primary" htmlType="submit" disabled={!this.state.formValidate}>提交</Button>
        </div>
      </FormEx2>
    )
  }
}



class TestFormEx extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  modalForm = () => {
    ModalEx.confirm({
      title: '弹窗表单',
      content: <ModalForm></ModalForm>,
      onOk: (close) => {
        close && close();
        console.log('ModalEx ok');
      }
    });
  }

  modalFormWithButton = () => {
    ModalEx.confirm({
      title: '弹窗表单',
      content: <ModalFormWithButton></ModalFormWithButton>,
      footer: null,
      onOk: (close) => {
        close && close();
        console.log('ModalEx ok');
      }
    });
  }

  render() {

    return (
      <div>
        <h1>表单</h1>
        <br/>
        <h2>表单一 弹窗表单</h2>
        <Button onClick={this.modalForm}>弹窗表单</Button>
        <br/>
        <h2>表单二 弹窗表单 关联按钮</h2>
        <Button onClick={this.modalFormWithButton}>弹窗表单 关联按钮</Button>
        <br/>
        <h2>表单三 基本表单</h2>
        <FormEx2
          defaultValues={{name: '', isOk: true}}
          onValidate={(status)=> { 
            console.log(`表单校验状态 ${status}`);
            this.setState({formValidate: status});
          }}
          onSubmit={data => { console.info('button submit', data)}}
          ref={ f => this.form = f}
        >

          <FormItem
            label="名称"
            dataIndex="name"
            {...formItemLayout}
            required
            decorator={
              <Input onFocus={()=> { console.log('input focus')}}></Input>
            }
          />
          <FormItem
            label="失焦校验"
            dataIndex="nameBlur"
            {...formItemLayout}
            required
            trigger="onBlur"
            rules={[
              { min: 6, max: 16, message: '请输入6-16位密码'},
              { pattern: /^[a-zA-Z0-9#@!~%^&*_\\.-]{6,16}$/, message: '请输入英文、数字、特殊字符的任意组合'},
              {validator(rule, value, callback, source, options) {
                if(value === 'aaaaaa'){
                  callback(false);
                }else{
                  callback();
                }
              }, message: '名称已存在'}
            ]}
            decorator={
              <Input onFocus={()=> { console.log('input focus')}} onBlur={()=> { console.log('input blur')}} placeholder="输入aaaaaa显示已存在"></Input>
            }
          />
          <FormItem
            label="开启"
            dataIndex="isOk"
            {...formItemLayout}
            decorator={<Switch></Switch>}
          />
          <FormItem
            label="开启(默认值)"
            dataIndex="isOkDefault"
            defaultValue={true}
            {...formItemLayout}
            decorator={<Switch></Switch>}
          />
          <FormItem
            label="radio group 1"
            dataIndex="radiogroup.child.aa"
            required
            {...formItemLayout}
            decorator={
              <Radio.Group >
                <Radio.Button value="horizontal">Horizontal</Radio.Button>
                <Radio.Button value="vertical">Vertical</Radio.Button>
                <Radio.Button value="inline">Inline</Radio.Button>
              </Radio.Group>
            }
          />
          <FormItem
            label="radio group 2"
            dataIndex="radiogroup.child.bb"
            defaultValue={1}
            {...formItemLayout}
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
            label="select normal"
            dataIndex="select.normal"
            defaultValue="jack"
            {...formItemLayout}
            decorator={
              <Select style={{ width: 200 }}>
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="disabled" disabled>Disabled</Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>
            }
          />
          <FormItem
            label="select multiple"
            dataIndex="select.multiple"
            defaultValue={['lucy']}
            {...formItemLayout}
            decorator={
              <Select
                mode="multiple"
                placeholder="Please select"
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="disabled" disabled>Disabled</Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>
            }
          />
          <FormItem
            label="checkbox"
            dataIndex="checkbox"
            defaultValue={true}
            {...formItemLayout}
            decorator={
              <Checkbox>是否选中</Checkbox>
            }
          />
          <FormItem
            label="Rate"
            dataIndex="rate"
            defaultValue={1}
            required
            {...formItemLayout}
            decorator={
              <Rate onChange={this.handleChange}/>
            }
          />
          <FormItem
            label="Slider"
            dataIndex="slider"
            {...formItemLayout}
            decorator={
              <Slider/>
            }
          />
          <FormItem
            {...formItemLayout}
            wrapperCol={{ offset: 2 }}
          >
            <Button type="primary" htmlType="submit" disabled={!this.state.formValidate}>表单内提交，将会调用Form上的onSubmit事件</Button>
          </FormItem>

          <Button 
            onClick={() => {
              this.form.submit(data =>{
                console.info('手动提交', data)
              });
            }}
          >手动提交，并传入回调函数</Button>
          <br/>

          <Button 
            onClick={() => {
              this.form.setValues({ name: '重设的名称'}, true);
            }}
          >重设表单的所有值</Button>
          <br/>

          <Button 
            onClick={() => {
              this.form.setValue('name', '只设置nanme');
            }}
          >重设表单的 name 值</Button>
          <br/>

          <Button 
            onClick={() => {
              this.form.validateValue('name', (isSuccess, result)=>{
                console.info('校验结果', result);
              });
            }}
          >只校验 name 值</Button>
          <br/>
        </FormEx2>

      </div>
    )
  }
}


export default TestFormEx;