import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { WomanOutlined, ManOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import Link from 'umi/link';
import { fetchUsers } from './service';

const genderTags = [
  <></>,
  <ManOutlined style={{ color: '#1890ff' }} />,
  <WomanOutlined style={{ color: '#eb2f96' }} />,
];

const CustomerList = () => {
  const [sorter, setSorter] = useState({});
  const actionRef = useRef();

  const columns = [
    {
      title: 'UUID',
      dataIndex: 'uuid',
      copyable: true,
      align: 'center',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      align: 'center',
      width: 100,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      hideInSearch: true,
      align: 'center',
      render: avatar => <img alt="nothing" width="50" src={avatar} />,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      hideInSearch: true,
      align: 'center',
      render: gender => genderTags[gender],
    },
    {
      title: '幸运值',
      dataIndex: 'points',
      hideInSearch: true,
      sorter: true,
      align: 'center',
    },
    {
      title: '总消费金额',
      dataIndex: 'goldTotal',
      hideInSearch: true,
      sorter: true,
      align: 'center',
      render: goldTotal => <span>¥{goldTotal / 100}</span>,
    },
    {
      title: '联系方式',
      dataIndex: 'mobile',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      valueType: 'dateTime',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '上次登录',
      dataIndex: 'loginAt',
      valueType: 'dateTime',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '操作',
      width: 150,
      align: 'center',
      render: (_, record) => <Link to={`/customer/${record.id}/detail`}>查看</Link>,
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable
        scroll={{ y: window.innerHeight - window.innerHeight / 3 }}
        bordered
        rowKey="id"
        actionRef={actionRef}
        onChange={(_, _filter, _sorter) => {
          setSorter(`${_sorter.field}_${_sorter.order}`);
        }}
        search={{ span: 6 }}
        params={{ sorter }}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 40,
          showTotal: total => `总共${total}条记录`,
        }}
        request={async params => {
          const response = await fetchUsers({ ...params });
          return {
            data: response.list,
            current: response.pagination.current,
            total: response.pagination.total,
            pageSize: response.pagination.pageSize,
          };
        }}
        columns={columns}
      />
    </PageHeaderWrapper>
  );
};

export default CustomerList;
