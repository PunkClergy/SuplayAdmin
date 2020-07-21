import React, { useEffect, useState } from 'react';
import { Modal, Input, InputNumber, Form, Upload, DatePicker, Select, Avatar } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { fetchBrands } from '../service';
import { imageUploadProps, imageUploadCallback } from '../../../../utils/utils';

const { Option } = Select;

const EditSeriesForm = props => {
  const [form] = Form.useForm();
  const { modalVisible, detail, onSubmit: handleEdit, onCancel } = props;
  const [iconUrl, setIconUrl] = useState(detail.iconUrl);
  const [imageUrl, setImageUrl] = useState(detail.imageUrl);
  const [brandList, setBrandList] = useState([]);
  const [status, setStatus] = useState(detail.status);
  const [brand, setBrand] = useState({});
  const initialValues = detail.id ? { ...detail } : { sort: 0, status: 0 };
  if (detail.predictAt) {
    initialValues.predictAt = moment(detail.predictAt);
  }
  if (detail.saleAt) {
    initialValues.saleAt = moment(detail.saleAt * 1000);
  }
  if (detail.brand) {
    initialValues.brand = detail.brand.name;
  }

  useEffect(() => {
    if (modalVisible) {
      setImageUrl(detail.imageUrl);
      setIconUrl(detail.iconUrl);
      setStatus(detail.status);
      if (detail.brand) {
        setBrand(detail.brand);
      }
      form.resetFields();
    }
  }, [modalVisible]);

  const handleOk = async () => {
    const fieldsValue = await form.validateFields();
    form.resetFields();
    const saleAt = fieldsValue.saleAt ? fieldsValue.saleAt.unix() : null;
    const predictAt = fieldsValue.predictAt ? fieldsValue.predictAt.unix() : null;
    // 执行编辑保存
    handleEdit({
      ...fieldsValue,
      saleAt,
      predictAt,
      brandId: brand.id,
    });
  };

  const onBrandChange = value => {
    setBrand(JSON.parse(value));
  };

  // 品牌搜索
  function onSearch(val) {
    fetchBrands({ name: val }).then(res => {
      setBrandList(res.list);
    });
  }

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
      title={detail.id ? '编辑系列' : '添加系列'}
      visible={modalVisible}
      onOk={handleOk}
      onCancel={() => onCancel()}
    >
      <Form name="editSeriesForm" form={form} {...formLayout} initialValues={initialValues}>
        <Form.Item label="ID" name="id">
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="系列名称"
          name="name"
          rules={[{ required: true, message: '输入系列名称!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="品牌" name="brand" rules={[{ required: true, message: '请选择品牌!' }]}>
          <Select
            showSearch
            style={{ width: 200 }}
            defaultValue={brand.name}
            onChange={onBrandChange}
            onSearch={onSearch}
            optionLabelProp="label"
          >
            {brandList.map(item => (
              <Option label={item.name} value={JSON.stringify(item)}>
                <Avatar
                  shape="square"
                  src={item.imageUrl}
                  size={24}
                  style={{ verticalAlign: 'middle' }}
                />
                <span style={{ marginLeft: 16, verticalAlign: 'middle' }}>{item.name}</span>
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="发售时间" name="saleAt">
          <DatePicker format="YYYY/MM/DD" />
        </Form.Item>
        <Form.Item
          label="封面图片"
          name="image"
          getValueFromEvent={e => imageUploadCallback(e, setImageUrl)}
        >
          <Upload name="image" {...imageUploadProps}>
            {imageUrl ? <img src={imageUrl} width="150" alt="icon" /> : <p>上传图片</p>}
          </Upload>
        </Form.Item>
        <Form.Item
          label="图标"
          name="icon"
          getValueFromEvent={e => imageUploadCallback(e, setIconUrl)}
        >
          <Upload name="icon" {...imageUploadProps}>
            {iconUrl ? (
              <img src={iconUrl} width="150" alt="icon" />
            ) : (
              <div>
                <PlusOutlined />
                <div className="ant-upload-text">上传</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item
          label="类型"
          name="status"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select style={{ width: 120 }} onChange={e => setStatus(e)}>
            <Option value={0}>现货</Option>
            <Option value={1}>预定</Option>
          </Select>
        </Form.Item>
        {status === 1 ? (
          <Form.Item
            label="预计到货时间"
            name="predictAt"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker
              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>
        ) : (
          <></>
        )}
        <Form.Item label="权重" name="sort">
          <InputNumber />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditSeriesForm;
