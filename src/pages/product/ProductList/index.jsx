import React, { useState, useRef } from 'react';
import { PlusOutlined, DownOutlined } from '@ant-design/icons';
import {
  Button,
  Tag,
  message,
  Select,
  Avatar,
  Input,
  Typography,
  Divider,
  Dropdown,
  Menu,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import Link from 'umi/link';
import AddStockForm from './components/AddStockForm';
import EditProductForm from './components/EditProductForm';
import { fetchProducts, updateProduct, quantityItem, fetchSeries } from './service';

const { Text } = Typography;
const { Option } = Select;

const handleAddStock = async fields => {
  const hide = message.loading('正在设置');
  try {
    await quantityItem({
      ...fields,
    });
    hide();
    message.success('设置成功');
    return true;
  } catch (error) {
    hide();
    message.error('设置失败请重试！');
    return false;
  }
};

const handleUpdate = async fields => {
  const hide = message.loading('正在保存');
  try {
    await updateProduct({
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

const ProductList = () => {
  const [sorter, setSorter] = useState({});
  const [editProduct, setEditProduct] = useState({});
  const [stockModalVisible, handleStockModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [searchSeriesList, setSearchSeriesList] = useState([]);
  const [name, setName] = useState();
  const [seriesId, setSeriesId] = useState();
  const actionRef = useRef();
  const menu = record => (
    <Menu>
      <Menu.Item key="0">
        <a
          onClick={() => {
            handleStockModalVisible(true);
            setEditProduct(record);
          }}
        >
          设置虚拟库存
        </a>
      </Menu.Item>
    </Menu>
  );
  const columns = [
    {
      title: 'ID',
      hideInSearch: true,
      dataIndex: 'id',
      copyable: true,
      sorter: true,
      align: 'center',
      width: 110,
      fixed: 'left',
    },
    {
      title: '商品名称',
      hideInSearch: true,
      dataIndex: 'name',
      align: 'center',
      width: 120,
      fixed: 'left',
    },
    {
      title: '图片',
      hideInSearch: true,
      dataIndex: 'imageUrl',
      width: 100,
      align: 'center',
      render: val => <img alt="nothing" width="90%" src={val} />,
    },
    {
      title: '卡片',
      hideInSearch: true,
      dataIndex: 'cardImageUrl',
      width: 100,
      align: 'center',
      render: val => (val ? <img alt="nothing" width="90%" src={val} /> : <></>),
    },
    {
      title: '系列',
      hideInSearch: true,
      dataIndex: 'series',
      width: 120,
      align: 'center',
      render: series =>
        series ? <Link to={`/product/series/detail/${series.id}`}>{series.name}</Link> : <></>,
    },
    {
      title: '零售价',
      dataIndex: 'price',
      hideInSearch: true,
      sorter: true,
      align: 'center',
      render: price => <span>¥{price / 100}</span>,
    },
    {
      title: '税率',
      dataIndex: 'taxRate',
      hideInSearch: true,
      sorter: true,
      align: 'center',
      render: taxRate => (taxRate !== '-' ? <span>{taxRate}</span> : <>-</>),
    },
    {
      title: '批发价',
      dataIndex: 'wholesalePrice',
      hideInSearch: true,
      sorter: true,
      align: 'center',
      render: wholesalePrice =>
        wholesalePrice !== '-' ? <span>¥{wholesalePrice / 100}</span> : <>-</>,
    },
    {
      title: '采购类型',
      dataIndex: 'purchaseType',
      filters: false,
      align: 'center',
      width: 90,
      valueEnum: {
        0: {
          text: <Tag color="orange">采销</Tag>,
        },
        1: {
          text: <Tag color="pink">代销</Tag>,
        },
        2: {
          text: <Tag>其他</Tag>,
        },
      },
    },
    {
      title: '属性',
      dataIndex: 'rare',
      filters: false,
      align: 'center',
      width: 90,
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
      title: '类型',
      dataIndex: 'status',
      filters: false,
      align: 'center',
      width: 90,
      valueEnum: {
        0: {
          text: <Tag color="green">现货</Tag>,
        },
        1: {
          text: <Tag color="geekblue">预售</Tag>,
        },
      },
    },
    {
      title: '虚拟库存',
      hideInSearch: true,
      dataIndex: 'quantity',
      align: 'center',
    },
    {
      title: 'ERP库存',
      hideInSearch: true,
      dataIndex: 'erp',
      align: 'center',
      sorter: true,
    },
    {
      title: '可配库存',
      hideInSearch: true,
      dataIndex: 'countUsable',
      align: 'center',
      render: val => (val < 0 ? <Text type="danger">{val}</Text> : val),
    },
    {
      title: '已配置',
      hideInSearch: true,
      children: [
        {
          title: '总数',
          dataIndex: 'countUsed',
          align: 'center',
        },
        {
          title: '盲盒',
          dataIndex: 'countBox',
          align: 'center',
        },
        {
          title: '直购',
          dataIndex: 'countShop',
          align: 'center',
        },
        {
          title: '福袋',
          dataIndex: 'countBag',
          align: 'center',
        },
      ],
    },
    {
      title: '累计销售',
      children: [
        {
          title: '总数',
          hideInSearch: true,
          dataIndex: 'soldCount',
          align: 'center',
        },
        {
          title: '盒柜中',
          dataIndex: 'cabinetCount',
          align: 'center',
        },
        {
          title: '待发货',
          hideInSearch: true,
          dataIndex: 'waitCount',
          align: 'center',
        },
        {
          title: '累计发货',
          dataIndex: 'orderCount',
          align: 'center',
        },
      ],
    },
    // {
    //   title: '待售',
    //   hideInSearch: true,
    //   dataIndex: 'total',
    //   align: 'center',
    // },
    {
      title: '操作',
      dataIndex: 'id',
      align: 'center',
      fixed: 'right',
      width: 100,
      hideInSearch: true,
      render: (_, record) => (
        <>
          <Link to={`/product/detail/${record.id}`}>详情</Link>
          <Divider type="vertical" />
          <Dropdown overlay={menu(record)}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              <DownOutlined />
            </a>
          </Dropdown>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable
        bordered
        rowKey="id"
        actionRef={actionRef}
        scroll={{ x: 1800, y: window.innerHeight - window.innerHeight / 3 }}
        search={{ span: 6 }}
        useFixedHeader
        onChange={(_, _filter, _sorter) => {
          setSorter(`${_sorter.field}_${_sorter.order}`);
        }}
        params={{
          sorter,
          name,
          seriesId,
        }}
        toolBarRender={() => [
          <Input.Search
            key="search_name"
            placeholder="搜索商品名称或ID"
            style={{ width: 200 }}
            onSearch={val => {
              if (actionRef.current) {
                actionRef.current.reset();
                setName(val);
              }
            }}
          />,
          <Select
            key="search_series"
            allowClear
            showSearch
            style={{ width: 200 }}
            placeholder="按系列搜索"
            onChange={val => {
              if (actionRef.current) {
                actionRef.current.reset();
                setSeriesId(val);
              }
            }}
            onSearch={val => {
              fetchSeries({ name: val }).then(res => {
                setSearchSeriesList(res.list);
              });
            }}
            filterOption={false}
            optionLabelProp="label"
          >
            {searchSeriesList.map(item => (
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
          <Button
            key="btn_create"
            type="primary"
            onClick={() => {
              handleUpdateModalVisible(true);
              setEditProduct({});
            }}
          >
            <PlusOutlined /> 创建商品
          </Button>,
        ]}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 20,
          showTotal: total => `总共${total}条记录`,
        }}
        request={async params => {
          const response = await fetchProducts({ ...params });
          return {
            data: response.list,
            current: response.pagination.current,
            total: response.pagination.total,
            pageSize: response.pagination.pageSize,
          };
        }}
        columns={columns}
      />
      <AddStockForm
        product={editProduct}
        onSubmit={async value => {
          handleStockModalVisible(false);
          const success = await handleAddStock(value);
          if (success) {
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleStockModalVisible(false)}
        modalVisible={stockModalVisible}
      />
      <EditProductForm
        product={editProduct}
        onSubmit={async value => {
          handleUpdateModalVisible(false);
          const success = await handleUpdate(value);
          if (success) {
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleUpdateModalVisible(false)}
        modalVisible={updateModalVisible}
      />
    </PageHeaderWrapper>
  );
};

export default ProductList;
