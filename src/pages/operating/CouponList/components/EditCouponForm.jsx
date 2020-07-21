import React, { useEffect, useState } from 'react';
import { Modal, Input, InputNumber, Form, Upload, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { updateCouponDetail } from '../service';
import { imageUploadProps } from '../../../../utils/utils';

const imageList = [
  'http://img.suplaymart.com/img/6fd2b3de407c403eaaf182f141c1cf92?imageView2/2/w/720/interlace/1/q/90',
  'https://img.suplaymart.com/img/50626d0157f24644a4a4c6490586da8c?imageView2/2/w/720/interlace/1/q/90',
];
const imageListKey = [
  'img/6fd2b3de407c403eaaf182f141c1cf92',
  'img/50626d0157f24644a4a4c6490586da8c',
];
const FormItem = Form.Item;
const { Option } = Select;
const EditCouponForm = props => {
  const [form] = Form.useForm();
  const { show, detail, handleCallbak } = props;
  const [image, setImage] = useState(detail.image);
  const [title, setTitle] = useState('添加轮播图');
  const [type, setType] = useState(detail.type);
  const [timeType, setTimeType] = useState(0);

  useEffect(() => {
    if (show) {
      form.resetFields();
      if (detail && detail.id) {
        setTitle('编辑优惠券');
        setType(detail.type);
      } else {
        setTitle('添加优惠券');
        form.setFieldsValue({
          type: 0,
        });
        setType(0);
      }
      setImage(
        detail.image
          ? detail.image
          : 'http://img.suplaymart.com/img/6fd2b3de407c403eaaf182f141c1cf92?imageView2/2/w/720/interlace/1/q/90',
      );
      setTimeType(0);
      form.setFieldsValue({
        limit: detail.limit / 100 || 0,
        deduct: detail.deduct / 100 || 0,
      });
    }
  }, [show]);
  const handleOk = async () => {
    const fieldsValue = await form.validateFields();
    const imageKey = fieldsValue.image ? fieldsValue.image : imageListKey[fieldsValue.type];
    fieldsValue.duration =
      timeType === 0 ? Number(fieldsValue.duration) : Number(fieldsValue.duration) * 24;
    fieldsValue.limit = fieldsValue.limit ? fieldsValue.limit * 100 : 0;
    fieldsValue.deduct = fieldsValue.deduct ? fieldsValue.deduct * 100 : 0;
    fieldsValue.image = imageKey;
    updateCouponDetail(detail.id, fieldsValue).then(() => {
      handleCallbak(true);
    });
  };

  // 上传图片
  const uploadIcon = e => {
    const url = 'http://img.suplaymart.com/';
    if (e.file.response) {
      setImage(`${url}${e.file.response.data.imageKey}`);
      return e.file.response.data.imageKey;
    }
    return null;
  };

  const handleCancel = () => {
    form.resetFields();
    handleCallbak(false);
  };

  const formLayout = {
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 13,
    },
  };

  const handSetType = e => {
    setType(e);
    setImage(imageList[e]);
    return null;
  };

  const handSetTimeType = e => {
    setTimeType(e);
    return null;
  };
  const selectAfter = (
    <Select defaultValue={0} className="select-after" onChange={e => handSetTimeType(e)}>
      <Option value={0}>时</Option>
      <Option value={1}>天</Option>
    </Select>
  );
  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      width={800}
      style={{ top: 40 }}
      bodyStyle={{
        padding: '32px 40px 48px',
        overflowY: 'auto',
        height: 'calc(100vh - 200px)',
      }}
      title={title}
      visible={show}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} {...formLayout} initialValues={{ ...detail }}>
        <Form.Item label="ID" name="id">
          <Input placeholder="" disabled />
        </Form.Item>
        <Form.Item
          label="名称"
          name="name"
          rules={[
            {
              required: true,
              message: '请输入名称',
            },
          ]}
        >
          <Input placeholder="请输入优惠券名称" />
        </Form.Item>
        <FormItem
          label="类型"
          name="type"
          rules={[
            {
              required: true,
              message: '请选择类型',
            },
          ]}
        >
          <Select style={{ width: 120 }} onChange={e => handSetType(e)}>
            <Option value={0}>代金券</Option>
            <Option value={1}>包邮券</Option>
          </Select>
        </FormItem>
        <Form.Item label="图片" name="image" getValueFromEvent={uploadIcon}>
          <Upload name="image" {...imageUploadProps}>
            {image ? (
              <img src={`${image}`} height="100" alt="icon" />
            ) : (
              <div>
                <PlusOutlined />
                <div className="ant-upload-text">上传</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        {type === 0 ? (
          <FormItem
            label="最低金额（元）"
            name="limit"
            rules={[
              {
                required: true,
                message: '请请输入金额要求',
              },
            ]}
          >
            <InputNumber placeholder="请输入金额"></InputNumber>
          </FormItem>
        ) : (
          ''
        )}
        {type === 0 ? (
          <Form.Item
            label="金额减免（元）"
            name="deduct"
            rules={[
              {
                required: true,
                message: '请输入金额减免',
              },
            ]}
          >
            <InputNumber placeholder="请输入金额" />
          </Form.Item>
        ) : (
          ''
        )}
        <FormItem
          label="有效时间"
          name="duration"
          rules={[
            {
              required: true,
              message: '请输入优惠券的有效时间',
            },
          ]}
        >
          {/* <InputNumber placeholder="请输入有效时间"></InputNumber> */}
          <Input addonAfter={selectAfter} defaultValue="" placeholder="请输入有效时间" />
        </FormItem>
        <FormItem label="描述" name="description">
          <Input.TextArea />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default EditCouponForm;
