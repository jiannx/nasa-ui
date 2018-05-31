```
const testValues = {
  domain_name: 'domain_name111',
  type1: 'file',
  type2: 'file',
  isOpen: true,
  host: {
    key1: 'value1',
    key2: 'value2',
    key3: false
  },
  cahce: [
    { isOpen: true, name: 'cahce1', isNeed: false },
  ],
  white: ['111', '222'],
  black: ['333', '444'],
}

<DynamicForm values={testValues} title="回源配置"
  items={[
    { type: 'input', label: '1回源域名', bind: 'domain_name', required: true},
    { type: 'br' },
    { type: 'select', label: '2.1类型', bind: 'type1', options: ['file', 'video'], required: true},
    { type: 'select', label: '2.2类型', bind: 'type2', options: [{name: '普通加速', key: 'file'}, {name: '视屏加速', key: 'video'}], selectLabel: 'name', selectBind: 'key'},
    { type: 'radio', label: '3是否开启', bind: 'isOpen'},
    { type: 'object', label: '4回源主备信息配置', bind: 'host', 
      keyText: 'key name',
      valueText: 'value name',
      render: (item = {}) => Object.keys(item).map(key => `${key}: ${item[key]}, `)

    },
    { type: 'array', label: '5缓存', bind: 'cahce', rowKey:'name', children:[
      { type: 'radio', label: '开启', bind: 'isOpen'},
      { type: 'input', label: '名字', bind: 'name'},
      { type: 'checkbox', label: '是否需要', bind: 'isNeed'},
    ]},
    { type: 'oneOf', label: '名单', children: [
      { label: '白名单', children: [
        { type: 'selectTag', label: '白名单输入', bind: 'white'}
      ] },
      { label: '黑名单', children: [
        { type: 'selectTag', label: '黑名单输入', bind: 'black'}
      ] },
    ]},
  ]}
>
  <Title value="回源配置">
    <Button icon="edit" htmlType="submit">编辑</Button>
  </Title>
</DynamicForm>
```