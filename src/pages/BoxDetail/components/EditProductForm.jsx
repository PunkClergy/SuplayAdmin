import React from 'react';
import { Form, InputNumber, Button, Popover } from 'antd';

const FormItem = Form.Item;

const EditProductForm = props => {
  const [form] = Form.useForm();
  const { isMobile, productId, onSubmit: updateBoxProduct } = props;

  const incHandle = async () => {
    const fieldsValue = await form.validateFields();
    form.resetFields();
    updateBoxProduct({ productId, quantity: fieldsValue.quantity });
  };

  const decHandle = async () => {
    const fieldsValue = await form.validateFields();
    form.resetFields();
    updateBoxProduct({ productId, quantity: -fieldsValue.quantity });
  };

  const content = (
    <Form form={form} layout={isMobile ? 'vertical' : 'inline'}>
      <FormItem
        label="数量"
        name="quantity"
        rules={[
          {
            required: true,
            message: '数量必须大于0',
          },
        ]}
      >
        <InputNumber />
      </FormItem>
      <Form.Item>
        <Button key="inc" type="primary" onClick={() => incHandle()}>
          增加
        </Button>
      </Form.Item>
      <Form.Item>
        <Button key="dec" type="primary" onClick={() => decHandle()}>
          减少
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <Popover trigger="click" content={content}>
      {props.children}
    </Popover>
  );
};

export default EditProductForm;
