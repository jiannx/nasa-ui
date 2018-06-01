## 弹窗组件说明

<br />
> 适用于表单弹窗

** 注：content的组件中需定义handleOk，当弹窗点击确定时，将调用该方法，参数为关闭弹窗的回调函数 **
<br />
<br />

### API

```
import { modalEx } from 'src/compoments';
modalEx.confirm({
  title: '标题',         // string
  content: <UserAdd />,  // string||ReactComponent 正文
  onOk: (close) => {},   // function 确定按钮事件，当content组件中定义了handleOk函数时，close参数将作为handleOk的参数，此处无效
  onCancel: () => {},    // function 关闭弹窗时事件
  closeBtn: true,        // boolen(default: true) 是否包含取消及右上角关闭按钮
  // 其余参数参照 antd Modal
  // https://ant.design/components/modal-cn/
});
```


