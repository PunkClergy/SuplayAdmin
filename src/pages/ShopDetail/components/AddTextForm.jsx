import React from 'react';
import { Form, Modal, Input } from 'antd';

const FormItem = Form.Item;

const AddTextForm = props => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel } = props;

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    // form.resetFields();
    handleAdd(fieldsValue);
  };

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      title="添加文字描述"
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
          label="文字描述"
          name="text"
        >
          <Input.TextArea />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default AddTextForm;
