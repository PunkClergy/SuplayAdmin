import React, { useState } from 'react';
import {
  Form,
  Input,
  Modal,
  Upload,
  Select,
  InputNumber,
  Avatar,
  DatePicker,
  Radio,
  message,
  Switch,
} from 'antd';
import moment from 'moment';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { imageUploadProps, imageUploadCallback, imageLoadingCallback } from '../../../utils/utils';
import { fetchSeries } from '../service';

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

// 默认提交参数值
const initialValues = {
  type: 0,
  bgColor: '#FFFFFF',
  rareNum: 0,
  status: 0,
  sort: 0,
  allowCoupon: true,
};

const CreateForm = props => {
  const [form] = Form.useForm();
  // 封面/外盒/盒盖/包装/类型新旧值
  const [coverUrl, setCoverUrl] = useState(undefined);
  const [headImageUrl, setHeadImageUrl] = useState(undefined);
  const [boxImageUrl, setBoxImageUrl] = useState(undefined);
  const [packageImageUrl, setPackageImage] = useState(undefined);
  const [type, setType] = useState(0);
  const [loadingCover, setLoadingCover] = useState(false);
  const [loadingHeadImage, setLoadingHeadImage] = useState(false);
  const [loadingBoxImage, setLoadingBoxImage] = useState(false);
  const [loadingPackageImage, setLoadingPackageImage] = useState(false);
  const [seriesList, setSeriesList] = useState([]);
  const [seriesListId, setSeriesListId] = useState(null);
  const { modalVisible, onSubmit: handleAdd, onCancel } = props;

  const okHandle = async () => {
    console.log(seriesListId);
    const fieldsValue = await form.validateFields();
    form.resetFields();
    const reserve = fieldsValue.type === 1;
    const predictAt = fieldsValue.type === 1 ? fieldsValue.predictAt.unix() : null;
    const openAt = fieldsValue.openAt.unix();
    const startAt = fieldsValue.startAt.unix();
    const endAt = fieldsValue.endAt ? fieldsValue.endAt.unix() : null;
    handleAdd({
      ...fieldsValue,
      price: Math.floor(fieldsValue.price * 100),
      reserve,
      predictAt,
      openAt,
      startAt,
      endAt,
      seriesId: seriesListId,
    });
  };
  const onSeriesChange = value => {
    if (value) {
      form.setFieldsValue({
        name: JSON.parse(value).name,
        cover: JSON.parse(value).image,
      });
      setSeriesListId(JSON.parse(value).id);
      setCoverUrl(JSON.parse(value).imageUrl);
    } else {
      form.setFieldsValue({
        name: null,
        cover: null,
      });
      setCoverUrl(undefined);
      setSeriesListId(null);
    }
  };
  // 系列搜索
  function onSearchSeries(val) {
    fetchSeries({ name: val }).then(res => {
      setSeriesList(res.list);
    });
  }

  return (
    <Modal
      width={800}
      style={{ top: 20 }}
      bodyStyle={{
        padding: '32px 40px 48px',
        overflowY: 'auto',
        height: 'calc(100vh - 200px)',
      }}
      maskClosable={false}
      destroyOnClose
      title="创建盲盒"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form form={form} {...formLayout} initialValues={initialValues}>
        <Form.Item label="系列" name="series" rules={[{ required: true, message: '请选择系列' }]}>
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
        <FormItem label="名称" name="name" rules={[{ required: true, message: '请输入盲盒名称' }]}>
          <Input placeholder="请输入盲盒名称" />
        </FormItem>
        <FormItem label="描述" name="description">
          <Input.TextArea />
        </FormItem>
        <FormItem
          label="上架时间"
          name="startAt"
          rules={[{ required: true, message: '请选择上架时间' }]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </FormItem>
        <FormItem label="下架时间" name="endAt" extra="不填则不会自动下架">
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </FormItem>
        <FormItem
          label="开售时间"
          name="openAt"
          rules={[{ required: true, message: '请选择开售时间' }]}
        >
          <DatePicker
            showTime={{ defaultValue: moment('10:00:00', 'HH:mm:ss') }}
            format="YYYY-MM-DD HH:mm:ss"
          />
        </FormItem>
        <FormItem label="类型" name="type" rules={[{ required: true }]}>
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
            <DatePicker
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
          label="头卡"
          name="headImage"
          valuePropName="headImage"
          getValueFromEvent={e => imageUploadCallback(e, setHeadImageUrl)}
          rules={[
            {
              required: true,
              message: '请上传头卡图片',
            },
          ]}
        >
          <Upload
            name="headImage"
            {...imageUploadProps}
            onChange={e => imageLoadingCallback(e, setLoadingHeadImage, message)}
          >
            {headImageUrl ? (
              <img src={headImageUrl} width="150" alt="avatar" />
            ) : (
              <div>
                {loadingHeadImage ? <LoadingOutlined /> : <PlusOutlined />}
                <div className="ant-upload-text">上传</div>
              </div>
            )}
          </Upload>
        </FormItem>
        <FormItem
          label="盒盖"
          name="boxImage"
          valuePropName="boxImage"
          getValueFromEvent={e => imageUploadCallback(e, setBoxImageUrl)}
          rules={[
            {
              required: true,
              message: '请上传盒盖图片',
            },
          ]}
        >
          <Upload
            name="boxImage"
            {...imageUploadProps}
            onChange={e => imageLoadingCallback(e, setLoadingBoxImage, message)}
          >
            {boxImageUrl ? (
              <img src={boxImageUrl} width="150" alt="avatar" />
            ) : (
              <div>
                {loadingBoxImage ? <LoadingOutlined /> : <PlusOutlined />}
                <div className="ant-upload-text">上传</div>
              </div>
            )}
          </Upload>
        </FormItem>
        <FormItem
          label="包装"
          name="packageImage"
          valuePropName="packageImage"
          getValueFromEvent={e => imageUploadCallback(e, setPackageImage)}
          rules={[
            {
              required: true,
              message: '请上传包装图片',
            },
          ]}
        >
          <Upload
            name="packageImage"
            {...imageUploadProps}
            onChange={e => imageLoadingCallback(e, setLoadingPackageImage, message)}
          >
            {packageImageUrl ? (
              <img src={packageImageUrl} width="150" alt="avatar" />
            ) : (
              <div>
                {loadingPackageImage ? <LoadingOutlined /> : <PlusOutlined />}
                <div className="ant-upload-text">上传</div>
              </div>
            )}
          </Upload>
        </FormItem>
        <FormItem
          label="价格（元）"
          name="price"
          rules={[
            {
              required: true,
              message: '请输入价格',
            },
          ]}
        >
          <InputNumber style={{ width: '100%' }} />
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
        <FormItem
          label="排序权重"
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
        <FormItem label="标签" name="attribute">
          <Select style={{ width: 120 }}>
            <Option value="人气">人气</Option>
            <Option value="限量">限量</Option>
          </Select>
        </FormItem>
        <FormItem label="优惠券" name="allowCoupon">
          <Switch checkedChildren="可用" unCheckedChildren="禁止" defaultChecked />
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

export default CreateForm;
