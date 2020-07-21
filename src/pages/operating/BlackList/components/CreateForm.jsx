import React, { useState } from 'react';
import { Form, Input, Modal, Select, Avatar } from 'antd';
import { fetchUsers } from '../service';

const { Option } = Select;
const FormItem = Form.Item;

// 栅格
const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const CreateForm = props => {
  const [form] = Form.useForm();
  const [userList, setUserList] = useState([]);
  const [user, setUser] = useState({});

  const { modalVisible, onSubmit: handleAdd, onCancel } = props;
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    form.resetFields();
    handleAdd({ ...fieldsValue, userId: user });
  };

  const onUserChange = value => {
    console.log(value);
    if (value) {
      setUser(JSON.parse(value).id);
      form.setFieldsValue({
        user: `[${JSON.parse(value).id}]${JSON.parse(value).nickname}`,
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
      width={800}
      style={{ top: 20 }}
      bodyStyle={{
        padding: '32px 40px 48px',
        overflowY: 'auto',
        height: 'calc(100vh - 200px)',
      }}
      maskClosable={false}
      destroyOnClose
      title="添加黑名单"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form form={form} {...formLayout}>
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
        <FormItem label="备注" name="remark" rules={[{ required: true, message: '请填写备注!' }]}>
          <Input.TextArea />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
