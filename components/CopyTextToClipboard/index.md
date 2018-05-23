# 复制功能

## Api
* text(String): 点击后复制的文本
* \[successCallback](Func): 成功复制回调
* \[failCallback](Func): 失败回调
* \[title](String): hover显示文本，children存在时，该参数无效


## 示例
```jsx
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