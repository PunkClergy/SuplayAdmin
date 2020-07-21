import React, { useState, useRef } from 'react';
import moment from 'moment';
import ProTable from '@ant-design/pro-table';
import { Popover } from 'antd';
import { getPayments } from '../service';

const PaymentList = props => {
  const { userId } = props;
  const [sorter, setSorter] = useState({});
  const actionRef = useRef();

  const columns = [
    {
      title: '微信账单编号',
      dataIndex: 'outTradeNo',
      copyable: true,
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '类型',
      dataIndex: 'body',
      align: 'center',
      valueEnum: {
        支付订单: {
          text: '支付订单',
        },
        购买盲盒: {
          text: '购买盲盒',
        },
        支付邮费: {
          text: '支付邮费',
        },
        定金抽选: {
          text: '定金抽选',
        },
      },
    },
    {
      title: '金额',
      dataIndex: 'fee',
      hideInSearch: true,
      align: 'center',
      render: fee => <span>¥{fee / 100}</span>,
    },
    {
      title: '数据',
      hideInSearch: true,
      textWrap: 'word-break',
      ellipsis: true,
      width: 175,
      dataIndex: 'description',
    },
    {
      title: '状态',
      dataIndex: 'status',
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
      title: '退款详情',
      hideInSearch: true,
      align: 'center',
      render: (_, record) =>
        record.refundAt ? (
          <Popover
            content={
              <>
                <div>
                  操作人：
                  {record.refundBy ? record.refundBy.nickname : '系统自动退款'}
                </div>
                <div>
                  退款时间：
                  {record.refundAt
                    ? moment(record.refundAt * 1000).format('YYYY-MM-DD HH:SS:MM')
                    : ''}
                </div>
                <div>
                  退款原因：
                  {record.refundReason ? record.refundReason : ''}
                </div>
                <div>
                  退款失败信息：
                  {record.refundError ? record.refundError : ''}
                </div>
              </>
            }
          >
            <a>退款详情</a>
          </Popover>
        ) : (
          <></>
        ),
    },
    {
      title: '时间',
      dataIndex: 'createAt',
      valueType: 'dateTime',
      hideInSearch: true,
      align: 'center',
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
        const response = await getPayments({ userId, ...params, page: params.current });
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

export default PaymentList;
