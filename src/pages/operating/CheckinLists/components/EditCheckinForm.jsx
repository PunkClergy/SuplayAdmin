import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Modal, Upload, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { imageUploadProps } from '../../../../utils/utils';

const { Option } = Select;
const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const EditCheckinForm = props => {
  const [form] = Form.useForm();

  const { checkin, modalVisible, onSubmit: handleUpdate, onCancel } = props;
  const [prizeImage, setPrizeImage] = useState(checkin.imageUrl);
  const [prizeType, setPrizeType] = useState(checkin.prizeType);
  const url = 'http://img.suplaymart.com/';
  useEffect(() => {
    if (modalVisible) {
      setPrizeImage(checkin.prizeImage);
      setPrizeType(checkin.prizeType);
      form.resetFields();
    }
  }, [modalVisible]);

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    form.resetFields();
    handleUpdate({
      ...checkin,
      ...fieldsValue,
    });
  };

  const uploadImage = e => {
    if (e.file.response) {
      setPrizeImage(`${url}${e.file.response.data.imageKey}`);
      return e.file.response.data.imageKey;
    }
    return null;
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
      title="编辑"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form
        name="editProductForm"
        form={form}
        {...formLayout}
        initialValues={{
          ...checkin,
        }}
      >
        <Form.Item label="天数" name="days">
          <InputNumber placeholder="" disabled />
        </Form.Item>
        <Form.Item
          label="图片"
          name="prizeImage"
          getValueFromEvent={uploadImage}
          rules={[{ required: true, message: '请上传商品图片!' }]}
        >
          <Upload name="prizeImage" {...imageUploadProps}>
            {prizeImage ? (
              <img alt="nothing" src={prizeImage} width="150" />
            ) : (
              <div>
                <PlusOutlined />
                <div className="ant-upload-text">上传</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item
          label="类型"
          name="prizeType"
          rules={[{ required: true, message: '请选择类型!' }]}
        >
          <Select style={{ width: 200 }} onChange={e => setPrizeType(e)}>
            <Option value={1}>幸运值</Option>
            <Option value={3}>优惠券</Option>
          </Select>
        </Form.Item>
        {prizeType === 3 ? (
          <Form.Item
            label="优惠券ID"
            name="prizeItemId"
            rules={[{ required: true, message: '请填写数量!' }]}
          >
            <InputNumber />
          </Form.Item>
        ) : (
          <></>
        )}
        <Form.Item
          label="数量"
          name="prizeQuantity"
          rules={[{ required: true, message: '请填写数量!' }]}
        >
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCheckinForm;
