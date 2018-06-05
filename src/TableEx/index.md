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

<TableEx api={api.cdnDomainList} 
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
<TableEx data={{size, current, pageSize, total, data}} 
  size="large"
  columns={columns} 
  rowKey="cdn_domain_id"
  onChange={this.onGridChange}
/>
```