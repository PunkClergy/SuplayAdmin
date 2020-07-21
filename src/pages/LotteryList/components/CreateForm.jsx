import React, { useState } from 'react';
import { Form, Switch, InputNumber, Modal, Upload, Select, DatePicker, Input, message } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { imageUploadProps, imageUploadCallback, imageLoadingCallback } from '../../../utils/utils';

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
// 默认提交参数值
const initialValues = {
  type: 1,
  price: 0,
  allowShare: false,
  isPublic: false,
  allowRedeem: false,
  allowHelp: false,
};
const UpdateForm = props => {
  const [form] = Form.useForm();
  const [type, setType] = useState(1);
  const [coverUrl, setCoverUrl] = useState(undefined);
  const [loadingCover, setLoadingCover] = useState(false);
  const { modalVisible, onSubmit: handleUpdate, onCancel } = props;

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    const endAt = fieldsValue.type === 1 ? fieldsValue.endAt.unix() : null;
    const openAt = fieldsValue.openAt ? fieldsValue.openAt.unix() : null;
    const wechat =
      fieldsValue.wechatDescrption || fieldsValue.wechatId
        ? {
            descrption: fieldsValue.wechatDescrption,
            id: fieldsValue.wechatId,
          }
        : null;
    handleUpdate({
      ...fieldsValue,
      price: Math.floor(fieldsValue.price * 100),
      endAt,
      openAt,
      wechat,
    });
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
      title="创建抽选"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      {/* <Alert message="编辑后需要重新审核" type="warning" /> */}
      <br />
      <Form {...formLayout} form={form} initialValues={initialValues}>
        <FormItem
          label="封面"
          name="cover"
          valuePropName="cover"
          getValueFromEvent={e => imageUploadCallback(e, setCoverUrl)}
          rules={[
            {
              required: true,
              message: '请上传封面图片',
            },
          ]}
        >
          <Upload
            name="cover"
            {...imageUploadProps}
            onChange={e => imageLoadingCallback(e, setLoadingCover, message)}
          >
            {coverUrl ? (
              <img src={coverUrl} width="150" alt="avatar" />
            ) : (
              <div>
                {loadingCover ? <LoadingOutlined /> : <PlusOutlined />}
                <div className="ant-upload-text">上传</div>
              </div>
            )}
          </Upload>
        </FormItem>
        <FormItem
          label="保证金金额"
          name="price"
          rules={[
            {
              required: true,
              message: '请输入保证金金额，0为无保证金',
            },
          ]}
          extra="0元不需要支付保证金"
        >
          <InputNumber />
        </FormItem>
        <FormItem
          label="抽选说明"
          name="description"
          rules={[
            {
              required: true,
              message: '抽选说明必填',
            },
          ]}
        >
          <Input.TextArea />
        </FormItem>
        <FormItem
          label="开奖方式"
          name="type"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select style={{ width: 120 }} onChange={e => setType(e)}>
            <Option value={1}>按时间开奖</Option>
            <Option value={2}>按人数开奖</Option>
          </Select>
        </FormItem>
        {type === 1 ? (
          <FormItem
            label="开奖时间"
            name="endAt"
            rules={[
              {
                required: true,
                message: '请输入开奖时间',
              },
            ]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </FormItem>
        ) : (
          <FormItem
            label="开奖人数"
            name="maxNum"
            rules={[
              {
                required: true,
                message: '请输入开奖人数',
              },
            ]}
          >
            <InputNumber />
          </FormItem>
        )}
        <FormItem label="抽选开始时间" name="openAt" extra="选填, 开启预约功能">
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </FormItem>
        <FormItem label="微信号" name="wechatId">
          <Input />
        </FormItem>
        <FormItem label="微信描述" name="wechatDescrption">
          <Input.TextArea />
        </FormItem>
        <FormItem label="允许分享" name="allowShare">
          <Switch checkedChildren="允许" unCheckedChildren="禁止" />
        </FormItem>
        <FormItem label="首页可见" name="isPublic">
          <Switch checkedChildren="显示" unCheckedChildren="隐藏" />
        </FormItem>
        <FormItem label="兑换签号" name="allowRedeem">
          <Switch checkedChildren="允许" unCheckedChildren="禁止" />
        </FormItem>
        <FormItem label="好友助力" name="allowHelp">
          <Switch checkedChildren="允许" unCheckedChildren="禁止" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default UpdateForm;
