import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Popconfirm, Tag, Divider, Button, Checkbox, message } from 'antd';
import {
  ExclamationCircleOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import SessionDetail from './SessionDetail';
import AddProductForm from './AddProductForm';
import CreateSessionForm from './CreateSessionForm';
import CustomerLink from '@/components/Common/CustomerLink';
import {
  fetchSessions,
  closeSession,
  recallSession,
  addProduct,
  createSession,
  removeBoxProduct,
} from '../service';

const SoldHistory = props => {
  const { luckBagId } = props;
  const [sorter, setSorter] = useState({});
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);
  const [createSessionModalVisible, setCreateSessionModalVisible] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [available, setAvailable] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const actionRef = useRef();

  const closeSessionRequest = async (session, displayStatus) => {
    const hide = message.loading('正在操作');
    try {
      await closeSession({
        id: session,
        available: displayStatus,
      });
      hide();
      message.success('操作成功');
      actionRef.current.reload();
      return true;
    } catch (error) {
      hide();
      message.error('操作失败请重试！');
      return false;
    }
  };

  const recallSessionRequest = async session => {
    const hide = message.loading('正在取消');
    try {
      await recallSession({
        id: session,
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
  const addProductRequest = async params => {
    const hide = message.loading('正在退回');
    try {
      await addProduct({
        productId: params.productId,
        sessionId: params.sessionId,
      });
      hide();
      message.success('退回成功');
      setAddProductModalVisible(false);
      actionRef.current.reload();
      return true;
    } catch (error) {
      hide();
      message.error('退回失败请重试！');
      return false;
    }
  };
  const createSessionRequest = async params => {
    setConfirmLoading(true);
    const hide = message.loading('正在生成');
    try {
      await createSession({
        id: luckBagId,
        ...params,
      });
      hide();
      message.success('生成成功');
      setCreateSessionModalVisible(false);
      setConfirmLoading(false);
      actionRef.current.reload();
      return true;
    } catch (error) {
      hide();
      message.error('生成失败请重试！');
      return false;
    }
  };
  const removeBox = async params => {
    const hide = message.loading('正在删除');
    try {
      await removeBoxProduct({
        itemId: params,
      });
      hide();
      message.success('删除成功');
      actionRef.current.reload();
      return true;
    } catch (error) {
      hide();
      message.error('删除失败请重试！');
      return false;
    }
  };
  const addSessionProduct = record => {
    setAddProductModalVisible(true);
    setSessionId(record.id);
  };
  const columns = [
    {
      title: '场次ID',
      dataIndex: 'id',
      align: 'center',
    },

    {
      title: '包含隐藏',
      dataIndex: 'rare',
      align: 'center',
      render: rare => (rare ? <Tag color="green">是</Tag> : <Tag>否</Tag>),
    },
    {
      title: '是否已售',
      dataIndex: 'soldAt',
      align: 'center',
      render: val =>
        val === '-' ? <Tag color="orange">待售</Tag> : <Tag color="green"> 已售</Tag>,
    },
    {
      title: '是否上架',
      dataIndex: 'available',
      align: 'center',
      render: availableStatus => (availableStatus ? <Tag color="green">是</Tag> : <Tag>否</Tag>),
    },
    {
      title: '购买人',
      dataIndex: 'user',
      align: 'center',
      render: user => <CustomerLink user={user} />,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      align: 'center',
    },
    {
      title: '总价值',
      dataIndex: 'worth',
      hideInSearch: true,
      sorter: true,
      align: 'center',
      render: worth => `¥${worth / 100}`,
    },
    {
      title: '图片',
      dataIndex: 'items',
      align: 'center',
      width: '30%',
      render: name => (
        <>
          {name.map(item => (
            <img
              key={item.id}
              src={item.productImage}
              width={30}
              style={{ marginLeft: '1px' }}
              alt="nothing"
              title={item.productName}
            ></img>
          ))}
        </>
      ),
    },
    {
      title: '购买时间',
      dataIndex: 'soldAt',
      align: 'center',
      sorter: true,
      render: val => (val === '-' ? '' : moment(val).format('YYYY-MM-DD HH:mm:ss')),
    },
    {
      title: '操作',
      render: (_, record) => (
        <>
          {record.available ? (
            <Popconfirm
              title="确认下架该场次?"
              icon={<ExclamationCircleOutlined />}
              onConfirm={() => closeSessionRequest(record.id, false)}
            >
              <a>
                <CaretDownOutlined />
                下架
              </a>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="确认上架该场次?"
              icon={<ExclamationCircleOutlined />}
              onConfirm={() => closeSessionRequest(record.id, true)}
            >
              <a disabled={record.soldAt}>
                <CaretUpOutlined />
                上架
              </a>
            </Popconfirm>
          )}
          <Divider type="vertical" />
          <Popconfirm
            title="确认退回该场次商品吗？"
            onConfirm={() => recallSessionRequest(record.id)}
          >
            <a>退回商品</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a type="primary" onClick={() => addSessionProduct(record)}>
            添加商品
          </a>
        </>
      ),
    },
  ];
  return (
    <>
      <ProTable
        bordered
        toolBarRender={() => [
          <Button type="primary" onClick={() => setCreateSessionModalVisible(true)}>
            <PlusOutlined /> 创建场次
          </Button>,
          <Checkbox
            checked={available}
            onChange={() => (available ? setAvailable(false) : setAvailable(true))}
          >
            隐藏已下架场次
          </Checkbox>,
        ]}
        actionRef={actionRef}
        rowKey={row => row.id}
        size="small"
        search={false}
        onChange={(_, _filter, _sorter) => {
          setSorter(`${_sorter.field}_${_sorter.order}`);
        }}
        params={{
          sorter,
          available,
        }}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 20,
          showTotal: total => `总共${total}条记录`,
        }}
        request={async params => {
          const response = await fetchSessions({
            id: luckBagId,
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
        expandedRowRender={record => (
          <SessionDetail sessionInfo={record.items} saleState={record.user} onSubmit={removeBox} />
        )}
      />
      {/* 添加商品 */}
      <AddProductForm
        sessionId={sessionId}
        onSubmit={addProductRequest}
        onCancel={() => setAddProductModalVisible(false)}
        modalVisible={addProductModalVisible}
      />
      <CreateSessionForm
        confirmLoading={confirmLoading}
        onSubmit={createSessionRequest}
        onCancel={() => setCreateSessionModalVisible(false)}
        modalVisible={createSessionModalVisible}
      />
    </>
  );
};

export default SoldHistory;
