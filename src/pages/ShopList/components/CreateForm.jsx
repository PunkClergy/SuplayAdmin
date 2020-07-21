import React, { useState } from 'react';
import {
  Form,
  Input,
  Modal,
  Upload,
  Select,
  InputNumber,
  DatePicker,
  Switch,
  message,
  Radio,
} from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';
import { imageUploadProps, imageUploadCallback, imageLoadingCallback } from '../../../utils/utils';

const { Option } = Select;
const FormItem = Form.Item;
// 栅格
const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};
// 默认提交参数值
const initialValues = {
  sales: 0,
  shipType: 0,
  limitType: 0,
  bgColor: '#ffffff',
  rareNum: 0,
  status: 0,
  sort: 0,
  limitPurchase: 0,
  needPostage: true,
  displayStock: true,
  reserve: false,
};

const CreateForm = props => {
  const [form] = Form.useForm();
  // 封面/类型新旧值
  const [coverUrl, setCoverUrl] = useState(undefined);
  const [reserve, setReserve] = useState(false);
  const [limitType, setLimitType] = useState(0);
  const [loadingCover, setLoadingCover] = useState(false);
  const { modalVisible, onSubmit: handleAdd, onCancel } = props;

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    form.resetFields();
    const predictAt = fieldsValue.reserve ? fieldsValue.predictAt.unix() : null;
    const openAt = fieldsValue.openAt.unix();
    const startAt = fieldsValue.startAt ? fieldsValue.startAt.unix() : null;

    const endAt = fieldsValue.endAt ? fieldsValue.endAt.unix() : null;
    const closeAt = fieldsValue.endAt ? fieldsValue.endAt.unix() : null;

    handleAdd({ ...fieldsValue, predictAt, openAt, startAt, endAt, reserve, closeAt });
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
      title="创建直购"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form form={form} {...formLayout} initialValues={initialValues}>
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
          <Input placeholder="请输入" />
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
          <DatePicker
            showTime={{ defaultValue: moment('10:00:00', 'HH:mm:ss') }}
            format="YYYY-MM-DD HH:mm:ss"
          />
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
        <FormItem label="类型" name="reserve" rules={[{ required: true }]}>
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
            <DatePicker
              disabled={!reserve}
              showTime={{ defaultValue: moment('10:00:00', 'HH:mm:ss') }}
              format="YYYY-MM-DD HH:mm:ss"
            />
          </FormItem>
        ) : (
          <></>
        )}
        <FormItem
          label="封面"
          name="cover"
          valuePropName="cover"
          getValueFromEvent={e => imageUploadCallback(e, setCoverUrl)}
          rules={[
            {
              required: true,
              message: '请上传封面图片',
            },
          ]}
        >
          <Upload
            name="cover"
            {...imageUploadProps}
            onChange={e => imageLoadingCallback(e, setLoadingCover, message)}
          >
            {coverUrl ? (
              <img src={coverUrl} width="150" alt="avatar" />
            ) : (
              <div>
                {loadingCover ? <LoadingOutlined /> : <PlusOutlined />}
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
                message: '清填写限购数量',
              },
            ]}
          >
            <InputNumber placeholder="请输入限购数量" />
          </FormItem>
        ) : (
          <></>
        )}

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
        <FormItem label="用户支付邮费" name="needPostage">
          <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked />
        </FormItem>
        <FormItem label="库存显示" name="displayStock">
          <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked />
        </FormItem>
        <FormItem label="列表显示" name="display">
          <Switch checkedChildren="显示" unCheckedChildren="隐藏" defaultChecked />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
