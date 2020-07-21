import React, { useState, useRef } from 'react';
import { Button, message, Tag } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Link from 'umi/link';
import { fetchExhibitionLists, createExhibition } from './service';
import CreateForm from './components/CreateForm';

const handleAdd = async fields => {
  console.log(fields);
  const hide = message.loading('正在添加');
  try {
    await createExhibition({
      ...fields,
    });
    hide();
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

const BannerList = () => {
  const [sorter, setSorter] = useState({});
  const [createModalVisible, handleModalVisible] = useState(false);
  const url = 'http://img.suplaymart.com/';
  const actionRef = useRef();

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '展会名称',
      dataIndex: 'name',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '开始时间',
      dataIndex: 'startAt',
      hideInSearch: true,
      align: 'center',
      render: val => (val ? moment(val).format('YYYY-MM-DD') : ''),
    },
    {
      title: '结束时间',
      dataIndex: 'endAt',
      hideInSearch: true,
      align: 'center',
      render: val => (val ? moment(val).format('YYYY-MM-DD') : ''),
    },
    {
      title: '图片',
      dataIndex: 'cover',
      hideInSearch: true,
      align: 'center',
      render: cover => <img alt="nothing" shape="square" height={70} src={`${url}${cover}`} />,
    },
    {
      title: '展会状态',
      dataIndex: 'status',
      filters: false,
      align: 'center',
      valueEnum: {
        已结束: {
          text: '已结束',
          status: 'Error',
        },
        即将进行: {
          text: '即将进行',
          status: 'Success',
        },
        进行中: {
          text: '进行中',
          status: 'Success',
        },
      },
    },
    {
      title: '是否显示',
      hideInSearch: true,
      dataIndex: 'display',
      align: 'center',
      render: archived => (archived ? <Tag color="green">显示</Tag> : <Tag>隐藏</Tag>),
    },
    {
      title: '是否已归档',
      hideInSearch: true,
      dataIndex: 'archived',
      align: 'center',
      render: archived => (archived ? <Tag color="green">已归档</Tag> : <Tag>未归档</Tag>),
    },
    {
      title: '展会指南链接',
      dataIndex: 'linkUrl',
      hideInSearch: true,
      textWrap: 'word-break',
      width: 150,
      align: 'center',
      render: linkUrl =>
        linkUrl !== '-' ? (
          <a href={linkUrl} target="_blank" rel="noopener noreferrer">
            {linkUrl}
          </a>
        ) : (
          '-'
        ),
    },
    {
      title: '操作',
      hideInSearch: true,
      dataIndex: 'id',
      align: 'center',
      render: id => <Link to={`/operating/exhibitionDetail/${id}`}>详情</Link>,
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
          const response = await fetchExhibitionLists({ ...params, page: params.current });
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
            <PlusOutlined /> 创建
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
