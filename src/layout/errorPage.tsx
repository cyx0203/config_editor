import { Result, Button } from 'antd';
import { Component, ErrorInfo } from 'react';

import ErrorImg from './error.png';

interface LayoutProps {}

interface LayoutState {
  isError: boolean;
  errorInfo: string;
}

export default class extends Component<LayoutProps, LayoutState> {
  state: Readonly<LayoutState> = {
    isError: false,
    errorInfo: '',
  };

  static getDerivedStateFromError(error: Error) {
    return { isError: true, errorInfo: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log(error, errorInfo);
  }
  render() {
    if (this.state.isError) {
      return (
        <Result
          icon={<img width={256} src={ErrorImg} />}
          style={{
            height: '100%',
            background: '#fff',
          }}
          title='错误处理'
          extra={
            <>
              <div
                style={{
                  maxWidth: 620,
                  textAlign: 'left',
                  backgroundColor: 'rgba(255,229,100,0.3)',
                  borderLeftColor: '#ffe564',
                  borderLeftWidth: '9px',
                  borderLeftStyle: 'solid',
                  padding: '20px 45px 20px 26px',
                  margin: 'auto',
                  marginBottom: '30px',
                  marginTop: '20px',
                }}
              >
                <p>注意</p>
                <p>
                  错误边界<strong>无法</strong>捕获以下场景中产生的错误：
                </p>
                <ul
                  style={{
                    listStyle: 'none',
                  }}
                >
                  <li>
                    事件处理（
                    <a href='https://zh-hans.reactjs.org/docs/error-boundaries.html#how-about-event-handlers#how-about-event-handlers'>
                      了解更多
                    </a>
                    ）
                  </li>
                  <li>
                    异步代码（例如 <code>setTimeout</code> 或 <code>requestAnimationFrame</code>{' '}
                    回调函数）
                  </li>
                  <li>服务端渲染</li>
                  <li>它自身抛出来的错误（并非它的子组件）</li>
                </ul>
              </div>
              <Button
                danger
                type='primary'
                onClick={() => {
                  window.location.reload();
                }}
              >
                刷新页面
              </Button>
            </>
          }
        />
      );
    }
    return this.props.children;
  }
}
