# 动态详情显示

```
<DynamicView
  style={{marginBottom: '20px'}}
  className="test"
  values={state.dynamicView}
  rowProps={{gutter: 16}}
  colProps={{span: 8}}
  items={[
    { title: '图标', dataIndex: 'icon', span: 24, render: src => <Avatar icon="user" />},
    { title: 'ID', dataIndex: 'id'},
    { type: 'boolen', title: '状态', dataIndex: 'available'},
    { title: '用户名', dataIndex: 'username'},
    { title: '名称', dataIndex: 'name'},
    { title: '备注超长标题名称', dataIndex: 'note'},
    { dataIndex: 'note2'},
    { dataIndex: 'note2'},
    { dataIndex: 'note2'},
    { dataIndex: 'note2'},
  ]}
/>
<h2>居中对齐</h2>
<DynamicView
  style={{marginBottom: '20px'}}
  className="test"
  align={0.4}
  values={state.dynamicView}
  rowProps={{gutter: 16}}
  colProps={{span: 8}}
  items={[
    { title: '图标', dataIndex: 'icon', render: src => <Avatar icon="user" />},
    { title: 'ID', dataIndex: 'id'},
    { title: '用户名', dataIndex: 'username'},
    { title: '名称', dataIndex: 'name'},
    { title: '备注', dataIndex: 'note'},
  ]}
/>
```