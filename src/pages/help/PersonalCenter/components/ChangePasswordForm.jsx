import React from 'react';
import { Form, Input, Modal, message } from 'antd';

const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};
const contrast = (odlPassword, newPassword, handleChangePasswordForm) => {
  const password =
    odlPassword === newPassword
      ? handleChangePasswordForm({ password: odlPassword })
      : message.error('两次输入不一致，请重试');
  return password;
};
const ChangePasswordForm = props => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleChangePasswordForm, onCancel } = props;
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    contrast(fieldsValue.odlPassword, fieldsValue.newPassword, handleChangePasswordForm);
    form.resetFields();
  };

  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      title="修改密码"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form name="addStockForm" form={form} {...formLayout}>
        <Form.Item
          label="新密码"
          name="odlPassword"
          rules={[
            {
              required: true,
              min: 6,
              message: '请输入新密码！',
            },
          ]}
        >
          <Input style={{ width: 200 }} placeholder="请输入新密码！" type="password" />
        </Form.Item>
        <Form.Item
          label="确认密码"
          name="newPassword"
          rules={[
            {
              required: true,
              min: 6,
              message: '请再次输入新密码！',
            },
          ]}
        >
          <Input style={{ width: 200 }} placeholder="请再次输入新密码！" type="password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordForm;
