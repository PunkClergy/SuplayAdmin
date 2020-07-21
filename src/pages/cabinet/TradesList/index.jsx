import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CustomerLink from '@/components/Common/CustomerLink';
import { fetchTrades } from './service';

const TradesList = () => {
  const [sorter, setSorter] = useState({});
  const actionRef = useRef();
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
      title: '盒柜ID',
      dataIndex: 'cabinetId',
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
    // {
    //   title: '商品名称',
    //   dataIndex: 'name',
    //   align: 'center',
    // },
    {
      title: '商品图片',
      dataIndex: 'image',
      hideInSearch: true,
      width: 90,
      align: 'center',
      render: image => <img alt="nothing" height={70} src={image} />,
    },
    {
      title: '价格',
      dataIndex: 'price',
      hideInSearch: true,
      align: 'center',
      render: price => <span>¥{price / 100}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: false,
      width: 110,
      align: 'center',
      valueEnum: {
        '0': {
          text: '关闭',
          status: 'Error',
        },
        '1': {
          text: '进行',
          status: 'Success',
        },
        '2': {
          text: '完成',
          status: 'Default',
        },
      },
    },
    {
      title: '备注',
      dataIndex: 'content',
      hideInSearch: true,
      align: 'center',
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
        params={{ sorter }}
        toolBarRender={() => []}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 40,
          showTotal: total => `总共${total}条记录`,
        }}
        request={async (params = {}) => {
          const response = await fetchTrades({ ...params });
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

export default TradesList;
