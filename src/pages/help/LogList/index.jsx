import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ReactJson from 'react-json-view';
import CustomerLink from '@/components/Common/CustomerLink';
import { fetchLogs } from './service';

const SwitchList = () => {
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
      title: '操作人',
      dataIndex: 'user',
      hideInSearch: true,
      align: 'center',
      render: user => <CustomerLink user={user} />,
    },
    {
      title: '请求方式',
      dataIndex: 'method',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '返回码',
      dataIndex: 'status',
      align: 'center',
      valueEnum: {
        200: {
          text: '200',
          status: 'Success',
        },
        500: {
          text: '500',
          status: 'Error',
        },
      },
    },
    {
      title: '路径',
      dataIndex: 'path',
      align: 'center',
    },
    {
      title: '请求内容',
      dataIndex: 'body',
      width: 350,
      hideInSearch: true,
      render: val => (val === '-' ? null : <ReactJson src={val} collapsed />),
    },
    {
      title: '操作时间',
      dataIndex: 'time',
      hideInSearch: true,
      align: 'center',
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable
        scroll={{ y: window.innerHeight - window.innerHeight / 3 }}
        search={{ span: 6 }}
        bordered
        rowKey="id"
        actionRef={actionRef}
        onChange={(_, _filter, _sorter) => {
          setSorter(`${_sorter.field}_${_sorter.order}`);
        }}
        params={{ sorter }}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 40,
          showTotal: total => `总共${total}条记录`,
        }}
        request={async (params = {}) => {
          const response = await fetchLogs({ ...params, page: params.current });
          return {
            data: response.list,
            current: response.pagination.current,
            pageSize: response.pagination.pageSize,
            total: response.pagination.total,
          };
        }}
        columns={columns}
      />
    </PageHeaderWrapper>
  );
};

export default SwitchList;
