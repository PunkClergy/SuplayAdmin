import React from 'react';
import { Form, Modal, InputNumber } from 'antd';

const FormItem = Form.Item;

const AddProductForm = props => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel } = props;
  // 数据保存
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    form.resetFields();
    handleAdd({ ...fieldsValue, price: fieldsValue.price * 100 });
  };
  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      title="添加产品"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form form={form}>
        <FormItem
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 15,
          }}
          label="产品ID"
          name="productId"
        >
          <InputNumber style={{ width: '100%' }} placeholder="请输入产品ID" />
        </FormItem>
        <FormItem
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 15,
          }}
          label="产品价钱"
          name="price"
        >
          <InputNumber style={{ width: '100%' }} placeholder="请输入价钱" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default AddProductForm;
