/**
 * 弹窗定制版 
 * 在antd的Modal上封装了弹出隐藏等基本逻辑
 * 参数参照antd Modal
 * Api:
 * ref.show(title)
 *      
<ModalEx title="日志下载" 
  ref={ modal => this.modalLog = modal} 
  onOk={(close) => { close(); }} 
  onInit={() => { console.log('init') }} 
  onShow={() => { console.log('show') }}
>
  children
</ModalEx>
<Button onClick={()=>{ this.modalLog.show('新标题') }}>下载日志</Button>
<Button onClick={()=>{ this.modalLog.show() }}>下载日志</Button>
 */

import React, { Component } from 'react';
import { Modal } from 'antd';
import confirm from './confirm.jsx';
import './style.scss';
export message from './message.jsx';

export default class ModalEx extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      visible: false,
      confirmLoading: false,
      isFirst: true,
    }
  }

  componentDidMount() {
    if (this.props.visible === true) {
      this.show();
    }
  }

  static defaultProps = {
    onInit: null, // 第一次弹出时调用的函数
    onShow: null, // 每次弹出调用的函数

    // 以下参照 antd Modal
    title: '',
    visible: false,
    okText: '确认',
    cancelText: '取消',
    onOk: () => {},
    onCancel: () => {},
  }

  show = (title) => {
    if (this.state.isFirst === true) {
      this.props.onInit && this.props.onInit();
      this.setState({
        isFirst: false,
      });
    }
    this.props.onShow && this.props.onShow();

    title = title || this.props.title;
    this.setState({
      title,
      visible: true,
    });
  }

  onOk = () => {
    // this.setState({
    //   confirmLoading: true
    // });
    this.props.onOk && this.props.onOk(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    });
  }

  onCancel = () => {
    this.setState({
      visible: false,
    });
    this.props.onCancel && this.props.onCancel();
  }

  render() {
    return (
      <Modal
        {...this.props}
        title={this.state.title}
        confirmLoading={this.state.confirmLoading}
        visible={this.state.visible}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        {this.props.children}
      </Modal>
    )
  }
}

ModalEx.confirm = confirm;

export const modalEx = {
  confirm,
}