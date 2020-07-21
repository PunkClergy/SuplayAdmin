import React, { useState, useRef } from 'react';
import Link from 'umi/link';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import { fetchBags, updateBag } from './service';

const handleAdd = async fields => {
  const hide = message.loading('正在添加');
  try {
    await updateBag({
      ...fields,
    });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

const LuckyBagList = () => {
  const [sorter, setSorter] = useState({});
  const [createModalVisible, handleModalVisible] = useState(false);
  const actionRef = useRef();
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: true,
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '封面',
      dataIndex: 'coverUrl',
      hideInSearch: true,
      align: 'center',
      render: coverUrl => <img alt="nothing" shape="square" height={70} src={coverUrl} />,
    },
    {
      title: '图片',
      dataIndex: 'imageUrl',
      hideInSearch: true,
      align: 'center',
      render: imageUrl => <img alt="nothing" shape="square" height={70} src={imageUrl} />,
    },
    {
      title: '价格',
      dataIndex: 'price',
      hideInSearch: true,
      align: 'center',
      render: price => `¥${price / 100}`,
    },
    {
      title: '剩余数量',
      dataIndex: 'quantity',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: false,
      align: 'center',
      valueEnum: {
        0: {
          text: '已下架',
          status: 'Error',
        },
        1: {
          text: '上架中',
          status: 'Success',
        },
      },
    },
    {
      title: '优惠券',
      dataIndex: 'allowCoupon',
      filters: false,
      align: 'center',
      valueEnum: {
        true: {
          text: '可用',
          status: 'Success',
        },
        false: {
          text: '禁用',
          status: 'Default',
        },
      },
    },
    {
      title: '开始时间',
      dataIndex: 'openAt',
      valueType: 'dateTime',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '描述',
      textWrap: 'word-break',
      ellipsis: true,
      hideInSearch: true,
      width: 200,
      align: 'center',
      dataIndex: 'description',
    },

    {
      title: '操作',
      hideInSearch: true,
      dataIndex: 'id',
      align: 'center',
      render: id => <Link to={`/sales/LuckyBag/${id}/detail`}>详情</Link>,
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
        params={{
          sorter,
        }}
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 20,
        }}
        request={async (params = {}) => {
          const response = await fetchBags({ ...params });
          return {
            data: response.list,
            current: response.pagination.current,
            pageSize: response.pagination.pageSize,
            total: response.pagination.total,
          };
        }}
        columns={columns}
      />
      <CreateForm
        onSubmit={async value => {
          const success = await handleAdd(value);
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

export default LuckyBagList;
