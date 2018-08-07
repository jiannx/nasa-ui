import React, { Component } from 'react';
import { Button } from 'antd';
import { CopyTextToClipboard } from 'nasa-ui';


export default class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {}

  componentWillReceiveProps(nextProps) {}

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div>
        <CopyTextToClipboard 
          text={`用户名: admin\n密码: admin`}
          successCallback={() => alert('已成功复制到剪切板')}
        />
        <br/>
        <CopyTextToClipboard 
          text={`用户名: admin\n密码: 123`}
          successCallback={() => alert('功复制到剪切板, hahahah')}
        >
          <Button title="点击复制信息">自定义内容，点击复制</Button>
        </CopyTextToClipboard>
      </div>
    )
  }
}