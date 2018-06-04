import React, { Component } from 'react';
import _ from 'lodash';
import { Card } from 'antd';
import { Echarts } from 'nasa-ui';


function optionRender(data) {
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
    this.state = {};
  }

  static defaultProps = {}

  componentWillReceiveProps(nextProps) {}

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div>
        <Card title="自定义Echarts库文件地址">
          <Echarts
            echartsUrl="https://cdn.bootcss.com/echarts/4.1.0.rc2/echarts.min.js"
            data={[
              { value: 135, name: '视频广告' },
              { value: 1548, name: '搜索引擎' }
            ]}
            option={optionRender}
            style={{height: 200}}
          />
        </Card>
      </div>
    )
  }
}