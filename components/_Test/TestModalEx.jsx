import React, { Component } from 'react';
import { Button, message } from 'antd';
import { MarkdownParser, modalEx } from '../index.js';
import md from '../ModalEx/index.md';

function UserDetail(props) {
  return (
    <div>
      <p>当前id： {props.id}</p>
    </div>
  )
}

class UserAdd extends Component {

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

export default function TestModal() {
  const state = {};

  const showDefault = () => {
    modalEx.confirm({
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
  }

  const showFrom = () => {
    modalEx.confirm({
      title: '用户添加',
      content: <UserAdd id={999}></UserAdd>,
      onOk: () => {
        console.log('用户添加成功');
        message.success('用户添加成功');
      },
      onCancel: () => {
        console.log('弹窗关闭');
      }
    });
  }

  const showNoClose = () => {
    modalEx.confirm({
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
  }

  return (
    <div>
      <h1>弹窗组件</h1>
      <br/>
      <Button onClick={showDefault}>标准弹窗</Button>&nbsp;
      <Button onClick={showFrom}>表单弹窗</Button>&nbsp;
      <Button onClick={showNoClose}>强制弹窗，不包含关闭按钮</Button>&nbsp;
      <br/>
      <br/>
      <MarkdownParser src={md}></MarkdownParser>
    </div>
  )
}