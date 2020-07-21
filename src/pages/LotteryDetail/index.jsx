import React, { Component } from 'react';
import { connect } from 'dva';
import {
  // Avatar,
  Typography,
  Descriptions,
  Button,
  Card,
  Table,
  Tag,
  Popconfirm,
  message,
  Divider,
} from 'antd';
import { GridContent, PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import moment from 'moment';
// import ProTable from '@ant-design/pro-table';
import CustomerLink from '@/components/Common/CustomerLink';
import { ExclamationCircleOutlined, LoadingOutlined } from '@ant-design/icons';
// import Link from 'umi/link';
import { saveAs } from 'file-saver';
import HtmlEditor from '@/components/Common/HtmlEditor';
import ProductSearch from '@/components/Common/ProductSearch';
import UpdateForm from './components/UpdateForm';
import WinnerList from './components/WinnerList';
import LotteryProductEditForm from './components/LotteryProductEditForm';
import styles from './style.less';

const { Text, Paragraph, Title } = Typography;
class LotteryDetail extends Component {
  // 初始化状态
  state = {
    tabActiveKey: 'tab1',
    updateModalVisible: false,
    ProductEditModalVisible: false,
    detailHtml: '',
    detailVisible: false,
    productDetail: '',
    loadingExport: false,
  };

  // 生命周期函数 第一次渲染后调用
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'lotteryDetail/getLottery',
      payload: { id: this.props.match.params.id },
    });
    dispatch({
      type: 'lotteryDetail/getWinners',
      payload: { id: this.props.match.params.id },
    });
  }

  // 审核通过与拒绝
  handleAudit = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'lotteryDetail/auditLottery',
      payload: { id: this.props.match.params.id, status: e },
    }).then(() => {
      dispatch({
        type: 'lotteryDetail/getLottery',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 取消
  cancelPrizeFn = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'lotteryDetail/cancelPrize',
      payload: { id: this.props.match.params.id, userId: e },
    }).then(() => {
      dispatch({
        type: 'lotteryDetail/getLottery',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 补抽
  handleRedraw = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'lotteryDetail/auditRedraw',
      payload: { id: this.props.match.params.id },
    }).then(() => {
      dispatch({
        type: 'lotteryDetail/getWinners',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 活动下线操作
  handleOff = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'lotteryDetail/offLottery',
      payload: { id: this.props.match.params.id },
    }).then(() => {
      dispatch({
        type: 'lotteryDetail/getLottery',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 编辑=>保存详情
  handleUpdate = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'lotteryDetail/updateLottery',
      payload: params,
    }).then(() => {
      this.setState({ updateModalVisible: false });
      dispatch({
        type: 'lotteryDetail/getLottery',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 删除盲盒产品配置
  removeBoxProduct = productId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'lotteryDetail/deleteBoxProduct',
      payload: { id: this.props.match.params.id, productId },
    }).then(() => {
      dispatch({
        type: 'lotteryDetail/getLottery',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 中奖名单导出
  handleDownloadClick = e => {
    this.setState({ loadingExport: true });
    e.preventDefault();
    const { dispatch } = this.props;
    const fileName = `中奖名单_抽选${this.props.match.params.id}.csv`;
    dispatch({
      type: 'lotteryDetail/download',
      payload: { sourceId: this.props.match.params.id, type: 3 },
      callback: blob => {
        saveAs(new Blob([blob], { type: 'text/csv;charset=utf-8' }), fileName);
      },
    });
    this.setState({ loadingExport: false });
  };

  // 编辑=>修改商品
  handleProductEdit = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'lotteryDetail/updateLotteryProduct',
      payload: { id: this.props.match.params.id, params },
    }).then(() => {
      this.setState({ ProductEditModalVisible: false });
      dispatch({
        type: 'lotteryDetail/getLottery',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 产品编辑=>增加商品
  handleAddBoxProduct = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'lotteryDetail/addLotteryProduct',
      payload: { id: this.props.match.params.id, ...params },
    }).then(() => {
      message.success('添加成功');
      this.setState({ searchProductId: undefined });
      dispatch({
        type: 'lotteryDetail/getLottery',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 图文保存
  handleDetailUpdate = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'lotteryDetail/updateDetailLottery',
      payload: { detail: this.state.detailHtml, id: this.props.match.params.id },
    }).then(() => {
      this.setState({ detailVisible: false });
      dispatch({
        type: 'lotteryDetail/getLottery',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  render() {
    const {
      lotteryDetail,
      // winnerList
    } = this.props.lotteryDetail;
    // const prizeList = winnerList ? winnerList.list : [];
    const { tabActiveKey, updateModalVisible, ProductEditModalVisible } = this.state;
    const miniUrl = `/pages/lottery/detail/detail?id=${this.props.match.params.id}`;
    const { searchProductId, searchProductName, loadingExport } = this.state;
    // 操作按钮
    const action = (
      <div>
        <Popconfirm
          cancelText="拒绝"
          okText="通过"
          title="确认审核通过吗？"
          disabled={lotteryDetail.auditStatus !== 0}
          onConfirm={() => this.handleAudit(1)}
          onCancel={() => this.handleAudit(-1)}
        >
          <Button disabled={lotteryDetail.auditStatus !== 0} style={{ marginLeft: 10 }}>
            审核
          </Button>
        </Popconfirm>
        <Popconfirm
          cancelText="取消"
          okText="确认"
          title="确认下线吗？"
          disabled={lotteryDetail.status !== 1}
          onConfirm={() => this.handleOff()}
        >
          <Button disabled={lotteryDetail.status !== 1} style={{ marginLeft: 10 }}>
            下线
          </Button>
        </Popconfirm>
        <Button
          style={{ marginLeft: 10 }}
          type="primary"
          onClick={() => this.setState({ updateModalVisible: true })}
        >
          编辑
        </Button>
      </div>
    );

    // 详情静态显示
    const description = (
      <RouteContext.Consumer>
        {({ isMobile }) => (
          <Descriptions className={styles.headerList} column={isMobile ? 2 : 4} bordered>
            <Descriptions.Item label="创建人">
              <CustomerLink user={lotteryDetail.publisher} />
            </Descriptions.Item>
            <Descriptions.Item label="保证金金额">
              {lotteryDetail.price > 0 ? `${lotteryDetail.price / 100}元` : '无保证金'}
            </Descriptions.Item>
            <Descriptions.Item label="开奖方式" key="type">
              {lotteryDetail.type === 1 ? (
                <Tag color="green">按时间开奖</Tag>
              ) : (
                <Tag color="blue">按人数开奖</Tag>
              )}
            </Descriptions.Item>
            {lotteryDetail.type === 1 ? (
              <Descriptions.Item label="开奖时间">
                {moment(lotteryDetail.endAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            ) : (
              <Descriptions.Item label="开奖人数">{lotteryDetail.maxNum}</Descriptions.Item>
            )}
            <Descriptions.Item label="首页可见">
              {lotteryDetail.isPublic ? <Tag color="green">是</Tag> : <Tag>否</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="允许兑换签号">
              {lotteryDetail.allowRedeem ? <Tag color="green">是</Tag> : <Tag>否</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="允许分享">
              {lotteryDetail.allowShare ? <Tag color="green">是</Tag> : <Tag>否</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="允许好友助力">
              {lotteryDetail.allowHelp ? <Tag color="green">是</Tag> : <Tag>否</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="微信描述">
              {lotteryDetail.wechat ? lotteryDetail.wechat.descrption : '无'}
            </Descriptions.Item>
            <Descriptions.Item label="微信号">
              {lotteryDetail.wechat ? lotteryDetail.wechat.id : '无'}
            </Descriptions.Item>
            <Descriptions.Item label="参与人数">{lotteryDetail.participantNum}</Descriptions.Item>
            <Descriptions.Item label="抽选开始时间">
              {lotteryDetail.openAt
                ? moment(lotteryDetail.openAt).format('YYYY-MM-DD HH:mm:ss')
                : ''}
            </Descriptions.Item>
            <Descriptions.Item label="小程序路径" span={isMobile ? 2 : 4}>
              <Text copyable>{miniUrl}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="说明" span={isMobile ? 2 : 4}>
              <Paragraph style={{ whiteSpace: 'pre-wrap' }}>{lotteryDetail.description}</Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="封面图">
              <img src={lotteryDetail.coverUrl} width="80" alt="cover" />
            </Descriptions.Item>
          </Descriptions>
        )}
      </RouteContext.Consumer>
    );

    const productColumns = [
      {
        title: '序号',
        align: 'center',
        render: (text, record, index) => `${index + 1}`,
      },
      {
        title: '产品ID',
        dataIndex: 'productId',
        align: 'center',
      },
      {
        title: '产品图',
        dataIndex: 'productImageUrl',
        align: 'center',
        render: val => <img alt="nothing" height="70" src={val} />,
      },
      {
        title: '名称',
        align: 'center',
        dataIndex: 'productName',
      },
      {
        title: '单价',
        dataIndex: 'price',
        align: 'center',
        render: price => `¥ ${price / 100}`,
      },

      {
        title: '数量',
        align: 'center',
        dataIndex: 'quantity',
      },
      {
        title: '操作',
        hideInSearch: true,
        dataIndex: 'id',
        align: 'center',
        render: (_, record) => (
          <>
            <a
              onClick={() =>
                this.setState({ productDetail: record, ProductEditModalVisible: true })
              }
            >
              编辑
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除该商品?"
              icon={<ExclamationCircleOutlined />}
              onConfirm={() => this.removeBoxProduct(record.productId)}
            >
              <a>删除</a>
            </Popconfirm>
          </>
        ),
      },
    ];
    // const winnerColumns = [
    //   {
    //     title: '中签用户',
    //     align: 'center',
    //     render: (_, record) => <CustomerLink user={record} />,
    //   },
    //   {
    //     title: '头像',
    //     dataIndex: 'avatar',
    //     align: 'center',
    //     render: val => <Avatar alt="nothing" shape="square" size={50} src={val} />,
    //   },
    //   {
    //     title: '手机号',
    //     dataIndex: 'mobile',
    //     align: 'center',
    //   },
    //   {
    //     title: '签号',
    //     dataIndex: 'code',
    //     align: 'center',
    //   },
    //   {
    //     title: '资格',
    //     dataIndex: 'qualify',
    //     align: 'center',
    //     render: qualify => (qualify ? <Text>有</Text> : <Text type="danger">无</Text>),
    //   },
    //   {
    //     title: '奖品',
    //     dataIndex: 'productName',
    //     align: 'center',
    //   },
    //   {
    //     title: '订单ID',
    //     dataIndex: ['order', 'id'],
    //     align: 'center',
    //     render: val => <Link to={`/order/${val}/detail`}>{val}</Link>,
    //   },
    //   {
    //     title: '订单状态',
    //     dataIndex: ['order', 'status'],
    //     align: 'center',
    //     valueEnum: {
    //       '0': {
    //         text: '需要确认/支付',
    //         status: 'Warning',
    //       },
    //       '1': {
    //         text: '等待发货',
    //         status: 'Success',
    //       },
    //       '2': {
    //         text: '已发货',
    //         status: 'Success',
    //       },
    //       '3': {
    //         text: '已完成',
    //         status: 'Default',
    //       },
    //       '-1': {
    //         text: '订单关闭/取消',
    //         status: 'Default',
    //       },
    //     },
    //   },
    //   {
    //     title: '操作',
    //     align: 'center',
    //     render: (_, record) => (
    //       <>
    //         <Popconfirm
    //           title="确认取消该资格?"
    //           icon={<ExclamationCircleOutlined />}
    //           onConfirm={() => this.cancelPrizeFn(record.id)}
    //         >
    //           <a disabled={!record.qualify}>取消资格</a>
    //         </Popconfirm>
    //       </>
    //     ),
    //   },
    // ];
    const html = lotteryDetail.detail;
    const contentList = {
      tab1: (
        <Card title="产品" style={{ marginBottom: 24 }}>
          <ProductSearch
            title={12}
            value={searchProductId}
            className={styles.tableOperations}
            onChange={(val, title) =>
              this.setState({ searchProductId: val, searchProductName: title.label })
            }
          />
          <Button
            className={styles.tableOperations}
            disabled={!searchProductId}
            type="primary"
            onClick={() =>
              this.handleAddBoxProduct({
                productId: searchProductId,
                price: 0,
                productName: searchProductName,
                quantity: 0,
              })
            }
          >
            添加产品
          </Button>
          <Table
            rowKey={row => row.productId}
            columns={productColumns}
            dataSource={lotteryDetail.products}
            size="small"
            pagination={false}
            bordered
          />
        </Card>
      ),
      tab2: (
        <Card
          title="图文描述"
          style={{ marginBottom: 24 }}
          extra={
            <>
              <Button
                style={!this.state.detailVisible ? { display: 'none' } : { marginRight: 10 }}
                size="small"
                onClick={() => this.setState({ detailVisible: false })}
              >
                取消
              </Button>
              <Button
                style={!this.state.detailVisible ? { display: 'none' } : { marginRight: 10 }}
                type="primary"
                size="small"
                onClick={this.handleDetailUpdate}
              >
                保存
              </Button>
              <Button
                style={this.state.detailVisible ? { display: 'none' } : {}}
                type="primary"
                size="small"
                onClick={() => this.setState({ detailVisible: true, detailHtml: html })}
              >
                编辑
              </Button>
            </>
          }
        >
          {this.state.detailVisible ? (
            <HtmlEditor html={html} callback={detailHtml => this.setState({ detailHtml })} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: html }} />
          )}
        </Card>
      ),
      tab3: (
        <Card title="中奖名单" style={{ marginBottom: 24 }}>
          <Button style={{ marginBottom: 10 }} type="primary" onClick={this.handleDownloadClick}>
            {loadingExport ? <LoadingOutlined /> : ''}
            导出订单
          </Button>
          <Popconfirm
            cancelText="取消"
            okText="通过"
            title="确认补抽吗？"
            disabled={lotteryDetail.status === 1}
            onConfirm={() => this.handleRedraw()}
          >
            <Button disabled={lotteryDetail.status === 1} style={{ marginLeft: 10 }} type="primary">
              补抽
            </Button>
          </Popconfirm>
          {/* <ProTable
            search={false}
            toolBarRender={false}
            rowKey="content"
            columns={winnerColumns}
            dataSource={prizeList}
            size="small"
            pagination={false}
            bordered
          /> */}
          <WinnerList lotteryId={this.props.match.params.id} />
        </Card>
      ),
    };

    const auditTag = {
      '-1': <Tag color="default">无需审核</Tag>,
      '0': <Tag color="warning">等待审核</Tag>,
      '1': <Tag color="green">已审核通过</Tag>,
      '2': <Tag color="error">审核已拒绝</Tag>,
    };
    const statusTag = {
      '1': <Tag color="green">抽选进行中</Tag>,
      '2': <Tag color="default">抽选已结束</Tag>,
      '-2': <Tag color="default">抽选已下线</Tag>,
    };

    return (
      <PageHeaderWrapper
        title={
          <>
            <Title level={3} style={{ marginBottom: 0 }}>
              抽选详情 {auditTag[lotteryDetail.auditStatus]} {statusTag[lotteryDetail.status]}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              上次编辑时间: {moment(lotteryDetail.updateAt).format('YYYY-MM-DD HH:mm:ss')}
            </Text>
          </>
        }
        extra={action}
        className={styles.pageHeader}
        content={description}
        tabActiveKey={tabActiveKey}
        onTabChange={key => this.setState({ tabActiveKey: key })}
        tabList={[
          {
            key: 'tab1',
            tab: '产品',
          },
          {
            key: 'tab2',
            tab: '图文描述',
          },
          {
            key: 'tab3',
            tab: '中奖名单',
          },
        ]}
      >
        <div className={styles.main}>
          <GridContent>{contentList[tabActiveKey]}</GridContent>
        </div>
        {/* 编辑详情 */}
        <UpdateForm
          lottery={lotteryDetail}
          onSubmit={this.handleUpdate}
          onCancel={() => this.setState({ updateModalVisible: false })}
          modalVisible={updateModalVisible}
        />
        {/* 商品编辑 */}
        <LotteryProductEditForm
          product={this.state.productDetail}
          onSubmit={this.handleProductEdit}
          onCancel={() => this.setState({ ProductEditModalVisible: false })}
          modalVisible={ProductEditModalVisible}
        />
        {/* 组件 */}
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ lotteryDetail, loading }) => ({
  lotteryDetail,
  loading: loading.effects['lotteryDetail/getLottery'],
}))(LotteryDetail);
