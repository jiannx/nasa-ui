# 弹窗组件

ModalEx.confirm

|      参数     |                                             说明                                            |      类型     |     默认值     |
|---------------|---------------------------------------------------------------------------------------------|---------------|----------------|
| title           | 标题                                                              | String       | ''     |
| content       | 正文组件                 | React Component | null             |
| onOk        | 默认确定按钮事件，参数为关闭弹窗函数           | Function(close)        | null             |
| onCancel      | 弹窗关闭事件 | Function        | null           |
| footer      | 底部菜单 | React Component or false        |            |
|... | 其余参数参照Antd RangePicker | ... | |

<br />

## 基本使用

```
import { ModalEx } from 'nasa-ui';
ModalEx.confirm({
  title: '标题',         // string
  content: <UserAdd />,  // string||ReactComponent 正文
  onOk: (close) => {},   // function 确定按钮事件，当content组件中定义了handleOk函数时，close参数将作为handleOk的参数，此处无效
  onCancel: () => {},    // function 关闭弹窗时事件
  closeBtn: true,        // boolen(default: true) 是否包含取消及右上角关闭按钮
  // 其余参数参照 antd Modal
  // https://ant.design/components/modal-cn/
});

// 1. 基本使用
ModalEx.confirm({
  title: '用户详情',
  content: <UserDetail id={999}></UserDetail>,
  onOk: (close) => {
    console.log('用户详情成功');
    message.success('用户详情成功');
    close();
  },
  onCancel: () => {
    console.log('弹窗关闭');
  }
});

// 2. content提供事件关闭
class UserAdd extends Component {
  // 该事件会在点击确定时触发
  handleOk = (close) => {
    console.log('表单提交成功');
    close();
  }

  render() {
    return (
      <div>
        <p>用户ID: {this.props.id}</p>
      </div>
    )
  }
}
ModalEx.confirm({
  title: '用户添加',
  content: <UserAdd id={999}></UserAdd>,
  closeBtn: false,
  onOk: () => {
    console.log('用户添加成功');
  },
  onCancel: () => {
    console.log('弹窗关闭');
  }
});

// 3. content主动调用modal实例进行关闭
class Add extends Component {
  render() {
    return (
      <div>
        <Button onClick={this.props.modal.close}>确定</Button>
      </div>
    )
  }
}
ModalEx.confirm({
  title: '证书详情',
  content: <Add data={data} callback={callback}></Add>,
  width: 800,
  footer: null,
});

```


