import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Typography,
  Descriptions,
  Button,
  Card,
  Tag,
  Table,
  Divider,
  Progress,
  Popconfirm,
  Upload,
  message,
  Checkbox,
} from 'antd';
import { GridContent, PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import {
  ExclamationCircleOutlined,
  UploadOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import ProTable from '@ant-design/pro-table';
import SearchProduct from '@/components/Common/ProductSearch';
import SearchSeries from '@/components/Common/SeriesSearch';
import { saveAs } from 'file-saver';
import UpdateForm from './components/UpdateForm';
import AddTextForm from './components/AddTextForm';
import ModifyGraphicForm from './components/ModifyGraphicForm';
import EditProductForm from './components/EditProductForm';
import BatchEditProductForm from './components/BatchEditProductForm';
import CreateSessionForm from './components/CreateSessionForm';
import SessionDetail from './components/SessionDetail';
import SoldHistory from './components/SoldHistory';
import styles from './style.less';
import { cdnUrl, uploadProps } from '../../utils/utils';

const { Text, Title } = Typography;

class BoxDetail extends Component {
  // 初始化状态
  state = {
    tabActiveKey: 'tab1',
    updateModalVisible: false,
    addTextModalVisible: false,
    ModifyGraphicModalVisible: false,
    createSessionModalVisible: false,
    searchProductId: undefined,
    searchSeries: undefined,
    hideClosedSessions: true,
    indexData: '',
    typeData: '',
    confirmLoading: false,
    loadingExport: false,
    selectedRowKeys: [],
    numberModalVisible: false,
  };

  // 生命周期函数 第一次渲染后调用
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'boxDetail/getBox',
      payload: { id: this.props.match.params.id },
    });
  }

  // 编辑=>保存详情
  handleUpdate = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'boxDetail/updateBox',
      payload: params,
    }).then(() => {
      this.setState({ updateModalVisible: false });
      dispatch({
        type: 'boxDetail/getBox',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 添加盲盒产品配置
  handleAddBoxProduct = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'boxDetail/updateBoxProduct',
      payload: { id: this.props.match.params.id, ...params, productIds: [params.productId] },
    }).then(() => {
      message.success('添加成功');
      this.setState({ searchProductId: undefined });
      dispatch({
        type: 'boxDetail/getBox',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 修改盲盒产品配置
  handleUpdateBoxProduct = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'boxDetail/updateBoxProduct',
      payload: { id: this.props.match.params.id, ...params, productIds: [params.productId] },
    }).then(() => {
      dispatch({
        type: 'boxDetail/getBox',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 绑定系列
  handleBindSeries = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'boxDetail/bindSeries',
      payload: { id: this.props.match.params.id, ...params },
    }).then(() => {
      message.success('绑定系列成功');
      dispatch({
        type: 'boxDetail/getBox',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 删除盲盒产品配置
  removeBoxProduct = productId => {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'boxDetail/deleteBoxProduct',
      payload: { id, productId },
    }).then(() => {
      dispatch({
        type: 'boxDetail/getBox',
        payload: { id },
      });
    });
  };

  // 创建盲盒场次
  createSession = params => {
    const { dispatch } = this.props;
    this.setState({ confirmLoading: true });
    dispatch({
      type: 'boxDetail/createSession',
      payload: { id: this.props.match.params.id, ...params },
    }).then(() => {
      this.setState({ createSessionModalVisible: false, confirmLoading: false });
      dispatch({
        type: 'boxDetail/getBox',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 关闭盲盒场次
  closeSession = (sessionId, displayStatus) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'boxDetail/closeSession',
      payload: { id: sessionId, display: displayStatus },
    }).then(() => {
      dispatch({
        type: 'boxDetail/getBox',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 退回盲盒场次产品
  recallSession = sessionId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'boxDetail/recallSession',
      payload: { id: sessionId },
    }).then(() => {
      dispatch({
        type: 'boxDetail/getBox',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 添加详情图片
  addDetailImage = e => {
    if (e.file.status === 'done' && e.file.response) {
      const { dispatch } = this.props;
      const { boxDetail } = this.props.boxDetail;
      const { detail } = boxDetail;
      detail.push({
        type: 2,
        content: e.file.response.data.imageKey,
      });

      dispatch({
        type: 'boxDetail/graphicBox',
        payload: { id: this.props.match.params.id, detail },
      }).then(() => {
        dispatch({
          type: 'boxDetail/getBox',
          payload: { id: this.props.match.params.id },
        });
      });
    }
    return null;
  };

  // 添加详情文字描述
  addDetailText = e => {
    const { dispatch } = this.props;
    const { boxDetail } = this.props.boxDetail;
    const { detail } = boxDetail;
    detail.push({
      type: 1,
      content: e.text,
    });
    dispatch({
      type: 'boxDetail/graphicBox',
      payload: { id: this.props.match.params.id, detail },
    }).then(() => {
      this.setState({ addTextModalVisible: false });
      dispatch({
        type: 'boxDetail/getBox',
        payload: { id: this.props.match.params.id },
      });
    });
    return null;
  };

  // 修改图文详情中的文字内容
  EditDetailItem = e => {
    const { dispatch } = this.props;
    const { boxDetail } = this.props.boxDetail;
    const { detail } = boxDetail;
    detail.splice(e.index.index, 1, {
      type: 1,
      content: e.fieldsValue.text,
    });
    dispatch({
      type: 'boxDetail/graphicBox',
      payload: { id: this.props.match.params.id, detail },
    }).then(() => {
      this.setState({ ModifyGraphicModalVisible: false });
      dispatch({
        type: 'boxDetail/getBox',
        payload: { id: this.props.match.params.id },
      });
    });
    return null;
  };

  // 删除详情图片和文字描述
  removeDetailItem = index => {
    const { dispatch } = this.props;
    const { boxDetail } = this.props.boxDetail;
    const { detail } = boxDetail;

    detail.splice(index, 1);
    dispatch({
      type: 'boxDetail/graphicBox',
      payload: { id: this.props.match.params.id, detail },
    }).then(() => {
      dispatch({
        type: 'boxDetail/getBox',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 产品到货函数
  goodsArrival = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'boxDetail/goodsArrival',
      payload: { id: this.props.match.params.id },
    }).then(() => {
      dispatch({
        type: 'boxDetail/getBox',
        payload: { id: this.props.match.params.id },
      });
    });
    return null;
  };

  // 购买记录名单导出
  handleDownloadClick = e => {
    this.setState({ loadingExport: true });
    e.preventDefault();
    const { dispatch } = this.props;
    const fileName = `购买名单_盲盒${this.props.match.params.id}.csv`;
    dispatch({
      type: 'boxDetail/download',
      payload: { sourceId: this.props.match.params.id, sourceType: 1 },
      callback: blob => {
        saveAs(new Blob([blob], { type: 'text/csv;charset=utf-8' }), fileName);
      },
    });
    this.setState({ loadingExport: false });
  };

  // 批量修改数量数组
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  // 批量修改数量函数
  handleUpdateBatch = (e, params) => {
    this.setState({ numberModalVisible: false });
    const { dispatch } = this.props;
    dispatch({
      type: 'boxDetail/updateBoxProduct',
      payload: { id: this.props.match.params.id, ...e, productIds: params },
    }).then(() => {
      message.success('请求成功');
      this.setState({
        selectedRowKeys: [],
      });
      dispatch({
        type: 'boxDetail/getBox',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 修改图文详情中的图片内容
  EditDetailImage(file, index) {
    if (file.file.status === 'done' && file.file.response) {
      const { dispatch } = this.props;
      const { boxDetail } = this.props.boxDetail;
      const { detail } = boxDetail;
      detail.splice(index, 1, {
        type: 2,
        content: file.file.response.data.imageKey,
      });

      dispatch({
        type: 'boxDetail/graphicBox',
        payload: { id: this.props.match.params.id, detail },
      }).then(() => {
        dispatch({
          type: 'boxDetail/getBox',
          payload: { id: this.props.match.params.id },
        });
      });
    }
    return null;
  }

  render() {
    const { boxDetail } = this.props.boxDetail;
    const sessions = boxDetail.sessions ? boxDetail.sessions : [];
    const miniUrl = `/pages/blindBox/boxDetail/boxDetail?id=${this.props.match.params.id}`;
    const {
      tabActiveKey,
      updateModalVisible,
      createSessionModalVisible,
      addTextModalVisible,
      ModifyGraphicModalVisible,
      searchProductId,
      searchSeries,
      hideClosedSessions,
      indexData,
      typeData,
      confirmLoading,
      loadingExport,
      selectedRowKeys,
      numberModalVisible,
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const action = (
      <div>
        <Popconfirm
          disabled={!boxDetail.reserve}
          title="确认该盲盒到货吗？"
          onConfirm={() => this.goodsArrival()}
        >
          <Button disabled={!boxDetail.reserve}>到货</Button>
        </Popconfirm>
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
              {boxDetail.status === 0 ? (
                <Tag color="red">已下架</Tag>
              ) : (
                <Tag color="green">上架中</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="标签">
              {boxDetail.attribute ? (
                <Tag color={boxDetail.attribute === '新品' ? 'cyan' : 'red'}>
                  {boxDetail.attribute}
                </Tag>
              ) : (
                '无'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="类型">
              {boxDetail.reserve ? <Tag color="geekblue">预售</Tag> : <Tag color="green">现货</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="排序权重">{boxDetail.sort}</Descriptions.Item>
            <Descriptions.Item label="价格">{boxDetail.price / 100}元</Descriptions.Item>
            <Descriptions.Item label="盒子数量">{boxDetail.boxNum}</Descriptions.Item>
            <Descriptions.Item label="稀有数量">{boxDetail.rareNum}</Descriptions.Item>
            <Descriptions.Item label="背景颜色">{boxDetail.bgColor}</Descriptions.Item>
            <Descriptions.Item label="上架时间" span={2}>
              {moment(boxDetail.startAt).format('YYYY年MM月DD日 HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="下架时间" span={2}>
              {boxDetail.endAt ? moment(boxDetail.endAt).format('YYYY年MM月DD日 HH:mm:ss') : '无'}
            </Descriptions.Item>
            <Descriptions.Item label="开售时间" span={2}>
              {moment(boxDetail.openAt).format('YYYY年MM月DD日 HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="预计到货时间" span={2}>
              {boxDetail.reserve ? moment(boxDetail.predictAt).format('YYYY年MM月DD日') : '无'}
            </Descriptions.Item>
            <Descriptions.Item label="小程序路径" span={isMobile ? 2 : 4}>
              <Text copyable>{miniUrl}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="系列" span={2}>
              {boxDetail.series ? boxDetail.series.name : '无'}
            </Descriptions.Item>
            <Descriptions.Item label="显示">
              {boxDetail.display ? <Tag color="green">显示</Tag> : <Tag color="red">隐藏</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="优惠券">
              {boxDetail.allowCoupon ? <Tag color="green">可用</Tag> : <Tag color="red">禁止</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="描述" span={isMobile ? 2 : 4}>
              {boxDetail.description ? boxDetail.description : '无'}
            </Descriptions.Item>
            <Descriptions.Item label="封面">
              <img src={boxDetail.coverUrl} width="100" alt="cover" />
            </Descriptions.Item>
            <Descriptions.Item label="头卡">
              <img src={boxDetail.headImageUrl} width="100" alt="boxImage" />
            </Descriptions.Item>
            <Descriptions.Item label="盒盖">
              <img src={boxDetail.boxImageUrl} width="100" alt="headImage" />
            </Descriptions.Item>
            <Descriptions.Item label="包装">
              <img src={boxDetail.packageImageUrl} width="100" alt="packageImage" />
            </Descriptions.Item>
          </Descriptions>
        )}
      </RouteContext.Consumer>
    );

    const productColumns = [
      {
        title: '产品ID',
        dataIndex: 'productId',
        align: 'center',
      },
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
        title: '总数',
        dataIndex: 'total',
        align: 'center',
      },
      {
        title: '剩余数量',
        dataIndex: 'quantity',
        align: 'center',
      },
      {
        title: '操作',
        align: 'center',
        render: (_, record) => (
          <>
            <RouteContext.Consumer>
              {({ isMobile }) => (
                <EditProductForm
                  isMobile={isMobile}
                  productId={record.productId}
                  onSubmit={this.handleUpdateBoxProduct}
                >
                  <a>修改数量</a>
                </EditProductForm>
              )}
            </RouteContext.Consumer>
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

    const sessionColumns = [
      {
        title: '场次ID',
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: '包含隐藏',
        dataIndex: 'rare',
        align: 'center',
        render: rare => (rare ? <Tag color="green">是</Tag> : <Tag>否</Tag>),
      },
      {
        title: '是否上架',
        dataIndex: 'display',
        align: 'center',
        render: display => (display ? <Tag color="green">是</Tag> : <Tag>否</Tag>),
      },
      {
        title: '进度（剩余数量/总数）',
        render: (_, record) => (
          <Progress
            size="small"
            format={() => `${record.quantity} / ${record.total}`}
            percent={(record.quantity * 100) / record.total}
          />
        ),
      },
      {
        title: '操作',
        render: (_, record) => (
          <>
            {record.display ? (
              <Popconfirm
                title="确认下架该场次?"
                icon={<ExclamationCircleOutlined />}
                onConfirm={() => this.closeSession(record.id, false)}
              >
                <a>
                  <CaretDownOutlined />
                  下架
                </a>
              </Popconfirm>
            ) : (
              <Popconfirm
                title="确认上架该场次?"
                icon={<ExclamationCircleOutlined />}
                onConfirm={() => this.closeSession(record.id, true)}
              >
                <a>
                  <CaretUpOutlined />
                  上架
                </a>
              </Popconfirm>
            )}
            <Divider type="vertical" />
            <Popconfirm
              title="确认退回该场次商品吗？"
              onConfirm={() => this.recallSession(record.id)}
            >
              <a>退回商品</a>
            </Popconfirm>
          </>
        ),
      },
    ];

    const detailColumns = [
      {
        title: '序号',
        render: (_, record, index) => index + Number(1),
      },
      {
        title: '内容',
        render: (_, record) =>
          record.type === 2 ? (
            <img
              alt="nothing"
              width="60"
              shape="square"
              size="small"
              src={cdnUrl(record.content)}
            />
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
          <Card title="盲盒配比" style={{ marginBottom: 24 }}>
            <SearchProduct
              value={searchProductId}
              className={styles.tableOperations}
              onChange={val => this.setState({ searchProductId: val })}
            />
            <Button
              className={styles.tableOperations}
              disabled={!searchProductId}
              type="primary"
              onClick={() => this.handleAddBoxProduct({ productId: searchProductId, quantity: 0 })}
            >
              添加产品
            </Button>
            <SearchSeries
              series={boxDetail.series}
              className={styles.tableOperations}
              onChange={val => this.setState({ searchSeries: val ? JSON.parse(val) : null })}
            />
            <Button
              className={styles.tableOperations}
              disabled={!searchSeries}
              type="primary"
              onClick={() => this.handleBindSeries({ seriesId: searchSeries.id })}
            >
              绑定系列
            </Button>
            <RouteContext.Consumer>
              {({ isMobile }) => (
                <BatchEditProductForm
                  isMobile={isMobile}
                  onSubmit={e => this.handleUpdateBatch(e, selectedRowKeys)}
                  onCancel={e => this.setState({ numberModalVisible: e })}
                  modalVisible={numberModalVisible}
                >
                  <Button
                    type="primary"
                    style={{ float: 'right', display: hasSelected ? '' : 'none' }}
                    onClick={() => this.setState({ numberModalVisible: true })}
                  >
                    批量修改数量
                  </Button>
                </BatchEditProductForm>
              )}
            </RouteContext.Consumer>
            <Button
              type="primary"
              disabled
              style={{ float: 'right', display: hasSelected ? 'none' : '' }}
            >
              批量修改数量
            </Button>
            <ProTable
              rowSelection={rowSelection}
              toolBarRender={false}
              search={false}
              options={false}
              rowKey="productId"
              columns={productColumns}
              dataSource={boxDetail.products}
              size="small"
              pagination={false}
              bordered
            />
          </Card>
          <Card title="盲盒场次" style={{ marginBottom: 24 }}>
            <Button
              className={styles.tableOperations}
              type="primary"
              onClick={() => this.setState({ createSessionModalVisible: true })}
            >
              创建场次
            </Button>
            <Checkbox
              checked={hideClosedSessions}
              onChange={e => this.setState({ hideClosedSessions: e.target.checked })}
            >
              隐藏已下架场次
            </Checkbox>
            <Text type="warning" style={{ float: 'right' }}>
              上架场次数量：
              {sessions ? sessions.filter(session => session.display === true).length : ''}
            </Text>
            <Table
              rowKey="id"
              columns={sessionColumns}
              dataSource={
                hideClosedSessions ? sessions.filter(session => session.display === true) : sessions
              }
              pagination={false}
              bordered
              rowClassName={this.rowClassName}
              expandedRowRender={record => <SessionDetail sessionId={record.id} />}
            />
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
            dataSource={boxDetail.detail}
            size="small"
            pagination={false}
            bordered
          />
        </Card>
      ),
      tab3: (
        <Card title="购买记录" style={{ marginBottom: 24 }}>
          <Button style={{ marginBottom: 10 }} type="primary" onClick={this.handleDownloadClick}>
            {loadingExport ? <LoadingOutlined /> : ''}
            导出记录
          </Button>
          <SoldHistory boxId={this.props.match.params.id} />
        </Card>
      ),
    };

    return (
      <PageHeaderWrapper
        title={
          <>
            <Title level={3} style={{ marginBottom: 0 }}>
              {`盲盒：${boxDetail.name}`}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              创建时间: {moment(boxDetail.createAt).format('YYYY-MM-DD HH:mm:ss')}
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
            tab: '配置',
          },
          {
            key: 'tab2',
            tab: '图文描述',
          },
          {
            key: 'tab3',
            tab: '购买记录',
          },
        ]}
      >
        <div className={styles.main}>
          <GridContent>{contentList[tabActiveKey]}</GridContent>
        </div>
        {/* 编辑详情 */}
        <UpdateForm
          box={boxDetail}
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
          box={BoxDetail}
          onSubmit={this.EditDetailItem}
          onCancel={() => this.setState({ ModifyGraphicModalVisible: false })}
          modalVisible={ModifyGraphicModalVisible}
        />
        {/* 创建场次 */}
        <CreateSessionForm
          confirmLoading={confirmLoading}
          onSubmit={this.createSession}
          onCancel={() => this.setState({ createSessionModalVisible: false })}
          modalVisible={createSessionModalVisible}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ boxDetail, loading }) => ({
  boxDetail,
  loading: loading.effects['boxDetail/getBox'],
}))(BoxDetail);
