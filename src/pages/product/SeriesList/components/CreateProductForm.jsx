import React, { useState } from 'react';
import { Modal, Input, InputNumber, Form, Upload, Select } from 'antd';
import { imageUploadProps, imageUploadCallback } from '../../../../utils/utils';

const { Option } = Select;

const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const CreateProductForm = props => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleCreate, onCancel } = props;
  const [imageUrl, setImageUrl] = useState(null);
  const [cardImageUrl, setCardImageUrl] = useState(null);

  const handleOk = async () => {
    const fieldsValue = form.getFieldsValue();
    form.resetFields();
    handleCreate(fieldsValue);
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
      title="创建商品"
      visible={modalVisible}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form
        name="createProductForm"
        form={form}
        {...formLayout}
        initialValues={{ rare: 0, quantity: 0, total: 0 }}
      >
        <Form.Item
          label="商品名称"
          name="name"
          rules={[{ required: true, message: '请输入商品名称!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="属性" name="rare" rules={[{ required: true, message: '请选择属性!' }]}>
          <Select style={{ width: 200 }}>
            <Option value={0}>普通</Option>
            <Option value={1}>稀有</Option>
            <Option value={2}>隐藏</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="图片"
          name="image"
          getValueFromEvent={e => imageUploadCallback(e, setImageUrl)}
          rules={[{ required: true, message: '请上传商品图片!' }]}
        >
          <Upload name="image" {...imageUploadProps}>
            {imageUrl ? <img alt="nothing" src={imageUrl} width="150" /> : <p>上传图片</p>}
          </Upload>
        </Form.Item>
        <Form.Item
          label="卡片"
          name="cardImage"
          getValueFromEvent={e => imageUploadCallback(e, setCardImageUrl)}
        >
          <Upload name="cardImage" {...imageUploadProps}>
            {cardImageUrl ? <img alt="nothing" src={cardImageUrl} width="150" /> : <p>上传卡片</p>}
          </Upload>
        </Form.Item>
        <Form.Item label="库存" name="quantity">
          <InputNumber />
        </Form.Item>
        <Form.Item label="剩余库存" name="total">
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProductForm;
