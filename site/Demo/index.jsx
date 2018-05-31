import React, { Component } from 'react';
import _ from 'lodash';

export default class Demo extends Component {
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
      <div>demo</div>
    )
  }
}