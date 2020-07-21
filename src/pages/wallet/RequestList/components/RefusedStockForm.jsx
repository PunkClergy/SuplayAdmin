import React, { useEffect } from 'react';
import { Form, Input, Modal } from 'antd';

const FormItem = Form.Item;
const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const RefusedStockForm = props => {
  const [form] = Form.useForm();
  const { product, modalVisible, onSubmit: handleAddStock, onCancel } = props;

  useEffect(() => {
    if (modalVisible) {
      form.setFieldsValue({
        ...props.product,
        id: product.id,
      });
    }
  }, [modalVisible]);

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    handleAddStock({ ...fieldsValue, status: -1, images: [] });
  };

  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      title="拒绝"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form name="name" form={form} {...formLayout}>
        <Form.Item label="ID" name="id">
          <Input disabled />
        </Form.Item>
        <FormItem
          label="备注"
          name="reason"
          rules={[
            {
              required: true,
              message: '请输入备注',
            },
          ]}
        >
          <Input.TextArea />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default RefusedStockForm;
