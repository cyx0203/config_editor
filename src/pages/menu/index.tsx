import { useEffect, useState } from 'react';
import DemoFormData from '@/mock/form';
import type { MenuProps } from 'antd';
import {
  Tabs,
  Empty,
  Button,
  Form,
  Input,
  Switch,
  Select,
  Spin,
  message,
  InputNumber,
  Menu,
  Layout,
} from 'antd';
import {
  AppstoreOutlined,
  CloudDownloadOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import ErrorImg from '@/layout/error.png';
const { Content, Sider } = Layout;

import { keys } from 'ramda';

import './index.less';

message.config({
  maxCount: 1,
});

const { TabPane } = Tabs;
const { Item: FormItem } = Form;
const { Option } = Select;

const omitValidateList: InputType[] = ['boolean'];

const setInitValue = (key: string, data: FormItemType[]) => ({
  [key]: Object.fromEntries((data || []).map(({ name: k, value }) => [k, value])),
});

const setPropName = (type: InputType) => {
  switch (type) {
    case 'boolean':
      return 'checked';
    default:
      return 'value';
  }
};

export default function MenuGenerator() {
  const [formData, setFormData] = useState<FormType>({});
  const [status, setStatus] = useState<Status>('loading');
  const [my_select, setMySelect] = useState('全局设置');
  const [my_form] = Form.useForm();
  const [commonList, setCommon] = useState([]);
  const [uniqueList, setUnique] = useState([]);

  useEffect(() => {
    try {
      console.error('~~~~~~~~~~~~~~~~~~~~~~~~~~~', window.ipcRenderer);
      window.ipcRenderer.send('request-read-form-json', '');
      setStatus('loading');
    } catch (error) {
      console.error('需要在 electron 环境中进行操作');
      initData(DemoFormData);
      console.log(DemoFormData);
    }
  }, []);

  useEffect(() => {
    // 监听接收到的数据
    try {
      window.ipcRenderer.on('reply-save-config', (event, _status: boolean) => {
        const _message = _status ? message.success : message.error;
        const txt = _status ? '保存成功' : '保存失败';
        _message(txt);
      });

      if (window.z.originConfig) {
        setStatus('idle');
        initData(window.z.originConfig);
      }
    } catch (error) {
      console.error('需要在 electron 环境中进行写入操作');
    }
  }, []);

  const initData = (data) => {
    console.log(data);
    // console.log(Object.keys(data)[0]);
    setFormData(data);
    let c = [];
    let u = [];
    for (let key in data) {
      if (data[key].visiable) {
        if (data[key].hasOwnProperty('type') && data[key].type === 1) u.push(getItem(key, key));
        else c.push(getItem(key, key));
      }
      setCommon(c);
      setUnique(u);
    }
  };

  const onSubmit = (value) => {
    const key = keys(value)[0] as string;
    console.log(value);
    console.log(formData[key].subList);
    console.log(value[key]);
    const formItems = formData[key].subList.map((item, index) => ({
      ...item,
      value: value[key].hasOwnProperty(item.name) ? value[key][item.name] : item.value,
    }));
    const newFormItem = { ...formData, [key]: { ...formData[key], subList: formItems } };
    console.log(newFormItem);
    setFormData((prev) => ({ ...prev, ...newFormItem }));

    try {
      window.ipcRenderer.send('save-config', JSON.stringify(newFormItem, null, '\t'));
    } catch (error) {
      console.error('需要在 electron 环境中进行操作');
    }
  };

  type MenuItem = Required<MenuProps>['items'][number];

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  }

  const items: MenuProps['items'] = [
    getItem('通用配置', '通用配置', <AppstoreOutlined />, commonList),

    { type: 'divider' },

    getItem('项目专用配置', '项目专用配置', <SettingOutlined />, uniqueList),
  ];

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setMySelect(e.key);
  };

  const renderContent = () => {
    // console.log((formData[my_select]));

    const dom = (
      // keys(formData)
      //   .filter((k) => formData[k].visiable)
      //   .map((key, i) => (
      <div className='z-pane'>
        <div className='z-pane-container'>
          <Form
            onFinish={onSubmit}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 20 }}
            labelWrap
            name={my_select as string}
            // initialValues={
            //   setInitValue(my_select as InputType, formData[my_select]?.subList)
            // }
          >
            {formData[my_select]
              ? (formData[my_select]?.subList)
                  .filter((i) => {
                    return (
                      !i.hasOwnProperty('visiable') ||
                      (i.hasOwnProperty('visiable') && i.visiable === true)
                    );
                  })
                  .map((item, j) => (
                    <FormItem
                      // rules={[{ required: !omitValidateList.includes(item.type) }]}
                      key={`form-item-${my_select}-${j}`}
                      name={[my_select, item.name]}
                      label={item.name}
                      valuePropName={setPropName(item.type)}
                      help={renderTip(item.tip)}
                      initialValue={item.value}
                    >
                      {renderInput(item)}
                    </FormItem>
                  ))
              : ''}
            <Button
              icon={<CloudDownloadOutlined />}
              size='large'
              type='primary'
              htmlType='submit'
              block
            >
              保存
            </Button>
          </Form>
        </div>
      </div>
    );
    // ))
    return dom;
  };

  return (
    <div style={{ display: 'flex' }}>
      <Layout>
        <Sider theme={'light'} width={200}>
          <div className='z-pane'>
            <Menu
              onClick={onClick}
              style={{ width: 200 }}
              defaultSelectedKeys={['全局设置']}
              defaultOpenKeys={['通用配置']}
              mode='inline'
              items={items}
            />
          </div>
        </Sider>
      </Layout>
      <Layout>
        <Content>{renderContent()}</Content>
      </Layout>
    </div>
  );
}

const renderEmpty = (
  <Empty description={false} image={ErrorImg}>
    <Button type='primary'>添加配置项</Button>
  </Empty>
);

const renderInput = (item: FormItemType) => {
  switch (item.type) {
    case 'text':
      return (
        <Input
          // defaultValue={item.value}
          autoComplete='off'
          allowClear
          disabled={item.disabled}
        />
      );
    case 'boolean':
      return (
        <Switch
          // defaultChecked={Boolean(item.value)}
          disabled={item.disabled}
        />
      );
    case 'dropdown':
      return (
        <Select
          disabled={item.disabled}
          // defaultValue={item.options[0].value}
          options={item.options}
        />
      );
    case 'number':
      return <InputNumber disabled={item.disabled} />;
    default:
      return null;
  }
};

const renderTip = (str: string) => {
  if (str) {
    return (
      <p>
        <QuestionCircleOutlined style={{ marginRight: 8 }} />
        {str}
      </p>
    );
  }
  return null;
};
