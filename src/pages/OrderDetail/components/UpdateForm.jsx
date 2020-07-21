import React, { useEffect } from 'react';
import { Form, Input, Modal, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const UpdateForm = props => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleUpdate, onCancel } = props;

  useEffect(() => {
    if (modalVisible) {
      form.setFieldsValue({
        ...props.order,
        nickname: props.order.buyer.nickname,
      });
    }
  }, [modalVisible]);

  // 数据保存
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    handleUpdate({ ...fieldsValue });
  };

  return (
    <Modal
      maskClosable={false}
      width={800}
      style={{ top: 20 }}
      bodyStyle={{
        padding: '32px 40px 48px',
        overflowY: 'auto',
        height: 'calc(100vh - 200px)',
      }}
      destroyOnClose
      title="编辑订单"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form {...formLayout} form={form}>
        <FormItem label="订单ID" name="id">
          <Input disabled />
        </FormItem>
        <FormItem
          label="买家昵称"
          name="nickname"
          rules={[
            {
              required: true,
              message: '请填写买家昵称',
            },
          ]}
        >
          <Input disabled />
        </FormItem>
        <FormItem
          label="订单状态"
          name="status"
          rules={[
            {
              required: true,
              message: '请选择订单状态',
            },
          ]}
        >
          <Select style={{ width: 160 }} disabled>
            <Option value={0}>需要确认/支付</Option>
            <Option value={1}>等待发货</Option>
            <Option value={2}>已发货</Option>
            <Option value={3}>已完成</Option>
            <Option value={-1}>订单关闭/取消</Option>
            <Option value={-2}>订单过期</Option>
          </Select>
        </FormItem>
        <FormItem label="物流公司" name="expressId">
          <Select style={{ width: 160 }}>
            <Option value="SF">顺丰</Option>
            <Option value="YTO">圆通快递</Option>
            <Option value="ZTO">中通快递</Option>
            <Option value="YD">韵达快递</Option>
            <Option value="HTKY">百世快递</Option>
            <Option value="EMS">EMS</Option>
            <Option value="HHTT">天天快递</Option>
            <Option value="JD">京东快递</Option>
            <Option value="UC">优速快递</Option>
            <Option value="YZPY">邮政快递包裹</Option>
            <Option value="UNKNOWN">未知快递</Option>
          </Select>
        </FormItem>
        <FormItem label="快递单号" name="expressNo">
          <Input />
        </FormItem>
        <FormItem
          label="姓名"
          name="name"
          rules={[
            {
              required: true,
              message: '请填写收件人姓名',
            },
          ]}
        >
          <Input />
        </FormItem>
        <FormItem
          label="联系方式"
          name="phone"
          rules={[
            {
              required: true,
              message: '请填写联系方式',
            },
          ]}
        >
          <Input />
        </FormItem>
        <FormItem
          label="地址"
          name="address"
          rules={[
            {
              required: true,
              message: '请填写收货地址',
            },
          ]}
        >
          <Input />
        </FormItem>
        <FormItem label="备注" name="remark">
          <Input.TextArea />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default UpdateForm;
