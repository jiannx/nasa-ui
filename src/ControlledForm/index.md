# 受控表单组建

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

<ControlledForm
	value={this.state.form1Data}
	onChange={(data, key, value) => {
		console.log('本次变更key: ' + key);
		this.setState({form1Data: data});
	}}
	itemProps={{ labelCol:{ span: 4 }, wrapperCol: {span: 16} }}
>
	<FormItem
	  label="名称1 默认值"
	  dataIndex="info.name1"
	  decorator={<Input></Input>}
	/>
</ControlledForm>
```