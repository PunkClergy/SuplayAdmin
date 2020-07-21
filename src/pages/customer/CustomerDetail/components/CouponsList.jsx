import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { getCouponss } from '../service';

const WalletLogList = props => {
  const { userId } = props;
  const [sorter, setSorter] = useState({});
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
      dataIndex: 'name',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '类型',
      dataIndex: 'type',
      align: 'center',
      valueEnum: {
        0: {
          text: '代金券',
        },
        1: {
          text: '包邮券',
        },
      },
    },
    {
      title: '图片',
      dataIndex: 'image',
      hideInSearch: true,
      align: 'center',
      render: cover => <img alt="nothing" shape="square" height={70} src={cover} />,
    },
    {
      title: '最低金额',
      hideInSearch: true,
      dataIndex: 'limit',
      align: 'center',
      render: price => `¥${price / 100}`,
    },
    {
      title: '金额减免',
      dataIndex: 'deduct',
      hideInSearch: true,
      align: 'center',
      render: price => `¥${price / 100}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      valueEnum: {
        0: {
          text: '已使用',
          status: 'Default',
        },
        1: {
          text: '未使用',
          status: 'Success',
        },
      },
    },
    {
      title: '描述',
      hideInSearch: true,
      dataIndex: 'description',
      align: 'center',
    },
    {
      title: '到期时间',
      dataIndex: 'expireAt',
      hideInSearch: true,
      align: 'center',
      render: val => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      hideInSearch: true,
      align: 'center',
      render: val => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
  ];

  return (
    <ProTable
      bordered
      rowKey="id"
      actionRef={actionRef}
      onChange={(_, _filter, _sorter) => {
        setSorter(`${_sorter.field}_${_sorter.order}`);
      }}
      search={false}
      params={{
        sorter,
      }}
      toolBarRender={false}
      pagination={{
        showSizeChanger: true,
        defaultPageSize: 20,
        showTotal: total => `总共${total}条记录`,
      }}
      request={async params => {
        const response = await getCouponss({ userId, ...params });
        return {
          data: response.list,
          current: response.pagination.current,
          total: response.pagination.total,
          pageSize: response.pagination.pageSize,
        };
      }}
      columns={columns}
    />
  );
};

export default WalletLogList;
