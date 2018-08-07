import React, { Component } from 'react';
import _ from 'lodash';
import { Fetch } from 'nasa-ui';
import { Card, Spin, Button } from 'antd';

function test(params) {
  return new Promise((resolve, reject) => {
    console.info('请求参数', params);
    setTimeout(() => {
      resolve({ list: Math.random() });
    }, 2000);
  });
}

function Test(props) {
  return <Spin spinning={props.loading}>组件名：{props.name}，props={JSON.stringify(props)}</Spin>
}

export default class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyA: [],
      historyB: [],
      historyC: [],
      historyD: [{}],
    };
  }

  static defaultProps = {}

  componentWillReceiveProps(nextProps) {}

  onHistoryA = () => {
    this.setState({
      historyA: this.state.historyA.concat([{ name: 'history中参数', history: 'history中参数' }])
    });
  }
  onHistoryB = () => {
    this.setState({
      historyB: this.state.historyB.concat([{ name: 'history中参数', history: 'history中参数' }])
    });
  }

  onHistoryC = () => {
    this.setState({
      historyC: this.state.historyC.concat([{ name: 'history中参数', history: 'history中参数' + Math.random() }])
    });
  }

  onHistoryD = () => {
    this.setState({
      historyD: this.state.historyD.concat([{}])
    });
  }

  render() {
    return (
      <div>
        <h3>获取数据 <Button onClick={this.onHistoryA}>发起请求</Button></h3>
        <Fetch 
          api={test}
          history={this.state.historyA}
          params={{name: 'params中参数优先'}}
          onLoadingChange={isLoading => console.log(isLoading)}
        >
          <Test name="name1"></Test>
        </Fetch>
        <Fetch 
          api={test}
          history={this.state.historyA}
          params={{name: 'params中参数优先'}}
          onLoadingChange={isLoading => console.log(isLoading)}
          dataIndex="newdata"
        >
          <Test name="name2"></Test>
        </Fetch>
        <br/>

        <h3>响应数据处理 <Button onClick={this.onHistoryB}>发起请求</Button></h3>
        <Fetch 
          api={test}
          history={this.state.historyB}
          params={{name: 'params中参数优先'}}
          onResponse={(res) => {
            return {
              res: res,
              newProps: 'onResponse中新加的参数'
            }
          }}
        >
          <Test></Test>
        </Fetch>
        <br/>

        <h3>缓存：相同cacheKey、相同history、相同params，只发起一个请求 <Button onClick={this.onHistoryC}>发起请求</Button></h3>
        <Fetch 
          api={test}
          history={this.state.historyC}
          params={{name: 'params中参数优先'}}
          cacheKey="historyC"
        >
          <Test></Test>
        </Fetch>
        <Fetch 
          api={test}
          history={this.state.historyC}
          params={{name: 'params中参数优先'}}
          cacheKey="historyC"
        >
          <Test></Test>
        </Fetch>

        <br/>
      </div>
    )
  }
}