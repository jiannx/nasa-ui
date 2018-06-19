# 图表控件

|      参数     |                                            说明                                           |      类型     |             默认值              |
|---------------|-------------------------------------------------------------------------------------------|---------------|---------------------------------|
| data          | 数据项，该数据将作为render的参数，当未定义render时，此属性必须为echart可解析的options对象 | Any           | null                            |
| render        | 图表配置函数，参数为data或者api返回数据，该函数需返回echart可解析的options对象         | Function      | null                      |
| echartsUrl    | echart库文件地址，可以为cdn地址        | String        | 'vendor/echarts/echarts.min.js' |
| className     | 样式名                        | String        | ''                              |
| style         | 样式                       | Object        | null                            |
| loading       | 受控loading状态                                                                           | bool          | null                            |
| optionIsMerge | setOption时是否合并数据，多次更新数据时注意 http://echarts.baidu.com/api.html#echartsInstance.setOption       | bool          | false                           |
| isAutoResize  | 是否自动随浏览器调整大小                                                                  | bool          | true                            |
| api           | Api请求接口，参照Fetch                                                           | Promise       | null                            |
| params        | 请求参数，参照Fetch                                                          | Object        | {}                              |
| history       | 请求参数，api参数存在时才有效, 变更此数组，强制刷新图表，参照Fetch                                 | array[Object] | []                              |
| onResponse    | 响应后数据格式化，api参数存在时才有效，参照Fetch                                            | Function      | res => res                      |
| ...           | 其余参数参照Fetch                                                                         | ...           | ...                             |

<br/>

## 基本使用

```jsx
import { Echarts } from 'nasa-ui';

function getData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { value: Math.random() * 100, name: '浙江' },
        { value: Math.random() * 100, name: '广东' },
      ]);
    }, 2000);
  });
}

function optionRender(data) {
  if (!data) {
    return <div style={{textAlign: 'center', lineHeight: '200px'}}><Icon type="exclamation-circle" /> 待加载</div>
  }
  return {
    series: [{
      name: '访问来源',
      type: 'pie',
      center: ['50%', '50%'],
      data: data,
    }]
  }
}

async function registerMap(url, key) {
  let echarts = window.echarts;
  return new Promise((resolve, reject) => {
    axios.get(url).then((res) => {
      echarts.registerMap(key, res.data);
      resolve();
    })
  }).catch((e) => {
    console.log('get map json error');
  });
}

async function optionRenderMap(data) {
  await registerMap('china.json', 'china');
  return {
    visualMap: {},
    series: [{
      type: 'map',
      mapType: 'china',
      data: data
    }]
  }
}

let defaultData = {
  series: [
    { type: 'pie', data: [{ value: 100, name: '默认数据' }] }
  ]
};

<h3>定义data</h3>
<Echarts
  data={defaultData}
  style={{height: 200}}
  ref={e => console.log(e)}
/>

<h3>定义render</h3>
<Echarts
  data={[
    { value: 135, name: 'data数据1' },
    { value: 1548, name: 'data数据2' }
  ]}
  render={optionRender}
  style={{height: 200}}
/>

<h3>定义api <Button onClick={this.onGetData}>获取数据</Button></h3>
<Echarts
  api={getData}
  history={this.state.history}
  render={optionRender}
  style={{height: 200}}
/>  
      
<h3>定义api，onResponse <Button onClick={this.onGetData}>获取数据</Button></h3>
<Echarts
  api={getData}
  history={this.state.history}
  render={optionRender}
  onResponse={res => res.concat([{value: Math.random() * 100, name: '响应中处理的数据' }])}
  style={{height: 200}}
/>   

<h3>显示地图<Button onClick={this.onGetData}>获取数据</Button></h3>
<Echarts
  api={getData}
  history={this.state.history}
  render={optionRenderMap}
  style={{height: 200}}
/>   
```