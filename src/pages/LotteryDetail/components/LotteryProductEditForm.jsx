import React, { useEffect } from 'react';
import { Form, InputNumber, Modal, Input, Alert } from 'antd';

const FormItem = Form.Item;
const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const UpdateForm = props => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleUpdate, onCancel } = props;

  useEffect(() => {
    if (modalVisible) {
      form.setFieldsValue({
        productId: props.product.productId,
        productName: props.product.productName,
        quantity: props.product.quantity,
        price: props.product.price / 100,
      });
    }
  }, [modalVisible]);

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    handleUpdate({
      ...fieldsValue,
      price: Math.floor(fieldsValue.price * 100),
    });
  };

  return (
    <Modal
      maskClosable={false}
      width={800}
      style={{ top: 20 }}
      bodyStyle={{
        padding: '32px 40px 48px',
        overflowY: 'auto',
        height: 'calc(100vh - 200px)',
      }}
      destroyOnClose
      title="编辑商品"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Alert message="编辑后需要重新审核" type="warning" />
      <br />
      <Form {...formLayout} form={form}>
        <FormItem label="商品ID" name="productId">
          <Input disabled />
        </FormItem>
        <FormItem label="商品名称" name="productName">
          <Input />
        </FormItem>
        <FormItem label="商品价钱" name="price">
          <InputNumber />
        </FormItem>
        <FormItem label="商品数量" name="quantity">
          <InputNumber />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default UpdateForm;
