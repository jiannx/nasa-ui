import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch, Redirect } from 'react-router';
import { HashRouter, NavLink, Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import Overview from './Overview';
import Docs from './Docs';
import './style.scss';
import './mock';

const { Header, Content, Footer } = Layout;

ReactDOM.render((
  <HashRouter>
    <Layout>
      <Header style={{overflow: 'hidden'}}>
        <Link className="logo" to="/">Nasa UI</Link>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="/"><NavLink to="/" exact>Overview</NavLink></Menu.Item>
          <Menu.Item key="/doc"><NavLink to="/doc" exact>Doc</NavLink></Menu.Item>
          <a className="gitbub-link" style={{float: 'right'}} href="https://github.com/milolu/nasa-ui"><Icon type="github" /></a>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Switch>
          <Route exact path="/" component={Overview} />
          <Route path="/doc" component={Docs}/>
          <Route render={() => <div>404</div>}/>
        </Switch>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Nasa UI ©2018 Created by Netease
      </Footer>
    </Layout>
  </HashRouter>
), document.getElementById('root'));