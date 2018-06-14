import React, { Component } from 'react';
import { Button } from 'antd';
import { MarkdownParser } from 'nasa-ui';


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
      <div>
        <MarkdownParser src={'https://raw.githubusercontent.com/milolu/nasa-ui/master/README.md'}></MarkdownParser>

        <MarkdownParser value="* test"></MarkdownParser>
      </div>
    )
  }
}