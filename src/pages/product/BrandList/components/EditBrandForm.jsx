import React, { useEffect, useState } from 'react';
import { Modal, Input, InputNumber, Form, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { updateBrand } from '../service';
import { imageUploadProps, imageUploadCallback } from '../../../../utils/utils';

const EditBrandForm = props => {
  const [form] = Form.useForm();
  const { show, detail, handleCallbak } = props;
  const [iconUrl, setIconUrl] = useState(detail.iconUrl);
  const [imageUrl, setImageUrl] = useState(detail.imageUrl);
  const [title, setTitle] = useState('添加品牌');

  useEffect(() => {
    if (show) {
      if (detail && detail.id) {
        setTitle('编辑品牌');
      } else {
        setTitle('添加品牌');
      }
      setImageUrl(detail.imageUrl);
      setIconUrl(detail.iconUrl);
      form.resetFields();
    }
  }, [show]);

  const handleOk = async () => {
    const data = form.getFieldsValue();
    form.resetFields();
    // 执行编辑
    updateBrand(detail.id, data).then(() => {
      handleCallbak(true);
    });
  };

  const handleCancel = () => {
    form.resetFields();
    handleCallbak(false);
  };

  const formLayout = {
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 13,
    },
  };

  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      width={800}
      style={{ top: 40 }}
      bodyStyle={{
        padding: '32px 40px 48px',
        overflowY: 'auto',
        height: 'calc(100vh - 200px)',
      }}
      title={title}
      visible={show}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form {...formLayout} form={form} initialValues={{ ...detail }}>
        <Form.Item label="ID" name="id">
          <Input placeholder="" disabled />
        </Form.Item>
        <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入品牌名称' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="图标"
          name="icon"
          getValueFromEvent={e => imageUploadCallback(e, setIconUrl)}
        >
          <Upload name="icon" {...imageUploadProps}>
            {iconUrl ? (
              <img src={iconUrl} width="150" alt="icon" />
            ) : (
              <div>
                <PlusOutlined />
                <div className="ant-upload-text">上传</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item
          label="LOGO"
          name="image"
          getValueFromEvent={e => imageUploadCallback(e, setImageUrl)}
          rules={[{ required: true, message: '请上传LOGO图片' }]}
        >
          <Upload name="image" {...imageUploadProps}>
            {imageUrl ? (
              <img src={imageUrl} width="150" alt="nothing" />
            ) : (
              <div>
                <PlusOutlined />
                <div className="ant-upload-text">上传</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item label="厂家" name="company">
          <Input />
        </Form.Item>
        <Form.Item label="地区" name="area">
          <Input />
        </Form.Item>
        <Form.Item label="权重" name="sort">
          <InputNumber />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditBrandForm;
