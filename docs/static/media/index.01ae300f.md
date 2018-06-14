# Markdown解析

|    参数   |                    说明                   |  类型  | 默认值 |
|-----------|-------------------------------------------|--------|--------|
| className | 样式                                      | String | ''     |
| src       | md地址                                    | String | null   |
| value     | md内容                                    | String | null   |
| option    | https://github.com/chjj/marked marked参数 | Object | {}     |

<br/>

## 基本使用
```jsx
import { MarkdownParser } from 'nasa-ui';

<MarkdownParser src={'https://raw.githubusercontent.com/milolu/nasa-ui/master/README.md'}></MarkdownParser>

<MarkdownParser value="* test"></MarkdownParser>
```