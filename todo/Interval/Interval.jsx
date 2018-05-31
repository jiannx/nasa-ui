/*
 定时器

 <Interval onTrigger={()=> console.log('Interval Trigger')} />

 <Interval 
  interval={60} 
  space={2} 
  render={(time, second) => `自定义显示:${time}，秒：${second}`} 
  repeat={false}
  onTrigger={()=> console.log('Interval Trigger')}
 />
 */
import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';

class Interval extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    };
  }

  static defaultProps = {
    className: null,
    style: null,
    interval: 600, // 定时多久后进行校验 默认10分钟
    space: 1, // 间隔多久校验一次，默认1秒
    render: null, // 每次校验时执行函数，参数为倒计时字符串 (time, second) => time
    onTrigger: null, // 倒计时最后执行函数
    repeat: true, // 是否循环
    countdownFormat: 'mm:ss', // 倒计时格式化
  }

  componentWillReceiveProps(nextProps) {}

  componentDidMount() {
    this.lastUpdate = moment();
    let countdownSecond = this.props.interval - (moment().unix() - this.lastUpdate.unix());
    let countdown = moment({ minute: countdownSecond / 60, second: countdownSecond % 60 });
    this.setText(countdown.format(this.props.countdownFormat), countdownSecond);

    this.interval = setInterval(() => {
      let countdownSecond = this.props.interval - (moment().unix() - this.lastUpdate.unix());
      let countdown = moment({ minute: countdownSecond / 60, second: countdownSecond % 60 });
      this.setText(countdown.format(this.props.countdownFormat), countdownSecond);
      if (countdownSecond <= 0) {
        this.lastUpdate = moment();
        this.props.onTrigger && this.props.onTrigger();
        // 移除定时器
        if (this.props.repeat === false) {
          clearInterval(this.interval);
        }
      }
    }, this.props.space * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  setText = (time, second) => {
    let text = '';
    if (this.props.render) {
      text = this.props.render(time, second);
    } else {
      text = `每${Math.round(this.props.interval / 60)}分钟更新一次，${time}后更新`;
    }
    this.setState({ text });
  }

  render() {
    return (
      <span className={this.props.className} style={this.props.style}>{this.state.text}</span>
    )
  }
}

export default Interval;