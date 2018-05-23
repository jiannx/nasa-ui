/**
 * 选择框，下拉包含搜索及确定
 * 
 */
import React, { Component } from 'react';
import _ from 'lodash';
import { Dropdown, Input, Checkbox, Button, Icon } from 'antd';
import './style.scss';

const Search = Input.Search;

class Item extends React.PureComponent {
  render() {
    return (
      <div className="nasa-select-menu-item">
      <Checkbox checked={this.props.checked} onChange={() => this.props.onChange(this.props.data)}>
        <span title={this.props.data[this.props.optionLabelKey]}>
          {this.props.data[this.props.optionLabelKey]}
        </span>
      </Checkbox>
    </div>
    )
  }
}

export default class SelectWithSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      option: this.props.option,
      checkedList: [],
      visible: false,
      searchKey: '',
      checkStr: '',
      currentShowIndex: 0, // 默认显示数量
    };
    this.id = `select-with-search-${Math.random()}`;
  }

  static defaultProps = {
    value: [],
    className: '',
    style: null,
    option: [],
    optionKey: 'value',
    optionLabelKey: 'value',
    onChange: (selIdList) => {},
    placeholder: '全部',
    checkAllPlaceholder: null, // 全选时显示文本 该值为空时使用placeholder
    searchPlaceholder: '请输入',
    searchText: '搜索',
    noSearchTip: '暂无相关信息',
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.option, nextProps.option)) {
      this.setState({ option: nextProps.option, searchKey: '' });
    }
    if (!_.isEqual(this.props.value, nextProps.value)) {
      this.setState({ value: nextProps.value, checkedList: nextProps.value, searchKey: '' }, () => {
        this.setCheckStr();
      });
    }
  }

  onSearch = _.debounce(() => {
    this.setState({ currentShowIndex: 0 });
    let option = this.props.option.filter(x => x[this.props.optionLabelKey].match(this.state.searchKey));
    this.setState({ option });
  }, 500)

  onSearchKeyChange = (value) => {
    this.setState({ searchKey: value }, () => {
      this.onSearch();
    });
  };

  onChecked = (item) => {
    let key = item[this.props.optionKey];
    let { checkedList } = this.state;
    let index = checkedList.findIndex(x => x === key);

    if (index < 0) {
      checkedList.push(key);
    } else {
      checkedList.splice(index, 1);
    }
    this.setState({ checkedList });
  }

  onCheckedAll = () => {
    let { checkedList } = this.state;
    let currentCheckAll = this.state.checkedList.length > 0 && _.isEqual(this.state.checkedList, this.state.option.map(x => x[this.props.optionKey]));
    if (currentCheckAll) {
      checkedList = [];
    } else {
      checkedList = this.state.option.map(x => x[this.props.optionKey]);
    }
    this.setState({ checkedList });
  }

  onOk = () => {
    this.setCheckStr();
    this.props.onChange && this.props.onChange(this.state.checkedList);
    this.setState({ visible: false, currentShowIndex: 0 });
    this.onSearchKeyChange('')
  }

  setCheckStr = () => {
    let checkStr = '';
    let { checkedList } = this.state;

    // 全选状态
    if (checkedList.length === this.props.option.length) {
      checkedList = [];
      checkStr = this.props.checkAllPlaceholder || this.props.placeholder;
    }
    // 非全选
    else {
      if (this.props.optionKey) {
        let names = [];
        for (let key of checkedList) {
          let item = this.props.option.find(x => x[this.props.optionKey] === key);
          names.push(item[this.props.optionLabelKey]);
        }
        checkStr = names.splice(0, 10).join(';');
      } else if (this.props.optionLabelKey) {
        let names = checkedList.map(x => x[this.props.optionLabelKey]);
        checkStr = names.splice(0, 10).join(';');
      } else {
        checkStr = checkedList.splice(0, 10).join(';');
      }
    }
    this.setState({ checkStr });
  }

  onOptionScroll = (e) => {
    if (e.target.scrollTop + 100 > e.target.scrollTopMax) {
      this.setState({ currentShowIndex: this.state.currentShowIndex + 1 })
    }
  }

  render() {
    // let currentCheckAll = this.state.checkedList.length > 0 && this.state.checkedList.length === this.state.option.length;
    let currentCheckAll = this.state.checkedList.length > 0 && _.isEqual(this.state.checkedList, this.state.option.map(x => x[this.props.optionKey]));

    const overlay = (
      <div className="nasa-select-menu">
        <div className="nasa-select-menu-search">
          <Input
            placeholder={this.props.placeholder}
            value={this.state.searchKey}
            onChange={e => this.onSearchKeyChange(e.target.value)}
            style={{ width: 240, margin: 10}}
            addonAfter={this.props.searchText}
          />
          {this.state.searchKey !== '' && 
            <Icon type="close-circle" className="nasa-select-menu-search-clear" onClick={() => this.onSearchKeyChange('')}/>
          }
        </div>

        <div className="nasa-select-menu-item check-all">
          <Checkbox checked={currentCheckAll} onChange={this.onCheckedAll}>
            全选（{this.state.checkedList.length}/{this.state.option.length}项）
          </Checkbox>
        </div>
        <div className="nasa-select-menu-options" onScroll={this.onOptionScroll}>
          {this.props.option.length === 0 && 
            <div className="nasa-select-menu-item">暂无数据</div>
          }
          {this.state.option.length === 0 && this.props.option.length !== 0 &&
            <div className="nasa-select-menu-item">{this.props.noSearchTip}</div>
          }
          {this.state.option.map((x, index) => 
            index <= ((this.state.currentShowIndex + 1) * 100) &&
            <Item 
              key={x[this.props.optionKey]}
              checked={this.state.checkedList.findIndex(checked => x[this.props.optionKey] === checked) >= 0} 
              onChange={this.onChecked.bind(this)} 
              data={x}
              optionLabelKey={this.props.optionLabelKey}
            />
          )}
        </div>
        <div className="nasa-select-buttom">
          <Button type="primary" onClick={this.onOk}>确定</Button>&nbsp;
          <Button onClick={() => this.setState({visible: false})}>取消</Button>
        </div>
      </div>
    );
    return (
      <div className={`nasa-select-with-search ${this.props.className}`} style={this.props.style}>
        <div id={this.id}></div>
        <Dropdown 
          overlay={overlay} 
          trigger={['click']}
          visible={this.state.visible}
          getPopupContainer={() => document.getElementById(this.id)}
          onVisibleChange={visible => this.setState({visible})}
        >
          <div className="nasa-select-selected">
            <span>{this.state.checkStr === '' ? this.props.placeholder : this.state.checkStr}</span>
            <Icon type="down" className={this.state.visible ? 'rotate': null} />
          </div>
        </Dropdown>
      </div>
    )
  }
}