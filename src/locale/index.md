# 国际化设置

## 方法

|             名称             |                            描述                            |   |
|------------------------------|------------------------------------------------------------|---|
| setLocales(string, callback) | 设置nasa-ui语言 string = 'en-US'or'zh-CN',callback回调函数 |   |
| getCurrentLocale()           | 获取当前语言                                               |   |


<br/>

## 基本使用

```jsx
import { locale } from 'nasa-ui';

onChange = (lang) => {
  locale.setLocales(lang, () => {
    window.location.reload();
  });
}

<h2>国际化</h2>
<p>默认中文 当前语言：{locale.getCurrentLocale()}</p>
<p>
  <Button onClick={() => this.onChange('zh-CN')}>设置到中文</Button>
  <Button onClick={() => this.onChange('en-US')}>设置到英文</Button>
</p>
```