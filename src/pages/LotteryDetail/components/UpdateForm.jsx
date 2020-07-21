import React, { useState, useEffect } from 'react';
import { Form, Switch, InputNumber, Modal, Upload, Select, DatePicker, Input, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { imageUploadProps } from '../../../utils/utils';

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
  const [lottery, setLottery] = useState(props.lottery);
  const [type, setType] = useState(props.lottery.type);
  const { modalVisible, onSubmit: handleUpdate, onCancel } = props;

  useEffect(() => {
    if (modalVisible) {
      setLottery(props.lottery);
      setType(props.lottery.type);
      form.setFieldsValue({
        ...props.lottery,
        price: props.lottery.price / 100,
        openAt: props.lottery.openAt ? moment(props.lottery.openAt) : null,
        endAt: props.lottery.endAt ? moment(props.lottery.endAt) : null,
        wechatDescrption: props.lottery.wechat ? props.lottery.wechat.descrption : null,
        wechatId: props.lottery.wechat ? props.lottery.wechat.id : null,
      });
    }
  }, [modalVisible]);

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
      ...lottery,
      ...fieldsValue,
      price: fieldsValue.price * 100,
      endAt,
      openAt,
      wechat,
    });
  };

  const handleCover = e => {
    if (e.file.response) {
      setLottery(prevState => ({
        ...prevState,
        cover: e.file.response.data.imageKey,
        coverUrl: e.file.response.data.imageUrl,
      }));
      return e.file.response.data.imageKey;
    }
    return null;
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
      title="编辑抽选"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Alert message="编辑后需要重新审核" type="warning" />
      <br />
      <Form {...formLayout} form={form}>
        <FormItem
          label="封面图片"
          name="cover"
          valuePropName="cover"
          getValueFromEvent={handleCover}
        >
          <Upload {...imageUploadProps}>
            {lottery.coverUrl ? (
              <img src={lottery.coverUrl} width="150" alt="avatar" />
            ) : (
              <div>
                <PlusOutlined />
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
          <Switch
            checkedChildren="允许"
            unCheckedChildren="禁止"
            defaultChecked={lottery.allowShare}
          />
        </FormItem>
        <FormItem label="首页可见" name="isPublic">
          <Switch
            checkedChildren="显示"
            unCheckedChildren="隐藏"
            defaultChecked={lottery.isPublic}
          />
        </FormItem>
        <FormItem label="兑换签号" name="allowRedeem">
          <Switch
            checkedChildren="允许"
            unCheckedChildren="禁止"
            defaultChecked={lottery.allowRedeem}
          />
        </FormItem>
        <FormItem label="好友助力" name="allowHelp">
          <Switch
            checkedChildren="允许"
            unCheckedChildren="禁止"
            defaultChecked={lottery.allowHelp}
          />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default UpdateForm;
