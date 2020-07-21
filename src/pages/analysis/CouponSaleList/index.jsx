import React, { useState, useRef } from 'react';
import { DatePicker } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { fetchSales } from './service';

const { RangePicker } = DatePicker;
// 数据渲染
const CouponSalesList = () => {
  // 初始查询 开始时间
  const startTime = () => {
    const start = new Date();
    return start.setDate(1);
  };
  // 初始查询 结束时间
  const endTime = () => {
    const end = new Date();
    return end;
  };
  const [sorter, setSorter] = useState({});
  const [start, setStart] = useState(moment(startTime()).format('YYYYMMDD'));
  const [end, setEnd] = useState(moment(endTime()).format('YYYYMMDD'));
  const actionRef = useRef();
  const columns = [
    {
      title: '优惠券ID',
      dataIndex: 'id',
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
      title: '优惠券名称',
      hideInSearch: true,
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '优惠券减免金额',
      dataIndex: 'deduct',
      hideInSearch: true,
      align: 'center',
      render: price => `¥${price / 100}`,
    },
    {
      title: '优惠券累计减免金额',
      dataIndex: 'deductCount',
      hideInSearch: true,
      align: 'center',
      render: price => `¥${price / 100}`,
    },
    {
      title: '图片',
      dataIndex: 'image',
      hideInSearch: true,
      align: 'center',
      render: avatar => <img alt="nothing" height="80" src={avatar} />,
    },

    {
      title: '已发送',
      dataIndex: 'sendOut',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '待使用',
      dataIndex: 'unused',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '已使用',
      dataIndex: 'used',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '已过期',
      dataIndex: 'expired',
      hideInSearch: true,
      align: 'center',
    },
  ];
  // 查询条件改变时执行
  const searchChange = dateString => {
    if (dateString) {
      setStart(moment(new Date(dateString[0]).getTime()).format('YYYYMMDD'));
      setEnd(moment(new Date(dateString[1]).getTime()).format('YYYYMMDD'));
    }
  };
  const dateFormat = 'YYYYMMDD';
  return (
    <PageHeaderWrapper>
      <ProTable
        scroll={{ y: window.innerHeight - window.innerHeight / 3 }}
        bordered
        rowKey="box_id"
        search={false}
        actionRef={actionRef}
        onChange={(_, _filter, _sorter) => {
          setSorter(`${_sorter.field}_${_sorter.order}`);
        }}
        params={{
          sorter,
          start,
          end,
        }}
        toolBarRender={() => [
          <RangePicker
            defaultValue={[
              moment(moment(startTime()).format('YYYYMMDD'), dateFormat),
              moment(moment(endTime()).format('YYYYMMDD'), dateFormat),
            ]}
            onChange={(_, dateString) => {
              if (actionRef.current) {
                actionRef.current.reset();
                searchChange(dateString);
              }
              return null;
            }}
          />,
        ]}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 20,
          showTotal: total => `总共${total}条记录`,
        }}
        request={async (params = {}) => {
          const response = await fetchSales({
            ...params,
          });

          return {
            data: response.list,
            current: response.pagination.current,
            pageSize: response.pagination.pageSize,
            total: response.pagination.total,
          };
        }}
        columns={columns}
      />
    </PageHeaderWrapper>
  );
};

export default CouponSalesList;
