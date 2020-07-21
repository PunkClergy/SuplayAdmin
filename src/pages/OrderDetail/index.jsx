import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Card,
  Descriptions,
  Divider,
  Table,
  Button,
  Tag,
  Typography,
  // Popconfirm
} from 'antd';
// import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import ProTable from '@ant-design/pro-table';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import CustomerLink from '@/components/Common/CustomerLink';
import UpdateForm from './components/UpdateForm';
import styles from './style.less';

const { Text } = Typography;
class orderDetailList extends Component {
  // 初始化状态
  state = {
    updateModalVisible: false,
  };

  // 生命周期函数 第一次渲染后调用
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderDetail/getOrder',
      payload: { id: this.props.match.params.id },
    });
  }

  // 编辑=>保存详情
  handleUpdate = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderDetail/updateOrder',
      payload: params,
    }).then(() => {
      this.setState({ updateModalVisible: false });
      dispatch({
        type: 'orderDetail/getOrder',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 编辑=>拆单
  handleSplit = (_, params) => {
    console.log(params.product_id);
    const { dispatch } = this.props;
    dispatch({
      type: 'orderDetail/splitOrder',
      payload: { id: this.props.match.params.id, productId: params.product_id },
    }).then(() => {
      dispatch({
        type: 'orderDetail/getOrder',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  render() {
    const { loading } = this.props;
    const { orderDetail } = this.props.orderDetail;
    const { updateModalVisible } = this.state;
    const auditStatus = {
      '0': <Tag color="orange">需要确认/支付</Tag>,
      '1': <Tag color="orange">等待发货</Tag>,
      '2': <Tag color="green">已发货</Tag>,
      '3': <Tag>已完成</Tag>,
      '-1': <Tag>订单关闭/取消</Tag>,
      '-2': <Tag>订单过期</Tag>,
    };
    const typeStatus = {
      '1': <Tag color="blue">盒柜</Tag>,
      '2': <Tag color="green">直购</Tag>,
      '3': <Tag color="gold">抽选</Tag>,
    };
    const auditExpress = {
      SF: '顺丰速运',
      YTO: '圆通快递',
      ZTO: '中通快递',
      YD: '韵达快递',
      HTKY: '百世快递',
      EMS: 'EMS',
      HHTT: '天天快递',
      JD: '京东快递',
      UC: '优速快递',
      YZPY: '邮政快递包裹',
      UNKNOWN: '未知快递',
    };
    const productColumns = [
      {
        title: '图片',
        dataIndex: 'image',
        align: 'center',
        render: val => <img alt="nothing" height="60" src={val} />,
      },
      {
        title: '名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '产品ID',
        dataIndex: 'product_id',
        align: 'center',
      },
      {
        title: '数量',
        dataIndex: 'quantity',
        align: 'center',
      },
      {
        title: '单价',
        dataIndex: 'price',
        align: 'center',
        render: price => <span>¥{price / 100}</span>,
      },
      // {
      //   title: '操作',
      //   align: 'center',
      //   render: (_, record) =>
      //     record.removed ? (
      //       <a disabled>已拆单</a>
      //     ) : (
      //       <Popconfirm
      //         title="确认删除该商品?"
      //         icon={<ExclamationCircleOutlined />}
      //         onConfirm={e => this.handleSplit(e, record)}
      //       >
      //         <a>拆单</a>
      //       </Popconfirm>
      //     ),
      // },
    ];
    const paymentsColumns = [
      {
        title: '支付编号',
        dataIndex: 'outTradeNo',
        align: 'center',
      },
      {
        title: 'ID',
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: '金额',
        dataIndex: 'fee',
        align: 'center',
        render: fee => <span>¥{fee / 100}</span>,
      },
      {
        title: '优惠金额',
        dataIndex: 'deduct',
        align: 'center',
        render: deduct => (deduct !== '-' ? <span>¥{deduct / 100}</span> : '-'),
      },
      {
        title: '购买人',
        dataIndex: 'user',
        align: 'center',
        render: user => <CustomerLink user={user} />,
      },
      {
        title: '支付类型',
        dataIndex: 'body',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'status',
        align: 'center',
        filters: false,
        valueEnum: {
          0: {
            text: '未付款',
            status: 'Default',
          },
          1: {
            text: '已付款',
            status: 'Success',
          },
          2: {
            text: '已退款',
            status: 'Warning',
          },
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createAt',
        align: 'center',
        render: val => (val === '-' ? '' : moment(val).format('YYYY-MM-DD HH:mm:ss')),
      },
    ];
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Button
            style={{ float: 'right' }}
            size="mini"
            type="primary"
            onClick={() => this.setState({ updateModalVisible: true })}
          >
            编辑
          </Button>
          <Descriptions title="用户信息" style={{ marginBottom: 32 }}>
            <Descriptions.Item label="买家昵称" key="buyer">
              {' '}
              {orderDetail.buyer ? orderDetail.buyer.nickname : '无'}
            </Descriptions.Item>
            <Descriptions.Item label="姓名" key="name">
              {' '}
              {orderDetail.name}
            </Descriptions.Item>
            <Descriptions.Item label="联系方式" key="phone">
              {' '}
              {orderDetail.phone}
            </Descriptions.Item>
            <Descriptions.Item label="地址" key="address">
              {orderDetail.address}
            </Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginBottom: 32 }} />
          <Descriptions title="订单信息" style={{ marginBottom: 32 }}>
            <Descriptions.Item label="订单ID" key="id">
              {orderDetail.id}
            </Descriptions.Item>
            <Descriptions.Item label="订单号" key="orderNo">
              <Text copyable>{orderDetail.orderNo}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="订单状态" key="status">
              {' '}
              {auditStatus[orderDetail.status]}
            </Descriptions.Item>
            <Descriptions.Item label="物流公司" key="expressId">
              {' '}
              {orderDetail.expressId ? auditExpress[orderDetail.expressId] : '无'}
            </Descriptions.Item>
            <Descriptions.Item label="快递单号" key="expressNo">
              {' '}
              {orderDetail.expressNo ? (
                <a
                  href={`https://m.kuaidi100.com/result.jsp?nu=${orderDetail.expressNo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {orderDetail.expressNo}
                </a>
              ) : (
                '无'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="来源" key="type">
              {typeStatus[orderDetail.type]}
            </Descriptions.Item>
            <Descriptions.Item label="备注" key="remark">
              {' '}
              {orderDetail.remark ? orderDetail.remark : '无'}
            </Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>订单商品</div>
          <Table
            rowKey="id"
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={loading}
            dataSource={orderDetail.detail}
            columns={productColumns}
          />
          <div className={styles.title}>支付信息</div>
          <ProTable
            search={false}
            toolBarRender={false}
            rowKey="id"
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={loading}
            dataSource={orderDetail.payments}
            columns={paymentsColumns}
          />
        </Card>
        {/* 编辑详情 */}
        <UpdateForm
          order={orderDetail}
          onSubmit={this.handleUpdate}
          onCancel={() => this.setState({ updateModalVisible: false })}
          modalVisible={updateModalVisible}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ orderDetail, loading }) => ({
  orderDetail,
  loading: loading.effects['orderDetail/getBox'],
}))(orderDetailList);
