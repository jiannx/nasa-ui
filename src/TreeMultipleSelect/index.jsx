/**
 * 级联多选，必须为受控组件
 * 支持树多选，列表多选
 */
import React, { Component } from 'react';
import { Button, Dropdown, Input, Tree, Popover, Icon } from 'antd';
import _ from 'lodash';
import './style.scss';

const Search = Input.Search;
const TreeNode = Tree.TreeNode;

const DEFAULT_SHOW_COUNT = 20; // 默认显示条目数

class TreeMultipleSelect extends Component {
  static defaultProps = {
    className: '', // 样式名
    list: null, // 可选列表  [{ title, key, children: [{ titile, key }, {title, key}] }]
    value: [], // 与选值 [key1, key2, key3]
    onChange: (selKeyList) => {}, // 变更事件 选中key值列表
    onAddClick: null, // 添加按钮点击事件

    searchPlaceholder: '请输入关键词',
    addButton: '+ 添加',
    noListDataText: '没有可选择的项',
    placeholder: '请添加',
    searchNoMatchText: '没有匹配项',
    nodeRender: record => record.title, // 节点渲染 
  }

  constructor(props) {
    super(props);
    this.state = {
      search: '',
      menuShow: false,
      value: props.value || [],
      checkedKeys: props.value || [],
      menuCheckedKeys: [],
      showCount: DEFAULT_SHOW_COUNT,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.value, this.state.value)) {
      this.setState({ checkedKeys: nextProps.value, value: nextProps.value });
    }
    // 可选列表变更时，强制刷新tree中选中节点
    if (!_.isEqual(nextProps.list, this.props.list)) {
      this.setState({ checkedKeys: [] });
      setTimeout(() => {
        this.setState({ checkedKeys: nextProps.value, value: nextProps.value });
      });
    }
  }

  componentDidMount(nextProps) {
    this.id = `nasa-tms-${new Date().getTime()}`;
    console.log(this.id);
  }

  onAddClick = () => {
    this.props.onAddClick && this.props.onAddClick();
    this.setState({ menuShow: true });
  }

  onMenuSelOk = () => {
    let list = this.state.checkedKeys;
    this.props.onChange && this.props.onChange(list);
    this.setState({ menuShow: false });
  }

  onMenuSelReset = () => {
    this.setState({ checkedKeys: [], search: '' });
  }

  onSearchChange = (e) => {
    this.initShowCount();
    this.setState({ search: e.target.value });
  }

  renderMenuTreeNodes = (list) => {
    return list.map((item) => {
      return (
        <TreeNode title={this.props.nodeRender(item)} key={item.key} dataRef={item}>
          {item.children ? this.renderMenuTreeNodes(item.children) : null}
        </TreeNode>
      );
    });
  }

  onMenuScroll = (e) => {
    if (e.target.scrollTop + e.target.clientHeight === e.target.scrollHeight) {
      this.setState({ showCount: this.state.showCount + DEFAULT_SHOW_COUNT });
    }
  }

  getKeys = (treeData, keys = []) => {
    treeData.forEach(node => {
      keys.push(node.key);
      if (node.children) {
        this.getKeys(node.children, keys);
      }
    });
    return keys;
  }

  // 当前选中列表 = 之前选中key列表（移除当前列表对应的所有key）+当前列表选中的key
  onMenuCheck = (currentList, checkedKeys, ...arg) => {
    // 当前可选菜单的key列表
    let currentListKeys = this.getKeys(currentList);
    // 原先选中的key中移除当前列表所有key
    let selectedNotInCurrentListKey = [...this.state.checkedKeys];
    _.remove(selectedNotInCurrentListKey, x => _.includes(currentListKeys, x));
    // 合并当前列表之外的选中key，当前列表对应选中的key
    this.setState({ checkedKeys: selectedNotInCurrentListKey.concat(checkedKeys) });
  }

  renderSelectedTree = (treeData, keyList) => {
    let nodes = [];
    treeData.forEach(item => {
      if (keyList.includes(item.key)) {
        nodes.push(
          <TreeNode title={this.props.nodeRender(item)} key={item.key} dataRef={item}>
            {item.children ? this.renderMenuTreeNodes(item.children) : null}
          </TreeNode>
        )
      }
    });
    return nodes;
  }

  onSelectedCheck = (checkedKeys) => {
    this.setState({ menuCheckedKeys: checkedKeys });
  }
  onSelectedSelAll = () => {
    this.setState({ menuCheckedKeys: this.state.value });
  }
  onSelectedSelNone = () => {
    this.setState({ menuCheckedKeys: [] });
  }

  onSelectedDel = () => {
    this.setState({ menuCheckedKeys: [] });
    let list = this.state.value.filter(v => this.state.menuCheckedKeys.findIndex(sel => sel === v) < 0);
    this.props.onChange && this.props.onChange(list);
  }

  initShowCount = () => {
    this.setState({ showCount: DEFAULT_SHOW_COUNT });
  }

  onMenuTrigger = (v) => {
    this.initShowCount();
    this.setState({ menuShow: v });
  }

  render() {
    let list = this.props.list || [];

    if (this.state.search) {
      list = list.filter(x => _.get(x, 'title', '').includes(this.state.search));
    }

    // 是否有更多
    let hasMore = null;
    if (this.state.showCount < list.length) {
      hasMore = <div style={{padding: '0px 20px 10px 50px'}}>...</div>
    }

    // 控制显示条目数
    list = _.slice(list, 0, this.state.showCount - 1);

    const menu = (
      <div className="nasa-tms-menu" onClick={(e) => e.stopPropagation()}>
        <div className="nasa-tms-menu-tool">
          <Search placeholder={this.props.searchPlaceholder} onChange={this.onSearchChange}></Search>
        </div>
        <div className="nasa-tms-menu-content" onScroll={this.onMenuScroll}>
          {this.props.list === null && 
            <div style={{padding: '4px 10px'}}>加载中...</div>
          }
          {_.isArray(this.props.list) && this.props.list.length === 0 && 
            <div style={{padding: '4px 10px'}}>{this.props.noListDataText}</div>
          }
          {_.isArray(this.props.list) && this.props.list.length > 0 && list.length === 0 && this.state.search && 
            <div style={{padding: '4px 10px'}}>{this.props.searchNoMatchText}</div>
          }
          <Tree
            checkable
            onCheck={(...arg) => this.onMenuCheck(list, ...arg)}
            checkedKeys={this.state.checkedKeys}
          >
            {this.renderMenuTreeNodes(list)}
          </Tree>
          {hasMore}
        </div>
        <div className="nasa-tms-menu-footer">
          <Button type="primary" onClick={this.onMenuSelOk}>确定</Button>&nbsp;
          <Button onClick={this.onMenuSelReset}>重置</Button>
        </div>
      </div>)

    return (
      <div className={`nasa-tms ${this.props.className}`}>
        <div className="nasa-tms-tool">
          <Dropdown trigger="click" overlay={menu} visible={this.state.menuShow} onVisibleChange={this.onMenuTrigger}>
            <a onClick={this.onAddClick}>{this.props.addButton}</a>
          </Dropdown>
          <div className="nasa-tms-tool-right">
            {this.state.menuCheckedKeys.length < this.state.value.length && 
              <Button type="button" onClick={this.onSelectedSelAll}>全选</Button>
            }
            {this.state.menuCheckedKeys.length === this.state.value.length && this.state.value.length > 0 && 
              <Button type="button" onClick={this.onSelectedSelNone}>取消全选</Button>
            }
            <Button type="button" disabled={this.state.menuCheckedKeys.length === 0} onClick={this.onSelectedDel}>删除</Button>
          </div>
        </div>
        <div className="nasa-tms-content">
          {this.state.value.length === 0 && 
            <div style={{padding: 40, textAlign: 'center', color: '#ccc'}}>{this.props.placeholder}</div>
          }
          {this.state.value.length > 0 && 
            <Tree
              checkable
              onCheck={this.onSelectedCheck}
              checkedKeys={this.state.menuCheckedKeys}
            >
              {this.renderSelectedTree(this.props.list, this.state.value)}
            </Tree>
          }
        </div>
      </div>
    )
  }
}

export default TreeMultipleSelect;