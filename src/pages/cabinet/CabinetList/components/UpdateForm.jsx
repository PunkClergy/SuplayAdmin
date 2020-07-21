import React from 'react';
import { Form, DatePicker, Modal } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const UpdateForm = props => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleUpdate, onCancel } = props;
  // 数据保存
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    const predictAt = fieldsValue.predictAt.unix();
    handleUpdate({
      predictAt,
    });
  };

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      title="修改到货时间"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form form={form}>
        <FormItem
          label="预计到货时间"
          name="predictAt"
          rules={[
            {
              required: true,
              message: '请选择预计到货时间',
            },
          ]}
        >
          <DatePicker
            showTime={{ defaultValue: moment('10:00:00', 'HH:mm:ss') }}
            format="YYYY-MM-DD HH:mm:ss"
          />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default UpdateForm;
