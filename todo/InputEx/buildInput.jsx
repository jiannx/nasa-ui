/**
 * Help workaround Chinese asynchronously input problem.
 * https://github.com/zhaoyao91/react-optimistic-input
 */

import React from 'react';

export default function(component) {
  return class OptimisticInput extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        value: props.value
      }
    }

    componentWillUpdate(nextProps, nextState) {
      if (nextProps.value !== this.props.value && nextProps.value !== nextState.value) {
        this.setState({ value: nextProps.value });
      }
    }

    render() {
      return React.createElement(component, Object.assign({}, this.props, {
        value: this.state.value,
        onChange: this.onChange.bind(this)
      }))
    }

    onChange(e) {
      if (this.props.value === undefined) {
        this.setState({
          value: e.target.value
        });
      }
      this.props.onChange && this.props.onChange(e);
    }
  }
}