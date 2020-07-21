import React, { useEffect, useState } from 'react';
import { Modal, Input, InputNumber, Form, Upload, Select, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { updateBannerDetail } from '../service';
import { imageUploadProps } from '../../../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const EditBannerForm = props => {
  const [form] = Form.useForm();
  const { show, detail, handleCallbak } = props;
  const [image, setImage] = useState(detail.iconUrl);

  const [display, setDispaly] = useState(detail.iconUrl);
  const [title, setTitle] = useState('添加轮播图');
  const url = 'http://img.suplaymart.com/';

  useEffect(() => {
    if (show) {
      if (detail && detail.id) {
        setTitle('编辑轮播图');
      } else {
        setTitle('添加轮播图');
      }
      setImage(detail.image);
      setDispaly(detail.display);
      form.resetFields();
    }
  }, [show]);

  const handleOk = async () => {
    const fieldsValue = await form.validateFields();
    // form.resetFields();
    // 执行编辑
    updateBannerDetail(detail.id, fieldsValue).then(() => {
      handleCallbak(true);
    });
  };

  // 上传图片
  const uploadIcon = e => {
    if (e.file.response) {
      setImage(e.file.response.data.imageKey);
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
          <Select style={{ width: 120 }}>
            <Option value={1}>Banner</Option>
            <Option value={2}>运营位</Option>
          </Select>
        </FormItem>
        <Form.Item
          label="图片"
          name="image"
          getValueFromEvent={uploadIcon}
          rules={[
            {
              required: true,
              message: '请上传图片',
            },
          ]}
        >
          <Upload name="image" {...imageUploadProps}>
            {image ? (
              <img src={`${url}${image}`} height="100" alt="icon" />
            ) : (
              <div>
                <PlusOutlined />
                <div className="ant-upload-text">上传</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <FormItem
          label="目标类型"
          name="targetType"
          rules={[
            {
              required: true,
              message: '请选择目标类型',
            },
          ]}
        >
          <Select style={{ width: 120 }}>
            <Option value={1}>抽选</Option>
            <Option value={2}>盲盒</Option>
            <Option value={3}>链接</Option>
            <Option value={5}>直购</Option>
            <Option value={6}>福袋</Option>
          </Select>
        </FormItem>
        <Form.Item
          label="目标ID"
          name="targetId"
          rules={[
            {
              required: true,
              message: '请填写目标ID或链接',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <FormItem label="是否显示" name="display" onChange={e => setDispaly(e)}>
          <Switch checkedChildren="显示" unCheckedChildren="隐藏" defaultChecked={display} />
        </FormItem>
        <Form.Item label="权重" name="sort">
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditBannerForm;
