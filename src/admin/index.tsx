import { LockTwoTone } from '@ant-design/icons';
import { Modal } from 'antd';

export default function () {
  function toggle() {
    Modal.warning({
      title: '通知',
      content: '☕️ 该功能正在开发中～',
      maskClosable: true,
    });
  }

  return (
    <>
      <a onClick={toggle} style={{ marginRight: 12 }}>
        <LockTwoTone style={{ marginRight: 8 }} />
        管理员
      </a>
    </>
  );
}
