import { MacCommandOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { List, Card, message } from 'antd';
import { useEffect, useState } from 'react';
import data from './data';
import styles from './index.module.less';

export default function () {
  const [loading, setLoading] = useState(false);

  const handleSelect = (item: typeof data[0]) => {
    setLoading(true);
    if (window.ipcRenderer) {
      window.ipcRenderer.send('exec-cmd', item.cmd);
    }
  };

  useEffect(() => {
    if (window.ipcRenderer) {
      window.ipcRenderer.on('reply-exec-cmd', (event, data) => {
        setLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
        message.error('发生了未知错误，请尝试重试');
      }, 30000);
    }
  }, [loading]);

  return (
    <PageContainer
      subTitle={
        <>
          部分操作较为敏感，需<strong>小心操作</strong>；点击卡片即可开始操作。
        </>
      }
      avatar={{ icon: <MacCommandOutlined /> }}
    >
      <List
        dataSource={data}
        grid={{ gutter: 21, column: 3 }}
        className={styles.list}
        loading={loading}
        renderItem={(item) => (
          <List.Item style={{ height: '100%' }}>
            <Card className={styles.wrapper} onClick={() => handleSelect(item)}>
              <h3 className={styles.header}>{item.title}</h3>
              <p className={styles.description}>{item.description}</p>
            </Card>
          </List.Item>
        )}
      />
    </PageContainer>
  );
}
