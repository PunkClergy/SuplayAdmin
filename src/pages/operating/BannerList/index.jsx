import React, { useState, useRef } from 'react';
import { Button, Tag } from 'antd';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { fetchBanner, fetchBannerDetail } from './service';
import EditBannerForm from './components/EditBannerForm';

const BannerList = () => {
  const [sorter, setSorter] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [detail, setDetail] = useState({});
  const actionRef = useRef();

  const handleGetDetail = id => {
    fetchBannerDetail(id).then(res => {
      setDetail(res);
      setShowModal(true);
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: true,
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '类型',
      dataIndex: 'type',
      align: 'center',
      valueEnum: {
        1: {
          text: 'Banner',
        },
        2: {
          text: '运营位',
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
      title: '目标ID',
      hideInSearch: true,
      width: 240,
      dataIndex: 'targetId',
      align: 'center',
    },
    {
      title: '目标类型',
      dataIndex: 'targetType',
      hideInSearch: true,
      align: 'center',
      valueEnum: {
        1: {
          text: '抽选',
        },
        2: {
          text: '盲盒',
        },
        3: {
          text: '链接',
        },
        5: {
          text: '直购',
        },
        6: {
          text: '福袋',
        },
      },
    },
    {
      title: '是否显示',
      hideInSearch: true,
      align: 'center',
      dataIndex: 'display',
      render: display => (
        <Tag color={display ? 'green' : ''} key={display}>
          {display ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '权重',
      hideInSearch: true,
      dataIndex: 'sort',
      sorter: true,
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      hideInSearch: true,
      align: 'center',
      render: val => (val ? moment(val * 1000).format('YYYY-MM-DD HH:mm:ss') : ''),
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
          defaultPageSize: 20,
          showTotal: total => `总共${total}条记录`,
        }}
        request={async params => {
          const response = await fetchBanner({ ...params, page: params.current });
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
      <EditBannerForm show={showModal} detail={detail} handleCallbak={handleCallbak} />
    </PageHeaderWrapper>
  );
};

export default BannerList;
