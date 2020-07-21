import React, { useEffect, useState } from 'react';
import { Form, Input, Upload, Modal, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};
// 初始化多图数组
const fileList = [];
const imageUploadProps = {
  action: '/api/upload',
  headers: { 'X-Auth-Token': localStorage.getItem('accessToken') },
  listType: 'picture',
  defaultFileList: [...fileList],
};
const AgreedStockForm = props => {
  const [form] = Form.useForm();
  const [images, setImage] = useState(undefined);

  const { product, modalVisible, onSubmit: handleAddStock, onCancel } = props;
  useEffect(() => {
    if (modalVisible) {
      form.setFieldsValue({
        ...props.product,
        id: product.id,
      });
      setImage(images);
    }
  }, [modalVisible]);

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    handleAddStock({ ...fieldsValue, status: 1 });
  };
  const uploadImage = e => {
    fileList.splice(0, fileList.length);
    e.fileList.map(index => {
      if (index.response) {
        fileList.push(index.response.data.imageKey);
      }
      return fileList;
    });
    return fileList;
  };
  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      title="通过"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form name="name" form={form} {...formLayout}>
        <Form.Item label="ID" name="id">
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="打款凭证"
          name="images"
          getValueFromEvent={uploadImage}
          rules={[{ required: true, message: '请上传打款凭证!' }]}
        >
          <Upload name="images" {...imageUploadProps}>
            <Button>
              <UploadOutlined /> 上传
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item label="备注" name="reason">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AgreedStockForm;
