import React, { useState, useRef } from 'react';
import { Button, message, Popconfirm } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { fetchBlackLists, updateBox, deleteBoxProduct } from './service';
import CreateForm from './components/CreateForm';

const handleAdd = async fields => {
  console.log(fields);
  const hide = message.loading('正在添加');
  try {
    await updateBox({
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
const handleGetDetail = async (fields, actionRef) => {
  const hide = message.loading('正在删除');
  try {
    await deleteBoxProduct({
      userId: fields,
    });
    hide();
    message.success('删除成功');
    actionRef.current.reload();
    return true;
  } catch (error) {
    hide();
    message.error('删除失败请重试！');
    actionRef.current.reload();
    return false;
  }
};
const BannerList = () => {
  const [sorter, setSorter] = useState({});
  const [createModalVisible, handleModalVisible] = useState(false);
  const actionRef = useRef();

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: 'UUID',
      dataIndex: 'uuid',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '图片',
      dataIndex: 'avatar',
      hideInSearch: true,
      align: 'center',
      render: cover => <img alt="nothing" shape="square" height={70} src={cover} />,
    },
    {
      title: '手机号',
      hideInSearch: true,
      dataIndex: 'mobile',
      align: 'center',
    },
    {
      title: '备注',
      textWrap: 'word-break',
      ellipsis: true,
      dataIndex: 'remark',
      hideInSearch: true,
      align: 'center',
      width: 175,
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      hideInSearch: true,
      align: 'center',
      render: val => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '操作',
      hideInSearch: true,
      dataIndex: 'id',
      align: 'center',
      // render: id => <a onClick={() => handleGetDetail(id, actionRef)}>删除</a>,
      render: id => (
        <Popconfirm
          title="确认移除该用户?"
          icon={<ExclamationCircleOutlined />}
          onConfirm={() => handleGetDetail(id, actionRef)}
        >
          <a>删除</a>
        </Popconfirm>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable
        scroll={{ y: window.innerHeight - window.innerHeight / 3 }}
        bordered
        rowKey="id"
        actionRef={actionRef}
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
          const response = await fetchBlackLists({ ...params, page: params.current });
          return {
            data: response.list,
            current: response.pagination.current,
            total: response.pagination.total,
            pageSize: response.pagination.pageSize,
          };
        }}
        columns={columns}
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 添加
          </Button>,
        ]}
        search={false}
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
      />{' '}
    </PageHeaderWrapper>
  );
};

export default BannerList;
