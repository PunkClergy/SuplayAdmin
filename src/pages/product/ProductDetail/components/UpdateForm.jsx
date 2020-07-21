import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Modal,
  Upload,
  Select,
  Avatar,
  DatePicker,
  InputNumber,
  Popover,
  Alert,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { fetchSeries, fetchBrands } from '../service';
import { imageUploadProps, imageUploadCallback } from '../../../../utils/utils';

const { Option } = Select;

const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const EditProductForm = props => {
  const [form] = Form.useForm();
  const { product, modalVisible, onSubmit: handleUpdate, onCancel } = props;
  const [disable, setDisable] = useState(product.series);
  const [imageUrl, setImageUrl] = useState(product.imageUrl);
  const [cardImageUrl, setCardImageUrl] = useState(product.cardImageUrl);
  const [status, setStatus] = useState(product.status);
  const [seriesList, setSeriesList] = useState([]);
  const [series, setSeries] = useState({});
  const [brandList, setBrandList] = useState([]);
  const [brand, setBrand] = useState({});
  const initialValues = {
    ...product,
    brand: product.brand ? product.brand.name : null,
    series: product.series ? product.series.name : null,
    status: product.status ? product.status : 0,
    price: product.price / 100,
    wholesalePrice: product.wholesalePrice / 100,
  };
  if (product.predictAt) {
    initialValues.predictAt = moment(product.predictAt);
  }
  useEffect(() => {
    if (modalVisible) {
      setDisable(product.series);
      setStatus(product.status);
      setImageUrl(product.imageUrl);
      setCardImageUrl(product.cardImageUrl);
      if (product.series) {
        setSeries(product.series);
      }
      if (product.brand) {
        setBrand(product.brand);
      }
      form.resetFields();
    }
  }, [modalVisible]);

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    const predictAt = fieldsValue.predictAt ? fieldsValue.predictAt.unix() : null;
    const price = fieldsValue.price * 100;
    const taxRate = fieldsValue.taxRate ? fieldsValue.taxRate : null;
    const wholesalePrice = fieldsValue.wholesalePrice
      ? parseInt(fieldsValue.wholesalePrice * 100, 10)
      : null;
    handleUpdate({
      ...product,
      ...fieldsValue,
      predictAt,
      price,
      taxRate,
      wholesalePrice,
      seriesId: series ? series.id : null,
      brandId: brand ? brand.id : null,
    });
    // form.resetFields();
  };

  const onSeriesChange = value => {
    if (value) {
      setStatus(JSON.parse(value).status);
      setSeries(JSON.parse(value));
      setBrand(JSON.parse(value).brand);
      setDisable(true);
      form.setFieldsValue({
        series: JSON.parse(value).name,
        brand: JSON.parse(value).brand.name,
        status: JSON.parse(value).status,
        predictAt: moment(JSON.parse(value).predictAt),
      });
    } else {
      setSeries({});
      setBrand({});
      setDisable(false);
      setStatus(product.status);
      form.setFieldsValue({
        series: null,
        brand: null,
        status: product.status ? product.status : 0,
        predictAt: product.predictAt ? moment(product.predictAt) : null,
      });
    }
  };

  const onBrandChange = value => {
    if (value) {
      setBrand(JSON.parse(value));
      setSeries(null);
      form.setFieldsValue({
        series: null,
        brand: JSON.parse(value).name,
      });
    } else {
      setBrand({});
      setSeries({});
      form.setFieldsValue({
        series: null,
        brand: null,
      });
    }
  };

  // 系列搜索
  function onSearchSeries(val) {
    fetchSeries({ name: val }).then(res => {
      setSeriesList(res.list);
      setBrandList([]);
    });
  }

  // 品牌搜索
  function onSearchBrand(val) {
    fetchBrands({ name: val }).then(res => {
      setBrandList(res.list);
    });
  }

  const hoverContent = <Alert message="商品零售价信息修改后不会同步erp" type="warning" />;
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
      title={product.id ? '编辑商品' : '创建商品'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form name="editProductForm" form={form} {...formLayout} initialValues={initialValues}>
        <Form.Item label="ID" name="id">
          <Input placeholder="" disabled />
        </Form.Item>
        <Form.Item
          label="商品名称"
          name="name"
          rules={[{ required: true, message: '请输入商品名称!' }]}
        >
          <Input />
        </Form.Item>
        <Popover placement="top" content={hoverContent} trigger="hover">
          <Form.Item
            label="零售价"
            name="price"
            rules={[{ required: true, message: '请输入金额!' }]}
          >
            <InputNumber />
          </Form.Item>
        </Popover>
        <Form.Item label="税率" name="taxRate">
          <InputNumber disabled />
        </Form.Item>
        <Form.Item label="批发价" name="wholesalePrice">
          <InputNumber disabled />
        </Form.Item>
        <Form.Item label="属性" name="rare" rules={[{ required: true, message: '请选择属性!' }]}>
          <Select style={{ width: 200 }}>
            <Option value={0}>普通</Option>
            <Option value={1}>稀有</Option>
            <Option value={2}>隐藏</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="图片"
          name="image"
          getValueFromEvent={e => imageUploadCallback(e, setImageUrl)}
          rules={[{ required: true, message: '请上传商品图片!' }]}
        >
          <Upload name="image" {...imageUploadProps}>
            {imageUrl ? (
              <img alt="nothing" src={imageUrl} width="150" />
            ) : (
              <div>
                <PlusOutlined />
                <div className="ant-upload-text">上传</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item
          label="卡片"
          name="cardImage"
          getValueFromEvent={e => imageUploadCallback(e, setCardImageUrl)}
        >
          <Upload name="cardImage" {...imageUploadProps}>
            {cardImageUrl ? (
              <img alt="nothing" src={cardImageUrl} width="150" />
            ) : (
              <div>
                <PlusOutlined />
                <div className="ant-upload-text">上传</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item label="系列" name="series">
          <Select
            allowClear
            showSearch
            style={{ width: 200 }}
            onChange={onSeriesChange}
            onSearch={onSearchSeries}
            optionLabelProp="label"
          >
            {seriesList.map(item => (
              <Option label={item.name} key={item.id} value={JSON.stringify(item)}>
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
        <Form.Item label="品牌" name="brand">
          <Select
            allowClear
            showSearch
            style={{ width: 200 }}
            onChange={onBrandChange}
            onSearch={onSearchBrand}
            optionLabelProp="label"
          >
            {brandList.map(item => (
              <Option label={item.name} key={item.id} value={JSON.stringify(item)}>
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
        <Form.Item
          label="类型"
          name="status"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select style={{ width: 120 }} onChange={e => setStatus(e)} disabled={disable}>
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
                message: '请选择预计到货时间',
              },
            ]}
            extra="修改时间所有盒柜相关产品将会改变"
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" disabled={disable} />
          </Form.Item>
        ) : (
          <></>
        )}
        <Form.Item
          label="采购类型"
          name="purchaseType"
          rules={[{ required: true, message: '请选择属性!' }]}
        >
          <Select style={{ width: 200 }}>
            <Option value={0}>采销</Option>
            <Option value={1}>代销</Option>
            <Option value={2}>其他</Option>
          </Select>
        </Form.Item>
        <Form.Item label="虚拟库存" name="quantity">
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProductForm;
