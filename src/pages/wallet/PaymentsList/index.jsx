import React, { useState, useRef } from 'react';
import { Avatar, DatePicker, message, Popconfirm, Popover, Divider } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import Link from 'umi/link';
import CustomerLink from '@/components/Common/CustomerLink';
import { fetchPayment, addPaymentRefund } from './service';

const { RangePicker } = DatePicker;

// 退款
const handleRefund = async fields => {
  const params = {
    id: fields,
  };
  const hide = message.loading('正在退款');
  try {
    await addPaymentRefund({
      ...params,
    });
    hide();
    message.success('退款成功');
    return true;
  } catch (error) {
    hide();
    message.error('退款失败请重试！');
    return false;
  }
};
// 数据渲染
const PaymentList = () => {
  const [sorter, setSorter] = useState({});
  const actionRef = useRef();
  const columns = [
    {
      title: '订单编号',
      dataIndex: 'outTradeNo',
      align: 'center',
    },
    {
      title: '用户昵称',
      hideInSearch: true,
      dataIndex: 'user',
      align: 'center',
      render: user => <CustomerLink user={user} />,
    },
    {
      title: '头像',
      dataIndex: ['user', 'avatar'],
      hideInSearch: true,
      width: 70,
      align: 'center',
      render: avatar => <Avatar alt="nothing" shape="square" size={60} src={avatar} />,
    },
    {
      title: '类型',
      dataIndex: 'feeType',
      filters: false,
      align: 'center',
      valueEnum: {
        1: {
          text: '定金参与',
        },
        2: {
          text: '支付订单',
        },
        3: {
          text: '购买盲盒',
        },

        4: {
          text: '直购商品',
        },
        5: {
          text: '盒柜发货',
        },
        6: {
          text: '购买福袋',
        },
        7: {
          text: '盲盒端盒',
        },
      },
    },
    {
      title: '实付金额',
      dataIndex: 'fee',
      hideInSearch: true,
      align: 'center',
      render: fee => <span>¥{fee / 100}</span>,
    },
    {
      title: '减免金额',
      dataIndex: 'deduct',
      hideInSearch: true,
      align: 'center',
      render: deduct =>
        deduct !== '-' ? <span style={{ color: 'red' }}>¥{deduct / 100}</span> : '-',
    },
    {
      title: '数据',
      hideInSearch: true,
      textWrap: 'word-break',
      ellipsis: true,
      dataIndex: 'description',
      width: 175,
    },

    {
      title: '状态',
      dataIndex: 'status',
      filters: false,
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
          status: 'Warning',
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
                  {record.refundAt ? moment(record.refundAt).format('YYYY-MM-DD HH:SS:MM') : ''}
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
      align: 'center',
      renderFormItem: () => <RangePicker />,
    },
    {
      title: '操作',
      hideInSearch: true,
      dataIndex: 'id',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <>
          <Link
            to={`/order/${record.orderId}/detail`}
            style={{ display: record.orderId ? '' : 'none' }}
          >
            查看订单
          </Link>
          <Divider type="vertical" style={{ display: record.orderId ? '' : 'none' }} />
          <Popconfirm
            title="确认退款给用户?"
            placement="topLeft"
            onConfirm={async () => {
              const success = await handleRefund(record.id);
              if (success) {
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
          >
            <a disabled={record.status !== 1}>退款</a>
          </Popconfirm>
        </>
      ),
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
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 20,
        }}
        request={async (params = {}) => {
          const dateRange = params.createAt
            ? {
                start: moment(params.createAt[0]).format('YYYYMMDD'),
                end: moment(params.createAt[0]).format('YYYYMMDD'),
              }
            : {};
          const response = await fetchPayment({
            ...params,
            ...dateRange,
          });
          return {
            data: response.list,
            page: response.pagination.current,
            total: response.pagination.total,
          };
        }}
        columns={columns}
      />
    </PageHeaderWrapper>
  );
};

export default PaymentList;
