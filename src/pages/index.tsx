import styles from './index.less';
import { Button } from 'antd';
import { history } from 'umi';

export default function IndexPage() {
  const handleClick = (path: string) => () => {
    history.push(path);
  };

  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
      <Button type='primary' onClick={handleClick('/components/editor')}>
        跳转表单页
      </Button>
    </div>
  );
}
