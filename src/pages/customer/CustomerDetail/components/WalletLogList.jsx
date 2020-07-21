import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { getWalletLogs } from '../service';

const WalletLogList = props => {
  const { userId } = props;
  const [sorter, setSorter] = useState({});
  const actionRef = useRef();

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '类型',
      dataIndex: 'action',
      align: 'center',
      valueEnum: {
        order: {
          text: '支付订单',
          status: 'Success',
        },
        prepay: {
          text: '保证金',
          status: 'Warning',
        },
        withdraw: {
          text: '提现',
          status: 'Default',
        },
      },
    },
    {
      title: '金额',
      dataIndex: 'amount',
      align: 'center',
      render: amount => <span>¥{amount / 100}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      valueEnum: {
        '0': {
          text: '待入账',
          status: 'Default',
        },
        '1': {
          text: '已入账',
          status: 'Success',
        },
        '-1': {
          text: '已取消',
          status: 'Warning',
        },
      },
    },
    {
      title: '描述',
      dataIndex: 'sourceName',
      align: 'center',
    },
    {
      title: '订单ID',
      dataIndex: ['order', 'id'],
      align: 'center',
    },
    {
      title: '订单状态',
      dataIndex: ['order', 'status'],
      align: 'center',
      valueEnum: {
        '0': {
          text: '需要确认/支付',
          status: 'Warning',
        },
        '1': {
          text: '等待发货',
          status: 'Success',
        },
        '2': {
          text: '已发货',
          status: 'Success',
        },
        '3': {
          text: '已完成',
          status: 'Default',
        },
        '-1': {
          text: '订单关闭/取消',
          status: 'Default',
        },
        '-2': {
          text: '订单过期',
          status: 'Default',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      valueType: 'dateTime',
      hideInSearch: true,
      align: 'center',
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
        const response = await getWalletLogs({ userId, ...params });
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
