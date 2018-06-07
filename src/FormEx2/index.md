# 非受控表单

```
const FormItem = FormEx2.FormItem;

<FormEx2
  defaultValues={} // 表单初始数据，默认为空对象
  onChange={(values, key, value) => {}}
  onValidate={(isSuccess, validateResult) => {}}
  onSubmit={(values) => {}}
  ref={form => this.form = form}
>
  <FormItem 
    // 以下属性参照 antd FormItem
    label="" // 文本
    labelCol // label 标签布局
    wrapperCol // 需要为输入控件设置布局样式时
    help // 提示信息
    extra // 额外的提示信息
    validateStatus // 校验状态
    hasFeedback // 配合 validateStatus 属性使用，展示校验状态图标
    colon={true} // 是否包含冒号
    required={false} // 是否必填
    // 以下是在antd FormItem基础上添加的
    valuePropName="value" // 子节点的值的属性，如 Switch 的是 'checked'
    dataIndex=""  // 绑定字段
    defaultValue={} // 数据不存在时的默认值
    rules={[]|{}} // 规则
    trigger="onChange" // 收集子节点的值的时机
    onChange={(values, key, value) => {}} // 数据变更时回调 
    decorator={<Input></Input>} // 输入控件 请使用InputEx代替Input，TextAreaEx代替TextArea，会自动添加onChange事件，所以请勿定义该事件
  />
</FormEx>
```