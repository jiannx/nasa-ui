# 图表控件

参数 | 说明 | 类型 | 默认值   
  -  |  -   |  -   |   - 
className |  样式名 | String | ''
style | 样式 | Object | null
api | Api请求接口，必须为Promise对象 | Promise | null
history | 请求参数，api参数存在时才有效, 变更此数组，强制刷新 | array[Object] | []
params | Object 请求参数，将优先于history | Object | {}
data | 数据项，作为表格数据直接展示 | Object | null
onChange | 页码，条目数，排序，过滤器等变更事件，可返回请求参数 | Function | (pagination, filters, sorter) => {}
onSort | 排序变更事件，可返回请求参数，该参数将合并页码等参数 | Function | (sorter) => {}
onFilter | 过滤器变更事件，可返回参数，该参数将合并页码等参数 | Function |(filters) => {}
config | 表格解析对于的key值 | Object | { defaultPageSize: 30, list: 'list', size: 'size', current: 'current', getPage: 'getPage', pageSize: 'pageSize', total: 'records'},
onResHandler | 接口响应事件 | Function | res => res
... | 其余参数参照Antd Table | ... | 

## 调用方式1
```
const columns = [
  { title: '域名', dataIndex: 'domain_name', render: (text, record, index) => <Link to={`/domain/detail/${record.cdn_domain_id}`}>{text}</Link>, width: 250 },
  { title: 'CNAME', dataIndex: 'cname', },
  { 
    title: '状态', 
    dataIndex: 'status.status_cn',
    filterMultiple: false, // 过滤单选
    filters: [
      { text: '已启用', value: 'open' },
      { text: '已停用', value: 'stop' },
      { text: '审批中', value: 'in_approval' },
    ] 
  },
  { title: '服务商', dataIndex: 'isp_type.isp_type_cn', },
  { title: '所属产品', dataIndex: 'project'},
  { title: '创建时间', dataIndex: 'time', sorter: true },
];

getData = () => {
  this.setState({
    domainSel: []
  });
  this.setState(state => {
    let params = { search: this.state.search };
    return {
      history: state.history.concat([params]);
    }
  });
}

onGridChange = (pagination, filters, sorter) => {
  // do something or return params
}

onGridSort = (sorter) => {
  return {
    sort_col: 'time',
    sort_type: 'desc' //asc
  };
}

onGridFilter = (filters) => {
  return {status: 'open'};
}

<Grid api={api.cdnDomainList} 
  size="large"
  columns={columns} 
  rowKey="cdn_domain_id"
  history={this.state.history}
  onChange={this.onGridChange}
  onSort={this.onGridSort}
  onFilter={this.onGridFilter}
  rowSelection={{type: 'checkbox', onChange: this.onDomainSel, selectedRowKeys: this.state.domainSel}}
/>

```

## 调用方式2
```
<Grid data={{size, current, pageSize, total, data}} 
  size="large"
  columns={columns} 
  rowKey="cdn_domain_id"
  onChange={this.onGridChange}
/>
```