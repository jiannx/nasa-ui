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
|onChange | 排序，过滤器等变更事件，如果该事件返回数据，则以此请求参数进行获取数据；否则请在onRequest中处理filters, sorter | Function(pagination, filters, sorter) | null |
|onRequest | 请求参数格式化，带有current, pageSize, filters, sorter属性，如需请针对业务进行格式化 | Function | params => params |
|onResponse |  响应数据格式化为组件需要的基础格式{list, pageSize, current, total} | Function | (res, reqParams) => res |
|pagination | 分页配置项 | Object or bool | { defaultPageSize: 30, defaultCurrent: 1, current: 1,showSizeChanger: true,showQuickJumper: true } |
|... | 其余参数参照Antd RangePicker | ... | 



## 全局配置
```javascript
TableEx.defaultProps.onReqHandler = (params) => {
  return {
    ...params,
    page: params.current,
    page_rows: params.pageSize
  };
}
TableEx.defaultProps.onResHandler = (res) => {
  let data = res.data;
  return {
    list: data.data,
    pageSize: data.page_rows,
    current: data.page_now,
    total: data.records,
  };
}
```