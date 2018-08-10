/* 时间跨度选择控件，在antd RangePicker基础上添加 可选时间跨度功能

<RangePickerEx range={3}/>
<RangePickerEx 
  range={[1, 5]}  
  disabledDate={(endValue) => {
    return endValue.valueOf() >= moment().valueOf();
}}/>
 */

import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

class RangePickerEx extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabledDate: props.disabledDate
    };
  }

  static defaultProps = {
    disabledDate: null,
    range: null, // 时间跨度 默认天 number or array
  }

  componentWillReceiveProps(nextProps) {}

  componentWillMount() {
    this.id = `nasa-rangepicker-${Math.random()}`;
  }

  componentDidMount() {

  }

  componentWillUnmount() {}

  setDisabledDate = (node) => {
    if (node.className.match(/disabled/)) {
      return;
    }
    let range = [];
    if (_.isArray(this.props.range)) {
      range = this.props.range;
    } else {
      range = [this.props.range, this.props.range];
    }

    let str = node.title;
    str = str.replace(/年|月/g, '-');
    str = str.replace(/日/g, '');

    let gtmOffset = 0;
    if (moment.locale() === 'zh-cn') {
      gtmOffset = -8; // 中国区时间快8小时，需要减去8小时换算到国际时间
    }

    let end = moment(str).add(range[1], 'days').add('hour', gtmOffset).unix();
    let start = moment(str).subtract(range[0], 'days').add('hour', gtmOffset).unix();

    this.setState({
      disabledDate: (endValue) => {
        if (!this.offset && endValue) {
          this.offset = endValue.hours() * 3600 + endValue.minute() * 60 + endValue.second(); // 获取失效时间的小时分钟秒的相对零点偏移量
        }
        // 加减1是为了去除毫秒数影响
        const disabled = endValue.unix() >= (end + this.offset + 1) || endValue.unix() <= (start + this.offset - 1);
        if (this.props.disabledDate) {
          return disabled || this.props.disabledDate(endValue, disabled);
        }
        return disabled;
      }
    })
  }

  handleClick = (e) => {
    if (!this.props.range || this.props.range === '') {
      console.info('RangePicker Ex: range must be number or array');
      return;
    }
    if (e.target && e.target.className.match(/ant-calendar-cell/)) {
      this.setDisabledDate(e.target);
    } else if (e.target.parentNode && e.target.parentNode.className.match(/ant-calendar-cell/)) {
      this.setDisabledDate(e.target.parentNode);
    }
  }

  onOpenChange = (status) => {
    this.setState({
      disabledDate: this.props.disabledDate
    });
    this.props.onOpenChange && this.props.onOpenChange(status);
  }

  render() {
    return (
      <span id={this.id} onClick={this.handleClick} style={this.props.style} className={this.props.className}>
        <RangePicker
          {...this.props}
          onOpenChange={this.onOpenChange}
          getCalendarContainer={() => document.getElementById(this.id)}
          disabledDate={this.state.disabledDate}
        />
      </span>
    )
  }
}

export default RangePickerEx;