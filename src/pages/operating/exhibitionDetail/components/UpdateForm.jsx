import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, Upload, DatePicker, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { imageUploadProps } from '../../../../utils/utils';

const FormItem = Form.Item;

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
  const url = 'http://img.suplaymart.com/';

  useEffect(() => {
    if (modalVisible) {
      setBox(props.box);
      form.setFieldsValue({
        ...props.box,
        startAt: props.box.startAt ? moment(props.box.startAt) : null,
        endAt: props.box.endAt ? moment(props.box.endAt) : null,
      });
    }
  }, [modalVisible]);
  // 数据保存
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    const startAt = fieldsValue.startAt.unix();
    const endAt = fieldsValue.endAt.unix();

    handleUpdate({
      ...fieldsValue,
      endAt,
      startAt,
    });
  };
  const handleHeadImage = e => {
    if (e.file.response) {
      setBox(prevState => ({
        ...prevState,
        titleBgImage: e.file.response.data.imageKey,
      }));
      return e.file.response.data.imageKey;
    }
    return null;
  };
  const handleImage = e => {
    if (e.file.response) {
      setBox(prevState => ({
        ...prevState,
        cover: e.file.response.data.imageKey,
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
      title="编辑会场"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form {...formLayout} form={form}>
        <Form.Item label="ID" name="id">
          <Input disabled placeholder="请输入ID" />
        </Form.Item>
        <Form.Item
          label="展会名称"
          name="name"
          rules={[
            {
              required: true,
              message: '请输入展会名称',
            },
          ]}
        >
          <Input placeholder="请输入展会名称" />
        </Form.Item>
        <FormItem
          label="展会开始时间"
          name="startAt"
          rules={[
            {
              required: true,
              message: '请选择开始时间',
            },
          ]}
        >
          <DatePicker showTime format="YYYY-MM-DD" />
        </FormItem>
        <FormItem
          label="展会结束时间"
          name="endAt"
          rules={[
            {
              required: true,
              message: '请选择结束时间',
            },
          ]}
        >
          <DatePicker showTime format="YYYY-MM-DD" />
        </FormItem>
        <FormItem label="封面图" name="cover" valuePropName="cover" getValueFromEvent={handleImage}>
          <Upload {...imageUploadProps}>
            {box.cover ? (
              <img src={`${url}${box.cover}`} width="150" alt="avatar" />
            ) : (
              <div>
                <PlusOutlined />
                <div className="ant-upload-text">上传</div>
              </div>
            )}
          </Upload>
        </FormItem>
        <FormItem
          label="标题图"
          name="titleBgImage"
          valuePropName="titleBgImage"
          getValueFromEvent={handleHeadImage}
        >
          <Upload {...imageUploadProps}>
            {box.titleBgImage ? (
              <img src={`${url}${box.titleBgImage}`} width="150" alt="avatar" />
            ) : (
              <div>
                <PlusOutlined />
                <div className="ant-upload-text">上传</div>
              </div>
            )}
          </Upload>
        </FormItem>
        <Form.Item label="展会指南链接" name="linkUrl">
          <Input placeholder="请输入展会指南链接" />
        </Form.Item>
        <FormItem label="是否显示" name="display">
          <Switch checkedChildren="显示" unCheckedChildren="隐藏" defaultChecked={box.display} />
        </FormItem>
        <Form.Item label="请输入背景颜色" name="bgColor">
          <Input placeholder="请输入背景颜色" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateForm;
