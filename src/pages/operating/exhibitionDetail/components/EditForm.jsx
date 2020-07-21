import React, { useEffect } from 'react';
import { Form, Input, Modal } from 'antd';

const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const EditForm = props => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleUpdateTitle, onCancel } = props;

  useEffect(() => {
    if (modalVisible) {
      form.resetFields();
      form.setFieldsValue({
        ...props.box,
      });
    }
  }, [modalVisible]);

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    console.log(fieldsValue);
    handleUpdateTitle({ title: fieldsValue.newtitle, key: props.box.key });
    form.resetFields();
  };

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      title="修改标题"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form name="editMobileForm" form={form} {...formLayout}>
        <Form.Item label="原标题" name="title">
          <Input disabled />
        </Form.Item>
        <Form.Item label="新标题" name="newtitle">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditForm;
