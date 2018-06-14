import React, { Component } from 'react';
import _ from 'lodash';
import { MarkdownParser } from 'nasa-ui';
import doc from './doc.md'

export default class Profile extends Component {
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
      <div style={{width: 1000, margin: 'auto', padding: '50px 0'}}>
        <MarkdownParser src={doc}></MarkdownParser>
      </div>
    )
  }
}