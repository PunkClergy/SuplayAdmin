import React, { useState, useRef } from 'react';
import {
  Checkbox,
  Select,
  Avatar,
  Tag,
  Dropdown,
  Menu,
  message,
  Divider,
  Modal,
  Button,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CustomerLink from '@/components/Common/CustomerLink';
import UpdateForm from './components/UpdateForm';
import { RightOutlined, DownOutlined } from '@ant-design/icons';
import Link from 'umi/link';
import {
  fetchCabinets,
  fetchSeries,
  destroy,
  modifyPredict,
  //  refund
} from './service';

const { Option } = Select;
const linkText = [`/box/`, `/shop/`, `/lottery/`, `/sales/LuckyBag/`];
const linkType = ['盲盒', '直购', '抽选', '福袋'];
const CabinetList = () => {
  const [sorter, setSorter] = useState({});
  const [searchSeriesList, setSearchSeriesList] = useState([]);
  const [expireOnly, setExpireOnly] = useState();
  const [sourceType, setSourceType] = useState();
  const [seriesId, setSeriesId] = useState();
  const [show, setShow] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const actionRef = useRef();
  const hasSelected = selectedRowKeys.length > 0;
  // 销毁
  const removeDestroy = async (params, action) => {
    setShow(true);
    const hide = message.loading('正在销毁');
    try {
      await destroy({
        id: params,
      });
      hide();
      setShow(false);
      action.current.reload();
      return true;
    } catch (error) {
      hide();
      message.error('销毁失败请重试！');
      setShow(false);
      action.current.reload();
      return false;
    }
  };
  // 批量修改时间
  const arrivalGoodTime = async params => {
    console.log(actionRef);
    const hide = message.loading('正在请求');
    try {
      await modifyPredict({
        ids: selectedRowKeys,
        ...params,
      });
      hide();
      setUpdateModalVisible(false);
      actionRef.current.reload();
      return true;
    } catch (error) {
      hide();
      message.error('销毁失败请重试！');
      setUpdateModalVisible(false);
      actionRef.current.reload();
      return false;
    }
  };
  // 批量修改
  const onSelectChange = selectedRowKey => {
    setSelectedRowKeys(selectedRowKey);
  };
  // 获取当前选择的数组值
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  // 批量修改下拉
  const menuBatch = () => (
    <Menu>
      <Menu.Item key="0">
        <a onClick={() => setUpdateModalVisible(true)}>批量修改到货时间</a>
        <UpdateForm
          onSubmit={arrivalGoodTime}
          onCancel={() => setUpdateModalVisible(false)}
          modalVisible={updateModalVisible}
        />
      </Menu.Item>
    </Menu>
  );
  // 销毁下拉
  const menu = (record, action) => (
    <Menu>
      <Menu.Item key="0">
        <a onClick={() => setShow(true)}>销毁</a>
        <Modal
          title="提示"
          visible={show}
          onOk={() => removeDestroy(record.id, action)}
          onCancel={() => setShow(false)}
        >
          <p>确认销毁该条记录？</p>
        </Modal>
      </Menu.Item>
    </Menu>
  );
  // 表格数据
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: true,
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '用户昵称',
      hideInSearch: true,
      dataIndex: 'user',
      align: 'center',
      render: user => <CustomerLink user={user} />,
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '商品图片',
      dataIndex: 'image',
      hideInSearch: true,
      width: 90,
      align: 'center',
      render: image => <img alt="nothing" height={70} src={image} />,
    },
    {
      title: '属性',
      dataIndex: 'rare',
      filters: false,
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
      title: '交换中',
      dataIndex: 'switch',
      filters: false,
      align: 'center',
      valueEnum: {
        true: {
          text: <Tag color="green">是</Tag>,
        },
        false: {
          text: <Tag color="orange">否</Tag>,
        },
      },
    },

    {
      title: '原价',
      dataIndex: 'price',
      hideInSearch: true,
      align: 'center',
      render: price => <span>¥{price / 100}</span>,
    },
    {
      title: '实际花费',
      dataIndex: 'cost',
      hideInSearch: true,
      align: 'center',
      render: cost => <span>¥{cost / 100}</span>,
    },
    {
      title: '来源',
      hideInSearch: true,
      dataIndex: 'id',
      width: 70,
      align: 'center',
      render: (_, record) => (
        <Link to={`${linkText[record.sourceType - 1]}${record.sourceId}/detail`}>
          {linkType[record.sourceType - 1]}
          <RightOutlined />
        </Link>
      ),
    },
    {
      title: '来自交换',
      dataIndex: 'switchId',
      hideInSearch: true,
      align: 'center',
      render: val => (val === '-' ? <Tag color="orange">否</Tag> : <Tag color="green">是</Tag>),
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: false,
      width: 110,
      align: 'center',
      valueEnum: {
        '0': {
          text: '盒柜中',
          status: 'Success',
        },
        '1': {
          text: '已下单',
          status: 'Default',
        },
        '2': {
          text: '预定',
          status: 'Processing',
        },
        '-1': {
          text: '已回收',
          status: 'Default',
        },
        '-2': {
          text: '已销毁',
          status: 'Default',
        },
      },
    },
    {
      title: '购买时间',
      dataIndex: 'createAt',
      valueType: 'dateTime',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '过期时间',
      dataIndex: 'expireAt',
      valueType: 'dateTime',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '到货时间',
      dataIndex: 'predictAt',
      valueType: 'date',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 100,
      align: 'center',
      render: (_, record) => (
        <>
          <Link to={`/cabinet/detail/${record.id}`}>详情</Link>
          <Divider
            type="vertical"
            style={{ display: record.status === 0 || record.status === 2 ? '' : 'none' }}
          />
          <Dropdown overlay={menu(record, actionRef)}>
            <a
              className="ant-dropdown-link"
              onClick={e => e.preventDefault()}
              style={{ display: record.status === 0 || record.status === 2 ? '' : 'none' }}
            >
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
        scroll={{ y: window.innerHeight - window.innerHeight / 3 }}
        rowSelection={rowSelection}
        bordered
        rowKey="id"
        search={{ span: 6 }}
        actionRef={actionRef}
        onChange={(_, _filter, _sorter) => {
          setSorter(`${_sorter.field}_${_sorter.order}`);
        }}
        params={{ expireOnly, sorter, seriesId, sourceType }}
        toolBarRender={() => [
          <Dropdown overlay={menuBatch}>
            <Button
              className="ant-dropdown-link"
              onClick={e => e.preventDefault()}
              style={{ textAlign: 'left', display: hasSelected ? '' : 'none' }}
            >
              批量操作 <DownOutlined />
            </Button>
          </Dropdown>,
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
                <span style={{ marginLeft: 16, verticalAlign: 'middle' }}>{item.name}</span>
              </Option>
            ))}
          </Select>,
          <Select
            style={{ width: 200 }}
            placeholder="请选择来源"
            onChange={val => {
              setSourceType(val);
            }}
          >
            <Option value="1">盲盒</Option>
            <Option value="2">直购</Option>
            <Option value="3">抽选</Option>
            <Option value="4">福袋</Option>
          </Select>,
          <Checkbox onChange={val => setExpireOnly(val.target.checked)}>只显示过期商品</Checkbox>,
        ]}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 40,
          showTotal: total => `总共${total}条记录`,
        }}
        request={async (params = {}) => {
          const response = await fetchCabinets({ ...params });
          return {
            data: response.list,
            current: response.pagination.current,
            page: response.pagination.current,
            total: response.pagination.total,
          };
        }}
        columns={columns}
      />
    </PageHeaderWrapper>
  );
};

export default CabinetList;
