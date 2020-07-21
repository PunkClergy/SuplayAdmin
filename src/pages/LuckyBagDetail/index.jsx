import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Descriptions,
  Button,
  Card,
  Tag,
  Table,
  Divider,
  Upload,
  Collapse,
  Typography,
  Spin,
} from 'antd';
import { GridContent, PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import { UploadOutlined, CaretRightOutlined } from '@ant-design/icons';
import { saveAs } from 'file-saver';
import moment from 'moment';
import numeral from 'numeral';
import ProTable from '@ant-design/pro-table';
// import CustomerLink from '@/components/Common/CustomerLink';
import UpdateForm from './components/UpdateForm';
import AddTextForm from './components/AddTextForm';
import ModifyGraphicForm from './components/ModifyGraphicForm';
import Session from './components/Session';
// import SoldHistory from './components/SoldHistory';
import styles from './style.less';
import { uploadProps } from '../../utils/utils';

const { Text } = Typography;
const { Panel } = Collapse;
class LuckDetail extends Component {
  // 初始化状态
  state = {
    tabActiveKey: 'tab1',
    updateModalVisible: false,
    addTextModalVisible: false,
    ModifyGraphicModalVisible: false,
    indexData: '',
    typeData: '',
  };

  // 生命周期函数 第一次渲染后调用
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'luckBagDetail/getLuckyBag',
      payload: { id: this.props.match.params.id },
    });
    dispatch({
      type: 'luckBagDetail/fetchSessions',
      payload: { id: this.props.match.params.id },
    });
  }

  // 编辑=>保存详情
  handleUpdate = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'luckBagDetail/updateLuckyBag',
      payload: params,
    }).then(() => {
      this.setState({ updateModalVisible: false });
      dispatch({
        type: 'luckBagDetail/getLuckyBag',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 购买记录名单导出
  handleDownloadClick = e => {
    e.preventDefault();
    const { dispatch } = this.props;
    const fileName = `购买名单_福袋${this.props.match.params.id}.csv`;
    dispatch({
      type: 'luckBagDetail/download',
      payload: { sourceType: 4, sourceId: this.props.match.params.id },
      callback: blob => {
        saveAs(new Blob([blob], { type: 'text/csv;charset=utf-8' }), fileName);
      },
    });
  };

  // 添加详情图片
  addDetailImage = e => {
    if (e.file.status === 'done' && e.file.response) {
      const { dispatch } = this.props;
      const { luckBagDetail } = this.props.luckBagDetail;
      const { detail } = luckBagDetail;
      detail.push({
        type: 2,
        content: e.file.response.data.imageKey,
      });

      dispatch({
        type: 'luckBagDetail/graphicBox',
        payload: { id: this.props.match.params.id, detail },
      }).then(() => {
        dispatch({
          type: 'luckBagDetail/getLuckyBag',
          payload: { id: this.props.match.params.id },
        });
      });
    }
    return null;
  };

  // 添加详情文字描述
  addDetailText = e => {
    const { dispatch } = this.props;
    const { luckBagDetail } = this.props.luckBagDetail;
    const { detail } = luckBagDetail;
    detail.push({
      type: 1,
      content: e.text,
    });
    dispatch({
      type: 'luckBagDetail/graphicBox',
      payload: { id: this.props.match.params.id, detail },
    }).then(() => {
      this.setState({ addTextModalVisible: false });
      dispatch({
        type: 'luckBagDetail/getLuckyBag',
        payload: { id: this.props.match.params.id },
      });
    });
    return null;
  };

  // 修改图文详情中的文字内容
  EditDetailItem = e => {
    const { dispatch } = this.props;
    const { luckBagDetail } = this.props.luckBagDetail;
    const { detail } = luckBagDetail;
    detail.splice(e.index.index, 1, {
      type: 1,
      content: e.fieldsValue.text,
    });
    dispatch({
      type: 'luckBagDetail/graphicBox',
      payload: { id: this.props.match.params.id, detail },
    }).then(() => {
      this.setState({ ModifyGraphicModalVisible: false });
      dispatch({
        type: 'luckBagDetail/getLuckyBag',
        payload: { id: this.props.match.params.id },
      });
    });
    return null;
  };

  // 删除详情图片和文字描述
  removeDetailItem = index => {
    const { dispatch } = this.props;
    const { luckBagDetail } = this.props.luckBagDetail;
    const { detail } = luckBagDetail;

    detail.splice(index, 1);
    dispatch({
      type: 'luckBagDetail/graphicBox',
      payload: { id: this.props.match.params.id, detail },
    }).then(() => {
      dispatch({
        type: 'luckBagDetail/getLuckyBag',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 修改图文详情中的图片内容
  EditDetailImage(file, index) {
    if (file.file.status === 'done' && file.file.response) {
      const { dispatch } = this.props;
      const { luckBagDetail } = this.props.luckBagDetail;
      const { detail } = luckBagDetail;
      detail.splice(index, 1, {
        type: 2,
        content: file.file.response.data.imageKey,
      });

      dispatch({
        type: 'luckBagDetail/graphicBox',
        payload: { id: this.props.match.params.id, detail },
      }).then(() => {
        dispatch({
          type: 'luckBagDetail/getLuckyBag',
          payload: { id: this.props.match.params.id },
        });
      });
    }
    return null;
  }

  render() {
    const { loading } = this.props;
    const { luckBagDetail } = this.props.luckBagDetail;
    // const sessions = sessionsData.list ? sessionsData.list : [];
    const miniUrl = `/pages/exhibition/luckbag/detail/detail?id=${this.props.match.params.id}`;
    const {
      tabActiveKey,
      updateModalVisible,
      addTextModalVisible,
      ModifyGraphicModalVisible,
      indexData,
      typeData,
    } = this.state;

    const action = (
      <div>
        <Button
          type="primary"
          onClick={() => this.setState({ updateModalVisible: true })}
          style={{ marginLeft: 10 }}
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
            <Descriptions.Item label="状态">
              {luckBagDetail.status === 0 ? (
                <Tag color="red">已下架</Tag>
              ) : (
                <Tag color="green">上架中</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="价格">{luckBagDetail.price / 100}元</Descriptions.Item>
            <Descriptions.Item label="权重">{luckBagDetail.sort}</Descriptions.Item>
            <Descriptions.Item label="开始时间" span={2}>
              {moment(luckBagDetail.openAt).format('YYYY年MM月DD日 HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="总价值">
              {numeral(luckBagDetail.totalWorth / 100).format('0,0')}元
            </Descriptions.Item>
            <Descriptions.Item label="总金额">
              {numeral(luckBagDetail.totalPrice / 100).format('0,0')}元
            </Descriptions.Item>
            <Descriptions.Item label="优惠券">
              {luckBagDetail.allowCoupon ? <Tag color="green">可用</Tag> : <Tag>禁止</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="小程序路径" span={isMobile ? 2 : 4}>
              <Text copyable>{miniUrl}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="描述" span={isMobile ? 2 : 4}>
              {luckBagDetail.description ? luckBagDetail.description : '无'}
            </Descriptions.Item>
            <Descriptions.Item label="封面">
              <img src={luckBagDetail.coverUrl} width="100" alt="cover" />
            </Descriptions.Item>
            <Descriptions.Item label="图片">
              <img src={luckBagDetail.imageUrl} width="100" alt="cover" />
            </Descriptions.Item>
          </Descriptions>
        )}
      </RouteContext.Consumer>
    );
    const productsColumns = [
      {
        title: '商品ID',
        dataIndex: 'productId',
        align: 'center',
      },
      {
        title: '商品名称',
        dataIndex: 'productName',
        align: 'center',
      },
      {
        title: '图片',
        dataIndex: 'productImage',
        align: 'center',
        render: val => <img alt="nothing" height="60" src={val} />,
      },
      {
        title: '零售价',
        dataIndex: 'price',
        hideInSearch: true,
        align: 'center',
        render: price => <span>¥{price / 100}</span>,
      },
      {
        title: '属性',
        dataIndex: 'rare',
        align: 'center',
        valueEnum: {
          0: {
            text: <Tag>普通</Tag>,
          },
          1: {
            text: <Tag color="blue">稀有</Tag>,
          },
          2: {
            text: <Tag color="purple">隐藏</Tag>,
          },
        },
      },
      {
        title: '类型',
        dataIndex: 'status',
        hideInSearch: true,
        align: 'center',
        render: status => (
          <Tag color={status === 1 ? 'blue' : 'green'} key={status}>
            {status === 1 ? '预定' : '现货'}
          </Tag>
        ),
      },
      {
        title: '数量',
        dataIndex: 'quantity',
        align: 'center',
      },
    ];
    // const sessionInfoColumns = [
    //   {
    //     title: '场次ID',
    //     dataIndex: 'id',
    //     align: 'center',
    //   },

    //   {
    //     title: '包含隐藏',
    //     dataIndex: 'rare',
    //     align: 'center',
    //     render: rare => (rare ? <Tag color="green">是</Tag> : <Tag>否</Tag>),
    //   },
    //   {
    //     title: '是否已售',
    //     dataIndex: 'soldAt',
    //     align: 'center',
    //     render: val => (val ? <Tag color="green"> 已售</Tag> : <Tag color="orange">待售</Tag>),
    //   },
    //   {
    //     title: '购买人',
    //     dataIndex: 'user',
    //     align: 'center',
    //     render: user => <CustomerLink user={user} />,
    //   },
    //   {
    //     title: '头像',
    //     dataIndex: ['user', 'avatar'],
    //     hideInSearch: true,
    //     align: 'center',
    //     render: avatar => (avatar ? <img alt="nothing" width="50" src={avatar} /> : ''),
    //   },
    //   {
    //     title: '数量',
    //     dataIndex: 'quantity',
    //     align: 'center',
    //   },
    //   {
    //     title: '图片',
    //     dataIndex: 'items',
    //     align: 'center',
    //     width: '30%',
    //     render: name => (
    //       <>
    //         {name.map(item => (
    //           <img
    //             src={item.productImage}
    //             width={30}
    //             style={{ marginLeft: '1px' }}
    //             alt="nothing"
    //             title={item.productName}
    //           ></img>
    //         ))}
    //       </>
    //     ),
    //   },
    //   {
    //     title: '购买时间',
    //     dataIndex: 'soldAt',
    //     align: 'center',
    //     sorter: true,
    //     render: val => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''),
    //   },
    // ];

    const detailColumns = [
      {
        title: '序号',
        render: (_, record, index) => index + Number(1),
      },
      {
        title: '内容',
        render: (_, record) =>
          record.type === 2 ? (
            <img alt="nothing" width="60" shape="square" size="small" src={record.content} />
          ) : (
            <p>{record.content}</p>
          ),
      },
      {
        title: '类型',
        dataIndex: 'type',
        render: val => (val === 2 ? '图片' : '文字'),
      },
      {
        title: '操作',
        render: (text, record, index) => (
          <>
            {text.type === 1 ? (
              <a
                onClick={() =>
                  this.setState({
                    ModifyGraphicModalVisible: true,
                    indexData: index,
                    typeData: text.type,
                  })
                }
              >
                编辑
              </a>
            ) : (
              <Upload
                name="image"
                onChange={file => {
                  this.EditDetailImage(file, index);
                }}
                {...uploadProps}
                listType=""
              >
                <a>编辑</a>
              </Upload>
            )}
            <Divider type="vertical" />
            <a onClick={() => this.removeDetailItem(index)}>删除</a>
          </>
        ),
      },
    ];

    const contentList = {
      tab1: (
        <>
          <Collapse
            bordered={false}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            className="site-collapse-custom-collapse"
            style={{ marginBottom: 24 }}
          >
            <Panel header="产品统计" key="2" className="site-collapse-custom-panel">
              <ProTable
                toolBarRender={false}
                search={false}
                options={false}
                rowKey="productId"
                columns={productsColumns}
                dataSource={luckBagDetail.products}
                size="small"
                pagination={false}
                bordered
              />
            </Panel>
          </Collapse>
          {/* </Card> */}
          <Card
            title="福袋场次"
            style={{ marginBottom: 24 }}
            extra={
              <Button
                style={{ marginBottom: 10 }}
                type="primary"
                onClick={this.handleDownloadClick}
              >
                导出数据
              </Button>
            }
          >
            <Session luckBagId={this.props.match.params.id} />
          </Card>
        </>
      ),
      tab2: (
        <Card title="产品图文详情" style={{ marginBottom: 24 }}>
          <Upload name="image" onChange={this.addDetailImage} {...uploadProps} listType="">
            <Button className={styles.tableOperations}>
              <UploadOutlined /> 添加图片
            </Button>
          </Upload>
          <Button
            className={styles.tableOperations}
            style={{ marginLeft: 20 }}
            onClick={() => this.setState({ addTextModalVisible: true })}
          >
            <UploadOutlined /> 添加文字
          </Button>
          <Table
            rowKey="content"
            columns={detailColumns}
            dataSource={luckBagDetail.detail}
            size="small"
            pagination={false}
            bordered
          />
        </Card>
      ),
      // tab3: (
      //   <Card title="购买记录" style={{ marginBottom: 24 }}>
      //     <Button style={{ marginBottom: 10 }} type="primary" onClick={this.handleDownloadClick}>
      //       导出数据
      //     </Button>
      //     <Table
      //       rowKey="id"
      //       columns={sessionInfoColumns}
      //       dataSource={sessions.filter(session => session.soldAt)}
      //       pagination={false}
      //       bordered
      //       rowClassName={this.rowClassName}
      //       expandedRowRender={record => <SoldHistory sessionInfo={record.items} />}
      //     />
      //   </Card>
      // ),
    };

    return (
      <Spin spinning={loading} delay={50}>
        <PageHeaderWrapper
          title={<span>{`福袋：${luckBagDetail.name}`}</span>}
          extra={action}
          className={styles.pageHeader}
          content={description}
          tabActiveKey={tabActiveKey}
          onTabChange={key => this.setState({ tabActiveKey: key })}
          tabList={[
            {
              key: 'tab1',
              tab: '配置',
            },
            {
              key: 'tab2',
              tab: '图文描述',
            },
            // {
            //   key: 'tab3',
            //   tab: '购买记录',
            // },
          ]}
        >
          <div className={styles.main}>
            <GridContent>{contentList[tabActiveKey]}</GridContent>
          </div>
          {/* 编辑详情 */}
          <UpdateForm
            box={luckBagDetail}
            onSubmit={this.handleUpdate}
            onCancel={() => this.setState({ updateModalVisible: false })}
            modalVisible={updateModalVisible}
          />
          {/* 添加图文详情文字 */}
          <AddTextForm
            onSubmit={this.addDetailText}
            onCancel={() => this.setState({ addTextModalVisible: false })}
            modalVisible={addTextModalVisible}
          />
          {/* 编辑图文详情 */}
          <ModifyGraphicForm
            index={indexData}
            type={typeData}
            box={LuckDetail}
            onSubmit={this.EditDetailItem}
            onCancel={() => this.setState({ ModifyGraphicModalVisible: false })}
            modalVisible={ModifyGraphicModalVisible}
          />
        </PageHeaderWrapper>
      </Spin>
    );
  }
}
export default connect(({ luckBagDetail, loading }) => ({
  luckBagDetail,
  loading: loading.effects['luckBagDetail/getLuckyBag'],
}))(LuckDetail);
