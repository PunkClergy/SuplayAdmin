import React, { useState, useRef } from 'react';
import Link from 'umi/link';
import { PlusOutlined, DownOutlined } from '@ant-design/icons';
import { Button, message, Tag, Dropdown, Menu, Divider } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import { fetchBoxes, updateBox, blindboxStatus } from './service';

const handleAdd = async fields => {
  const hide = message.loading('正在添加');
  try {
    await updateBox({
      ...fields,
    });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

// 上架下架
const handleShopStatus = async (fields, val, actionRef) => {
  const hide = message.loading('正在操作');
  try {
    await blindboxStatus({
      id: fields.id,
      status: val,
    });
    hide();
    message.success('操作成功');
    actionRef.current.reload();
    return true;
  } catch (error) {
    hide();
    message.error('操作失败请重试！');
    return false;
  }
};

const BoxList = () => {
  const [sorter, setSorter] = useState({});
  const [createModalVisible, handleModalVisible] = useState(false);
  const menu = (record, actionRef) => (
    <Menu>
      <Menu.Item key="0">
        {record.status === 1 ? (
          <a
            onClick={() => {
              handleShopStatus(record, 0, actionRef);
            }}
          >
            下架
          </a>
        ) : (
          <a
            onClick={() => {
              handleShopStatus(record, 1, actionRef);
            }}
          >
            上架
          </a>
        )}
      </Menu.Item>
    </Menu>
  );
  const actionRef = useRef();
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: true,
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '名称',
      width: 150,
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: '封面',
      dataIndex: 'cover',
      hideInSearch: true,
      width: 90,
      align: 'center',
      render: cover => <img alt="nothing" shape="square" height={70} src={cover} />,
    },
    {
      title: '价格',
      dataIndex: 'price',
      hideInSearch: true,
      align: 'center',
      render: price => `¥${price / 100}`,
    },
    {
      title: '类型',
      dataIndex: 'reserve',
      filters: false,
      align: 'center',
      valueEnum: {
        true: {
          text: <Tag color="geekblue">预售</Tag>,
        },
        false: {
          text: <Tag color="green">现货</Tag>,
        },
      },
    },
    {
      title: '标签',
      hideInSearch: true,
      dataIndex: 'attribute',
      filters: false,
      align: 'center',
      valueEnum: {
        新品: {
          text: <Tag color="cyan">新品</Tag>,
        },
        限量: {
          text: <Tag color="magenta">限量</Tag>,
        },
        人气: {
          text: <Tag color="red">人气</Tag>,
        },
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: false,
      align: 'center',
      valueEnum: {
        0: {
          text: '已下架',
          status: 'Error',
        },
        1: {
          text: '上架中',
          status: 'Success',
        },
      },
    },
    {
      title: '优惠券',
      dataIndex: 'allowCoupon',
      filters: false,
      align: 'center',
      valueEnum: {
        true: {
          text: '可用',
          status: 'Success',
        },
        false: {
          text: '禁用',
          status: 'Error',
        },
      },
    },
    {
      title: '开售时间',
      dataIndex: 'openAt',
      valueType: 'dateTime',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '上架时间',
      dataIndex: 'startAt',
      valueType: 'dateTime',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '权重',
      dataIndex: 'sort',
      hideInSearch: true,
      sorter: true,
      align: 'center',
    },
    {
      title: '预约人数',
      dataIndex: 'reserves',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '显示',
      dataIndex: 'display',
      hideInSearch: true,
      align: 'center',
      valueEnum: {
        true: {
          text: '显示',
          status: 'Success',
        },
        false: {
          text: '隐藏',
          status: 'Error',
        },
      },
    },
    {
      title: '操作',
      hideInSearch: true,
      dataIndex: 'id',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <>
          <Link to={`/box/${record.id}/detail`}>详情</Link>
          <Divider type="vertical" />
          <Dropdown overlay={menu(record, actionRef)}>
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
        scroll={{ y: window.innerHeight - window.innerHeight / 3 }}
        bordered
        rowKey="id"
        search={{ span: 6 }}
        actionRef={actionRef}
        onChange={(_, _filter, _sorter) => {
          setSorter(`${_sorter.field}_${_sorter.order}`);
        }}
        params={{
          sorter,
        }}
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 20,
        }}
        request={async (params = {}) => {
          const response = await fetchBoxes({ ...params });
          return {
            data: response.list,
            current: response.pagination.current,
            pageSize: response.pagination.pageSize,
            total: response.pagination.total,
          };
        }}
        columns={columns}
      />
      <CreateForm
        onSubmit={async value => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      />
    </PageHeaderWrapper>
  );
};

export default BoxList;
