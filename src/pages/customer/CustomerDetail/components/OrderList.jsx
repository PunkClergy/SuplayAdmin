import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import Link from 'umi/link';
import CustomerLink from '@/components/Common/CustomerLink';
import { getOrders } from '../service';

const OrderList = props => {
  const { userId } = props;
  const [sorter, setSorter] = useState({});
  const actionRef = useRef();

  const columns = [
    {
      title: '订单ID',
      align: 'center',
      dataIndex: 'id',
    },
    {
      title: '用户昵称',
      hideInSearch: true,
      dataIndex: 'buyer',
      align: 'center',
      render: buyer => <CustomerLink user={buyer} />,
    },
    {
      title: '收货人',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '电话',
      align: 'center',
      dataIndex: 'phone',
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      align: 'center',
      valueEnum: {
        '-1': {
          text: '订单关闭',
          status: 'Default',
        },
        '0': {
          text: '等待确认',
          status: 'Default',
        },
        '1': {
          text: '等待发货',
          status: 'Warning',
        },
        '2': {
          text: '已发货',
          status: 'Processing',
        },
        '3': {
          text: '已完成',
          status: 'Success',
        },
      },
    },
    {
      title: '物流单号',
      dataIndex: 'expressNo',
      align: 'center',
      render: express =>
        express ? (
          <a
            href={`https://m.kuaidi100.com/result.jsp?nu=${express}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {express}
          </a>
        ) : (
          <></>
        ),
    },
    {
      title: '操作',
      hideInSearch: true,
      dataIndex: 'id',
      width: 100,
      align: 'center',
      render: id => <Link to={`/order/${id}/detail`}>查看</Link>,
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
      pagination={{
        showSizeChanger: true,
        defaultPageSize: 20,
        showTotal: total => `总共${total}条记录`,
      }}
      toolBarRender={false}
      request={async params => {
        const response = await getOrders({ userId, ...params, page: params.current });
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

export default OrderList;
