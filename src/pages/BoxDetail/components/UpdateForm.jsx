import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Modal,
  Upload,
  Select,
  DatePicker,
  Radio,
  Avatar,
  Switch,
} from 'antd';
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

const colors = [
  '#FFFFFF',
  '#FFEFF5',
  '#EFFAFF',
  '#F1F1F1',
  '#FEF6EF',
  '#F0EFFE',
  '#FEF1EF',
  '#EAFFF9',
];

const UpdateForm = props => {
  const [form] = Form.useForm();
  const [box, setBox] = useState(props.box);
  const [type, setType] = useState(props.box.reserve ? 1 : 0);
  const { modalVisible, onSubmit: handleUpdate, onCancel } = props;

  useEffect(() => {
    if (modalVisible) {
      setBox(props.box);
      setType(props.box.reserve ? 1 : 0);

      form.setFieldsValue({
        ...props.box,
        type: props.box.reserve ? 1 : 0,
        price: props.box.price / 100,
        predictAt: props.box.predictAt ? moment(props.box.predictAt) : null,
        openAt: moment(props.box.openAt),
        startAt: moment(props.box.startAt),
        endAt: props.box.endAt ? moment(props.box.endAt) : null,
      });
    }
  }, [modalVisible]);
  // 数据保存
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    const reserve = fieldsValue.type === 1;
    const predictAt = fieldsValue.type === 1 ? fieldsValue.predictAt.unix() : null;
    const openAt = fieldsValue.openAt.unix();
    const startAt = fieldsValue.startAt.unix();
    const endAt = fieldsValue.endAt ? fieldsValue.endAt.unix() : null;
    handleUpdate({
      ...box,
      ...fieldsValue,
      price: Math.floor(fieldsValue.price * 100),
      reserve,
      predictAt,
      openAt,
      startAt,
      endAt,
    });
  };
  // 上传图片
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
  const handleBoxImage = e => {
    if (e.file.response) {
      setBox(prevState => ({
        ...prevState,
        boxImage: e.file.response.data.imageKey,
        boxImageUrl: e.file.response.data.imageUrl,
      }));
      return e.file.response.data.imageKey;
    }
    return null;
  };
  const handleHeadImage = e => {
    if (e.file.response) {
      setBox(prevState => ({
        ...prevState,
        headImage: e.file.response.data.imageKey,
        headImageUrl: e.file.response.data.imageUrl,
      }));
      return e.file.response.data.imageKey;
    }
    return null;
  };
  const handlePackageImage = e => {
    if (e.file.response) {
      setBox(prevState => ({
        ...prevState,
        packageImage: e.file.response.data.imageKey,
        packageImageUrl: e.file.response.data.imageUrl,
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
      title="编辑盲盒"
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
        <FormItem label="描述" name="description">
          <Input.TextArea />
        </FormItem>
        <FormItem
          label="上架时间"
          name="startAt"
          rules={[
            {
              required: true,
              message: '请选择上架时间',
            },
          ]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </FormItem>
        <FormItem label="下架时间" name="endAt" extra="不填则不会自动下架">
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
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
        <FormItem
          label="类型"
          name="type"
          rules={[{ required: true }]}
          extra="修改后不会改变已有盒柜中商品状态"
        >
          <Radio.Group onChange={e => setType(e.target.value)}>
            <Radio value={0}>现货</Radio>
            <Radio value={1}>预定</Radio>
          </Radio.Group>
        </FormItem>
        {type === 1 ? (
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
        <FormItem
          label="头卡"
          name="headImage"
          valuePropName="headImage"
          getValueFromEvent={handleHeadImage}
        >
          <Upload {...imageUploadProps}>
            {box.headImageUrl ? (
              <img src={box.headImageUrl} width="150" alt="avatar" />
            ) : (
              <div>
                <PlusOutlined />
                <div className="ant-upload-text">上传</div>
              </div>
            )}
          </Upload>
        </FormItem>
        <FormItem
          label="盒盖"
          name="boxImage"
          valuePropName="boxImage"
          getValueFromEvent={handleBoxImage}
        >
          <Upload {...imageUploadProps}>
            {box.boxImageUrl ? (
              <img src={box.boxImageUrl} width="150" alt="avatar" />
            ) : (
              <div>
                <PlusOutlined />
                <div className="ant-upload-text">上传</div>
              </div>
            )}
          </Upload>
        </FormItem>
        <FormItem
          label="包装"
          name="packageImage"
          valuePropName="packageImage"
          getValueFromEvent={handlePackageImage}
        >
          <Upload {...imageUploadProps}>
            {box.packageImageUrl ? (
              <img src={box.packageImageUrl} width="150" alt="avatar" />
            ) : (
              <div>
                <PlusOutlined />
                <div className="ant-upload-text">上传</div>
              </div>
            )}
          </Upload>
        </FormItem>
        <FormItem label="价格（元）" name="price">
          <InputNumber style={{ width: '100%' }} formatter={value => `￥ ${value}`} />
        </FormItem>
        <FormItem
          label="盒子数量"
          name="boxNum"
          rules={[
            {
              required: true,
              message: '盒子数量必须大于0',
            },
          ]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </FormItem>
        <FormItem
          label="每场稀有数量"
          name="rareNum"
          rules={[
            {
              required: true,
              message: '请输入没场稀有数量',
            },
          ]}
        >
          <InputNumber style={{ width: '100%' }} />
        </FormItem>
        <FormItem label="排序权重" name="sort">
          <InputNumber style={{ width: '100%' }} />
        </FormItem>
        <FormItem label="标签" name="attribute">
          <Select style={{ width: 120 }} allowClear>
            {/* <Option value="新品">新品</Option> */}
            <Option value="人气">人气</Option>
            <Option value="限量">限量</Option>
          </Select>
        </FormItem>
        <FormItem label="优惠券" name="allowCoupon">
          <Switch
            checkedChildren="可用"
            unCheckedChildren="禁用"
            defaultChecked={box.allowCoupon}
          />
        </FormItem>
        <FormItem label="显示" name="display">
          <Switch checkedChildren="显示" unCheckedChildren="隐藏" defaultChecked={box.display} />
        </FormItem>
        <FormItem
          label="背景颜色"
          name="bgColor"
          rules={[
            {
              required: true,
              message: '选择背景颜色',
            },
          ]}
        >
          <Radio.Group>
            {colors.map(c => (
              <Radio value={c} key={c}>
                <Avatar
                  shape="square"
                  size="large"
                  style={{
                    marginBottom: 10,
                    color: 'black',
                    border: '1px solid black',
                    backgroundColor: c,
                  }}
                >
                  {c}
                </Avatar>
              </Radio>
            ))}
          </Radio.Group>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default UpdateForm;
