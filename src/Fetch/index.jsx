/**
 * 数据获取组件
 */
import React, { Component } from 'react';
import _ from 'lodash';

let requesting = {};

export default class Fetch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      response: {}
    };
  }

  static defaultProps = {
    api: null,
    history: [],
    params: null,
    cacheKey: null, // 定义该字段时，将在本地进行缓存，当history中最后一个对象+params+cacheKey这几个都未变更时，接口不发起
    dataIndex: 'data',
    onRequest: params => params,
    onResponse: res => res,
    onLoadingChange: null, // 状态变更事件
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.history, nextProps.history)) {
      setTimeout(this.getData);
    }
  }

  componentDidMount() {
    this.setLoading(false);
    this.getData();
  }

  componentWillUnmount() {}

  setLoading = (loading) => {
    this.setState({ loading });
    this.props.onLoadingChange && this.props.onLoadingChange(loading);
  }

  getCache = () => {
    let key = this.getActuallyCacheKey();
    let value = window.sessionStorage.getItem(key);
    if (!value) {
      return null;
    }
    let res = {};
    try {
      res = JSON.parse(window.sessionStorage.getItem(key) || '{}');
    } catch (err) {
      res = {};
    }
    return res;
  }

  setCache = (value) => {
    let key = this.getActuallyCacheKey();
    window.sessionStorage.setItem(this.getActuallyCacheKey(key), JSON.stringify(value));
  }

  /**
   * 生成key
   * @return {[type]} [description]
   */
  getActuallyCacheKey = () => {
    return `${JSON.stringify(this.props.cacheKey)}-${JSON.stringify(_.last(this.props.history))}-${JSON.stringify(this.props.params)}`;
  }

  requestSuccCallback = (res) => {
    // 缓存接口响应
    if (this.props.cacheKey) {
      this.setCache(res);
    }
    let response = this.props.onResponse ? this.props.onResponse(res) : res;
    this.setState({ response: response });
    this.setLoading(false);
  }

  requestErrCallback = (res) => {
    this.setLoading(false);
  }

  request = () => {
    this.setLoading(true);

    // 判定队列中是否有相同请求，如果开启缓存且队列中已存在，则不在请求
    let key = new Date().getTime() + Math.random();
    if (this.props.cacheKey) {
      key = this.getActuallyCacheKey();
    }
    if (!requesting[key]) {
      requesting[key] = [];
      let params = Object.assign({}, _.last(this.props.history), this.props.params);
      params = this.props.onRequest(params) || params;
      this.props.api(params)
        .then(res => {
          requesting[key].forEach(item => item.success(res));
          delete requesting[key];
        }).catch(res => {
          requesting[key].forEach(item => item.error(res));
          delete requesting[key];
        });
    }
    requesting[key].push({ success: this.requestSuccCallback, error: this.requestErrCallback });
  }

  getData = () => {
    if (!this.props.api || !_.isArray(this.props.history) || this.props.history.length === 0) {
      return;
    }
    if (this.props.cacheKey) {
      let res = this.getCache();
      if (res) {
        let response = this.props.onResponse ? this.props.onResponse(res) : res;
        this.setState({ response: response });
        return;
      }
    }
    this.request();
  }

  render() {
    if (!this.props.children) {
      return null;
    }

    let props = { loading: this.state.loading, [this.props.dataIndex]: this.state.response };

    if (_.isArray(this.props.children)) {
      return this.props.children.map(child => React.cloneElement(child, props));
    }

    return React.cloneElement(this.props.children, props);
  }
}