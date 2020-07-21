import React, { useState } from 'react';
import { Modal, Form, Select, InputNumber, Avatar } from 'antd';
import { fetchProducts } from '../service';

const { Option } = Select;
const FormItem = Form.Item;
const AddProductForm = props => {
  const [form] = Form.useForm();
  const [brandList, setBrandList] = useState([]);
  const [product, setProduct] = useState({});
  const { modalVisible, onSubmit: handleAdd, onCancel, sessionId } = props;

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    form.resetFields();
    handleAdd({ ...fieldsValue, productId: product });
  };
  // 品牌搜索
  function onSearchProduct(val) {
    fetchProducts({ name: val }).then(res => {
      setBrandList(res.list);
    });
  }
  function onProductChange(val) {
    setProduct(JSON.parse(val).id);
  }
  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      title="添加商品"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form form={form} initialValues={{ sessionId }}>
        <FormItem
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 15,
          }}
          label="场次ID"
          name="sessionId"
          rules={[
            {
              required: true,
              message: '请输入场次数量',
            },
          ]}
        >
          <InputNumber disabled />
        </FormItem>
        <Form.Item
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 15,
          }}
          label="商品"
          name="productId"
        >
          <Select
            allowClear
            showSearch
            style={{ width: 200 }}
            onSearch={onSearchProduct}
            onChange={onProductChange}
            optionLabelProp="label"
            placeholder="请选择商品"
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
      </Form>
    </Modal>
  );
};

export default AddProductForm;
