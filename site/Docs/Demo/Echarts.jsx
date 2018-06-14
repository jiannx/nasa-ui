import React, { Component } from 'react';
import _ from 'lodash';
import { Row, Col, Button } from 'antd';
import { Echarts } from 'nasa-ui';


function getData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { value: Math.random() * 100, name: 'api数据1' },
        { value: Math.random() * 100, name: 'api数据2' }
      ]);
    }, 2000);
  });
}

function optionRender(data = [{ value: 135, name: '默认数据' }]) {
  return {
    series: [{
      name: '访问来源',
      type: 'pie',
      center: ['50%', '60%'],
      data: data,
    }]
  }
}

export default class DemoEchart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: []
    };
  }

  static defaultProps = {}

  componentWillReceiveProps(nextProps) {}

  componentDidMount() {}

  componentWillUnmount() {}

  onGetData = () => {
    this.setState({
      history: this.state.history.concat([{}])
    })
  }

  render() {
    return (
      <div>
        <Row>
          <Col span={12}>
            <h3>定义data</h3>
            <Echarts
              echartsUrl="https://cdn.bootcss.com/echarts/4.1.0.rc2/echarts.min.js"
              data={optionRender()}
              style={{height: 200}}
            />
          </Col>
          <Col span={12}>
            <h3>定义render</h3>
            <Echarts
              echartsUrl="https://cdn.bootcss.com/echarts/4.1.0.rc2/echarts.min.js"
              data={[
                { value: 135, name: 'data数据1' },
                { value: 1548, name: 'data数据2' }
              ]}
              render={optionRender}
              style={{height: 200}}
            />
          </Col>
        </Row>

        <h3>定义api <Button onClick={this.onGetData}>获取数据</Button></h3>
        <Echarts
          echartsUrl="https://cdn.bootcss.com/echarts/4.1.0.rc2/echarts.min.js"
          api={getData}
          history={this.state.history}
          render={optionRender}
          style={{height: 200}}
        />        
        <h3>定义api，onResponse <Button onClick={this.onGetData}>获取数据</Button></h3>
        <Echarts
          echartsUrl="https://cdn.bootcss.com/echarts/4.1.0.rc2/echarts.min.js"
          api={getData}
          history={this.state.history}
          render={optionRender}
          onResponse={res => res.concat([{value: Math.random() * 100, name: '响应中新加数据1' }])}
          style={{height: 200}}
        />   
      </div>
    )
  }
}