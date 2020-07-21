import React, { useState } from 'react';
import { Form, Input, Modal, Upload, InputNumber, message, DatePicker, Switch } from 'antd';
import moment from 'moment';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { imageUploadProps, imageUploadCallback, imageLoadingCallback } from '../../../utils/utils';

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
  allowCoupon: false,
};
const CreateForm = props => {
  const [form] = Form.useForm();
  // 封面
  const [coverUrl, setCoverUrl] = useState(undefined);
  const [imageUrl, setImageUrl] = useState(undefined);
  const [loadingCover, setLoadingCover] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const { modalVisible, onSubmit: handleAdd, onCancel } = props;
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    form.resetFields();
    const openAt = fieldsValue.openAt.unix();
    handleAdd({ ...fieldsValue, price: Math.floor(fieldsValue.price * 100), openAt });
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
      title="创建福袋"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form form={form} {...formLayout} initialValues={initialValues}>
        <FormItem
          label="名称"
          name="name"
          rules={[
            {
              required: true,
              message: '请输入福袋名称',
            },
          ]}
        >
          <Input placeholder="请输入福袋名称" />
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
          label="图片"
          name="image"
          valuePropName="image"
          getValueFromEvent={e => imageUploadCallback(e, setImageUrl)}
          rules={[
            {
              required: true,
              message: '请上传图片',
            },
          ]}
        >
          <Upload
            name="image"
            {...imageUploadProps}
            onChange={e => imageLoadingCallback(e, setLoadingImage, message)}
          >
            {imageUrl ? (
              <img src={imageUrl} width="150" alt="avatar" />
            ) : (
              <div>
                {loadingImage ? <LoadingOutlined /> : <PlusOutlined />}
                <div className="ant-upload-text">上传</div>
              </div>
            )}
          </Upload>
        </FormItem>
        <FormItem
          label="开始时间"
          name="openAt"
          rules={[
            {
              required: true,
              message: '请选择开始时间',
            },
          ]}
        >
          <DatePicker
            showTime={{ defaultValue: moment('10:00:00', 'HH:mm:ss') }}
            format="YYYY-MM-DD HH:mm:ss"
          />
        </FormItem>
        <FormItem
          label="价格（元）"
          name="price"
          rules={[
            {
              required: true,
              message: '请输入价格',
            },
          ]}
        >
          <InputNumber style={{ width: '100%' }} />
        </FormItem>
        <FormItem label="优惠券" name="allowCoupon">
          <Switch checkedChildren="可用" unCheckedChildren="禁止" />
        </FormItem>
        <FormItem label="描述" name="description">
          <Input.TextArea />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
