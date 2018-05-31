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
    let end = moment(str).add(range[1] + 1, 'days');
    let start = moment(str).subtract(range[0], 'days');

    this.setState({
      disabledDate: (endValue) => {
        const res = endValue.valueOf() >= end.valueOf() || endValue.valueOf() <= start.valueOf();
        if (this.props.disabledDate) {
          return res || this.props.disabledDate(endValue);
        }
        return res;
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