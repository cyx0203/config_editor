import { LockOutlined, LockTwoTone, MacCommandOutlined, SettingOutlined } from '@ant-design/icons';
import BasicLayout, { BasicLayoutProps } from '@ant-design/pro-layout';
import { Component, ErrorInfo } from 'react';
import { history, Link } from 'umi';
import errorPage from './errorPage';
import Logo from './logo.png';
import { Button } from 'antd';
import admin from '@/admin';

const defaultSettings: BasicLayoutProps = {
  layout: 'top',
  title: '公用 - 配置工具',
  style: { height: '100vh', overflow: 'hidden' },
  logo: <img alt='logo' src={Logo} />,
  rightContentRender: admin,
  location: { pathname: '/' },
};

interface LayoutProps {}

interface LayoutState {
  isError: boolean;
  errorInfo: string;
  pathname: string;
}

export default class Layout extends Component<LayoutProps, LayoutState> {
  state: Readonly<LayoutState> = {
    isError: false,
    errorInfo: '',
    pathname: '/components/admin',
  };

  static getDerivedStateFromError(error: Error) {
    return { isError: true, errorInfo: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log(error, errorInfo);
  }

  handleSkip = (url: string) => () => {
    history.push(url);
  };

  render() {
    return (
      <BasicLayout
        {...defaultSettings}
        location={{ pathname: this.state.pathname }}
        ErrorBoundary={errorPage}
        onMenuHeaderClick={this.handleSkip('/')}
        menuItemRender={(item, dom) => (
          <a
            onClick={() => {
              this.setState({ pathname: item.path || '/' });
              history.push(item.path || '/');
            }}
            key={item.path}
          >
            {dom}
          </a>
        )}
        route={{
          path: '/',
          routes: [
            {
              path: '/components/admin',
              component: './admin',
              icon: <MacCommandOutlined />,
              name: '指令集',
            },
            {
              path: '/components/editor2',
              component: './menu',
              icon: <SettingOutlined />,
              name: '配置项',
            },
          ],
        }}
      >
        {this.props.children}
      </BasicLayout>
    );
  }
}
