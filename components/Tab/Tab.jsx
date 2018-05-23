import React, { Component } from 'react';
import _ from 'lodash';
import './Tab.scss';

export default class Tab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: props.activeIndex
    };
  }

  static defaultProps = {
    type: 'line', // block
    className: '',
    items: [],
    content: null,
    style: null,
    activeIndex: 0,
    onChange: null, // tab点击事件，告知父节点已更新(当前选中页index, 当前tab数据)，创建后将触发一次
    onSelect: null, // tab点击事件, 父节点更新activeIndex
  }

  componentWillReceiveProps(nextProps) {
    // 外部更新选中项的情况下才进行重置state
    if (this.props.onSelect) {
      this.setState({
        activeIndex: nextProps.activeIndex
      });
    }
  }

  componentDidMount() {
    this.onChange(this.props.activeIndex, this.props.items[this.state.activeIndex]);
  }

  onChange(index, item) {
    if (this.props.onSelect) {
      this.props.onSelect(index, item);
      return;
    }
    this.setState({
      activeIndex: index
    }, () => {
      if (this.props.onChange) {
        this.props.onChange(index, item);
      }
    });
  }

  render() {
    const className = this.props.type === 'line' ? 'nasa-tab' : 'nasa-tab-block';
    return (
      <div className={className + '' + this.props.className} style={this.props.style}>
        <ul className="tab-menu">
          { this.props.items.map((item, index) => 
            <li className={this.state.activeIndex === index ? 'active' : null} 
              key={item}
              onClick={this.onChange.bind(this, index, item)}
            >
              { (_.isArray(this.props.content) && this.props.content.length > 0) ?
                ( this.props.content[index] )
                : 
                ( <span className="center">{item}</span> )
              }
            </li>
          )}
        </ul>
        <div className="tab-right">
          {this.props.children}
        </div>
      </div>
    )
  }
}
