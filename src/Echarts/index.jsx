import React, { Component } from 'react';
import { Spin } from 'antd';
import _ from 'lodash';
import { loadEcharts } from './help.js';
import './style.scss';

import Fetch from '../Fetch';

function assert(condition, info) {
  if (!condition) {
    throw Error(`Echarts Error: ${info}`);
  }
}

class Echarts extends Component {
  constructor(props) {
    super(props);
    this.id = `nase-chart-${new Date().getTime()}`;
    this.state = {
      id: this.id,
      instance: null,
      loading: false,
    };
  }

  static defaultProps = {
    echartsUrl: 'vendor/echarts/echarts.min.js', // echart库文件地址
    className: '',
    style: null,
    render: null, // Function 图表配置项
    data: null, // Object 数据项或图表配置项
    loading: null, // bool 受控loading状态
    optionIsMerge: false, // setOption时是否合并数据 http://echarts.baidu.com/api.html#echartsInstance.setOption
    isAutoResize: true, // 自动调整浏览器大小
  }

  componentDidMount() {
    this.draw();
  }

  componentWillReceiveProps(nextProps) {
    if (_.isEqual(this.props.data, nextProps.data)) {
      return;
    }

    setTimeout(() => {
      this.draw();
    });
  }

  async mergeOptions() {
    let option = null;
    if (this.props.render && _.isFunction(this.props.render)) {
      option = await this.props.render(this.props.data);
    } else {
      option = this.props.data;
    }
    return option;
  }

  async draw() {
    // 获取echart实例
    let { instance } = this.state;
    if (!instance) {

      let echarts = window.echarts;
      if (!echarts) {
        echarts = await loadEcharts(this.props.echartsUrl);
      }

      instance = echarts.init(document.getElementById(this.state.id));
      this.setState({ instance });

      if (this.props.events) {
        if (!_.isPlainObject(this.props.events)) {
          assert('props events must be Object');
        } else {
          Object.keys(this.props.events).forEach(name => {
            instance.on(name, this.props.events[name]);
          });
        }
      }
    }
    let option = await this.mergeOptions();
    assert(_.isPlainObject(option), 'option must be Object');

    if (React.isValidElement(option)) {
      this.setState({ component: option });
    } else {
      this.setState({ component: null });
    }
    instance.setOption(option, !this.props.optionIsMerge);
  }

  render() {
    let loading = this.props.loading;
    if (this.props.loading === false || this.props.loading === true) {
      loading = this.props.loading;
    }

    return (
      <div className={`nase-chart ${this.props.className}`} style={this.props.style}>
        <Spin spinning={loading} delay={0} className="spin-loading">
          <div id={this.state.id} style={{width: '100%', height: '100%'}}></div>
          { this.state.component && 
            <div style={{width: '100%', height: '100%', position: 'absolute', left: '0', top: '0'}}>{this.state.component}</div>
          }
        </Spin>
      </div>
    )
  }

}


export default class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {
    api: null, // Api 请求接口
    params: {}, // Object 请求参数，将优先于history。
    history: [], // array[Object] 请求参数，api参数存在时才有效, 变更此数组，强制刷新图表。保存时间等公共参数
    onResponse: undefined, // Function 响应后数据格式化，api参数存在时才有效

    echartsUrl: 'vendor/echarts/echarts.min.js', // echart库文件地址
    className: '',
    style: null,
    render: null, // Function 图表配置项，优先级 该参数>type中定义的配置项
    data: null, // Object 数据项或图表配置项
    loading: null, // bool 受控loading状态
    optionIsMerge: false, // setOption时是否合并数据 http://echarts.baidu.com/api.html#echartsInstance.setOption
    isAutoResize: true, // 自动调整浏览器大小
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {

    if (this.props.api) {
      return (
        <Fetch {...this.props}>
          <Echarts {...this.props}></Echarts>
        </Fetch>
      )
    }
    
    if (this.props.data) {
      return <Echarts {...this.props}></Echarts>;
    }

  }
}