import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Modal } from 'antd';

const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const AddStockForm = props => {
  const [form] = Form.useForm();
  const { product, modalVisible, onSubmit: handleAddStock, onCancel } = props;

  useEffect(() => {
    if (modalVisible) {
      form.resetFields();
    }
  }, [modalVisible]);

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    handleAddStock(fieldsValue);
    form.resetFields();
  };

  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      title="设置虚拟库存"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form
        name="addStockForm"
        form={form}
        {...formLayout}
        initialValues={{ id: product.id, name: product.name, quantity: product.quantity }}
      >
        <Form.Item label="ID" name="id">
          <Input disabled />
        </Form.Item>
        <Form.Item label="商品名称" name="name">
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="数量"
          name="quantity"
          rules={[
            {
              required: true,
              message: '请输入数量！',
            },
          ]}
        >
          <InputNumber style={{ width: 200 }} placeholder="请输入数量" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddStockForm;
