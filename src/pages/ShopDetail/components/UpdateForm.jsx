import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Upload, Select, DatePicker, Switch, Radio } from 'antd';
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
  const [shop, setShop] = useState(props.shop);
  const [reserve, setReserve] = useState(props.shop.reserve);
  const [limitType, setLimitType] = useState(props.shop.limitPurchase ? 1 : 0);
  const { modalVisible, onSubmit: handleUpdate, onCancel } = props;

  useEffect(() => {
    if (modalVisible) {
      setShop(props.shop);
      setReserve(props.shop.reserve);
      setLimitType(props.shop.limitPurchase ? 1 : 0);
      form.setFieldsValue({
        ...props.shop,
        limitType: props.shop.limitPurchase ? 1 : 0,
        price: props.shop.price / 100,
        predictAt: props.shop.predictAt ? moment(props.shop.predictAt) : null,
        endAt: props.shop.endAt ? moment(props.shop.endAt) : null,
        openAt: props.shop.openAt ? moment(props.shop.openAt) : null,
        startAt: props.shop.startAt ? moment(props.shop.startAt) : null,
        closeAt: props.shop.closeAt ? moment(props.shop.closeAt) : null,
      });
    }
  }, [modalVisible]);
  // 数据保存
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();

    const hidden = !fieldsValue.hidden;
    const predictAt = fieldsValue.reserve ? fieldsValue.predictAt.unix() : null;
    const startAt = fieldsValue.startAt ? fieldsValue.startAt.unix() : null;
    const endAt = fieldsValue.endAt ? fieldsValue.endAt.unix() : null;
    const closeAt = fieldsValue.closeAt ? fieldsValue.closeAt.unix() : null;
    const limitPurchase = fieldsValue.limitType === 1 ? fieldsValue.limitPurchase : null;
    const openAt = fieldsValue.openAt.unix();
    handleUpdate({
      ...shop,
      ...fieldsValue,
      price: fieldsValue.price * 100,
      predictAt,
      openAt,
      endAt,
      startAt,
      limitPurchase,
      reserve,
      hidden,
      closeAt,
    });
  };
  // 上传封面图
  const handleCover = e => {
    if (e.file.response) {
      setShop(prevState => ({
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
      title="编辑直购"
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
              message: '请输入产品名称',
              min: 1,
            },
          ]}
        >
          <Input placeholder="请输入直购名称" />
        </FormItem>
        <FormItem label="描述" name="description">
          <Input.TextArea />
        </FormItem>
        <FormItem
          label="开售时间"
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
        <FormItem label="停售时间" name="closeAt" extra="设置限时抢购结束时间">
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </FormItem>
        <FormItem label="上架时间" name="startAt" rules={[{ required: true }]}>
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </FormItem>
        <FormItem label="下架时间" name="endAt">
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </FormItem>
        <FormItem
          label="类型"
          name="reserve"
          rules={[{ required: true }]}
          extra="修改后不会改变已有盒柜中商品状态"
        >
          <Radio.Group onChange={e => setReserve(e.target.value)}>
            <Radio value={false}>现货</Radio>
            <Radio value>预定</Radio>
          </Radio.Group>
        </FormItem>
        {reserve ? (
          <FormItem
            label="预计到货时间"
            name="predictAt"
            rules={[
              {
                required: true,
                message: '请选择预计到货时间',
              },
            ]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </FormItem>
        ) : (
          <></>
        )}
        <FormItem label="封面" name="cover" valuePropName="cover" getValueFromEvent={handleCover}>
          <Upload {...imageUploadProps}>
            {shop.coverUrl ? (
              <img src={shop.coverUrl} width="150" alt="avatar" />
            ) : (
              <div>
                <PlusOutlined />
                <div className="ant-upload-text">上传</div>
              </div>
            )}
          </Upload>
        </FormItem>
        <FormItem
          label="是否限购"
          name="limitType"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select style={{ width: 120 }} onChange={e => setLimitType(e)}>
            <Option value={1}>限购</Option>
            <Option value={0}>不限购</Option>
          </Select>
        </FormItem>
        {limitType === 1 ? (
          <FormItem
            label="限购数量"
            name="limitPurchase"
            rules={[
              {
                required: true,
                message: '请输入限购数量',
              },
            ]}
          >
            <InputNumber placeholder="请输入限购数量" style={{ width: '100%' }} />
          </FormItem>
        ) : (
          <></>
        )}

        <FormItem label="重要提示" name="important">
          <Input.TextArea />
        </FormItem>
        <FormItem
          label="权重"
          name="sort"
          rules={[
            {
              required: true,
              message: '请输入权重',
            },
          ]}
        >
          <InputNumber placeholder="请输入" />
        </FormItem>
        <FormItem
          label="物流方式"
          name="shipType"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select style={{ width: 120 }}>
            <Option value={0}>普通快递</Option>
            <Option value={1}>顺丰寄付</Option>
            <Option value={2}>顺丰到付</Option>
          </Select>
        </FormItem>
        {/* <FormItem
          label="采购类型"
          name="sales"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select style={{ width: 120 }}>
            <Option value={0}>采销</Option>
            <Option value={1}>代销</Option>
          </Select>
        </FormItem> */}
        <FormItem label="需要用户支付邮费" name="needPostage">
          <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked={shop.needPostage} />
        </FormItem>
        <FormItem label="库存显示" name="displayStock">
          <Switch
            checkedChildren="显示"
            unCheckedChildren="隐藏"
            defaultChecked={shop.displayStock}
          />
        </FormItem>
        <FormItem label="列表显示" name="display">
          <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked={shop.display} />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default UpdateForm;
