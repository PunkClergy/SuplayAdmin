import React, { useRef } from 'react';
import { message, Button, Typography, Switch } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { getLives, syncLives, postDesc, postDisplay } from './service';

const { Paragraph } = Typography;
const statusMap = {
  '101': '直播中',
  '102': '未开始',
  '103': '已结束',
  '104': '禁播',
  '105': '暂停中',
  '106': '异常',
  '107': '已过期',
};

const handleSync = ref => {
  const hide = message.loading('正在同步');
  try {
    syncLives({}).then(() => {
      hide();
      message.success('同步成功');
      ref.current.reload();
    });
    return true;
  } catch (error) {
    hide();
    message.error('同步失败请重试！');
    return false;
  }
};

const onChangeDescription = (desc, info, actionRef) => {
  const temp = {
    id: info.roomId,
    description: desc || null,
  };
  const hide = message.loading('正在修改');
  try {
    postDesc({ ...temp }).then(() => {
      hide();
      message.success('修改成功');
      actionRef.current.reload();
    });
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
};

const onChangeHome = (e, info, actionRef) => {
  const temp = {
    id: info.roomId,
    display: e,
  };
  const hide = message.loading('正在设置');
  try {
    postDisplay({ ...temp }).then(() => {
      hide();
      message.success('设置成功');
      actionRef.current.reload();
    });
    return true;
  } catch (error) {
    hide();
    message.error('设置失败请重试！');
    return false;
  }
};

const LiveList = () => {
  const actionRef = useRef();
  const columns = [
    {
      title: 'RoomId',
      dataIndex: 'roomId',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '名称',
      dataIndex: 'name',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 200,
      hideInSearch: true,
      align: 'center',
      render: (_, record) => (
        <Paragraph
          editable={{ onChange: e => onChangeDescription(e, record, actionRef) }}
          width={100}
        >
          {record.description}
        </Paragraph>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
      align: 'center',
      render: val => `${statusMap[val]}[${val}]`,
    },
    {
      title: '图片',
      dataIndex: 'cover',
      hideInSearch: true,
      width: 90,
      align: 'center',
      render: cover => <img alt="nothing" height={70} src={cover} />,
    },
    {
      title: '开始时间',
      dataIndex: 'startAt',
      valueType: 'dateTime',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '结束时间',
      dataIndex: 'endAt',
      valueType: 'dateTime',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '首页是否显示',
      hideInSearch: true,
      align: 'center',
      render: (_, record) => (
        <Switch
          checkedChildren="显示"
          unCheckedChildren="隐藏"
          defaultChecked={record.display}
          onChange={display => onChangeHome(display, record, actionRef)}
        />
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable
        scroll={{ y: window.innerHeight - window.innerHeight / 3 }}
        bordered
        rowKey="roomId"
        actionRef={actionRef}
        search={false}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 20,
          showTotal: total => `总共${total}条记录`,
        }}
        request={async params => {
          const response = await getLives({ ...params });
          return {
            data: response.list,
            current: response.pagination.current,
            total: response.pagination.total,
            pageSize: response.pagination.pageSize,
          };
        }}
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleSync(actionRef)}>
            同步
          </Button>,
        ]}
        columns={columns}
      />
    </PageHeaderWrapper>
  );
};

export default LiveList;
