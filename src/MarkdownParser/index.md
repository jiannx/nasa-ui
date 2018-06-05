# Markdown解析

## Api
参数 | 说明 | 类型 | 默认值   
  -  |  -   |  -   |   - 
className | 样式 | String | ''
src | md地址 | String | null
value | md内容 | String | null
marked | https://github.com/chjj/marked marked参数 | Object | {}

示例
```jsx
import { MarkdownParser } from 'nasa-ui';
import CopyMd from '../components/CopyTextToClipboard/index.md';

<MarkdownParser src={CopyMd}></MarkdownParser>
```