# 图表控件

## Api
* echartsUrl: 'vendor/echarts/echarts.min.js', // echart库文件地址
* className: '',
* style: null,
* api: null, // Api 请求接口
* params: {}, // Object 请求参数，将优先于history。
* history: [], // array[Object] 请求参数，api参数存在时才有效, 变更此数组，强制刷新图表。保存时间等公共参数
* option: {}, // Object|Function 图表配置项，优先级 该参数>type中定义的配置项
* data: null, // Object 数据项或图表配置项
* loading: null, // bool 受控loading状态
* optionIsMerge: false, // setOption时是否合并数据 http://echarts.baidu.com/api.html#echartsInstance.setOption
* onResHandler: res => res.data, // Function 响应后数据格式化，api参数存在时才有效
* isAutoResize: true, // 自动调整浏览器大小

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