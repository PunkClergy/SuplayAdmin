import React, { useRef } from 'react';
import { Tag } from 'antd';
import moment from 'moment';
import ProTable from '@ant-design/pro-table';

const SessionDetail = props => {
  const { sessionInfo } = props;
  const columns = [
    {
      title: '商品ID',
      dataIndex: 'productId',
      align: 'center',
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      align: 'center',
    },
    {
      title: '图片',
      dataIndex: 'productImage',
      align: 'center',
      render: val => <img alt="nothing" height={60} src={val} />,
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
      title: '类型',
      dataIndex: 'status',
      hideInSearch: true,
      align: 'center',
      render: status => (
        <Tag color={status === 1 ? 'blue' : 'green'} key={status}>
          {status === 1 ? '预定' : '现货'}
        </Tag>
      ),
    },
    {
      title: '预计到货时间',
      dataIndex: 'predictAt',
      align: 'center',
      render: val => (val !== '-' ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
  ];
  const actionRef = useRef();
  return (
    <ProTable
      toolBarRender={false}
      search={false}
      options={false}
      bordered
      actionRef={actionRef}
      rowKey={row => row.productId}
      size="small"
      pagination={false}
      columns={columns}
      dataSource={sessionInfo}
    />
  );
};

export default SessionDetail;
