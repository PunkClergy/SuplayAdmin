import React, { useState } from 'react';
import { Modal, Form, Button, Select, Row, InputNumber, Avatar, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { fetchSeries, fetchProducts } from '../service';
import styles from '../style.less';

const { Option } = Select;
const FormItem = Form.Item;
const rules = [{ required: true }];
const CreateSessionForm = props => {
  const [form] = Form.useForm();
  const [brandList, setBrandList] = useState([]);
  const [productList, setProductList] = useState([]);

  const { modalVisible, onSubmit: handleAdd, onCancel, confirmLoading } = props;

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    if (fieldsValue.listSeriesdata || fieldsValue.listProductdata) {
      const listSeries = [];
      const ListProduct = [];
      // 系列数据
      if (fieldsValue.listSeriesdata) {
        fieldsValue.listSeriesdata.map(field => {
          const series = [];
          field.seriesIds.map(seriesId => {
            series.push(JSON.parse(seriesId.value).id);
            return null;
          });
          const temp = {
            seriesIds: series,
            number: field.number,
          };
          listSeries.push(temp);
          return null;
        });
      }

      // 产品数据
      if (fieldsValue.listProductdata) {
        fieldsValue.listProductdata.map(field => {
          const products = [];
          field.productIds.map(productId => {
            products.push(JSON.parse(productId.value).id);
            return null;
          });
          const temp = {
            productIds: products,
            number: field.number,
          };
          ListProduct.push(temp);
          return null;
        });
      }

      handleAdd(
        {
          sessionNumber: fieldsValue.sessionNumber,
          seriesList: listSeries,
          productList: ListProduct,
        },
        form,
      );
    } else {
      message.error('产品和系列请至少选择一项');
    }
  };

  // 系列搜索
  function onSearchSeries(val) {
    fetchSeries({ name: val }).then(res => {
      setBrandList(res.list);
    });
  }

  // 产品搜索
  function onSearchProducts(val) {
    fetchProducts({ name: val }).then(res => {
      setProductList(res.list);
    });
  }

  return (
    <Modal
      maskClosable={false}
      confirmLoading={confirmLoading}
      destroyOnClose
      title="创建场次"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form form={form} name="">
        <FormItem
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 15,
          }}
          label="场次数量"
          name="sessionNumber"
          rules={[
            {
              required: true,
              message: '请输入场次数量',
            },
          ]}
        >
          <InputNumber style={{ width: '100%' }} min={1} placeholder="请输入场次" />
        </FormItem>
        <Form.List name="listSeriesdata">
          {(fields, { add, remove }) => {
            const fieldsInfo = (
              <div>
                {fields.map(field => (
                  <Row key={field.key}>
                    <Form.Item
                      name={[field.name, 'seriesIds']}
                      fieldKey={[field.fieldKey, 'seriesIds']}
                      rules={rules}
                      style={{ marginLeft: '5%', width: '60%' }}
                    >
                      <Select
                        mode="multiple"
                        allowClear
                        labelInValue
                        style={{ width: 200 }}
                        onSearch={onSearchSeries}
                        optionLabelProp="label"
                        placeholder="请选择系列"
                      >
                        {brandList.map(item => (
                          <Option label={item.name} key={item.id} value={JSON.stringify(item)}>
                            <Avatar
                              shape="square"
                              src={item.imageUrl}
                              size={24}
                              style={{ verticalAlign: 'middle' }}
                            />
                            <span style={{ marginLeft: 16, verticalAlign: 'middle' }}>
                              {item.name}
                            </span>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name={[field.name, 'number']}
                      fieldKey={[field.fieldKey, 'number']}
                      rules={rules}
                      style={{ marginLeft: '1%' }}
                    >
                      <InputNumber placeholder="数量" />
                    </Form.Item>
                    <MinusCircleOutlined
                      className={styles.dynamicButton}
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  </Row>
                ))}
                <Form.Item style={{ marginLeft: '5%' }}>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    style={{ width: '82%' }}
                  >
                    <PlusOutlined /> 新增系列
                  </Button>
                </Form.Item>
              </div>
            );
            return fieldsInfo;
          }}
        </Form.List>
        <Form.List name="listProductdata">
          {(fields, { add, remove }) => {
            const fieldsInfo = (
              <div>
                {fields.map(field => (
                  <Row key={field.key}>
                    <Form.Item
                      name={[field.name, 'productIds']}
                      fieldKey={[field.fieldKey, 'productIds']}
                      rules={rules}
                      style={{ marginLeft: '5%', width: '60%' }}
                    >
                      <Select
                        mode="multiple"
                        allowClear
                        labelInValue
                        style={{ width: 200 }}
                        onSearch={onSearchProducts}
                        optionLabelProp="label"
                        placeholder="请选择产品"
                      >
                        {productList.map(item => (
                          <Option label={item.name} key={item.id} value={JSON.stringify(item)}>
                            <Avatar
                              shape="square"
                              src={item.imageUrl}
                              size={24}
                              style={{ verticalAlign: 'middle' }}
                            />
                            <span style={{ marginLeft: 16, verticalAlign: 'middle' }}>
                              {item.name}
                            </span>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name={[field.name, 'number']}
                      fieldKey={[field.fieldKey, 'number']}
                      rules={rules}
                      style={{ marginLeft: '1%' }}
                    >
                      <InputNumber placeholder="数量" />
                    </Form.Item>
                    <MinusCircleOutlined
                      className={styles.dynamicButton}
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  </Row>
                ))}
                <Form.Item style={{ marginLeft: '5%' }}>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    style={{ width: '82%' }}
                  >
                    <PlusOutlined /> 新增产品
                  </Button>
                </Form.Item>
              </div>
            );
            return fieldsInfo;
          }}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default CreateSessionForm;
