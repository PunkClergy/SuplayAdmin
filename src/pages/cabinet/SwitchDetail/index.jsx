import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Descriptions, Table, Tag } from 'antd';
import moment from 'moment';
import ProTable from '@ant-design/pro-table';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import CustomerLink from '@/components/Common/CustomerLink';
import styles from './style.less';

class switchDetailList extends Component {
  // 生命周期函数 第一次渲染后调用
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'switchDetail/getOrder',
      payload: { id: this.props.match.params.id },
    });
  }

  render() {
    const { loading } = this.props;
    console.log(this.props);
    const { switchDetail } = this.props.switchDetail;
    const auditStatus = {
      '0': <Tag color="orange">等待</Tag>,
      '1': <Tag color="green">接受</Tag>,
      '-1': <Tag>取消</Tag>,
      '2': <Tag color="error">拒绝</Tag>,
    };

    const productColumns = [
      {
        title: 'ID',
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '图片',
        dataIndex: 'image',
        align: 'center',
        render: val => <img alt="nothing" height="60" src={val} />,
      },
    ];
    const paymentsColumns = [
      {
        title: 'ID',
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '图片',
        dataIndex: 'image',
        align: 'center',
        render: val => <img alt="nothing" height="60" src={val} />,
      },
    ];
    return (
      <PageHeaderWrapper title="交换详情">
        <Card>
          <Descriptions title="基础信息" style={{ marginBottom: 32 }}>
            <Descriptions.Item label="交换ID" key="id">
              {switchDetail.id}
            </Descriptions.Item>
            <Descriptions.Item label="交换状态" key="status">
              {auditStatus[switchDetail.status]}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间" key="createAt">
              {moment(switchDetail.createAt * 1000).format('YYYY年MM月DD日 HH:mm:ss')}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card>
          <Descriptions title="发起方信息" style={{ marginBottom: 32 }}>
            <Descriptions.Item label="用户ID" key="id">
              {switchDetail.from ? switchDetail.from.id : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="uuid" key="expressId">
              {switchDetail.from ? switchDetail.from.uuid : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="昵称" key="status">
              <CustomerLink user={switchDetail.from ? switchDetail.from : '-'} />
            </Descriptions.Item>
            <Descriptions.Item label="头像" key="expressId">
              {switchDetail.from ? (
                <img alt="nothing" width="50" src={switchDetail.from.avatar} />
              ) : (
                ''
              )}
            </Descriptions.Item>
          </Descriptions>
          <div className={styles.title}>发起方商品</div>
          <Table
            rowKey="id"
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={loading}
            dataSource={switchDetail.fromCabinets}
            columns={productColumns}
          />
        </Card>
        <Card>
          <Descriptions title="接受方信息" style={{ marginBottom: 32 }}>
            <Descriptions.Item label="用户ID" key="id">
              {switchDetail.to ? switchDetail.to.id : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="uuid" key="expressId">
              {switchDetail.to ? switchDetail.to.uuid : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="昵称" key="status">
              <CustomerLink user={switchDetail.to ? switchDetail.to : '-'} />
            </Descriptions.Item>
            <Descriptions.Item label="头像" key="avatar">
              {switchDetail.to ? <img alt="nothing" width="50" src={switchDetail.to.avatar} /> : ''}
            </Descriptions.Item>
          </Descriptions>

          <div className={styles.title}>接受方商品</div>
          <ProTable
            search={false}
            toolBarRender={false}
            rowKey="id"
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={loading}
            dataSource={switchDetail.toCabinets}
            columns={paymentsColumns}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ switchDetail, loading }) => ({
  switchDetail,
  loading: loading.effects['orderDetail/getBox'],
}))(switchDetailList);
