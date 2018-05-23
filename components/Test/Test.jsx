import React, { Component } from 'react';

class Child extends Component {

  componentWillReceiveProps() {
    console.log('child componentWillReceiveProps')
  }

  componentDidMount() {
    console.log('child componentDidMount');
  }

  onClick() {
    console.log('child on click');
    console.log('child before setState')
    this.setState({}, () => {
      console.log('child setState success');
      console.log('child do praent callback');
      if (this.props.onClickChange) {
        this.props.onClickChange();
      }
    });
  }

  render() {
    console.log('child render');
    return (
      <button onClick={this.onClick.bind(this)}>child button</button>
    )
  }
}

class Test extends Component {

  componentWillReceiveProps() {
    console.log('parent componentWillReceiveProps')
  }

  componentDidMount() {
    console.log('parent componentDidMount');
  }

  onClick() {
    console.log('parent before setState')
    this.setState({}, () => {
      console.log('parent setState success');
    });
  }

  render() {
    console.log('parent render');
    return (
      <Child onClickChange={this.onClick.bind(this)}/>
    )
  }
}

export default Test;
