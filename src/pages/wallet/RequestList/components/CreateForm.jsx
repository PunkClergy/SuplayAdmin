import React, { useState } from 'react';
import { Form, Input, Modal, Upload, Select, Avatar, Button, InputNumber } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { fetchUsers } from '../service';

const { Option } = Select;
const FormItem = Form.Item;
const uploadFileProps = {
  action: '/api/uploadFile',
  multiple: false,
  listType: 'picture-card',
  className: 'avatar-uploader',
  showUploadList: false,
  headers: { 'X-Auth-Token': localStorage.getItem('accessToken') },
};
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
  const { modalVisible, onSubmit: handleCreate, onCancel } = props;
  const [userList, setUserList] = useState([]);
  const [images, setImages] = useState([]);
  const [user, setUser] = useState({});

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();

    // form.resetFields();
    handleCreate({
      ...fieldsValue,
      userId: user.id,
      images: images.map(image => (image.response ? image.response.data.fileKey : null)),
      amount: fieldsValue.amount * 100,
    });
    setImages(null);
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

  const handleImagesChange = ({ fileList }) =>
    fileList.map(img => (img.response ? img.response.data.fileKey : null));

  const onUploadImage = ({ fileList }) => {
    const list = fileList.map(image => {
      if (image.status === 'done' && image.response) {
        // eslint-disable-next-line no-param-reassign
        image.thumbUrl = image.response.data.imageUrl;
        // eslint-disable-next-line no-param-reassign
        image.key = image.response.data.imageKey;
        // eslint-disable-next-line no-param-reassign
        image.url = image.response.data.imageUrl;
      }
      return image;
    });
    setImages(list);
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
      title="提现录入"
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
        <FormItem
          label="支付宝账号"
          name="account"
          rules={[{ required: true, message: '请输入支付宝账户!' }]}
        >
          <Input placeholder="请输入支付宝账号" />
        </FormItem>
        <FormItem
          label="收款人姓名"
          name="name"
          rules={[{ required: true, message: '收款人姓名!' }]}
        >
          <Input placeholder="请输入收款人姓名" />
        </FormItem>
        <FormItem
          label="提现金额（元）"
          name="amount"
          rules={[{ required: true, message: '请输入提现金额!' }]}
        >
          <InputNumber formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
        </FormItem>
        <Form.Item
          label="打款凭证"
          name="images"
          valuePropName="images"
          getValueFromEvent={handleImagesChange}
          rules={[{ required: true, message: '请上传打款凭证!' }]}
        >
          <Upload
            {...uploadFileProps}
            fileList={images}
            listType="picture"
            onChange={onUploadImage}
            showUploadList
          >
            <Button>
              <UploadOutlined /> 上传
            </Button>
          </Upload>
        </Form.Item>
        <FormItem label="备注" name="reason">
          <Input.TextArea />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
