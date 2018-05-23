# nasa-ui
NETS nasa front-end Component Library, base on antd  [https://milolu.github.io/nasa-ui/](https://milolu.github.io/nasa-ui/)

## api

## 组件添加

## 版本要求
> React 16+，antd 3+

## 样式定义规则（在BEM做一定的调整）
* 必须以.nasa
* 组件名称定义 .nasa-xxxx，如.nase-table，.nase-markdown-parser
* 组件内模块定义 .nase-组件名_模块名。嵌套模块全部展开到第一层，如.nasa-table_title，.nase-markdown-parser_footer
* 组件内模块状态定义 .nase-组件名_模块名.状态，如.nasa-table_title.active，.nase-markdown-parser_footer.disabled

```css
.nasa-table {
  .nasa-table_title {
    &.disabled {}
    &.warming {}
  }
}

.nase-markdown-parser {
  .nase-markdown-parser_title {
    &.small {}
    &.big {}
  }
  .nase-markdown-parser_content {
    &.hover {}
    &.disabled {}
  }
}
```
