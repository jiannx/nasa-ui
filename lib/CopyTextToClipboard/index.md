# 复制功能

## Api

参数 | 说明 | 类型 | 默认值   
  -  |  -   |  -   |   - 
text | 点击后复制的文本 | String | ''
successCallback | 成功复制回调 | Func | null
failCallback | 失败回调 | Func | null
title | hover显示文本，children存在时，该参数无效 | String | '点击复制信息'


## 示例
```jsx
import { CopyTextToClipboard } from 'nasa-ui';

<CopyTextToClipboard 
  text={`用户名: ${detail.username}\n密码: ${detail.password}`}
/>
<br/>
<CopyTextToClipboard 
  text={`用户名: ${detail.username}\n密码: ${detail.password}`}
  successCallback={() => message.success('复制成功, hahahah')}
>
  <a title="点击复制鉴权信息">自定义内容</a>
</CopyTextToClipboard>
```