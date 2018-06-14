# 复制功能

|       参数      |                    说明                   |  类型  |     默认值     |
|-----------------|-------------------------------------------|--------|----------------|
| text            | 点击后复制的文本                          | String | ''             |
| successCallback | 成功复制回调                              | Func   | null           |
| failCallback    | 失败回调                                  | Func   | null           |
| title           | hover显示文本，children存在时，该参数无效 | String | '点击复制信息' |

<br/>

## 基本使用

```jsx
import { CopyTextToClipboard } from 'nasa-ui';

<CopyTextToClipboard 
  text={`用户名: admin\n密码: admin`}
  successCallback={() => alert('已成功复制到剪切板')}
/>


<CopyTextToClipboard 
  text={`用户名: admin\n密码: 123`}
  successCallback={() => alert('功复制到剪切板, hahahah')}
>
  <Button title="点击复制信息">自定义内容，点击复制</Button>
</CopyTextToClipboard>
```