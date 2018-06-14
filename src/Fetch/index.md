# 数据获取组件

|      参数     |                                             说明                                            |      类型     |     默认值     |
|---------------|---------------------------------------------------------------------------------------------|---------------|----------------|
| api           | Api请求接口，必须为Promise对象                                                              | Promise       | 必填，null     |
| history       | 请求参数, 变更此数组，触发刷新                                                              | array[Object] | []             |
| params        | 请求参数, 优先级高于history                                                                 | Object        | []             |
| cacheKey      | 定义该字段时，将进行本地缓存，当history最后项, params, cacheKey这几个都未变更时，接口不发起 | String        | null           |
| dataIndex     | 将接口返回的数据以此属性传入到子组件中，默认子组件会有props.data                            | String        | 'data'         |
| onRequest     | 请求参数处理，返回的数据将作为请求参数，默认参数=Object.assign({}, _.last(history), params) | Function      | parms => parms |
| onResponse    | 接口返回处理，                                                                              | Function      | res => res     |
| onLoading     | 加载状态变更事件                                                                            | Function      | null           |
| <>children</> | 被包元素，如果子元素为数组，则在每个元素上添加属性，默认为props.data和props.loading属性     | React Element | null           |

<br/>

## 基本使用  

```jsx
import { Fetch } from 'nasa-ui';

function Test(props) {
  return 
    <Spin spinning={props.loading}>
      组件名：{props.name}，props={JSON.stringify(props)}
    </Spin>
}

onHistory = () => {
  this.setState({
    history: this.state.history.concat([{ name: 'history中参数', history: 'history中参数' }])
  });
}

<Button onClick={this.onHistory}>发起请求</Button>
<Fetch 
  api={test}
  history={this.state.history}
  params={{name: 'params中参数优先'}}
  onLoading={loading => console.log(loading)}
>
  <Test name="name1"></Test>
  <Test name="name2" dataIndex="newdata"></Test>
</Fetch>

```