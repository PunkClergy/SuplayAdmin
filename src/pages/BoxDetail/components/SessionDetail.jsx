import React, { useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Tag } from 'antd';
import CustomerLink from '@/components/Common/CustomerLink';
import { getSessionDetail } from '../service';

const columns = [
  {
    title: '编号',
    dataIndex: 'no',
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
    title: '状态',
    dataIndex: 'soldAt',
    align: 'center',
    render: val => (val !== '-' ? <Tag color="green"> 已售</Tag> : <Tag color="orange">待售</Tag>),
  },
  {
    title: '购买人',
    dataIndex: 'user',
    align: 'center',
    render: user => <CustomerLink user={user} />,
  },
  {
    title: '购买时间',
    dataIndex: 'soldAt',
    valueType: 'dateTime',
    align: 'center',
  },
];

const SessionDetail = props => {
  const { sessionId } = props;
  const actionRef = useRef();
  return (
    <ProTable
      bordered
      actionRef={actionRef}
      rowKey={row => row.id}
      size="small"
      search={false}
      pagination={false}
      request={async () => {
        const response = await getSessionDetail({ id: sessionId });
        return {
          data: response.items,
          success: true,
        };
      }}
      columns={columns}
      toolBarRender={false}
    />
  );
};

export default SessionDetail;
