import React, { useState, useRef } from 'react';
import { Button, Divider, Dropdown, Menu, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { fetchCoupon, fetchCouponDetail, sendCoupon } from './service';
import EditCouponForm from './components/EditCouponForm';
import AddStockForm from './components/AddStockForm';

const CouponList = () => {
  const [sorter, setSorter] = useState({});
  const [editProduct, setEditProduct] = useState({});
  const [stockModalVisible, handleStockModalVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [detail, setDetail] = useState({});
  const actionRef = useRef();

  const handleGetDetail = id => {
    fetchCouponDetail(id).then(res => {
      setDetail(res);
      setShowModal(true);
    });
  };

  const handleAddStock = async fields => {
    const hide = message.loading('正在发送');
    try {
      await sendCoupon({
        ...fields,
      });
      hide();
      // message.success('发送成功');
      return true;
    } catch (error) {
      hide();
      message.error('发送失败请重试！');
      return false;
    }
  };
  const menu = record => (
    <Menu>
      <Menu.Item key="0">
        <a
          onClick={() => {
            handleStockModalVisible(true);
            setEditProduct(record);
          }}
        >
          发送
        </a>
      </Menu.Item>
    </Menu>
  );

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
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '类型',
      dataIndex: 'type',
      align: 'center',
      valueEnum: {
        0: {
          text: '代金券',
        },
        1: {
          text: '包邮券',
        },
      },
    },
    {
      title: '图片',
      dataIndex: 'image',
      hideInSearch: true,
      align: 'center',
      render: cover => <img alt="nothing" shape="square" height={70} src={cover} />,
    },
    {
      title: '最低金额',
      hideInSearch: true,
      dataIndex: 'limit',
      align: 'center',
      render: price => `¥${price / 100}`,
    },
    {
      title: '金额减免',
      dataIndex: 'deduct',
      hideInSearch: true,
      align: 'center',
      render: price => `¥${price / 100}`,
    },
    {
      title: '有效时间（小时）',
      dataIndex: 'duration',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '已发送数量',
      dataIndex: 'sendOut',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '已使用数量',
      dataIndex: 'used',
      hideInSearch: true,
      align: 'center',
    },
    // {
    //   title: '是否可用',
    //   dataIndex: 'available',
    //   align: 'center',
    //   valueEnum: {
    //     true: {
    //       text: '可用',
    //       status: 'Success',
    //     },
    //     false: {
    //       text: '禁用',
    //       status: 'Default',
    //     },
    //   },
    // },
    {
      title: '描述',
      hideInSearch: true,
      dataIndex: 'description',
      align: 'center',
    },
    {
      title: '更新时间',
      dataIndex: 'updateAt',
      hideInSearch: true,
      align: 'center',
      render: val => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '操作',
      hideInSearch: true,
      dataIndex: 'id',
      align: 'center',
      // render: id => <a onClick={() => handleGetDetail(id)}>编辑</a>,
      render: (_, record) => (
        <>
          <a onClick={() => handleGetDetail(record.id)}>编辑</a>
          <Divider type="vertical" />
          <Dropdown overlay={menu(record, actionRef)}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              <DownOutlined />
            </a>
          </Dropdown>
        </>
      ),
    },
  ];

  const handleCallbak = val => {
    if (val) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
    setShowModal(false);
  };

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
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 20,
          showTotal: total => `总共${total}条记录`,
        }}
        request={async params => {
          const response = await fetchCoupon({ ...params, page: params.current });
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
              setShowModal(true);
              setDetail({});
            }}
          >
            新建
          </Button>,
        ]}
      />
      <EditCouponForm show={showModal} detail={detail} handleCallbak={handleCallbak} />
      <AddStockForm
        product={editProduct}
        onSubmit={async value => {
          handleStockModalVisible(false);
          const success = await handleAddStock(value);
          if (success) {
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleStockModalVisible(false)}
        modalVisible={stockModalVisible}
      />
    </PageHeaderWrapper>
  );
};

export default CouponList;
