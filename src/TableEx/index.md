# 新版表格组件

|参数 | 说明 | 类型 | 默认值   
|  -  |  -   |  -   |   - 
|className |  样式名 | String | ''|
|style | 样式 | Object | null |
|columns | 列相关配置，参照antd table | Array | [] |
|data | 数据项，作为表格数据直接展示，基础格式={list, pageSize, current, total} <br/>!!当定义改参数时，请勿定义api | Object | null |
|api | Api请求接口，必须为Promise对象， | Promise | null|
|history | 请求参数，api参数存在时才有效, 变更此数组，将进行刷新 | array[Object] | [] |
|params | Object 请求参数，将优先于history | Object | {} |
|currentPage | 定义此参数，页码将受控外部 | Number | null |
|onCurrentPageChange | 当前页码变更，与上一参数组合使用 | Function | null |
|onChange | 排序，过滤器等变更事件，如果该事件返回数据，则以此请求参数传入onRequest；否则为默认参数 | Function(pagination, filters, sorter) | null |
|onRequest | 请求参数格式化，带有current, pageSize, filters, sorter属性，如需请针对业务进行格式化 | Function | params => params |
|onResponse |  响应数据格式化为组件需要的基础格式{list, pageSize, current, total} | Function | (res, reqParams) => res |
|pagination | 分页配置项 | Object or bool | { defaultPageSize: 30, defaultCurrent: 1, current: 1,showSizeChanger: true,showQuickJumper: true } |
|... | 其余参数参照Antd RangePicker | ... | 


## 数据流图
![数据流](https://github.com/milolu/nasa-ui/blob/master/resource/table-ex-data-flow.png?raw=true "数据流")


## 基本使用
```javascript
function test(params) {
  return axios({
    method: 'get',
    url: '/mock/tableex',
    params: params,
  });
}


TableEx.defaultProps.onRequest = (params) => {
  console.log('defaultProps.onRequest', params);
  return {
    page: params.current,
    page_rows: params.pageSize,
    filters_data: params.filters,
    sorter_data: params.sorter,
    data: params.data
  };
};

TableEx.defaultProps.onResponse = (res) => {
  console.log('defaultProps.onResponse', res.data);
  let data = res.data;
  return {
    list: data.data,
    pageSize: data.page_rows,
    current: data.page_now,
    total: data.page_total,
  };
};

<h3>1. 全局配置onRequest，onResponse</h3>
<strong>针对项目进行全局onRequest，onResponse配置</strong><br/>
<strong>每个项目都应该有自己的一套分页规则</strong><br/>
<pre>
{`TableEx.defaultProps.onRequest = (params) => {
  return {
    ...params,
    page: params.current,
    page_rows: params.pageSize,
    filters_data: params.filters,
    sorter_data: params.sorter,
  };
};

TableEx.defaultProps.onResponse = (res) => {
  return {
    list: res.list,
    pageSize: res.pageSize,
    current: res.current,
    total: res.total,
  };
};`}
</pre>

this.state = {
  history1: [{}],
  history2: [],
  history3: [],
  history4: [],
  history5: [],
  history6: [],
  history7: [],
  history8: [],
};


onTestApi = (historyName, data = {}) => {
  this.setState({
    [historyName]: this.state[historyName].concat([data])
  });
}


<h3>2. data属性（定义此属性时，将不发起请求）</h3>
<TableEx
  columns={columns}
  data={data1}
  onChange={(pagination, filters, sorter) => console.log({pagination, filters, sorter})}
/>
<br/>

<h3>3. 不包含分页</h3>
<TableEx
  columns={columns}
  data={data1}
  pagination={false}
  onChange={(pagination, filters, sorter) => console.log(pagination, filters, sorter)}
/>
<br/>

<h3>4. 请求数据 <Button onClick={this.onTestApi.bind(this, 'history1', {})}>发起请求</Button></h3>
<TableEx
  api={test}
  columns={columns2}
  history={this.state.history1}
  pagination={{
    defaultPageSize: 5
  }}
/>

<h3>5. 受控页码 
  <Button onClick={this.onTestApi.bind(this, 'history2', {})}>发起请求</Button> 
  <Button onClick={() => this.setState({currentPage: 1})}>设置页码为1</Button>
</h3>
<TableEx
  api={test}
  columns={columns2}
  history={this.state.history2}
  pagination={{
    defaultPageSize: 5
  }}
  currentPage={this.state.currentPage || 1}
  onCurrentPageChange={num => {
    console.log(num)
    this.setState({currentPage: num});
  }}
/>

<h3>6. onChange </h3>
<p>onChange返回对象，则将此参数传入props.onRequest -> defaultProps.onRequest</p>
<Button onClick={this.onTestApi.bind(this, 'history3', {})}>发起请求</Button>
<TableEx
  api={test}
  columns={columns2}
  history={this.state.history3}
  pagination={{
    defaultPageSize: 5
  }}
  onChange={(params) => {
    console.log('6 props.onChange')
    return {...params, 'data': '新参数'}
  }}
/>
<p>onChange未返回对象，则按默认流程props.onRequest -> defaultProps.onRequest</p>
<Button onClick={this.onTestApi.bind(this, 'history4', {})}>发起请求</Button>
<TableEx
  api={test}
  columns={columns2}
  history={this.state.history4}
  pagination={{
    defaultPageSize: 5
  }}
  onChange={(params) => {
    console.log('6 props.onChange')
  }}
/>

<h3>7. props.onRequest</h3>
<p>onRequest返回对象，则忽略defaultProps.onRequest，将返回对象作为请求参数</p>
<Button onClick={this.onTestApi.bind(this, 'history5', {})}>发起请求</Button>
<TableEx
  api={test}
  columns={columns2}
  history={this.state.history5}
  pagination={{
    defaultPageSize: 5
  }}
  onRequest={(params) => {
    console.log('7 props.onRequest')
    return {...params, 'data': 'props.onRequest返回的参数，不再调用defaultProps.onRequest'}
  }}
/>
<p>onRequest未返回对象，则按默认流程，生成&#123;current, pageSize, filters, sorter&#125;作为defaultProps.onRequest的参数</p>
<Button onClick={this.onTestApi.bind(this, 'history6', {})}>发起请求</Button>
<TableEx
  api={test}
  columns={columns2}
  history={this.state.history6}
  pagination={{
    defaultPageSize: 5
  }}
  onRequest={(params) => {
    console.log('7 props.onRequest 不返回数据')
  }}
/>

<h3>8. props.onResponse</h3>
<p>onResponse返回对象，则忽略defaultProps.onResponse，将返回对象作为表格的完整数据</p>
<Button onClick={this.onTestApi.bind(this, 'history7', {})}>发起请求</Button>
<TableEx
  api={test}
  columns={columns2}
  history={this.state.history7}
  pagination={{
    defaultPageSize: 5
  }}
  onResponse={(params) => {
    console.log('8 props.onResponse 返回数据');
    return { list: [{content: 'props.onResponse 返回数据'}], current: 1, pageSize: 5, total: 1}
  }}
/>
<p>onResponse未返回对象，则按默认流程，将接口响应数据作为defaultProps.onResponse的参数</p>
<Button onClick={this.onTestApi.bind(this, 'history8', {})}>发起请求</Button>
<TableEx
  api={test}
  columns={columns2}
  history={this.state.history8}
  pagination={{
    defaultPageSize: 5
  }}
  onResponse={(params) => {
    console.log('8 props.onResponse 不返回数据，请求响应数据：', params);
  }}
/>
```