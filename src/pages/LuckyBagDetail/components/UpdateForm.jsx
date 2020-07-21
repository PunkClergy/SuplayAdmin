import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Upload, Select, DatePicker, Switch } from 'antd';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
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
  const [box, setBox] = useState(props.box);
  const { modalVisible, onSubmit: handleUpdate, onCancel } = props;

  useEffect(() => {
    if (modalVisible) {
      setBox(props.box);

      form.setFieldsValue({
        ...props.box,
        price: props.box.price / 100,
        openAt: moment(props.box.openAt),
      });
    }
  }, [modalVisible]);

  // 数据保存
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    const openAt = fieldsValue.openAt.unix();
    handleUpdate({
      id: box.id,
      ...fieldsValue,
      price: Math.floor(fieldsValue.price * 100),
      openAt,
    });
  };
  // 上传封面
  const handleCover = e => {
    if (e.file.response) {
      setBox(prevState => ({
        ...prevState,
        cover: e.file.response.data.imageKey,
        coverUrl: e.file.response.data.imageUrl,
      }));
      return e.file.response.data.imageKey;
    }
    return null;
  };

  // 上传图片
  const handleImage = e => {
    if (e.file.response) {
      setBox(prevState => ({
        ...prevState,
        image: e.file.response.data.imageKey,
        imageUrl: e.file.response.data.imageUrl,
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
      title="编辑福袋"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form {...formLayout} form={form}>
        <FormItem
          label="名称"
          name="name"
          rules={[
            {
              required: true,
              message: '请输入盲盒名称',
            },
          ]}
        >
          <Input placeholder="请输入盲盒名称" />
        </FormItem>

        <FormItem label="状态" name="status">
          <Select style={{ width: 120 }}>
            <Option value={1}>上架</Option>
            <Option value={0}>下架</Option>
          </Select>
        </FormItem>
        <FormItem label="价格（元）" name="price">
          <InputNumber style={{ width: '100%' }} formatter={value => `￥ ${value}`} />
        </FormItem>
        <FormItem label="排序权重" name="sort">
          <InputNumber style={{ width: '100%' }} />
        </FormItem>
        <FormItem
          label="开始时间"
          name="openAt"
          rules={[
            {
              required: true,
              message: '请选择开售时间',
            },
          ]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </FormItem>
        <FormItem label="封面" name="cover" valuePropName="cover" getValueFromEvent={handleCover}>
          <Upload {...imageUploadProps}>
            {box.coverUrl ? (
              <img src={box.coverUrl} width="150" alt="avatar" />
            ) : (
              <div>
                <PlusOutlined />
                <div className="ant-upload-text">上传</div>
              </div>
            )}
          </Upload>
        </FormItem>
        <FormItem label="图片" name="image" valuePropName="image" getValueFromEvent={handleImage}>
          <Upload {...imageUploadProps}>
            {box.imageUrl ? (
              <img src={box.imageUrl} width="150" alt="avatar" />
            ) : (
              <div>
                <PlusOutlined />
                <div className="ant-upload-text">上传</div>
              </div>
            )}
          </Upload>
        </FormItem>
        <FormItem label="优惠券" name="allowCoupon">
          <Switch
            checkedChildren="可用"
            unCheckedChildren="禁用"
            defaultChecked={box.allowCoupon}
          />
        </FormItem>
        <FormItem label="描述" name="description">
          <Input.TextArea />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default UpdateForm;
