import React from 'react';
import { Form, Modal, InputNumber, Radio } from 'antd';

const FormItem = Form.Item;

const CreateSessionForm = props => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel, confirmLoading } = props;
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    form.resetFields();
    handleAdd({ ...fieldsValue });
  };
  const options = [
    { label: '普通算法', value: 0 },
    { label: '福袋算法', value: 1 },
  ];
  return (
    <Modal
      maskClosable={false}
      confirmLoading={confirmLoading}
      destroyOnClose
      title="创建场次"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form form={form} initialValues={{ number: 1, type: 0 }}>
        <FormItem
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 15,
          }}
          label="场次数量"
          name="number"
          rules={[
            {
              required: true,
              message: '请输入数量',
            },
          ]}
        >
          <InputNumber style={{ width: '100%' }} min={1} placeholder="请输入要创建的数量" />
        </FormItem>
        <FormItem
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 15,
          }}
          label="盲盒算法"
          name="type"
        >
          <Radio.Group options={options} defaultValue={0} />
          <br></br>
          <span style={{ color: 'red', fontSize: 12 }}>创建前请检查盲盒算法</span>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateSessionForm;
