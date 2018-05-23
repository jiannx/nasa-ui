/*
<Echarts data={EchartOptions} /> data:echart数据结构
<Echarts data={EchartOptions} option={EchartOptions={}} /> echartOption = _.merge(data, option)
<Echarts data={Object} option={Function | async Function} /> echartOption = option(data)

api:请求接口; history: 请求参数数组. 默认最后一项作为请求参数 echartOption = option(data)
<Echarts api={Api} history={array[Object]} option={Function}/> 

请求参数 = Object.assign({}, history[history.length-1], params) echartOption = option(data)
<Echarts api={Api} history={array[Object]} option={Function} params={Object}/> 

onResHandler:数据响应处理函数 echartOption = onResHandler(res)
<Echarts api={Api} history={array[Object]} onResHandler={(res)=>{ return res.data;}} /> 

echartOption = _.merge({}, option, onResHandler(res))
<Echarts api={Api} history={array[Object]} onResHandler={(res)=>{ return res.data;}} option={Object} />

echartOption = option(onResHandler(res))
<Echarts api={Api} history={array[Object]} onResHandler={(res)=>{ return res.data;}} option={Function} />

history: 参数数组，必须为数组。当length == 0时，不会获取数据。
当该数组变更时，将刷新数据。如果请求参数为空，请push空的对象 this.state.history.push({})。this.state.history.push({ id: 1})
<Echarts history={[]} /> 
*/
import React, { Component } from 'react';
import { Spin } from 'antd';
import _ from 'lodash';
import { loadEcharts } from './help.js';
import './style.scss';

function assert(condition, info) {
  if (!condition) {
    throw Error(`Echarts Error: ${info}`);
  }
}

class Echarts extends Component {
  constructor(props) {
    super(props);
    const id = (new Date()).valueOf();
    this.state = {
      id: `nase-chart-${id}${Math.random()}`,
      chart: null,
      loading: false,
      data: props.data
    };
  }

  static defaultProps = {
    echartsUrl: 'vendor/echarts/echarts.min.js', // echart库文件地址
    className: '',
    style: null,
    api: null, // Api 请求接口
    params: {}, // Object 请求参数，将优先于history。
    history: [], // array[Object] 请求参数，api参数存在时才有效, 变更此数组，强制刷新图表。保存时间等公共参数
    option: {}, // Object|Function 图表配置项，优先级 该参数>type中定义的配置项
    data: null, // Object 数据项或图表配置项
    loading: null, // bool 受控loading状态
    optionIsMerge: false, // setOption时是否合并数据 http://echarts.baidu.com/api.html#echartsInstance.setOption
    onResHandler: res => res.data, // Function 响应后数据格式化，api参数存在时才有效
    isAutoResize: true, // 自动调整浏览器大小
  }

  componentWillReceiveProps(nextProps) {
    // 数据未发生变更时，不做刷新
    if (_.isEqual(this.props.data, nextProps.data) &&
      _.isEqual(this.props.history, nextProps.history) &&
      _.isEqual(this.props.params, nextProps.params)) {
      return;
    }
    setTimeout(() => {
      this.entry();
    });
  }

  componentDidMount() {
    this.entry();
    this.onResize = _.debounce(() => {
      this.state.chart && this.state.chart.resize();
    }, 500);
    if (this.props.isAutoResize) {
      window.addEventListener('resize', this.onResize);
    }
  }

  componentWillUnmount() {
    this.state.echarts && this.state.echarts.dispose(this.state.chart);
    window.removeEventListener('resize', this.onResize);
  }

  entry() {
    if (this.props.api) {
      this.request();
    } else {
      this.setState({
        data: this.props.data
      }, () => {
        if (_.isUndefined(this.state.data) || _.isNull(this.state.data)) {
          return;
        }
        this.draw();
      });
    }
  }

  request() {
    if (this.props.history.length === 0) {
      return;
    }
    this.setState({ loading: true });
    let params = this.props.history[this.props.history.length - 1];
    this.props.api(Object.assign({}, params || {}, this.props.params)).then(res => {
      let data = this.props.onResHandler(res);
      this.setState({
        data,
        loading: false
      }, () => {
        this.draw();
      });
    }).catch(() => {
      this.setState({ loading: false });
    });
  }

  async mergeOptions() {
    let option = null;
    if (this.props.option) {
      if (_.isFunction(this.props.option)) {
        option = await this.props.option(this.state.data);
      }
      if (_.isPlainObject(this.props.option)) {
        option = _.merge({}, this.state.data, this.props.option);
      }
    } else {
      option = this.state.data;
    }
    return option;
  }

  async draw() {
    console.log('Echarts draw');
    // 获取echart实例
    let { chart } = this.state;
    if (!chart) {
      let echarts = await loadEcharts(this.props.echartsUrl);
      chart = echarts.init(document.getElementById(this.state.id));
      this.setState({ chart, echarts });
      if (this.props.events) {
        if (!_.isPlainObject(this.props.events)) {
          console.log('Echarts props events must be Object');
        } else {
          for (let name of Object.keys(this.props.events)) {
            chart.on(name, this.props.events[name]);
          }
        }
      }
    }
    let option = await this.mergeOptions();
    assert(_.isPlainObject(option), 'option must be Object');
    if (option.type === 'react') {
      this.setState({
        dom: option.component
      });
    } else {
      this.setState({
        dom: null
      });
    }
    chart.setOption(option, !this.props.optionIsMerge);
  }

  // 调整大小，不重绘
  resize = () => {
    let { chart } = this.state;
    let { clientWidth, clientHeight } = document.getElementById(this.state.id);
    chart.resize({ height: clientHeight, width: clientWidth });
  }

  // 重绘
  refresh = () => {
    this.draw();
  }

  getInstance = () => {
    return this.state.chart;
  }

  render() {
    let loading = this.state.loading;
    if (this.props.loading === false || this.props.loading === true) {
      loading = this.props.loading;
    }

    return (
      <div className={`nase-chart ${this.props.className}`} style={this.props.style}>
        <Spin spinning={loading} delay={0} className="spin-loading">
          <div id={this.state.id} style={{width: '100%', height: '100%'}}></div>
          { this.state.dom && 
            <div style={{width: '100%', height: '100%', position: 'absolute', left: '0', top: '0'}}>{this.state.dom}</div>
          }
        </Spin>
      </div>
    )
  }
}

export default Echarts;