import React from 'react';
import { Form, Modal, InputNumber } from 'antd';

const FormItem = Form.Item;
const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};
const AddProductForm = props => {
  const [form] = Form.useForm();
  const { product, modalVisible, onSubmit: updateShopProduct, onCancel } = props;

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    // form.resetFields();
    updateShopProduct({
      productId: product.productId,
      price: parseInt(fieldsValue.price * 100, 10),
    });
  };
  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      title="修改价格"
      visible={modalVisible}
      onCancel={() => onCancel()}
      onOk={okHandle}
    >
      <Form form={form} {...formLayout}>
        <FormItem
          label="产品价格"
          name="price"
          rules={[
            {
              required: true,
              message: '请输入不小于0的数字',
              pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
            },
          ]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="请输入产品价格" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default AddProductForm;
