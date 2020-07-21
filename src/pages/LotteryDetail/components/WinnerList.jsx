import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Typography, Avatar, Popconfirm, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Link from 'umi/link';
import CustomerLink from '@/components/Common/CustomerLink';
import { getWinners, cancelPrize } from '../service';

const { Text } = Typography;
const WinnerList = props => {
  const { lotteryId } = props;
  const [sorter, setSorter] = useState({});
  const actionRef = useRef();
  // 取消中奖资格
  const cancelPrizeFn = async fields => {
    const hide = message.loading('正在取消');
    try {
      await cancelPrize({
        fields,
        lotteryId,
      });
      hide();
      message.success('取消成功');
      actionRef.current.reload();
      return true;
    } catch (error) {
      hide();
      message.error('取消失败请重试！');
      return false;
    }
  };
  const columns = [
    {
      title: '中签用户',
      align: 'center',
      render: (_, record) => <CustomerLink user={record} />,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      align: 'center',
      render: val => <Avatar alt="nothing" shape="square" size={50} src={val} />,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      align: 'center',
    },
    {
      title: '签号',
      dataIndex: 'code',
      align: 'center',
    },
    {
      title: '资格',
      dataIndex: 'qualify',
      align: 'center',
      render: qualify => (qualify ? <Text>有</Text> : <Text type="danger">无</Text>),
    },
    {
      title: '奖品',
      dataIndex: 'productName',
      align: 'center',
    },
    {
      title: '订单ID',
      dataIndex: ['order', 'id'],
      align: 'center',
      render: val => <Link to={`/order/${val}/detail`}>{val}</Link>,
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
      },
    },
    {
      title: '操作',
      align: 'center',
      render: (_, record) => (
        <>
          <Popconfirm
            title="确认取消该资格?"
            icon={<ExclamationCircleOutlined />}
            onConfirm={() => cancelPrizeFn(record.id)}
          >
            <a disabled={!record.qualify}>取消资格</a>
          </Popconfirm>
        </>
      ),
    },
  ];
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
        const response = await getWinners({ id: lotteryId, ...params });
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

export default WinnerList;
