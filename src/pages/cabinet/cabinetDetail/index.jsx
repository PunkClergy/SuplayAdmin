import React, { Component } from 'react';
import { connect } from 'dva';
import { Typography, Card, Avatar, Popover, Descriptions, Tag, DatePicker } from 'antd';
import { PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { RightOutlined } from '@ant-design/icons';
import moment from 'moment';
import Link from 'umi/link';
import CustomerLink from '@/components/Common/CustomerLink';
import styles from './style.less';

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;
const rareTags = [<Tag>普通</Tag>, <Tag color="blue">稀有</Tag>, <Tag color="purple">隐藏</Tag>];
const linkText = [`/sales/box/`, `/shop/`, `/lottery/`, `/sales/LuckyBag/`];
const linkType = ['盲盒', '直购', '抽选', '福袋'];
const linkStatus = ['盒柜中', '已下单', '预定'];
const colorStatus = ['green', '', 'blue'];
class CabinetDetail extends Component {
  // 初始化状态
  state = {};

  // 生命周期函数 第一次渲染后调用
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cabinetDetail/getBox',
      payload: { id: this.props.match.params.id },
    });
  }

  render() {
    const { loading } = this.props;
    const cabinetContent = this.props.cabinetDetail.cabinetDetail;
    const { payment, switches } = cabinetContent;
    const cabinet = cabinetContent.cabinet ? cabinetContent.cabinet : '';
    console.log(cabinetContent);
    // 详情静态显示
    const description = (
      <RouteContext.Consumer>
        {({ isMobile }) => (
          <Descriptions className={styles.headerList} column={isMobile ? 2 : 4} bordered>
            <Descriptions.Item label="ID">{cabinet.id}</Descriptions.Item>
            <Descriptions.Item label="用户昵称">
              <CustomerLink user={cabinet.user} />
            </Descriptions.Item>

            <Descriptions.Item label="属性">{rareTags[cabinet.rare]}</Descriptions.Item>
            <Descriptions.Item label="交换">
              {' '}
              {cabinet.switch ? <Tag color="green">是</Tag> : <Tag color="orange">否</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="原价（元）">{cabinet.price / 100}</Descriptions.Item>
            <Descriptions.Item label="实际花费（元）">{cabinet.cost / 100}</Descriptions.Item>
            <Descriptions.Item label="来源ID">{cabinet.sourceId}</Descriptions.Item>
            <Descriptions.Item label="来源">
              <Link to={`${linkText[cabinet.sourceType - 1]}${cabinet.sourceId}/detail`}>
                {linkType[cabinet.sourceType - 1]}
                <RightOutlined />
              </Link>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              {cabinet.status === '-2' ? (
                <Tag>已销毁</Tag>
              ) : (
                <Tag color={colorStatus[cabinet.status]}>{linkStatus[cabinet.status]}</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="购买时间">
              {cabinet.createAt ? moment(cabinet.createAt).format('YYYY年MM月DD日 HH:mm:ss') : ''}
            </Descriptions.Item>
            <Descriptions.Item label="过期时间">
              {cabinet.expireAt ? moment(cabinet.expireAt).format('YYYY年MM月DD日 HH:mm:ss') : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="到货时间">
              {cabinet.predictAt
                ? moment(cabinet.predictAt).format('YYYY年MM月DD日 HH:mm:ss')
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="商品名称">{cabinet.name}</Descriptions.Item>
            <Descriptions.Item label="商品图片">
              <img src={cabinet.image} width="100" alt="" />
            </Descriptions.Item>
          </Descriptions>
        )}
      </RouteContext.Consumer>
    );
    const paymentsColumns = [
      {
        title: '订单编号',
        dataIndex: 'outTradeNo',
        hideInSearch: true,
        align: 'center',
      },
      {
        title: '用户昵称',
        hideInSearch: true,
        dataIndex: 'user',
        align: 'center',
        render: user => <CustomerLink user={user} />,
      },
      {
        title: '头像',
        dataIndex: ['user', 'avatar'],
        hideInSearch: true,
        width: 70,
        align: 'center',
        render: avatar => <Avatar alt="nothing" shape="square" size={60} src={avatar} />,
      },
      {
        title: '类型',
        dataIndex: 'feeType',
        filters: false,
        align: 'center',
        valueEnum: {
          1: {
            text: '定金参与',
          },
          2: {
            text: '支付订单',
          },
          3: {
            text: '购买盲盒',
          },

          4: {
            text: '直购商品',
          },
          5: {
            text: '盒柜发货',
          },
          6: {
            text: '购买福袋',
          },
          7: {
            text: '盲盒端盒',
          },
        },
      },
      {
        title: '金额',
        dataIndex: 'fee',
        hideInSearch: true,
        align: 'center',
        render: fee => <span>¥{fee / 100}</span>,
      },
      {
        title: '减免金额',
        dataIndex: 'deduct',
        hideInSearch: true,
        align: 'center',
        render: deduct =>
          deduct !== '-' ? <span style={{ color: 'red' }}>¥{deduct / 100}</span> : '-',
      },
      {
        title: '数据',
        hideInSearch: true,
        textWrap: 'word-break',
        ellipsis: true,
        dataIndex: 'description',
        width: 175,
      },

      {
        title: '状态',
        dataIndex: 'status',
        filters: false,
        align: 'center',
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
        title: '退款详情',
        hideInSearch: true,
        align: 'center',
        render: (_, record) =>
          record.refundAt ? (
            <Popover
              content={
                <>
                  <div>
                    操作人：
                    {record.refundBy ? record.refundBy.nickname : '系统自动退款'}
                  </div>
                  <div>
                    退款时间：
                    {record.refundAt ? moment(record.refundAt).format('YYYY-MM-DD HH:SS:MM') : ''}
                  </div>
                  <div>
                    退款原因：
                    {record.refundReason ? record.refundReason : ''}
                  </div>
                  <div>
                    退款失败信息：
                    {record.refundError ? record.refundError : ''}
                  </div>
                </>
              }
            >
              <a>退款详情</a>
            </Popover>
          ) : (
            <></>
          ),
      },
      {
        title: '时间',
        dataIndex: 'createAt',
        valueType: 'dateTime',
        align: 'center',
        renderFormItem: () => <RangePicker />,
      },
    ];
    const switchColumns = [
      {
        title: 'ID',
        dataIndex: 'id',
        sorter: true,
        hideInSearch: true,
        align: 'center',
      },
      {
        title: '发起方',
        children: [
          {
            title: '头像',
            dataIndex: ['from', 'avatar'],
            valueType: 'avatar',
            align: 'center',
          },
          {
            title: '昵称',
            dataIndex: 'from',
            align: 'center',
            render: user => <CustomerLink user={user} />,
          },
          {
            title: '产品名称',
            dataIndex: 'fromCabinets',
            width: 240,
            align: 'center',
            render: cabinetNames => (
              <>
                {cabinetNames.map(name => (
                  <Text code>{name}</Text>
                ))}
              </>
            ),
          },
        ],
      },
      {
        title: '接受方',
        children: [
          {
            title: '头像',
            dataIndex: ['to', 'avatar'],
            valueType: 'avatar',
            align: 'center',
          },
          {
            title: '昵称',
            dataIndex: 'to',
            align: 'center',
            render: user => <CustomerLink user={user} />,
          },
          {
            title: '产品名称',
            dataIndex: 'toCabinets',
            width: 240,
            align: 'center',
            render: cabinetNames => (
              <>
                {cabinetNames.map(name => (
                  <Text code>{name}</Text>
                ))}
              </>
            ),
          },
        ],
      },
      {
        title: '状态',
        dataIndex: 'status',
        filters: false,
        align: 'center',
        width: 100,
        valueEnum: {
          '0': {
            text: '等待',
            status: 'Warning',
          },
          '1': {
            text: '接受',
            status: 'Success',
          },
          '2': {
            text: '拒绝',
            status: 'Error',
          },
          '-1': {
            text: '取消',
            status: 'Default',
          },
        },
      },
      {
        title: '说明',
        dataIndex: 'content',
        hideInSearch: true,
        align: 'center',
        width: 150,
      },
      {
        title: '创建时间',
        dataIndex: 'createAt',
        valueType: 'dateTime',
        hideInSearch: true,
        align: 'center',
      },
    ];
    return (
      <>
        <PageHeaderWrapper
          title={
            <>
              <Title level={3} style={{ marginBottom: 0 }}>
                基础信息
              </Title>
            </>
          }
          className={styles.pageHeader}
          content={description}
        >
          <Card bordered={false}>
            <div className={styles.title}>支付信息</div>
            <ProTable
              bordered
              rowKey="id"
              search={false}
              toolBarRender={false}
              style={{ marginBottom: 24, marginTop: 24 }}
              pagination={false}
              loading={loading}
              dataSource={payment}
              columns={paymentsColumns}
            />{' '}
            <div className={styles.title}>交换信息</div>
            <ProTable
              bordered
              rowKey="id"
              search={false}
              toolBarRender={false}
              style={{ marginBottom: 24, marginTop: 24 }}
              pagination={false}
              loading={loading}
              dataSource={switches}
              columns={switchColumns}
            />{' '}
          </Card>
        </PageHeaderWrapper>
      </>
    );
  }
}

export default connect(({ cabinetDetail, loading }) => ({
  cabinetDetail,
  loading: loading.effects['cabinetDetail/getBox'],
}))(CabinetDetail);
