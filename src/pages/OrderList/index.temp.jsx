import React, { useState, useRef } from 'react';
import { Checkbox, List, Table, Avatar, Row, Col } from 'antd';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { fetchOrders } from './service';
import styles from './style.less';

const BoxList = () => {
  const [sorter, setSorter] = useState({});
  const [ids, setIds] = useState([]);
  const [officialOnly, setOfficialOnly] = useState(null);
  const actionRef = useRef();
  const header = [
    {
      title: '商品信息',
      render: (_, record) => (
        <List
          split
          size="small"
          itemLayout="vertical"
          dataSource={record.detail}
          renderItem={item => (
            <List.Item>
              <Avatar style={{ marginRight: 10 }} shape="square" size="large" src={item.image} />
              <span>{`${item.name} x ${item.quantity}`}</span>
            </List.Item>
          )}
        />
      ),
    },
    {
      title: '用户昵称',
      dataIndex: ['buyer', 'nickname'],
    },
    {
      title: '收货人',
      dataIndex: 'name',
    },
    {
      title: '电话',
      dataIndex: 'phone',
    },
    {
      title: '物流信息',
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      valueEnum: {
        '-1': {
          text: '订单关闭',
          status: 'Default',
        },
        '0': {
          text: '等待发货',
          status: 'Warning',
        },
        '1': {
          text: '已发货',
          status: 'Processing',
        },
        '2': {
          text: '已完成',
          status: 'Default',
        },
      },
    },
    {
      title: '操作',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <>
          {record.status === 0 ? (
            <a onClick={() => {}}>发货</a>
          ) : (
            <a style={{ color: 'lightgray' }}>发货</a>
          )}
        </>
      ),
    },
  ];

  const expandedRowRender = data => (
    <Table showHeader={false} columns={header} dataSource={[data]} pagination={false} />
  );

  const columns = [
    {
      title: '商品信息',
      render: (_, record) => ({
        children: (
          <Row>
            <Col sm={6}>订单号：{record.id}</Col>
            <Col sm={6}>下单时间：{moment.unix(record.createAt).format('YYYY-MM-DD HH:mm')}</Col>
          </Row>
        ),
        props: { colSpan: 7 },
      }),
    },
    {
      title: '单价',
      render: () => ({
        props: { colSpan: 0 },
      }),
    },
    {
      title: '数量',
      render: () => ({
        props: { colSpan: 0 },
      }),
    },
    {
      title: '用户昵称',
      render: () => ({
        props: { colSpan: 0 },
      }),
    },
    {
      title: '收货人',
      render: () => ({
        props: { colSpan: 0 },
      }),
    },
    {
      title: '电话',
      render: () => ({
        props: { colSpan: 0 },
      }),
    },
    {
      title: '物流信息',
      render: () => ({
        props: { colSpan: 0 },
      }),
    },
    {
      title: '订单状态',
      render: () => ({
        props: { colSpan: 0 },
      }),
    },
    {
      title: '操作',
      render: () => ({
        props: { colSpan: 0 },
      }),
    },
  ];
  return (
    <PageHeaderWrapper>
      <ProTable
        bordered
        className={styles.orderTable}
        rowKey="id"
        rowClassName={styles.rowHeader}
        rowSelection={{}}
        actionRef={actionRef}
        onChange={(_, _filter, _sorter) => {
          setSorter(`${_sorter.field}_${_sorter.order}`);
        }}
        toolBarRender={() => [
          <Checkbox onChange={val => setOfficialOnly(val.target.checked)}>只显示官方订单</Checkbox>,
        ]}
        params={{
          sorter,
          officialOnly,
        }}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 24,
        }}
        request={async (params = {}) => {
          const response = await fetchOrders({ ...params, page: params.current });
          setIds(response.list.map(order => order.id));
          return {
            data: response.list,
            page: response.pagination.current,
            total: response.pagination.total,
          };
        }}
        columns={columns}
        expandedRowKeys={ids}
        expandable={{ expandedRowRender, defaultExpandAllRows: true, indentSize: 30 }}
      />
    </PageHeaderWrapper>
  );
};

export default BoxList;
