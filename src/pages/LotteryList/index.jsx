import React, { useState, useRef } from 'react';
import Link from 'umi/link';
import { Tag, Avatar, Button, Space, message, Tooltip } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import CustomerLink from '@/components/Common/CustomerLink';
import CreateForm from './components/CreateForm';
import { fetchLotteries, updateLottery } from './service';

const handleAdd = async fields => {
  const hide = message.loading('正在添加');
  try {
    await updateLottery({
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
const LotteryList = () => {
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
      title: '发起人',
      hideInSearch: true,
      dataIndex: 'user',
      align: 'center',
      render: user => <CustomerLink user={user} />,
    },
    {
      title: '头像',
      dataIndex: ['user', 'avatar'],
      hideInSearch: true,
      width: 90,
      align: 'center',
      render: avatar => <Avatar alt="nothing" shape="square" size={60} src={avatar} />,
    },
    {
      title: '首页展示',
      dataIndex: 'auditStatus',
      filters: false,
      align: 'center',
      width: 100,
      valueEnum: {
        '-1': {
          text: '否',
          status: 'Default',
        },
        '0': {
          text: '待审核',
          status: 'Warning',
        },
        '1': {
          text: '是',
          status: 'Success',
        },
        '2': {
          text: '已拒绝',
          status: 'Error',
        },
      },
    },
    {
      title: '抽选状态',
      dataIndex: 'status',
      filters: false,
      align: 'center',
      width: 100,
      valueEnum: {
        '1': {
          text: '进行中',
          status: 'Success',
        },
        '2': {
          text: '已结束',
          status: 'Default',
        },
        '-2': {
          text: '已下线',
          status: 'Warning',
        },
      },
    },
    {
      title: '属性',
      ellipsis: true,
      dataIndex: 'status',
      hideInSearch: true,
      align: 'center',
      width: 75,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.type === 1 ? (
            <Tooltip title={moment(record.endAt).format('YYYY-MM-DD HH:mm:ss')}>
              <Tag color="green">按时间开奖</Tag>
            </Tooltip>
          ) : (
            <Tooltip title={`${record.maxNum}人`}>
              <Tag color="blue">按人数开奖</Tag>
            </Tooltip>
          )}
          {record.allowHelp ? <Tag color="volcano">助力</Tag> : <></>}
        </Space>
      ),
    },
    {
      title: '名称',
      dataIndex: 'title',
      width: 220,
      align: 'center',
    },
    {
      title: '保证金',
      dataIndex: 'price',
      hideInSearch: true,
      align: 'center',
      render: price => `¥ ${price / 100}`,
    },
    {
      title: '参与人数',
      dataIndex: 'participantNum',
      hideInSearch: true,
      align: 'center',
      render: num => `${num}人`,
    },
    {
      title: '封面',
      dataIndex: 'cover',
      hideInSearch: true,
      align: 'center',
      render: cover => <img alt="nothing" height={80} src={cover} />,
    },
    {
      title: '操作',
      hideInSearch: true,
      dataIndex: 'id',
      width: 100,
      align: 'center',
      render: id => <Link to={`lottery/${id}/detail`}>详情</Link>,
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
            <PlusOutlined /> 新建
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
          const response = await fetchLotteries({ ...params });
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

export default LotteryList;
