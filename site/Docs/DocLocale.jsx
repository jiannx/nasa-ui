import React, { Component } from 'react';
import { Button } from 'antd';
import { locale, MarkdownParser } from 'nasa-ui';
import marked from 'marked';

var renderer = new marked.Renderer();

renderer.code = function(code, lang) {
  return '<pre>' +
    '<code class="hljs ' + lang + '">' + code.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code>' +
    '</pre>';
};

export default class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {}

  componentWillReceiveProps(nextProps) {}

  componentDidMount() {

  }

  componentWillUnmount() {}

  onChange = (lang) => {
    locale.setLocales(lang, () => {
      window.location.reload();
    });
  }

  render() {
    return (
      <div>

        <MarkdownParser src={require(`../../src/locale/index.md`)} className="doc-md" 
          option={{
            renderer: renderer,
        }}>
        </MarkdownParser>
      
        <p>默认中文 当前语言：{locale.getCurrentLocale()}</p>
        <p>
          <Button onClick={() => this.onChange('zh-CN')}>设置到中文</Button>
          <Button onClick={() => this.onChange('en-US')}>设置到英文</Button>
        </p>
        Tips: 可跳转到表单页面查看组件 组件内部必填项规则将进行转化，label及其他校验信息须在项目内进行国际话，与nasa-ui无关。

      </div>
    )
  }
}