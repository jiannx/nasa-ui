import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch, Redirect } from 'react-router';
import { HashRouter, NavLink, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import Overview from './Overview';
import Docs from './Docs';
import Demo from './Demo';
import './style.scss';

const { Header, Content, Footer } = Layout;

ReactDOM.render((
  <HashRouter>
    <Layout>
      <Header>
        <Link className="logo" to="/">Nasa UI</Link>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="/"><NavLink to="/" exact>Overview</NavLink></Menu.Item>
          <Menu.Item key="/docs"><NavLink to="/docs" exact>Doc</NavLink></Menu.Item>
          <Menu.Item key="/demo"><NavLink to="/demo" exact>Demo</NavLink></Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Switch>
          <Route exact path="/" component={Overview} />
          <Route exact path="/docs" component={Docs}/>
          <Route exact path="/demo" component={Demo}/>
          <Route render={() => <div>404</div>}/>
        </Switch>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Nasa UI ©2018 Created by Netease
      </Footer>
    </Layout>
  </HashRouter>
), document.getElementById('root'));