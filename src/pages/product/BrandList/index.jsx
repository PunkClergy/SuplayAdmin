import React, { useState, useRef } from 'react';
import { Button, Avatar } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { fetchBrands, fetchBrandDetail } from './service';
import EditBrandForm from './components/EditBrandForm';

const BrandList = () => {
  const [sorter, setSorter] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [detail, setDetail] = useState({});
  const actionRef = useRef();

  const handleGetDetail = id => {
    fetchBrandDetail(id).then(res => {
      setDetail(res);
      setShowModal(true);
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '品牌名称',
      dataIndex: 'name',
      align: 'center',
      hideInSearch: false,
    },
    {
      title: 'LOGO',
      dataIndex: 'imageUrl',
      hideInSearch: true,
      align: 'center',
      render: val => <Avatar alt="nothing" shape="square" size={80} src={val} />,
    },
    {
      title: '图标',
      dataIndex: 'iconUrl',
      hideInSearch: true,
      align: 'center',
      render: val => (val ? <Avatar alt="nothing" shape="square" size={80} src={val} /> : <></>),
    },
    {
      title: '厂家',
      hideInSearch: true,
      dataIndex: 'company',
      align: 'center',
    },
    {
      title: '地区',
      hideInSearch: true,
      dataIndex: 'area',
      align: 'center',
    },
    {
      title: '描述',
      hideInSearch: true,
      dataIndex: 'description',
      align: 'center',
      width: 240,
      ellipsis: true,
    },
    {
      title: '权重',
      hideInSearch: true,
      dataIndex: 'sort',
      sorter: true,
      align: 'center',
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
      align: 'center',
      render: id => <a onClick={() => handleGetDetail(id)}>编辑</a>,
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
          defaultPageSize: 24,
          showTotal: total => `总共${total}条记录`,
        }}
        request={async params => {
          const response = await fetchBrands({ ...params });
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
      <EditBrandForm show={showModal} detail={detail} handleCallbak={handleCallbak} />
    </PageHeaderWrapper>
  );
};

export default BrandList;
