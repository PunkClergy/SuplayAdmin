import React, { useState, useRef } from 'react';
import { Tag, DatePicker, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { fetchPayment } from '../service';

const rareTags = [
  <Tag>定金抽选</Tag>,
  <Tag color="blue">支付订单</Tag>,
  <Tag color="orange">购买盲盒</Tag>,
  <Tag color="volcano">购买直购</Tag>,
  <Tag color="cyan">盒柜发货</Tag>,
];
const { RangePicker } = DatePicker;
// 数据渲染
const ShipList = props => {
  const { onSubmit: handleUpdate } = props;
  const [sorter, setSorter] = useState({});
  const [time, setTime] = useState();
  const [orderShipAt, setOrderShipAt] = useState();
  const okHandle = async e => {
    handleUpdate(e, time, orderShipAt);
  };
  const actionRef = useRef();

  const columns = [
    {
      title: '订单编号',
      textWrap: 'word-break',
      ellipsis: true,
      dataIndex: 'outTradeNo',
      hideInSearch: true,
      align: 'center',
      width: 75,
    },
    {
      title: '用户ID',
      hideInSearch: true,
      align: 'center',
      dataIndex: ['user', 'id'],
    },
    {
      title: '交易金额',
      dataIndex: 'fee',
      hideInSearch: true,
      align: 'center',
      render: price => `¥ ${price / 100}`,
    },
    {
      title: '业务类型',
      hideInSearch: true,
      dataIndex: 'feeType',
      align: 'center',
      render: rare => rareTags[rare - 1],
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '采购类型',
      dataIndex: 'purchaseType',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '付款状态',
      dataIndex: 'status',
      hideInSearch: true,
      align: 'center',
      valueEnum: {
        0: {
          text: '未付款',
          status: 'Default',
        },
        1: {
          text: '已付款',
          status: 'Success',
        },
        2: {
          text: '已退款',
          status: 'Error',
        },
      },
    },
    {
      title: '支付平台',
      hideInSearch: true,
      align: 'center',
      render: () => <Tag color="#87d068">小程序</Tag>,
    },
    {
      title: '交易时间',
      dataIndex: 'time',
      valueType: 'dateTime',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '支付方式',
      hideInSearch: true,
      align: 'center',
      render: () => <Tag color="#87d068">微信支付</Tag>,
    },
    {
      title: '支付单号',
      hideInSearch: true,
      ellipsis: true,
      dataIndex: 'transactionId',
      align: 'center',
      width: 75,
    },
    {
      title: '订单状态',
      dataIndex: 'orderId',
      hideInSearch: true,
      align: 'center',
      render: status => (status ? '已下单' : '未下单'),
    },
    {
      title: '订单创建时间',
      dataIndex: 'orderCreateAt',
      valueType: 'dateTime',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '发货状态',
      dataIndex: 'orderStatus',
      hideInSearch: true,
      align: 'center',
      valueEnum: {
        '0': {
          text: '需要确认/支付',
          status: 'Default',
        },
        '1': {
          text: '等待发货',
          status: 'Success',
        },
        '2': {
          text: '已发货',
          status: 'Error',
        },
        '3': {
          text: '已完成',
          status: 'Error',
        },
        '-2': {
          text: '订单过期',
          status: 'Error',
        },
        '-1': {
          text: '订单关闭/取消',
          status: 'Error',
        },
      },
    },
    {
      title: '发货时间',
      dataIndex: 'orderShipAt',
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
        search={false}
        rowKey="id"
        actionRef={actionRef}
        onChange={(_, _filter, _sorter) => {
          setSorter(`${_sorter.field}_${_sorter.order}`);
        }}
        params={{
          sorter,
          orderShipAt,
          time,
        }}
        toolBarRender={() => [
          <span>
            <span>交易时间： </span>
            <RangePicker
              onChange={(_, dateString) => {
                if (actionRef.current) {
                  actionRef.current.reset();
                  const assignment = dateString[0]
                    ? setTime(
                        `${dateString[0].split('-').join('')}-${dateString[1].split('-').join('')}`,
                      )
                    : setTime();
                  return assignment;
                }
                return null;
              }}
            />
          </span>,
          <span>
            <span>发货时间： </span>
            <RangePicker
              onChange={(_, dateString) => {
                if (actionRef.current) {
                  actionRef.current.reset();
                  const assignment = dateString[0]
                    ? setOrderShipAt(
                        `${dateString[0].split('-').join('')}-${dateString[1].split('-').join('')}`,
                      )
                    : setOrderShipAt();
                  return assignment;
                }
                return null;
              }}
            />
          </span>,
          <span>
            <Button onClick={okHandle} type="primary">
              导出
            </Button>
          </span>,
        ]}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 24,
        }}
        request={async (params = {}) => {
          const response = await fetchPayment({ ...params });
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

export default ShipList;
