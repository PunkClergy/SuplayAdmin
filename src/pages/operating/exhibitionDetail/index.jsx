import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import {
  Button,
  Card,
  Divider,
  Popconfirm,
  message,
  Tag,
  Upload,
  Row,
  Col,
  Typography,
  Descriptions,
} from 'antd';
import moment from 'moment';
import ProTable from '@ant-design/pro-table';
import { GridContent, PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import {
  ExclamationCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
  FormOutlined,
} from '@ant-design/icons';
import UpdateForm from './components/UpdateForm';
import UpdateLive from './components/UpdateLive';
import EditForm from './components/EditForm';
import ProductCrad from '@/components/Common/productCard';
import LiveRoomCard from '@/components/Common/LiveRoomCard';
import LuckBagsCard from '@/components/Common/LuckBagsCard';
import LotteriesCard from '@/components/Common/LotteriesCard';
import styles from './style.less';
import { imageUploadProps } from '../../../utils/utils';

const { Text, Title } = Typography;
class ExhibitionDetail extends Component {
  // 初始化状态
  state = {
    productId: undefined,
    luckyBag: undefined,
    lotterie: undefined,
    liveRoom: undefined,
    updateModalVisible: false,
    updateLiveModalVisible: false,
    liveId: null,
    titleContent: null,
    editorModal: false,
  };

  // 生命周期函数 第一次渲染后调用
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'exhibitionDetail/fetchExhibitions',
      payload: { id: this.props.match.params.id },
    });
  }

  // 编辑=>保存详情
  handleUpdate = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'exhibitionDetail/updateExhibition',
      payload: params,
    }).then(() => {
      this.setState({ updateModalVisible: false });
      dispatch({
        type: 'exhibitionDetail/fetchExhibitions',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 编辑保存直播进程
  handleUpdateLive = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'exhibitionDetail/updateLiveDetail',
      payload: { id: this.props.match.params.id, ...params },
    }).then(() => {
      this.setState({ updateLiveModalVisible: false });
      dispatch({
        type: 'exhibitionDetail/fetchExhibitions',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 添加productIds产品配置
  handleAddBoxProduct = (params, keys) => {
    const productId = [];
    params.productIds.map(item => productId.push(item.value));
    const { dispatch } = this.props;
    dispatch({
      type: 'exhibitionDetail/addexhibition',
      payload: { id: this.props.match.params.id, productIds: productId, key: keys },
    }).then(() => {
      message.success('添加成功');
      this.setState({
        productId: undefined,
        luckyBag: undefined,
        lotterie: undefined,
        liveRoom: undefined,
      });
      dispatch({
        type: 'exhibitionDetail/fetchExhibitions',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 删除商品
  removeBoxProduct = (params, keys) => {
    const { dispatch } = this.props;
    const paramsId = [params];
    dispatch({
      type: 'exhibitionDetail/deleteExhibition',
      payload: { id: this.props.match.params.id, productIds: paramsId, key: keys },
    }).then(() => {
      message.success('删除成功');
      this.setState({
        productId: undefined,
        luckyBag: undefined,
        lotterie: undefined,
        liveRoom: undefined,
      });
      dispatch({
        type: 'exhibitionDetail/fetchExhibitions',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 添加直播进程图片
  addDetailImage = (e, index) => {
    if (e.file.status === 'done' && e.file.response) {
      const { dispatch } = this.props;
      dispatch({
        type: 'exhibitionDetail/addLiveDetail',
        payload: { date: index, image: e.file.response.data.imageKey },
      }).then(() => {
        dispatch({
          type: 'exhibitionDetail/fetchExhibitions',
          payload: {},
        });
      });
    }
    return null;
  };

  // 添加合作品牌
  addPartnerImage = e => {
    if (e.file.status === 'done' && e.file.response) {
      const { dispatch } = this.props;
      dispatch({
        type: 'exhibitionDetail/addDetailImage',
        payload: { id: this.props.match.params.id, image: e.file.response.data.imageKey },
      }).then(() => {
        dispatch({
          type: 'exhibitionDetail/fetchExhibitions',
          payload: { id: this.props.match.params.id },
        });
      });
    }
    return null;
  };

  // 编辑直播日程弹窗
  handleGetDetail = e => {
    this.setState({ updateLiveModalVisible: true, liveId: e });
  };

  // 修改标题弹窗
  handEditorTitle = (key, title) => {
    const titleBox = {
      key,
      title,
    };
    this.setState({ titleContent: titleBox, editorModal: true });
  };

  // 修改标题
  handleUpdateTitle = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'exhibitionDetail/updateTitle',
      payload: { id: this.props.match.params.id, ...params },
    }).then(() => {
      this.setState({ editorModal: false });
      dispatch({
        type: 'exhibitionDetail/fetchExhibitions',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 归档
  handArchive = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'exhibitionDetail/updateArchive',
      payload: { id: this.props.match.params.id },
    }).then(() => {
      this.setState({ editorModal: false });
      dispatch({
        type: 'exhibitionDetail/fetchExhibitions',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  render() {
    const { exhibitionDetail } = this.props.exhibitionDetail;
    const products = exhibitionDetail.detail ? exhibitionDetail.detail.product : '';
    const liveRooms = exhibitionDetail.detail ? exhibitionDetail.detail.liveRoom : '';
    const liveSchedules = exhibitionDetail.detail ? exhibitionDetail.detail.liveSchedule : '';
    const lotterys = exhibitionDetail.detail ? exhibitionDetail.detail.lottery : '';
    const luckyBags = exhibitionDetail.detail ? exhibitionDetail.detail.luckyBag : '';
    const partners = exhibitionDetail.detail ? exhibitionDetail.detail.partner : '';
    const url = 'http://img.suplaymart.com/';
    const miniUrl = `/pages/exhibition/index/index?id=${this.props.match.params.id}`;
    const action = (
      <div>
        <Popconfirm
          disabled={exhibitionDetail.archived}
          title="确认该归档吗？"
          onConfirm={() => this.handArchive()}
        >
          <Button disabled={exhibitionDetail.archived}>归档</Button>
        </Popconfirm>
        <Button
          type="primary"
          onClick={() => this.setState({ updateModalVisible: true })}
          style={{ marginLeft: 10 }}
          // disabled={exhibitionDetail.archived}
        >
          编辑
        </Button>
      </div>
    );

    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">上传</div>
      </div>
    );
    const {
      productId,
      luckyBag,
      lotterie,
      liveRoom,
      updateModalVisible,
      updateLiveModalVisible,
      liveId,
      titleContent,
      editorModal,
    } = this.state;
    const productColumns = [
      {
        title: 'ID',
        dataIndex: 'sourceId',
        hideInSearch: true,
        align: 'center',
      },
      {
        title: '卡片名称',
        dataIndex: 'name',
        width: 200,
        align: 'center',
      },
      {
        title: '图片',
        dataIndex: 'coverUrl',
        hideInSearch: true,
        width: 90,
        align: 'center',
        render: coverUrl => <img alt="nothing" height={70} src={coverUrl} />,
      },
      {
        title: '状态',
        dataIndex: 'status',
        align: 'center',
        valueEnum: {
          0: {
            text: '已下架',
            status: 'Error',
          },
          1: {
            text: '上架中',
            status: 'Success',
          },
        },
      },

      {
        title: '价格（元）',
        dataIndex: 'price',
        hideInSearch: true,
        align: 'center',
        render: price => <span>¥ {price / 100}</span>,
      },
      {
        title: '类型',
        dataIndex: 'type',
        hideInSearch: true,
        align: 'center',
        render: type => (
          <span>
            <Tag color={type === 1 ? 'blue' : 'green'} key={type}>
              {type === 1 ? '盲盒' : '直购'}
            </Tag>
          </span>
        ),
      },
      {
        title: '开售时间',
        dataIndex: 'openAt',
        valueType: 'dateTime',
        align: 'center',
      },
      {
        title: '操作',
        align: 'center',
        render: (_, record) => (
          <>
            {record.type === 1 ? (
              <Link to={`/sales/box/${record.sourceId}/detail`}>查看</Link>
            ) : (
              <Link to={`/shop/${record.sourceId}/detail`}>查看</Link>
            )}
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除该商品?"
              icon={<ExclamationCircleOutlined />}
              onConfirm={() => this.removeBoxProduct(record.id, 'product')}
            >
              <a>删除</a>
            </Popconfirm>
          </>
        ),
      },
    ];
    const lotteryColumns = [
      {
        title: 'ID',
        dataIndex: 'id',
        hideInSearch: true,
        align: 'center',
      },
      {
        title: '抽选名称',
        width: 200,
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '图片',
        dataIndex: 'coverUrl',
        hideInSearch: true,
        width: 90,
        align: 'center',
        render: cover => <img alt="nothing" height={70} src={cover} />,
      },
      {
        title: '审核状态',
        dataIndex: 'auditStatus',
        align: 'center',
        valueEnum: {
          '-1': {
            text: '无需审核',
            status: 'Default',
          },
          '0': {
            text: '待审核',
            status: 'Warning',
          },
          '1': {
            text: '已通过',
            status: 'Success',
          },
          '2': {
            text: '已拒绝',
            status: 'Error',
          },
        },
      },
      {
        title: '抽选状态',
        dataIndex: 'status',
        align: 'center',
        valueEnum: {
          '1': {
            text: '进行中',
            status: 'Success',
          },
          '2': {
            text: '已结束',
            status: 'Default',
          },
          '-2': {
            text: '已下线',
            status: 'Warning',
          },
        },
      },
      {
        title: '开奖方式',
        dataIndex: 'type',
        hideInSearch: true,
        align: 'center',
        render: type =>
          type === 1 ? <Tag color="green">按时间开奖</Tag> : <Tag color="blue">按人数开奖</Tag>,
      },
      {
        title: '操作',
        align: 'center',
        render: (_, record) => (
          <>
            <Link to={`/lottery/${record.id}/detail`}>查看</Link>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除该商品?"
              icon={<ExclamationCircleOutlined />}
              onConfirm={() => this.removeBoxProduct(record.id, 'lottery')}
            >
              <a>删除</a>
            </Popconfirm>
          </>
        ),
      },
    ];
    const luckyBagColumns = [
      {
        title: 'ID',
        dataIndex: 'id',
        hideInSearch: true,
        align: 'center',
      },
      {
        title: '福袋名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '图片',
        dataIndex: 'coverUrl',
        hideInSearch: true,
        width: 90,
        align: 'center',
        render: coverUrl => <img alt="nothing" height={70} src={coverUrl} />,
      },
      {
        title: '价格',
        dataIndex: 'price',
        hideInSearch: true,
        align: 'center',
        render: price => <span>¥{price / 100}</span>,
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: 200,
        hideInSearch: true,
        align: 'center',
      },
      {
        title: '操作',
        align: 'center',
        render: (_, record) => (
          <>
            <Link to={`/sales/LuckyBag/${record.id}/detail`}>查看</Link>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除该商品?"
              icon={<ExclamationCircleOutlined />}
              onConfirm={() => this.removeBoxProduct(record.id, 'luckyBag')}
            >
              <a>删除</a>
            </Popconfirm>
          </>
        ),
      },
    ];
    const liveRoomColumns = [
      {
        title: 'RoomId',
        dataIndex: 'roomId',
        hideInSearch: true,
        align: 'center',
      },
      {
        title: '房间名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '图片',
        dataIndex: 'cover',
        hideInSearch: true,
        width: 90,
        align: 'center',
        render: cover => <img alt="nothing" height={70} src={cover} />,
      },
      {
        title: '开始时间',
        dataIndex: 'startAt',
        hideInSearch: true,
        align: 'center',
        render: time => {
          const times = moment(time * 1000).format('YYYY-MM-DD HH:ss:mm');
          return times;
        },
      },
      {
        title: '结束时间',
        dataIndex: 'endAt',
        hideInSearch: true,
        align: 'center',
        render: time => {
          const times = moment(time * 1000).format('YYYY-MM-DD HH:ss:mm');
          return times;
        },
      },
      {
        title: '描述',
        width: 200,
        dataIndex: 'description',
        hideInSearch: true,
        align: 'center',
      },
      {
        title: '操作',
        align: 'center',
        render: (_, record) => (
          <>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除该商品?"
              icon={<ExclamationCircleOutlined />}
              onConfirm={() => this.removeBoxProduct(record.roomId, 'liveRoom')}
            >
              <a>删除</a>
            </Popconfirm>
          </>
        ),
      },
    ];
    const liveScheduleColumns = [
      {
        title: '日期',
        dataIndex: 'date',
        hideInSearch: true,
        align: 'center',
        render: date => moment(date).format('LL'),
      },

      {
        title: '图片',
        dataIndex: 'imageUrl',
        hideInSearch: true,
        align: 'center',
        render: cover => (cover !== '-' ? <img alt="nothing" height={70} src={cover} /> : '-'),
      },

      {
        title: '操作',
        align: 'center',
        render: record => <a onClick={() => this.handleGetDetail(record)}>编辑</a>,
      },
    ];

    // 详情静态显示
    const description = (
      <RouteContext.Consumer>
        {({ isMobile }) => (
          <Descriptions className={styles.headerList} column={isMobile ? 2 : 4} bordered>
            <Descriptions.Item label="状态">
              {exhibitionDetail.status === '已结束' ? (
                <Tag color="red">{exhibitionDetail.status}</Tag>
              ) : (
                <Tag color="green">{exhibitionDetail.status}</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="开始时间">
              {moment(exhibitionDetail.startAt).format('YYYY年MM月DD日')}
            </Descriptions.Item>
            <Descriptions.Item label="结束时间" key="type">
              {moment(exhibitionDetail.endAt).format('YYYY年MM月DD日')}
            </Descriptions.Item>
            <Descriptions.Item label="显示状态">
              {exhibitionDetail.display ? <Tag color="green">显示</Tag> : <Tag>隐藏</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="背景颜色">{exhibitionDetail.bgColor}</Descriptions.Item>
            <Descriptions.Item label="展会指南" span={isMobile ? 2 : 4}>
              {exhibitionDetail.linkUrl ? exhibitionDetail.linkUrl : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="小程序路径" span={isMobile ? 2 : 4}>
              <Text copyable>{miniUrl}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="封面图">
              <img src={`${url}${exhibitionDetail.cover}`} width="100" alt="cover" />
            </Descriptions.Item>
            <Descriptions.Item label="标题图">
              {exhibitionDetail.titleBgImage ? (
                <img
                  src={`${url}${exhibitionDetail.titleBgImage}`}
                  width="100"
                  alt="titleBgImage"
                />
              ) : (
                '-'
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </RouteContext.Consumer>
    );
    return (
      <PageHeaderWrapper
        title={
          <>
            <Title level={3} style={{ marginBottom: 0 }}>
              {`${exhibitionDetail.name}`}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              创建时间: {moment(exhibitionDetail.createAt).format('YYYY-MM-DD HH:mm:ss')}
            </Text>
          </>
        }
        className={styles.pageHeader}
        extra={action}
        content={description}
      >
        <div className={styles.main}>
          <GridContent>
            <Card
              title={
                <>
                  <span> {products.title} </span> {` `}
                  <a onClick={() => this.handEditorTitle('product', products.title)}>
                    <FormOutlined />
                  </a>
                </>
              }
              style={{ marginBottom: 24 }}
            >
              <ProductCrad
                value={productId}
                className={styles.tableOperations}
                onChange={val => this.setState({ productId: val })}
              />
              <Button
                className={styles.tableOperations}
                disabled={!productId}
                type="primary"
                onClick={() => this.handleAddBoxProduct({ productIds: productId }, 'product')}
              >
                添加产品
              </Button>
              <ProTable
                rowKey="id"
                toolBarRender={false}
                search={false}
                columns={productColumns}
                dataSource={products.products}
                size="small"
                pagination={false}
                bordered
              />
            </Card>

            <Card
              title={
                <>
                  <span> {lotterys.title} </span> {` `}
                  <a onClick={() => this.handEditorTitle('lottery', lotterys.title)}>
                    <FormOutlined />
                  </a>
                </>
              }
              style={{ marginBottom: 24 }}
            >
              <LotteriesCard
                value={lotterie}
                className={styles.tableOperations}
                onChange={val => this.setState({ lotterie: val })}
              />
              <Button
                className={styles.tableOperations}
                disabled={!lotterie}
                type="primary"
                onClick={() => this.handleAddBoxProduct({ productIds: lotterie }, 'lottery')}
              >
                添加抽选
              </Button>
              <ProTable
                rowKey="id"
                toolBarRender={false}
                search={false}
                columns={lotteryColumns}
                dataSource={lotterys.products}
                size="small"
                pagination={false}
                bordered
              />
            </Card>

            <Card
              title={
                <>
                  <span> {luckyBags.title} </span> {` `}
                  <a onClick={() => this.handEditorTitle('luckyBag', luckyBags.title)}>
                    <FormOutlined />
                  </a>
                </>
              }
              style={{ marginBottom: 24 }}
            >
              <LuckBagsCard
                value={luckyBag}
                className={styles.tableOperations}
                onChange={val => this.setState({ luckyBag: val })}
              />
              <Button
                className={styles.tableOperations}
                disabled={!luckyBag}
                type="primary"
                onClick={() => this.handleAddBoxProduct({ productIds: luckyBag }, 'luckyBag')}
              >
                添加福袋
              </Button>
              <ProTable
                rowKey="id"
                toolBarRender={false}
                search={false}
                columns={luckyBagColumns}
                dataSource={luckyBags.products}
                size="small"
                pagination={false}
                bordered
              />
            </Card>

            <Card
              title={
                <>
                  <span> {liveRooms.title} </span> {` `}
                  <a onClick={() => this.handEditorTitle('liveRoom', liveRooms.title)}>
                    <FormOutlined />
                  </a>
                </>
              }
              style={{ marginBottom: 24 }}
            >
              <LiveRoomCard
                value={liveRoom}
                className={styles.tableOperations}
                onChange={val => this.setState({ liveRoom: val })}
              />
              <Button
                className={styles.tableOperations}
                disabled={!liveRoom}
                type="primary"
                onClick={() => this.handleAddBoxProduct({ productIds: liveRoom }, 'liveRoom')}
              >
                添加房间
              </Button>
              <ProTable
                toolBarRender={false}
                search={false}
                rowKey="roomId"
                columns={liveRoomColumns}
                dataSource={liveRooms.rooms}
                size="small"
                pagination={false}
                bordered
              />
            </Card>

            <Card
              title={
                <>
                  <span> {liveSchedules.title} </span> {` `}
                  <a onClick={() => this.handEditorTitle('liveSchedule', liveSchedules.title)}>
                    <FormOutlined />
                  </a>
                </>
              }
              style={{ marginBottom: 24 }}
            >
              <ProTable
                toolBarRender={false}
                search={false}
                rowKey="roomId"
                columns={liveScheduleColumns}
                dataSource={liveSchedules.details}
                size="small"
                pagination={false}
                bordered
              />
            </Card>

            <Card
              title={
                <>
                  <span> {partners.title} </span> {` `}
                  <a onClick={() => this.handEditorTitle('partner', partners.title)}>
                    <FormOutlined />
                  </a>
                </>
              }
              style={{ marginBottom: 24 }}
            >
              <Row gutter={[16, 16]}>
                <Col span={4}>
                  <Text>合作品牌</Text>
                  <Upload {...imageUploadProps} onChange={this.addPartnerImage}>
                    {partners.imageUrl ? (
                      <img src={partners.imageUrl} alt="avatar" style={{ width: '100%' }} />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </Col>
              </Row>
            </Card>
          </GridContent>
        </div>
        {/* 编辑详情 */}
        <UpdateForm
          box={exhibitionDetail}
          onSubmit={this.handleUpdate}
          onCancel={() => this.setState({ updateModalVisible: false })}
          modalVisible={updateModalVisible}
        />
        <UpdateLive
          box={liveId}
          onSubmit={this.handleUpdateLive}
          onCancel={() => this.setState({ updateLiveModalVisible: false })}
          modalVisible={updateLiveModalVisible}
        />
        <EditForm
          box={titleContent}
          onSubmit={this.handleUpdateTitle}
          onCancel={() => this.setState({ editorModal: false })}
          modalVisible={editorModal}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ exhibitionDetail, loading }) => ({
  exhibitionDetail,
  loading: loading.effects['exhibitionDetail/fetchExhibitions'],
}))(ExhibitionDetail);
