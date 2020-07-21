import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Avatar, message, Tag } from 'antd';
import Link from 'umi/link';
import moment from 'moment';
import { fetchSeries, editSeries } from './service';
import EditSeriesForm from './components/EditSeriesForm';

const handleAdd = async fields => {
  const hide = message.loading('正在添加');
  try {
    await editSeries({
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

const SeriesList = () => {
  const [sorter, setSorter] = useState({});
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const actionRef = useRef();
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      copyable: true,
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '系列名称',
      dataIndex: 'name',
      align: 'center',
      hideInSearch: false,
    },
    {
      title: '所属品牌',
      dataIndex: 'brand',
      align: 'center',
      render: val => <div>{val ? val.name : ''}</div>,
    },
    {
      title: '商品数量',
      hideInSearch: true,
      dataIndex: 'toyNumber',
      align: 'center',
    },
    {
      title: '图片',
      dataIndex: 'imageUrl',
      hideInSearch: true,
      align: 'center',
      render: val => (val ? <Avatar alt="nothing" shape="square" size={80} src={val} /> : <></>),
    },
    {
      title: '图标',
      dataIndex: 'iconUrl',
      hideInSearch: true,
      align: 'center',
      render: val => (val ? <Avatar alt="nothing" shape="square" size={80} src={val} /> : <></>),
    },
    {
      title: '类型',
      dataIndex: 'status',
      hideInSearch: true,
      align: 'center',
      render: status => (
        <Tag color={status === 1 ? 'geekblue' : 'green'}>{status === 1 ? '预售' : '现货'}</Tag>
      ),
    },
    {
      title: '预计到货时间',
      dataIndex: 'predictAt',
      hideInSearch: true,
      align: 'center',
      render: val => (val !== '-' ? moment(val).format('YYYY-MM-DD') : ''),
    },
    {
      title: '发售时间',
      dataIndex: 'saleAt',
      hideInSearch: true,
      align: 'center',
      render: val => (val !== '-' ? moment(val * 1000).format('YYYY-MM-DD') : ''),
    },
    {
      title: '权重',
      hideInSearch: true,
      dataIndex: 'sort',
      align: 'center',
      sorter: true,
    },
    {
      title: '首字母',
      hideInSearch: true,
      dataIndex: 'spell',
      align: 'center',
      sorter: true,
    },
    {
      title: '操作',
      hideInSearch: true,
      dataIndex: 'id',
      width: 100,
      align: 'center',
      render: id => <Link to={`/product/series/detail/${id}`}>详情</Link>,
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable
        scroll={{ y: window.innerHeight - window.innerHeight / 3 }}
        search={{ span: 6 }}
        bordered
        actionRef={actionRef}
        rowKey="id"
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
          const response = await fetchSeries({ ...params });
          return {
            data: response.list,
            current: response.pagination.current,
            total: response.pagination.total,
            pageSize: response.pagination.pageSize,
          };
        }}
        columns={columns}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              handleUpdateModalVisible(true);
            }}
          >
            新建
          </Button>,
        ]}
      />
      <EditSeriesForm
        modalVisible={updateModalVisible}
        detail={{}}
        onSubmit={async value => {
          const success = await handleAdd(value);
          if (success) {
            handleUpdateModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleUpdateModalVisible(false)}
      />
    </PageHeaderWrapper>
  );
};

export default SeriesList;
