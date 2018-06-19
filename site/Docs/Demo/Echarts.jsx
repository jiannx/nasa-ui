import React, { Component } from 'react';
import _ from 'lodash';
import { Row, Col, Button, Icon } from 'antd';
import { Echarts } from 'nasa-ui';
import axios from 'axios';

Echarts.defaultProps.echartsUrl = 'https://cdn.bootcss.com/echarts/4.1.0.rc2/echarts.min.js';

function getData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { value: Math.random() * 100, name: '浙江' },
        { value: Math.random() * 100, name: '广东' },
      ]);
    }, 2000);
  });
}

function optionRender(data) {
  if (!data) {
    return <div style={{textAlign: 'center', lineHeight: '200px'}}><Icon type="exclamation-circle" /> 待加载</div>
  }
  return {
    series: [{
      name: '访问来源',
      type: 'pie',
      center: ['50%', '50%'],
      data: data,
    }]
  }
}

async function registerMap(url, key) {
  let echarts = window.echarts;
  return new Promise((resolve, reject) => {
    axios.get(url).then((res) => {
      echarts.registerMap(key, res.data);
      resolve();
    })
  }).catch((e) => {
    console.log('get map json error');
  });
}

async function optionRenderMap(data) {
  await registerMap('china.json', 'china');
  return {
    visualMap: {},
    series: [{
      type: 'map',
      mapType: 'china',
      data: data
    }]
  }
}

let defaultData = {
  series: [
    { type: 'pie', data: [{ value: 100, name: '默认数据' }] }
  ]
};

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
              data={defaultData}
              style={{height: 200}}
              ref={e => console.log(e)}
            />
          </Col>
          <Col span={12}>
            <h3>定义render</h3>
            <Echarts
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
          api={getData}
          history={this.state.history}
          render={optionRender}
          style={{height: 200}}
        />  
              
        <h3>定义api，onResponse <Button onClick={this.onGetData}>获取数据</Button></h3>
        <Echarts
          api={getData}
          history={this.state.history}
          render={optionRender}
          onResponse={res => res.concat([{value: Math.random() * 100, name: '响应中处理的数据' }])}
          style={{height: 200}}
        />   

        <h3>显示地图<Button onClick={this.onGetData}>获取数据</Button></h3>
        <Echarts
          api={getData}
          history={this.state.history}
          render={optionRenderMap}
          style={{height: 200}}
        />   
      </div>
    )
  }
}