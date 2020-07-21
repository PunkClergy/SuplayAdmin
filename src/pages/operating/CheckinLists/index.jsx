import React, { useState, useRef } from 'react';
import { message, Tag } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import EditCheckinForm from './components/EditCheckinForm';
import { getCheckin, updateCheckin } from './service';

const handleUpdate = async fields => {
  const hide = message.loading('正在保存');
  try {
    await updateCheckin({
      ...fields,
    });
    hide();
    message.success('保存成功');
    return true;
  } catch (error) {
    hide();
    message.error('保存失败请重试！');
    return false;
  }
};

const CheckinList = () => {
  const [editCheckin, setEditCheckin] = useState({});
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const actionRef = useRef();
  // const url = 'http://img.suplaymart.com/';
  const columns = [
    {
      title: '天数',
      dataIndex: 'days',
      hideInSearch: true,
      align: 'center',
      render: days => <span>第{days}天</span>,
    },
    {
      title: '类型',
      hideInSearch: true,
      dataIndex: 'prizeType',
      filters: false,
      align: 'center',
      valueEnum: {
        1: {
          text: <Tag color="cyan">幸运值</Tag>,
        },
        3: {
          text: <Tag color="magenta">优惠券</Tag>,
        },
      },
    },
    {
      title: '优惠券ID',
      hideInSearch: true,
      align: 'center',
      render: (_, record) => (
        <>{record.prizeType === 3 ? <span>{record.prizeItemId}</span> : '-'}</>
      ),
    },
    {
      title: '数量',
      dataIndex: 'prizeQuantity',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '封面',
      dataIndex: 'prizeImage',
      hideInSearch: true,
      align: 'center',
      render: cover => <img alt="nothing" shape="square" height={70} src={cover} />,
    },

    {
      title: '操作',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setEditCheckin(record);
            }}
          >
            编辑
          </a>
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
        actionRef={actionRef}
        search={false}
        request={async params => {
          const response = await getCheckin({ ...params });
          return {
            data: response.checkIns,
          };
        }}
        columns={columns}
      />
      <EditCheckinForm
        checkin={editCheckin}
        onSubmit={async value => {
          handleUpdateModalVisible(false);
          const success = await handleUpdate(value);
          if (success) {
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleUpdateModalVisible(false)}
        modalVisible={updateModalVisible}
      />
    </PageHeaderWrapper>
  );
};

export default CheckinList;
