# 图表控件


|      参数     |                                            说明                                           |      类型     |             默认值              |
|---------------|-------------------------------------------------------------------------------------------|---------------|---------------------------------|
| data          | 数据项，该数据将作为render的参数，当未定义render时，此属性必须为echart可解析的options对象 | Any           | null                            |
| render        | 图表配置函数，参数为data或者api返回数据                                                   | Function      | () => {}                        |
| echartsUrl    | echart库文件地址，可以为cdn地址                                                           | String        | 'vendor/echarts/echarts.min.js' |
| className     | 样式名                                                                                    | String        | ''                              |
| style         | 样式                                                                                      | Object        | null                            |
| loading       | 受控loading状态                                                                           | bool          | null                            |
| optionIsMerge | setOption时是否合并数据 http://echarts.baidu.com/api.html#echartsInstance.setOption       | bool          | false                           |
| isAutoResize  | 是否自动随浏览器调整大小                                                                  | bool          | true                            |
| api           | Api请求接口，必须为Promise对象                                                            | Promise       | null                            |
| params        | Object 请求参数，将优先于history                                                          | Object        | {}                              |
| history       | 请求参数，api参数存在时才有效, 变更此数组，强制刷新图表                                   | array[Object] | []                              |
| onResponse    | 响应后数据格式化，api参数存在时才有效                                                     | Function      | res => res                      |
| ...           | 其余参数参照Fetch                                                                         | ...           | ...                             |


示例
```jsx
import { Echarts } from 'nasa-ui';

function getData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { value: Math.random() * 100, name: 'api数据1' },
        { value: Math.random() * 100, name: 'api数据2' }
      ]);
    }, 2000);
  });
}

function optionRender(data = [{ value: 135, name: '默认数据' }]) {
  return {
    series: [{
      name: '访问来源',
      type: 'pie',
      center: ['50%', '60%'],
      data: data,
    }]
  }
}

<Echarts
  echartsUrl="https://cdn.bootcss.com/echarts/4.1.0.rc2/echarts.min.js"
  data={optionRender()}
  style={{height: 200}}
/>

<Echarts
  echartsUrl="https://cdn.bootcss.com/echarts/4.1.0.rc2/echarts.min.js"
  data={[
    { value: 135, name: 'data数据1' },
    { value: 1548, name: 'data数据2' }
  ]}
  render={optionRender}
  style={{height: 200}}
/>

<Echarts
  echartsUrl="https://cdn.bootcss.com/echarts/4.1.0.rc2/echarts.min.js"
  api={getData}
  history={this.state.history}
  render={optionRender}
  style={{height: 200}}
/>  

<Echarts
  echartsUrl="https://cdn.bootcss.com/echarts/4.1.0.rc2/echarts.min.js"
  api={getData}
  history={this.state.history}
  render={optionRender}
  onResponse={res => res.concat([{value: Math.random() * 100, name: '响应中新加数据1' }])}
  style={{height: 200}}
/>   
```