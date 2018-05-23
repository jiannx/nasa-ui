import React, { Component } from 'react';
import _ from 'lodash';

export default class Action extends Component {
  constructor(props) {
    super(props);
    let frame = props.frame;
    if (_.isString(frame)) {
      frame = frame.split('');
      let str = '';
      frame = frame.map((x, index) => {
        str += x;
        return str;
      });
    }
    this.state = {
      frame
    };
  }

  static defaultProps = {
    frame: [],
    timeSpace: 1,
  }

  componentWillReceiveProps(nextProps) {

  }

  componentDidMount() {
    this.frameIndex = 0;
    this.setAction();
    this.interval = setInterval(this.setAction, this.props.timeSpace * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  setAction = () => {
    this.setState({
      view: this.state.frame[this.frameIndex % this.state.frame.length]
    });
    this.frameIndex += 1;
  }

  render() {
    return (
      <span className={this.props.className} style={this.props.style}>
        {this.state.view}
      </span>
    )
  }
}