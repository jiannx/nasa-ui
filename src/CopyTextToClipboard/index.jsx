/**
 * 拷贝内容到剪切板
 */
import React, { Component } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './style.scss';
import locale from '../locale';

function copyTextToClipboard(text, successCallback, failCallback) {
  let textArea = document.createElement("textarea")
  textArea.style.width = '0';
  textArea.style.height = '0';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    if (document.execCommand('copy'))
      successCallback && successCallback();
    else
      failCallback && failCallback();
  } catch (err) {
    failCallback && failCallback();
  }
  document.body.removeChild(textArea)
}

export default class CopyTextToClipboard extends Component {
  static defaultProps = {
    text: '', // 需要复制的内容
    successCallback: null, // 复制成功回调
    failCallback: null, // 复制失败回调
    title: locale.get('Click to copy information'), // 鼠标hover文本
  }

  onCopy = () => {
    copyTextToClipboard(this.props.text, this.props.successCallback, this.props.failCallback);
  }

  render() {
    return (
      this.props.children ?
      <span className={classNames('nasa-copy-text', this.props.className)} onClick={this.onCopy}>
				{this.props.children}
			</span> :
      <a className={classNames('nasa-copy-text', this.props.className)} title={this.props.title} onClick={this.onCopy}>
	    	<Icon type="copy" />
	    </a>
    )
  }
}

CopyTextToClipboard.propTypes = {
  text: PropTypes.string.isRequired,
  successCallback: PropTypes.func,
  failCallback: PropTypes.func,
  title: PropTypes.string,
};