import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Descriptions, Select, Tag, Avatar, Popconfirm, message } from 'antd';
import moment from 'moment';
import {
  fetchSeriesDetail,
  editSeries,
  fetchProducts,
  addProductToSeries,
  removeProductFromSeries,
  createProduct,
  createArrive,
} from './service';
import Link from 'umi/link';
import EditSeriesForm from './components/EditSeriesForm';
import CreateProductForm from './components/CreateProductForm';

const { Option } = Select;

const SeriesDetail = props => {
  const [id] = useState(props.match.params.id);
  const [sorter, setSorter] = useState({});
  const [detail, setDetail] = useState({});
  const [searchProductList, setSearchProductList] = useState([]);
  const [bindProductId, setBindProductId] = useState(undefined);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [productModal, handleProductModalVisible] = useState(false);
  const actionRef = useRef();

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      copyable: true,
      align: 'center',
    },
    {
      title: '名称',
      hideInSearch: true,
      width: 120,
      align: 'center',
      render: (_, record) => (
        <>
          <Link to={`/product/detail/${record.id}`}>{record.name}</Link>
        </>
      ),
    },
    {
      title: '图片',
      dataIndex: 'imageUrl',
      align: 'center',
      render: val => <img alt="nothing" height="70" src={val} />,
    },
    {
      title: '卡片',
      dataIndex: 'cardImageUrl',
      align: 'center',
      render: val => (val ? <img alt="nothing" height="70" src={val} /> : <></>),
    },
    {
      title: '属性',
      dataIndex: 'rare',
      align: 'center',
      valueEnum: {
        0: {
          text: <Tag>普通</Tag>,
        },
        1: {
          text: <Tag color="blue">稀有</Tag>,
        },
        2: {
          text: <Tag color="purple">隐藏</Tag>,
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'id',
      align: 'center',
      width: 200,
      render: val => (
        <Popconfirm title="确认从该系列中移除?" onConfirm={() => handleRemoveProduct(val)}>
          <a>移除</a>
        </Popconfirm>
      ),
    },
  ];

  // 获取系列详情
  const getDetail = () =>
    fetchSeriesDetail(id).then(res => {
      setDetail(res);
    });

  useEffect(() => {
    getDetail();
  }, [id]);

  // 快捷添加产品
  function addProduct() {
    if (!bindProductId) {
      return;
    }
    addProductToSeries({ seriesId: Number(id), productId: bindProductId }).then(() => {
      getDetail();
      if (actionRef.current) {
        actionRef.current.reload();
      }
    });
  }

  // 移除产品
  function handleRemoveProduct(productId) {
    removeProductFromSeries(id, { productId }).then(() => {
      getDetail();
      if (actionRef.current) {
        actionRef.current.reload();
      }
    });
  }

  const handleEdit = async fields => {
    const hide = message.loading('正在保存');
    try {
      await editSeries({
        ...fields,
      });
      hide();
      message.success('保存成功');
      return true;
    } catch (error) {
      hide();
      message.error('保存失败请重试！');
      return false;
    }
  };

  const handleCreateProduct = async fields => {
    const hide = message.loading('正在创建');
    try {
      await createProduct({
        ...fields,
        seriesId: Number(props.match.params.id),
        brandId: detail.brand.id,
      });
      hide();
      message.success('创建成功');
      return true;
    } catch (error) {
      hide();
      message.error('创建失败请重试！');
      return false;
    }
  };

  const goodsArrival = async () => {
    const hide = message.loading('正在请求');
    try {
      await createArrive({
        id: detail.id,
      });
      hide();
      getDetail();
      message.success('请求成功');
      return true;
    } catch (error) {
      hide();
      message.error('请求失败请重试！');
      return false;
    }
  };
  const description = (
    <RouteContext.Consumer>
      {({ isMobile }) => (
        <Descriptions size="small" column={isMobile ? 2 : 4} bordered>
          <Descriptions.Item label="系列ID">{detail.id}</Descriptions.Item>
          <Descriptions.Item label="名称">{detail.name}</Descriptions.Item>
          <Descriptions.Item label="品牌">
            {detail.brand ? detail.brand.name : ''}
          </Descriptions.Item>
          <Descriptions.Item label="发售时间">
            {detail.saleAt ? moment(detail.saleAt * 1000).format('YYYY/MM/DD') : ''}
          </Descriptions.Item>
          <Descriptions.Item label="类型">
            {detail.status === 1 ? <Tag color="blue">预定</Tag> : <Tag color="green">现货</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="预计到货时间">
            {detail.predictAt ? moment(detail.predictAt).format('YYYY/MM/DD') : ''}
          </Descriptions.Item>
          <Descriptions.Item label="商品数量">{detail.toyNumber}</Descriptions.Item>
          <Descriptions.Item label="权重">{detail.sort}</Descriptions.Item>
          <Descriptions.Item label="图标">
            {detail.iconUrl ? <img alt="nothing" width="80" src={detail.iconUrl} /> : null}
          </Descriptions.Item>
          <Descriptions.Item label="图片">
            {detail.imageUrl ? <img alt="nothing" width="80" src={detail.imageUrl} /> : null}
          </Descriptions.Item>
          <Descriptions.Item label="描述">{detail.description}</Descriptions.Item>
        </Descriptions>
      )}
    </RouteContext.Consumer>
  );

  // 编辑按钮
  const action = (
    <>
      <Popconfirm
        disabled={detail.status !== 1}
        title="确认该盲盒到货吗？"
        onConfirm={() => goodsArrival()}
      >
        <Button disabled={detail.status !== 1}>到货</Button>
      </Popconfirm>
      <Button
        type="primary"
        onClick={() => {
          handleUpdateModalVisible(true);
        }}
      >
        编辑
      </Button>
    </>
  );

  return (
    <PageHeaderWrapper title={`系列：${detail.name}`} content={description} extra={action}>
      <ProTable
        bordered
        search={false}
        actionRef={actionRef}
        rowKey="id"
        size="small"
        onChange={(_, _filter, _sorter) => {
          setSorter(`${_sorter.field}_${_sorter.order}`);
        }}
        params={{
          sorter,
          seriesId: id,
          pageSize: 100,
          officialOnly: false,
        }}
        pagination={false}
        request={async params => {
          const response = await fetchProducts({ ...params });
          return {
            data: response.list,
          };
        }}
        columns={columns}
        toolBarRender={() => [
          <Select
            allowClear
            showSearch
            style={{ width: 300 }}
            placeholder="搜索商品名称或ID"
            onChange={val => setBindProductId(val)}
            onSearch={val => {
              fetchProducts({ name: val }).then(res => {
                setSearchProductList(res.list);
              });
            }}
            filterOption={false}
            optionLabelProp="label"
          >
            {searchProductList.map(item => (
              <Option key={item.id} label={item.name} value={item.id}>
                <Avatar
                  shape="square"
                  src={item.imageUrl}
                  size={24}
                  style={{ verticalAlign: 'middle' }}
                />
                <span style={{ marginLeft: 16, verticalAlign: 'middle' }}>
                  {item.series ? `${item.name}(已绑系列)` : item.name}
                </span>
              </Option>
            ))}
          </Select>,
          <Button disabled={!bindProductId} type="primary" onClick={() => addProduct()}>
            添加商品
          </Button>,
          <Button type="primary" onClick={() => handleProductModalVisible(true)}>
            创建商品
          </Button>,
        ]}
      />
      <EditSeriesForm
        modalVisible={updateModalVisible}
        detail={detail}
        onSubmit={async value => {
          handleUpdateModalVisible(false);
          const success = await handleEdit(value);
          if (success) {
            getDetail();
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleUpdateModalVisible(false)}
      />
      <CreateProductForm
        modalVisible={productModal}
        onSubmit={async value => {
          handleProductModalVisible(false);
          const success = await handleCreateProduct(value);
          if (success) {
            getDetail();
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleProductModalVisible(false)}
      />
    </PageHeaderWrapper>
  );
};

export default SeriesDetail;
