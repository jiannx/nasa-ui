# 输入框包含删除图标

|      参数     |        说明        |  类型  | 默认值 |
|---------------|--------------------|--------|--------|
| iconStyle     | 图标样式           | Object | {}     |
| iconClassName | 图标样式           | String | ''     |
| ...           | 参数参照Antd Input | ...    |        |

<br/>

## 基本使用  

```javascript
import { InputWithClear } from 'nasa-ui';

this.state = {
  value: '初始值'
};

onChange = (e) => {
  this.setState({ value: e.target.value });
}


<h3>普通输入框</h3>
<InputWithClear size="small"/>
<InputWithClear />
<InputWithClear size="large" onChange={(e) => console.log(e.target.value)}/>

<h3>受控输入框</h3>
<InputWithClear value={this.state.value} onChange={this.onChange}/>

```