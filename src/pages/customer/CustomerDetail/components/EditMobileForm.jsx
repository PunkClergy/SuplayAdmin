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

const EditMobileForm = props => {
  const [form] = Form.useForm();
  const { customer, modalVisible, onSubmit: handleUpdateMobile, onCancel } = props;

  useEffect(() => {
    if (modalVisible) {
      form.resetFields();
    }
  }, [modalVisible]);

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    const userId = customer.id;
    handleUpdateMobile({ mobile: fieldsValue.newMobile, id: userId });
    form.resetFields();
  };

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      title="修改手机号"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form
        name="editMobileForm"
        form={form}
        {...formLayout}
        initialValues={{ nickname: customer.nickname, mobile: customer.mobile, id: customer.id }}
      >
        <Form.Item label="用户昵称" name="nickname">
          <Input disabled />
        </Form.Item>
        <Form.Item label="原手机号" name="mobile">
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="新手机号"
          name="newMobile"
          rules={[
            {
              required: true,
              message: '请输入新手机号！',
            },
          ]}
        >
          <Input placeholder="请输入新手机号！" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditMobileForm;
