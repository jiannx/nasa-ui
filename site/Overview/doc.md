## 使用方式
```js
npm install nasa-ui
或者
yarn add nasa-ui

// 使用
import { Echarts } from 'nasa-ui';
```

## 相关命令
1. 开发
```
npm run start // 文档网站运行
```

2. 发布
```
npm run build // 将代码babel编辑到lib文件夹
npm run publish
```

3. 生成文档
```
npm run doc // 生成docs文件夹
```

## 组件添加规范
1. src中创建组件文件夹，文件名称即为组件名  
2. 必须包含 组件入口文件`index.jsx` 和 组件说明文件`index.md`。支持最新es语法
3. 样式规则参照如下  
 * 一级命名：`.nasa-组件名`，如：`.nasa-echarts`
 * 模块组件半参照bem：`.nasa-组件名_模块名称`，如：`.nasa-echarts_title` `.nasa-echarts_content`
 * 层级不做嵌套，所有模块都在第一层级之下
 * 状态以较短的单词进行描述。 

4. demo  
  ```
  .nasa-echarts {
    .nasa-echarts_title {
      &.active {}
      &.disabled {}
    }
    .nasa-echarts_title-nav {
    }
    .nasa-echarts_title-info {
    }
    .nasa-echarts_content {
    }
  }
  ```