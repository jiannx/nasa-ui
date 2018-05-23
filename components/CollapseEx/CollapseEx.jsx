import React, { Component } from 'react';
import _ from 'lodash';
import './CollapseEx.scss';

export default class CollapseEx extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: props.active
    };
  }

  static defaultProps = {
    num: 5, 
    rows: [],
    message: '查看全部域名'   
  }

  collapse() {
    this.setState({ active: true});
  }


  render() {
    let style= {
      maxHeight: 200 ,
      overflow: 'auto',
    };
    style = Object.assign({}, style, this.props.style );
    
    let length = this.props.rows.length;
    const chunks= _.chunk(this.props.rows,this.props.num);
    return (
      <div style={style}>
        <div >
          { !this.state.active && chunks[0] && chunks[0].map( (row, index) => <div key={index}>{ row }</div>) }
          { this.state.active && this.props.rows.map( (row, index) => <div key={index}>{ row }</div>) }
        </div>        
        { !this.state.active && length > this.props.num && <a onClick={ this.collapse.bind(this) } >{this.props.message }</a>}
      </div>
    )
  }
}
