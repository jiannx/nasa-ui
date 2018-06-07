# 图表控件


|      参数     |                                         说明                                        |      类型     |             默认值              |
|---------------|-------------------------------------------------------------------------------------|---------------|---------------------------------|
| option        | 图表配置函数，参数为data或者api返回数据                                             | Function      | () => {}                        |
| echartsUrl    | echart库文件地址                                                                    | String        | 'vendor/echarts/echarts.min.js' |
| className     | 样式名                                                                              | String        | ''                              |
| style         | 样式                                                                                | Object        | null                            |
| data          | 数据项，将作为option函数的参数                                                      | Any           | null                            |
| api           | Api请求接口，必须为Promise对象                                                      | Promise       | null                            |
| params        | Object 请求参数，将优先于history                                                    | Object        | {}                              |
| history       | 请求参数，api参数存在时才有效, 变更此数组，强制刷新图表                             | array[Object] | []                              |
| loading       | 受控loading状态                                                                     | bool          | null                            |
| optionIsMerge | setOption时是否合并数据 http://echarts.baidu.com/api.html#echartsInstance.setOption | bool          | false                           |
| onResHandler  | 响应后数据格式化，api参数存在时才有效                                               | Function      | res => res.data                 |
| isAutoResize  | 是否自动调整浏览器大小                                                              | bool          | true                            |


示例
```jsx
import { Echarts } from 'nasa-ui';

<Echarts data={EchartOptions} /> // data:echart数据结构
<Echarts data={EchartOptions} option={EchartOptions={}} /> // echartOption = _.merge(data, option)
<Echarts data={Object} option={Function | async Function} /> // echartOption = option(data)

// api:请求接口; history: 请求参数数组. 默认最后一项作为请求参数 echartOption = option(data)
<Echarts api={Api} history={array[Object]} option={Function}/> 

请求参数 = Object.assign({}, history[history.length-1], params) echartOption = option(data)
<Echarts api={Api} history={array[Object]} option={Function} params={Object}/> 

onResHandler:数据响应处理函数 echartOption = onResHandler(res)
<Echarts api={Api} history={array[Object]} onResHandler={(res)=>{ return res.data;}} /> 

echartOption = _.merge({}, option, onResHandler(res))
<Echarts api={Api} history={array[Object]} onResHandler={(res)=>{ return res.data;}} option={Object} />

echartOption = option(onResHandler(res))
<Echarts api={Api} history={array[Object]} onResHandler={(res)=>{ return res.data;}} option={Function} />

history: 参数数组，必须为数组。当length == 0时，不会获取数据。
当该数组变更时，将刷新数据。如果请求参数为空，请push空的对象 this.state.history.push({})。this.state.history.push({ id: 1})
<Echarts history={[]} /> 
```