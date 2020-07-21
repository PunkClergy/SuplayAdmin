import React, { useState } from 'react';
import { Form, Input, Modal, DatePicker, Upload, message, Switch } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import {
  imageUploadProps,
  imageUploadCallback,
  imageLoadingCallback,
} from '../../../../utils/utils';

const FormItem = Form.Item;

// 栅格
const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

// 默认提交参数值
const initialValues = {
  display: false,
};
const CreateForm = props => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel } = props;
  const [loadingCover, setLoadingCover] = useState(false);
  const [titleBgImageUrl, setHeadImageUrl] = useState(undefined);
  const [loadingHeadImage, setLoadingHeadImage] = useState(false);
  const [coverUrl, setCoverUrl] = useState(undefined);

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    console.log(fieldsValue);
    const startAt = fieldsValue.startAt.unix();
    const endAt = fieldsValue.endAt.unix();

    form.resetFields();
    handleAdd({ ...fieldsValue, startAt, endAt });
  };

  return (
    <Modal
      width={800}
      style={{ top: 20 }}
      bodyStyle={{
        padding: '32px 40px 48px',
        overflowY: 'auto',
        height: 'calc(100vh - 200px)',
      }}
      maskClosable={false}
      destroyOnClose
      title="创建会场"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form form={form} {...formLayout} initialValues={initialValues}>
        <Form.Item
          label="展会名称"
          name="name"
          rules={[
            {
              required: true,
              message: '请输入展会名称',
            },
          ]}
        >
          <Input placeholder="请输入展会名称" />
        </Form.Item>
        <FormItem
          label="展会开始时间"
          name="startAt"
          rules={[
            {
              required: true,
              message: '请选择开售时间',
            },
          ]}
        >
          <DatePicker showTime format="YYYY-MM-DD" />
        </FormItem>
        <FormItem
          label="展会结束时间"
          name="endAt"
          rules={[
            {
              required: true,
              message: '请选择开售时间',
            },
          ]}
        >
          <DatePicker showTime format="YYYY-MM-DD" />
        </FormItem>
        <FormItem
          label="封面"
          name="cover"
          valuePropName="cover"
          getValueFromEvent={e => imageUploadCallback(e, setCoverUrl)}
          rules={[
            {
              required: true,
              message: '请上传封面图片',
            },
          ]}
        >
          <Upload
            name="cover"
            {...imageUploadProps}
            onChange={e => imageLoadingCallback(e, setLoadingCover, message)}
          >
            {coverUrl ? (
              <img src={coverUrl} width="150" alt="avatar" />
            ) : (
              <div>
                {loadingCover ? <LoadingOutlined /> : <PlusOutlined />}
                <div className="ant-upload-text">上传</div>
              </div>
            )}
          </Upload>
        </FormItem>
        <FormItem
          label="标题图"
          name="titleBgImage"
          valuePropName="titleBgImage"
          getValueFromEvent={e => imageUploadCallback(e, setHeadImageUrl)}
        >
          <Upload
            name="titleBgImage"
            {...imageUploadProps}
            onChange={e => imageLoadingCallback(e, setLoadingHeadImage, message)}
          >
            {titleBgImageUrl ? (
              <img src={titleBgImageUrl} width="150" alt="avatar" />
            ) : (
              <div>
                {loadingHeadImage ? <LoadingOutlined /> : <PlusOutlined />}
                <div className="ant-upload-text">上传</div>
              </div>
            )}
          </Upload>
        </FormItem>
        <Form.Item label="展会指南链接" name="linkUrl">
          <Input placeholder="请输入展会指南链接" />
        </Form.Item>
        <FormItem label="是否显示" name="display">
          <Switch checkedChildren="显示" unCheckedChildren="隐藏" />
        </FormItem>
        <Form.Item label="请输入背景颜色" name="bgColor">
          <Input placeholder="请输入背景颜色" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForm;
