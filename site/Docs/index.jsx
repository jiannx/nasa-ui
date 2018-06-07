import React, { Component } from 'react';
import _ from 'lodash';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { Route, Switch, Redirect } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import * as NasaUI from 'nasa-ui';
import { MarkdownParser } from 'nasa-ui';

import DemoEcharts from './Demo/Echarts.jsx';
import DemoTableEx from './Demo/TableEx.jsx';
import DemoGrid from './Demo/Grid.jsx';
import DemoInterval from './Demo/Interval.jsx';
import DemoRangePickerEx from './Demo/RangePickerEx.jsx';
import DemoFetch from './Demo/Fetch.jsx';

// import Test from './test.mdx';


const { SubMenu } = Menu;
const { Content, Sider } = Layout;

const demos = [
  { name: 'Echarts', doc: 'src/Echarts/index.md', demo: DemoEcharts, },
  { name: 'CopyTextToClipboard', doc: 'src/CopyTextToClipboard/index.md', demo: null },
  { name: 'MarkdownParser', doc: 'src/MarkdownParser/index.md', demo: null },
  { name: 'Grid', doc: 'src/Grid/index.md', demo: DemoGrid },
  { name: 'TableEx', doc: 'src/TableEx/index.md', demo: DemoTableEx },
  { name: 'Interval', doc: 'src/Interval/index.md', demo: DemoInterval },
  { name: 'RangePickerEx', doc: 'src/RangePickerEx/index.md', demo: DemoRangePickerEx },
  { name: 'Fetch', doc: 'src/Fetch/index.md', demo: DemoFetch },
  { name: 'FormEx2', doc: 'src/FormEx2/index.md', demo: null },
  { name: 'ModalEx', doc: 'src/ModalEx/index.md', demo: null },
];

@withRouter
export default class Doc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      demos: demos,
    };
  }

  static defaultProps = {}

  componentWillReceiveProps(nextProps) {
    this.setMenu();
  }

  componentDidMount() {
    this.setMenu();
  }

  setMenu = () => {
    this.setState({ selectedKeys: [this.props.history.location.pathname] });
  }

  onMenuClick = ({ item, key, selectedKeys }) => {
    this.props.history.push({
      pathname: key
    });
  }

  render() {
    return (
      <Content style={{ padding: '50px' }}>
        <Layout style={{ padding: '24px 0', background: '#fff', minHeight: 800 }}>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultOpenKeys={['component']}
              style={{ height: '100%' }}
              selectedKeys={this.state.selectedKeys}
              onSelect={this.onMenuClick}
            >
              <SubMenu key="component" title={<span><Icon type="laptop" />组件</span>}>
                {this.state.demos.map(x => 
                  <Menu.Item key={`/doc/${x.name}`}>{x.name}</Menu.Item>
                )}
              </SubMenu>
            </Menu>
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
            <Switch>
              <Redirect exact from='/doc' to={`/doc/${this.state.demos[0].name}`}/>
              {this.state.demos.map(x => 
                <Route key={x.name} exact path={`/doc/${x.name}`} render={() => 
                  <div>
                    <MarkdownParser src={require(`../../src/${x.name}/index.md`)} className="doc-md"></MarkdownParser>
                    { x.demo && 
                      <div>
                        <br/>
                        <x.demo></x.demo>
                      </div>
                    }
                  </div>
                }/>
              )}
              <Route render={() => <div>404</div>}/>
            </Switch>
          </Content>
        </Layout>
      </Content>
    )
  }
}