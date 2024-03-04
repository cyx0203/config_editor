import { WarningFilled } from '@ant-design/icons';

const data = [
  {
    title: '最小化窗体',
    description: '将浏览器最小化至系统托盘',
    cmd: 'minimize',
    level: 'app',
  },
  {
    title: '显示窗体',
    description: '从最小化唤起',
    cmd: 'show',
    level: 'app',
  },
  {
    title: '重启浏览器',
    description: '重启',
    cmd: 'restart',
    level: 'app',
  },
  {
    title: '重启设备',
    description: (
      <>
        <WarningFilled style={{ color: 'orange' }} /> 立即重启设备
      </>
    ),
    cmd: 'reboot',
    level: 'sys',
  },
  {
    title: '退出浏览器',
    description: '连同后台、工具一起清理掉',
    cmd: 'exit',
    level: 'app',
  },
];

export default data;
