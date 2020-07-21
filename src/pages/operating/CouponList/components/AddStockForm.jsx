import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Modal, Select, Avatar } from 'antd';
import { fetchUsers } from '../service';

const { Option } = Select;
const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const AddStockForm = props => {
  const [form] = Form.useForm();
  const { product, modalVisible, onSubmit: handleAddStock, onCancel } = props;
  const [userList, setUserList] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    if (modalVisible) {
      form.resetFields();
    }
  }, [modalVisible]);

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    // form.resetFields();
    handleAddStock({
      ...fieldsValue,
      userId: user.id,
    });
    form.resetFields();
  };

  const onUserChange = value => {
    if (value) {
      setUser(JSON.parse(value));
      form.setFieldsValue({
        user: `[${JSON.parse(value).uuid}]${JSON.parse(value).nickname}`,
      });
    } else {
      setUser({});
      form.setFieldsValue({
        user: null,
      });
    }
  };
  const onSearchUser = val => {
    const params = !Number.isNaN(Number(val)) ? { uuid: Number(val) } : {};
    fetchUsers(params).then(res => {
      setUserList(res.list);
    });
  };
  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      title="发送优惠券"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form
        name="addStockForm"
        form={form}
        {...formLayout}
        initialValues={{ couponId: product.id }}
      >
        <Form.Item label="ID" name="couponId">
          <Input disabled />
        </Form.Item>
        <Form.Item label="用户" name="user" rules={[{ required: true, message: '请选择用户!' }]}>
          <Select
            allowClear
            showSearch
            onChange={onUserChange}
            onSearch={onSearchUser}
            optionLabelProp="label"
            style={{ width: '100%' }}
            placeholder="请输入UUID或用户名"
          >
            {userList.map(item => (
              <Option label={item.name} key={item.id} value={JSON.stringify(item)}>
                <Avatar
                  shape="circle"
                  src={item.avatar}
                  size={24}
                  style={{ verticalAlign: 'middle' }}
                />
                <span style={{ marginLeft: 16, verticalAlign: 'middle' }}>{item.nickname}</span>
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="数量"
          name="quantity"
          rules={[
            {
              required: true,
              message: '请输入数量！',
            },
          ]}
        >
          <InputNumber style={{ width: 200 }} placeholder="请输入数量" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddStockForm;
