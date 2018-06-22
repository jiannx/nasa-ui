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

export default class Echarts extends Component {
  constructor(props) {
    super(props);
    this.id = `nase-chart-${new Date().getTime()}-${Math.random()}`;
    this.state = {
      id: this.id,
      instance: undefined,
      loading: false,
      data: props.data,
    };
  }

  static defaultProps = {
    api: null, // Api 请求接口
    params: {}, // Object 请求参数，将优先于history。
    history: [], // array[Object] 请求参数，api参数存在时才有效, 变更此数组，强制刷新图表。保存时间等公共参数
    onResponse: undefined, // Function 响应后数据格式化，api参数存在时才有效

    data: undefined, // Object 数据项或图表配置项
    render: null, // Function 图表配置项
    echartsUrl: 'vendor/echarts/echarts.min.js', // echart库文件地址
    className: '',
    style: null,
    loading: false, // bool 受控loading状态
    optionIsMerge: false, // setOption时是否合并数据 http://echarts.baidu.com/api.html#echartsInstance.setOption
    isAutoResize: true, // 自动调整浏览器大小
  }

  componentDidMount() {
    this.onResize = _.debounce(() => {
      this.state.instance && this.state.instance.resize();
    }, 300);

    if (this.props.isAutoResize) {
      window.addEventListener('resize', this.onResize);
    }

    this.draw();
  }

  componentWillUnmount() {
    window.echarts && window.echarts.dispose(this.state.instance);
    window.removeEventListener('resize', this.onResize);
  }

  componentWillReceiveProps(nextProps) {
    // 处理数据变更，与api相关的全部由Fetch处理
    if (!this.props.api && !_.isEqual(this.props.data, nextProps.data)) {
      setTimeout(() => {
        this.setState({ data: this.props.data }, this.draw);
      });
    }
  }

  // 调整大小，不重绘
  resize = () => {
    let { instance } = this.state;
    let { clientWidth, clientHeight } = document.getElementById(this.state.id);
    instance.resize({ height: clientHeight, width: clientWidth });
  }

  // 重绘
  refresh = () => {
    this.draw();
  }

  getInstance = () => {
    return this.state.instance;
  }

  async mergeOptions() {
    let option = null;
    if (this.props.render && _.isFunction(this.props.render)) {
      option = await this.props.render(this.state.data);
    } else {
      option = this.state.data;
    }
    return option;
  }

  async draw() {
    console.log('Echarts draw');
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
    let option = await this.mergeOptions() || {};
    assert(_.isPlainObject(option), 'option must be Object');

    if (React.isValidElement(option)) {
      this.setState({ component: option });
      instance.setOption({}, !this.props.optionIsMerge);
    } else {
      this.setState({ component: null });
      instance.setOption(option, !this.props.optionIsMerge);
    }
  }

  onFetchResponse = (res) => {
    res = this.props.onResponse ? this.props.onResponse(res) : res;
    this.setState({ data: res }, this.draw);
  }

  render() {
    let loading = this.state.loading;

    return (
      <div className={`nase-chart ${this.props.className}`} style={this.props.style}>
        {this.props.api && 
          <Fetch 
            api={this.props.api}
            history={this.props.history}
            params={this.props.params}
            cacheKey={this.props.cacheKey}
            dataIndex={this.props.dataIndex}
            onRequest={this.props.onRequest}
            onResponse={this.onFetchResponse}
            onLoadingChange={loading => this.setState({ loading })}
          />
        }
        {loading && <Spin></Spin>}
        <div className={`nase-chart_content ${loading && 'blur'}`} id={this.state.id}></div>
        { this.state.component && 
          <div className="nase-chart_content">{this.state.component}</div>
        }
      </div>
    )
  }

}