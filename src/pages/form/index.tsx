import { useEffect, useState } from 'react';
import DemoFormData from '@/mock/form';
import { Tabs, Empty, Button, Form, Input, Switch, Select, Spin, message, InputNumber } from 'antd';
import { CloudDownloadOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import ErrorImg from '@/layout/error.png';

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
  [key]: Object.fromEntries(data.map(({ name: k, value }) => [k, value])),
});

const setPropName = (type: InputType) => {
  switch (type) {
    case 'boolean':
      return 'checked';
    default:
      return 'value';
  }
};

// console.log('纯净数据', window.z.config);
// console.log('配置工具数据', window.z.originConfig);

// const _keys = Object.keys(window.z.config);

// const data = _keys.reduce((ac, cu) => {
//   const obj = window.z.config[cu].subList.reduce((acc, cur) => {
//     acc[cur.key] = cur.value;
//     return acc;
//   }, {});
//   return { ...ac, [cu]: obj };
// }, {});

// console.log(data);

// console.log(setInitValue('系统设置', FormData['系统设置'].subList));

export default function FormGenerator() {
  const [formData, setFormData] = useState<FormType>({});
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    try {
      window.ipcRenderer.send('request-read-form-json', '');
      setStatus('loading');
    } catch (error) {
      console.error('需要在 electron 环境中进行操作');
      setFormData(DemoFormData);
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
        // const _keys = keys(window.z.originConfig);
        // // 筛选出可见的配置项
        // const _visible = _keys.reduce((ac, cu) => {
        //   if (window.z.originConfig[cu].visiable) {
        //     ac[cu] = window.z.originConfig[cu];
        //   }
        //   return ac;
        // }, {});
        setFormData(window.z.originConfig);
        setStatus('idle');
      }
    } catch (error) {
      console.error('需要在 electron 环境中进行写入操作');
    }
  }, []);

  const onSubmit = (value) => {
    const key = keys(value)[0] as string;
    const formItems = formData[key].subList.map((item) => ({
      ...item,
      value: value[key][item.name],
    }));
    const newFormItem = { ...formData, [key]: { ...formData[key], subList: formItems } };
    setFormData((prev) => ({ ...prev, ...newFormItem }));

    try {
      window.ipcRenderer.send('save-config', JSON.stringify(newFormItem, null, '\t'));
    } catch (error) {
      console.error('需要在 electron 环境中进行操作');
    }
  };

  return (
    // <Spin spinning={status === 'loading'} tip='正在加载配置，请稍等'>
    <Tabs tabPosition='left'>
      {keys(formData)
        .filter((k) => formData[k].visiable)
        .map(
          (key, i) => (
            console.log(key),
            (
              <TabPane tab={key} key={key} className='z-pane'>
                <div key={'tab-panel-' + i} className='z-pane-container'>
                  {keys(formData[key]).length === 0 || !formData[key].visiable ? (
                    renderEmpty
                  ) : (
                    <Form
                      onFinish={onSubmit}
                      labelCol={{ span: 6 }}
                      wrapperCol={{ span: 20 }}
                      labelWrap
                      name={key as string}
                      initialValues={setInitValue(key as InputType, formData[key].subList)}
                    >
                      {formData[key].subList.map((item, j) => (
                        <FormItem
                          // rules={[{ required: !omitValidateList.includes(item.type) }]}
                          key={`form-item-${key}-${j}`}
                          name={[key, item.name]}
                          label={item.name}
                          valuePropName={setPropName(item.type)}
                          help={renderTip(item.tip)}
                        >
                          {renderInput(item)}
                        </FormItem>
                      ))}
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
                  )}
                </div>
              </TabPane>
            )
          ),
        )}
    </Tabs>
    // {/* </Spin> */}
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
