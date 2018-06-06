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
  return <Spin spinning={props.loading}>请求响应，props完整数据：{JSON.stringify(props)}</Spin>
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
        <h2>获取数据 <Button onClick={this.onHistoryA}>发起请求</Button></h2>
        <Fetch 
          api={test}
          history={this.state.historyA}
          params={{name: 'params中参数优先'}}
          component={<Test></Test>}
          onLoadingChange={isLoading => console.log(isLoading)}
        />
        <br/>
        <h2>响应数据处理 <Button onClick={this.onHistoryB}>发起请求</Button></h2>
        <Fetch 
          api={test}
          history={this.state.historyB}
          params={{name: 'params中参数优先'}}
          component={<Test></Test>}
          onResponse={(res) => {
            return {
              data: res,
              newProps: 'onResponse中新加的参数'
            }
          }}
        />

        <br/>
        <h2>缓存处理，以下两个相同cacheKey，只发起一个请求 <Button onClick={this.onHistoryC}>发起请求</Button></h2>
        <Fetch 
          api={test}
          history={this.state.historyC}
          params={{name: 'params中参数优先'}}
          component={<Test></Test>}
          cacheKey="historyC"
        />
        <Fetch 
          api={test}
          history={this.state.historyC}
          params={{name: 'params中参数优先'}}
          component={<Test></Test>}
          cacheKey="historyC"
        />

        <br/>
        <h2>缓存处理，每次请求cacheKey，history，params相同时，使用缓存 <Button onClick={this.onHistoryD}>发起请求</Button></h2>
        <Fetch 
          api={test}
          history={this.state.historyD}
          params={{name: 'params中参数优先'}}
          component={<Test></Test>}
          cacheKey="historyD"
        />
        <Fetch 
          api={test}
          history={this.state.historyD}
          params={{name: 'params中参数优先'}}
          component={<Test></Test>}
          cacheKey="historyD"
        />
      </div>
    )
  }
}