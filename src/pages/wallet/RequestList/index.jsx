import React, { useState, useRef } from 'react';
import { message, Divider, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CustomerLink from '@/components/Common/CustomerLink';
import AgreedStockForm from './components/AgreedStockForm';
import RefusedStockForm from './components/RefusedStockForm';
import ViewForm from './components/ViewForm';
import CreateForm from './components/CreateForm';
import { fetchRequests, updateRequests, createWithdrawRequest } from './service';

// 通过和拒绝审核
const handleAddAgreedStock = async fields => {
  const hide = message.loading('正在操作');
  try {
    await updateRequests({
      ...fields,
    });
    hide();
    message.success('操作成功');
    return true;
  } catch (error) {
    hide();
    message.error('操作失败请重试！');
    return false;
  }
};

// 录入
const handleCreate = async fields => {
  const hide = message.loading('正在保存');
  try {
    await createWithdrawRequest({
      ...fields,
    });
    hide();
    // message.success('保存成功');
    return true;
  } catch (error) {
    hide();
    message.error('保存失败请重试！');
    return false;
  }
};
// 数据渲染
const PaymentList = () => {
  const [sorter, setSorter] = useState({});
  const [editProduct, setEditProduct] = useState({});
  const [createModalVisible, handleModalVisible] = useState(false);
  const [agreedStockModalVisible, handleAgreedStockModalVisible] = useState(false);
  const [refusedStockModalVisible, handleRefusedStockModalVisible] = useState(false);
  const [viewModalVisible, handleViewModalVisible] = useState(false);

  const actionRef = useRef();
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '发起人',
      hideInSearch: true,
      dataIndex: 'user',
      align: 'center',
      render: user => <CustomerLink user={user} />,
    },
    {
      title: '支付宝账号',
      hideInSearch: true,
      dataIndex: 'account',
      align: 'center',
    },
    {
      title: '姓名',
      hideInSearch: true,
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '提现金额',
      dataIndex: 'amount',
      hideInSearch: true,
      align: 'center',
      render: amount => <span>¥{amount / 100}</span>,
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      align: 'center',
      valueEnum: {
        '0': {
          text: '未审核',
          status: 'Warning',
        },
        '1': {
          text: '已通过',
          status: 'Success',
        },
        '-1': {
          text: '已拒绝',
          status: 'Error',
        },
      },
    },
    {
      title: '发起时间',
      dataIndex: 'createAt',
      valueType: 'dateTime',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '操作人昵称',
      dataIndex: ['auditId', 'nickname'],
      hideInSearch: true,
    },
    {
      title: '操作时间',
      dataIndex: 'auditAt',
      valueType: 'dateTime',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '操作',
      hideInSearch: true,
      align: 'center',
      render: (_, record) => (
        <>
          <a
            disabled={record.status !== 0}
            onClick={() => {
              handleAgreedStockModalVisible(true);
              setEditProduct(record, 1);
            }}
          >
            通过
          </a>
          <Divider type="vertical" />
          <a
            disabled={record.status !== 0}
            onClick={() => {
              handleRefusedStockModalVisible(true);
              setEditProduct(record);
            }}
          >
            拒绝
          </a>
          <Divider type="vertical" />
          <a
            disabled={record.status === 0}
            onClick={() => {
              handleViewModalVisible(true);
              setEditProduct(record);
            }}
          >
            查看
          </a>
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
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            录入
          </Button>,
        ]}
        params={{
          sorter,
        }}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 20,
        }}
        request={async (params = {}) => {
          const response = await fetchRequests({
            ...params,
            page: params.current,
          });

          return {
            data: response.list,
            page: response.pagination.current,
            total: response.pagination.total,
          };
        }}
        columns={columns}
      />
      {/* 通过 */}
      <AgreedStockForm
        product={editProduct}
        onSubmit={async value => {
          handleAgreedStockModalVisible(false);
          const success = await handleAddAgreedStock(value);
          if (success) {
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleAgreedStockModalVisible(false)}
        modalVisible={agreedStockModalVisible}
      />
      {/* 拒绝 */}
      <RefusedStockForm
        product={editProduct}
        onSubmit={async value => {
          handleRefusedStockModalVisible(false);
          const success = await handleAddAgreedStock(value);
          if (success) {
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleRefusedStockModalVisible(false)}
        modalVisible={refusedStockModalVisible}
      />
      {/* 查看 */}
      <ViewForm
        product={editProduct}
        onSubmit={() => {
          handleViewModalVisible(false);
        }}
        onCancel={() => handleViewModalVisible(false)}
        modalVisible={viewModalVisible}
      />
      <CreateForm
        onSubmit={async value => {
          const success = await handleCreate(value);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      />
    </PageHeaderWrapper>
  );
};

export default PaymentList;
