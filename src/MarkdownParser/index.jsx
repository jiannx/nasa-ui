/**
 * https://github.com/chjj/marked
 */
import React, { Component } from 'react';
import axios from 'axios';
import marked from 'marked';

export default class MarkdownParser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      html: ''
    };
  }

  static defaultProps = {
    className: '',
    src: null,
    value: null,
    option: {}
  }

  componentDidMount() {
    if (this.props.src) {
      axios(this.props.src).then(res => {
        let html = marked(res.data, this.props.option);
        this.setState({ html });
      });
    } else if (this.props.value) {
      let html = marked(this.props.value, this.props.option);
      this.setState({ html });
    }
  }

  render() {
    return (
      <div className={this.props.className} dangerouslySetInnerHTML={{__html: this.state.html}}></div>
    )
  }
}