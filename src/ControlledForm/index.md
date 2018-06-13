# 受控表单组件

ControlledForm

|    参数    |                         说明                         |   类型   |  默认值  |
|------------|------------------------------------------------------|----------|----------|
| onSubmit   | 表单提交按钮事件                                     | Function | () => {} |
| onChange   | 数据变更事件，必填                                   | Function | () => {} |
| value      | 数据，必填                                           | Object   | null     |
| onValidate | 每次数据变更时整个表单的校验状态                     | Function | null     |
| itemProps  | Item的props，可将一些item的公共props放在此处，如布局 | Object   | null     |

FormItem

|    参数   |                   说明                   |            类型            |   默认值   |
|-----------|------------------------------------------|----------------------------|------------|
| label     | 标题                                     | String                     | ''         |
| dataIndex | 数据索引，未传入该参数，Item将不绑定数据 | String                     | ''         |
| rules     | 校验规则                                 | Array                      | []         |
| decorator | 被包装的受控组建                         | Component, dataIndex时必填 | null       |
| required  | 当前字段是否必填                         | Boolen                     | false      |
| trigger   | 数据变更方式                             | 'onChange' or 'onBlur'     | 'onChange' |
| ...       | 其余参数参照Antd Form.Item               | ...                        |            |


```jsx
import { ControlledForm } from 'nasa-ui';
const FormItem = ControlledForm.Item;
let formLayout = {
  labelCol: { span: 4 }, 
  wrapperCol: { span:16 }
};
<ControlledForm
  value={this.state.form1Data}
  itemProps={formLayout}
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
>
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
  <h3>onBlur</h3>
  <FormItem
    label="onBlur触发"
    dataIndex="require.key2"
    required
    trigger="onBlur"
    decorator={<Input></Input>}
  />
  <FormItem
    wrapperCol={{span: 12, offset: 4}}
  >
    <Button type="primary" htmlType="submit" disabled={!this.state.form1Status}>确定</Button>
    <Button onClick={() => this.form1.validate('rule1')}>手动校验 自定义规则1 显示错误</Button>
    <Button onClick={() => this.form1.validate('rule1', false, res => alert(res.status))}>手动校验 自定义规则1 不显示错误</Button>
  </FormItem>
</ControlledForm>
```