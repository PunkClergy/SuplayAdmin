import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Typography } from 'antd';
import ProTable from '@ant-design/pro-table';
import Link from 'umi/link';
import CustomerLink from '@/components/Common/CustomerLink';
import UsersSearch from '@/components/Common/UsersSearch';
import { fetchSwitches } from './service';

const { Text } = Typography;

const SwitchList = () => {
  const [sorter, setSorter] = useState({});
  const [userId, setUserId] = useState();
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
      title: '发起方',
      children: [
        {
          title: '头像',
          dataIndex: ['from', 'avatar'],
          valueType: 'avatar',
          align: 'center',
        },
        {
          title: '昵称',
          dataIndex: 'from',
          align: 'center',
          render: user => <CustomerLink user={user} />,
        },
        {
          title: '产品名称',
          dataIndex: 'fromCabinets',
          width: 240,
          align: 'center',
          render: cabinetNames => (
            <>
              {cabinetNames.map(name => (
                <Text code>{name}</Text>
              ))}
            </>
          ),
        },
      ],
    },
    {
      title: '接受方',
      children: [
        {
          title: '头像',
          dataIndex: ['to', 'avatar'],
          valueType: 'avatar',
          align: 'center',
        },
        {
          title: '昵称',
          dataIndex: 'to',
          align: 'center',
          render: user => <CustomerLink user={user} />,
        },
        {
          title: '产品名称',
          dataIndex: 'toCabinets',
          width: 240,
          align: 'center',
          render: cabinetNames => (
            <>
              {cabinetNames.map(name => (
                <Text code>{name}</Text>
              ))}
            </>
          ),
        },
      ],
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: false,
      align: 'center',
      width: 100,
      valueEnum: {
        '0': {
          text: '等待',
          status: 'Warning',
        },
        '1': {
          text: '接受',
          status: 'Success',
        },
        '2': {
          text: '拒绝',
          status: 'Error',
        },
        '-1': {
          text: '取消',
          status: 'Default',
        },
      },
    },
    {
      title: '说明',
      dataIndex: 'content',
      hideInSearch: true,
      align: 'center',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      valueType: 'dateTime',
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
          <Link to={`/cabinet/switchesDetail/${record.id}`}>详情</Link>
        </>
      ),
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
        params={{ sorter, userId }}
        toolBarRender={() => [
          <UsersSearch
            value={undefined}
            onChange={val => {
              if (actionRef.current) {
                actionRef.current.reset();
                setUserId(val);
              }
            }}
          />,
        ]}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 40,
          showTotal: total => `总共${total}条记录`,
        }}
        request={async (params = {}) => {
          const response = await fetchSwitches({ ...params, page: params.current });
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
