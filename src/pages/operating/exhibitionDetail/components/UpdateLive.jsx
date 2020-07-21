import React, { useEffect, useState } from 'react';
import { Form, Input, Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { imageUploadProps } from '../../../../utils/utils';

const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const UpdateLive = props => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(props.box ? props.box.imageUrl : null);
  const { modalVisible, onSubmit: handleUpdate, onCancel } = props;
  const url = 'http://img.suplaymart.com/';
  useEffect(() => {
    if (modalVisible) {
      setImageUrl(props.box.imageUrl);
      form.resetFields();
      form.setFieldsValue({
        ...props.box,
      });
    }
  }, [modalVisible]);

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    const image = fieldsValue.imageUrl;
    handleUpdate({
      ...fieldsValue,
      image,
    });
    form.resetFields();
  };
  const handleImage = e => {
    if (e.file.response) {
      setImageUrl(url + e.file.response.data.imageKey);
      return e.file.response.data.imageKey;
    }
    return null;
  };
  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      title="编辑直播日程"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form name="UpdateLive" form={form} {...formLayout}>
        <Form.Item label="日期" name="date">
          <Input placeholder="请填写日期" disabled />
        </Form.Item>
        <Form.Item
          label="图片"
          name="imageUrl"
          valuePropName="imageUrl"
          getValueFromEvent={handleImage}
          rules={[
            {
              required: true,
              message: '请上传图片',
            },
          ]}
        >
          <Upload {...imageUploadProps}>
            {imageUrl ? (
              <img src={imageUrl} width="150" alt="avatar" />
            ) : (
              <div>
                <PlusOutlined />
                <div className="ant-upload-text">上传</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateLive;
