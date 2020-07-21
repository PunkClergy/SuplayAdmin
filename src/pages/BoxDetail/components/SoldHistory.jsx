import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Avatar, Tag } from 'antd';
import CustomerLink from '@/components/Common/CustomerLink';
import { getHistory } from '../service';

const columns = [
  {
    title: '场次ID',
    dataIndex: 'sessionId',
    align: 'center',
  },
  {
    title: '图片',
    dataIndex: 'image',
    align: 'center',
    render: val => <img alt="nothing" height={60} src={val} />,
  },
  {
    title: '产品名称',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '属性',
    dataIndex: 'rare',
    align: 'center',
    sorter: true,
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
    title: '购买人',
    dataIndex: 'user',
    align: 'center',
    render: user => <CustomerLink user={user} />,
  },
  {
    title: '头像',
    dataIndex: ['user', 'avatar'],
    align: 'center',
    render: val => <Avatar alt="nothing" shape="square" size={50} src={val} />,
  },
  {
    title: '购买时间',
    dataIndex: 'soldAt',
    valueType: 'dateTime',
    align: 'center',
    sorter: true,
  },
];

const SoldHistory = props => {
  const { boxId } = props;
  const [sorter, setSorter] = useState({});
  const actionRef = useRef();

  return (
    <ProTable
      bordered
      actionRef={actionRef}
      rowKey={row => row.id}
      size="small"
      search={false}
      onChange={(_, _filter, _sorter) => {
        setSorter(`${_sorter.field}_${_sorter.order}`);
      }}
      params={{
        sorter,
      }}
      pagination={{
        showSizeChanger: true,
        defaultPageSize: 20,
        showTotal: total => `总共${total}条记录`,
      }}
      request={async params => {
        const response = await getHistory({
          id: boxId,
          ...params,
        });
        return {
          data: response.list,
          current: response.pagination.current,
          total: response.pagination.total,
          pageSize: response.pagination.pageSize,
        };
      }}
      columns={columns}
      toolBarRender={false}
    />
  );
};

export default SoldHistory;
