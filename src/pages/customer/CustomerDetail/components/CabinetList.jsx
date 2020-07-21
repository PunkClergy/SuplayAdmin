import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Tag, Popconfirm, Divider, message } from 'antd';
import { RightOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Link from 'umi/link';
import {
  getCabinets,
  destroy,
  //  refund
} from '../service';

const linkText = [`/box/`, `/shop/`, `/lottery/`, `/sales/LuckyBag/`];
const linkType = ['盲盒', '直购', '抽选', '福袋'];
const CabinetList = props => {
  const { userId } = props;
  const [sorter, setSorter] = useState({});
  const actionRef = useRef();
  const removeDestroy = async (params, action) => {
    const hide = message.loading('正在销毁');
    try {
      await destroy({
        id: params,
      });
      hide();
      message.success('销毁成功');
      action.current.reload();
      return true;
    } catch (error) {
      hide();
      message.error('销毁失败请重试！');
      action.current.reload();
      return false;
    }
  };

  // const removeRefund = async (params, actionRef) => {
  //   const hide = message.loading('正在销毁');
  //   try {
  //     await refund({
  //       id: params,
  //     });
  //     hide();
  //     message.success('销毁成功');
  //     actionRef.current.reload();
  //     return true;
  //   } catch (error) {
  //     hide();
  //     message.error('销毁失败请重试！');
  //     actionRef.current.reload();
  //     return false;
  //   }
  // };
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      width: 160,
      align: 'center',
    },
    {
      title: '商品图片',
      dataIndex: 'image',
      align: 'center',
      render: val => <img alt="nothing" height="60" src={val} />,
    },
    {
      title: '显示价格',
      dataIndex: 'price',
      hideInSearch: true,
      align: 'center',
      render: price => <span>¥{price / 100}</span>,
    },
    {
      title: '实际花费',
      dataIndex: 'cost',
      hideInSearch: true,
      align: 'center',
      render: price => <span>¥{price / 100}</span>,
    },
    {
      title: '属性',
      dataIndex: 'rare',
      filters: false,
      align: 'center',
      valueEnum: {
        0: {
          text: <Tag>普通</Tag>,
        },
        1: {
          text: <Tag color="blue">稀有</Tag>,
        },
        2: {
          text: <Tag color="purple">隐藏</Tag>,
        },
      },
    },
    {
      title: '交换中',
      dataIndex: 'switch',
      filters: false,
      align: 'center',
      render: val => (val ? <Tag color="green">是</Tag> : <Tag color="orange">否</Tag>),
    },

    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      filters: false,
      valueEnum: {
        '0': {
          text: '盒柜中',
          status: 'Success',
        },
        '1': {
          text: '已下单',
          status: 'Default',
        },
        '2': {
          text: '预定',
          status: 'Processing',
        },
        '-1': {
          text: '已回收',
          status: 'Default',
        },
        '-2': {
          text: '已销毁',
          status: 'Default',
        },
      },
    },
    {
      title: '来源',
      hideInSearch: true,
      dataIndex: 'id',
      align: 'center',
      render: (_, record) => (
        <Link to={`${linkText[record.sourceType - 1]}${record.sourceId}/detail`}>
          {linkType[record.sourceType - 1]}
          <RightOutlined />
        </Link>
      ),
    },
    {
      title: '来自交换',
      dataIndex: 'switchId',
      hideInSearch: true,
      align: 'center',
      render: val => (val === '-' ? <Tag color="orange">否</Tag> : <Tag color="green">是</Tag>),
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      valueType: 'dateTime',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '过期时间',
      dataIndex: 'expireAt',
      valueType: 'dateTime',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '到货时间',
      dataIndex: 'predictAt',
      valueType: 'date',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '操作',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <>
          <Link to={`/cabinet/detail/${record.id}`}>详情</Link>
          <Divider
            type="vertical"
            style={{ display: record.status === 0 || record.status === 2 ? '' : 'none' }}
          />
          <Popconfirm
            title="确认删除该商品?"
            icon={<ExclamationCircleOutlined />}
            onConfirm={() => removeDestroy(record.id, actionRef)}
          >
            <a style={{ display: record.status === 0 || record.status === 2 ? '' : 'none' }}>
              销毁
            </a>
          </Popconfirm>
          {/* <Divider type="vertical" />
          <Popconfirm
            title="确认删除该商品?"
            icon={<ExclamationCircleOutlined />}
            onConfirm={() => removeRefund(record.id, actionRef)}
          >
            <a style={{ display: record.status === 0 || record.status === 2 ? '' : 'none' }}>
              销毁并退款
            </a>
          </Popconfirm> */}
        </>
      ),
    },
  ];

  return (
    <ProTable
      bordered
      rowKey="id"
      actionRef={actionRef}
      onChange={(_, _filter, _sorter) => {
        setSorter(`${_sorter.field}_${_sorter.order}`);
      }}
      search={false}
      params={{
        sorter,
      }}
      pagination={{
        showSizeChanger: true,
        defaultPageSize: 20,
        showTotal: total => `总共${total}条记录`,
      }}
      toolBarRender={false}
      request={async params => {
        const response = await getCabinets({ userId, ...params, page: params.current });
        return {
          data: response.list,
          current: response.pagination.current,
          total: response.pagination.total,
          pageSize: response.pagination.pageSize,
        };
      }}
      columns={columns}
    />
  );
};

export default CabinetList;
