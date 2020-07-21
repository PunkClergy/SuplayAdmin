import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Typography,
  Descriptions,
  Button,
  Card,
  Table,
  Modal,
  Upload,
  Tag,
  Divider,
  message,
  Popconfirm,
} from 'antd';
import { GridContent, PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import { ExclamationCircleOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';
import { saveAs } from 'file-saver';
import SearchProduct from '@/components/Common/ProductSearch';
import UpdateForm from './components/UpdateForm';
import OrderList from './components/OrderList';
import AddProductForm from './components/AddProductForm';
import AddTextForm from './components/AddTextForm';
import EditProductForm from './components/EditProductForm';
import EditPriceForm from './components/EditPriceForm';
import ModifyGraphicForm from './components/ModifyGraphicForm';
import styles from './style.less';
import { uploadProps, cdnUrl } from '../../utils/utils';

const { Text, Title } = Typography;
const emsType = ['普通快递', '顺丰寄付', '顺丰到付'];
class ShopDetail extends Component {
  // 初始化状态
  state = {
    tabActiveKey: 'tab1',
    updateModalVisible: false,
    addProductModalVisible: false,
    editPriceModalVisible: false,
    addTextModalVisible: false,
    editProduct: undefined,
    ModifyGraphicModalVisible: false,
    theIndex: '',
    textType: '',
    loadingImage: false,
    loadingExport: false,
  };

  // 生命周期函数 第一次渲染后调用
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'shopDetail/getShop',
      payload: { id: this.props.match.params.id },
    });
  }

  // 保存直购详情
  handleUpdate = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'shopDetail/updateShop',
      payload: params,
    }).then(() => {
      this.setState({ updateModalVisible: false });
      dispatch({
        type: 'shopDetail/getShop',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 直购配比数量修改
  handleUpdateShopProduct = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'shopDetail/updateShopNum',
      payload: { id: this.props.match.params.id, ...params },
    }).then(() => {
      this.setState({ addProductModalVisible: false });
      dispatch({
        type: 'shopDetail/getShop',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 直购配比价格修改
  handleUpdateShopPrice = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'shopDetail/updateShopProduct',
      payload: { id: this.props.match.params.id, ...params },
    }).then(() => {
      this.setState({ addProductModalVisible: false, editPriceModalVisible: false });
      dispatch({
        type: 'shopDetail/getShop',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 直购产品配置删除
  removeShopProduct = productId => {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    Modal.confirm({
      title: '确认删除该商品?',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      onOk() {
        dispatch({
          type: 'shopDetail/deleteShopProduct',
          payload: { id, productId },
        }).then(() => {
          dispatch({
            type: 'shopDetail/getShop',
            payload: { id },
          });
        });
      },
      onCancel() {},
    });
  };

  // 图文详情=>添加详情图片
  addDetailImage = e => {
    this.setState({
      loadingImage: true,
    });
    if (e.file.status === 'uploading') {
      return null;
    }
    if (e.file.status === 'done' && e.file.response) {
      const { dispatch } = this.props;
      const { shopDetail } = this.props.shopDetail;
      const { detail } = shopDetail;
      detail.push({
        type: 2,
        content: e.file.response.data.imageKey,
      });

      dispatch({
        type: 'shopDetail/graphicShop',
        payload: { id: this.props.match.params.id, detail },
      }).then(() => {
        dispatch({
          type: 'shopDetail/getShop',
          payload: { id: this.props.match.params.id },
        });
      });
      this.setState({ loadingImage: false });
      message.success('上传成功');
    } else {
      this.setState({ loadingImage: false });
      message.error('上传失败');
    }
    return null;
  };

  // 图为详情=>添加详情文字描述
  addDetailText = e => {
    const { dispatch } = this.props;
    const { shopDetail } = this.props.shopDetail;
    const { detail } = shopDetail;
    detail.push({
      type: 1,
      content: e.text,
    });
    dispatch({
      type: 'shopDetail/graphicShop',
      payload: { id: this.props.match.params.id, detail },
    }).then(() => {
      this.setState({ addTextModalVisible: false });
      dispatch({
        type: 'shopDetail/getShop',
        payload: { id: this.props.match.params.id },
      });
    });
    return null;
  };

  // 图文详情=>修改图文详情中的文字内容
  EditDetailItem = e => {
    const { dispatch } = this.props;
    const { shopDetail } = this.props.shopDetail;
    const { detail } = shopDetail;
    detail.splice(e.index.index, 1, {
      type: 1,
      content: e.fieldsValue.text,
    });
    dispatch({
      type: 'shopDetail/graphicShop',
      payload: { id: this.props.match.params.id, detail },
    }).then(() => {
      this.setState({ ModifyGraphicModalVisible: false });
      dispatch({
        type: 'shopDetail/getShop',
        payload: { id: this.props.match.params.id },
      });
    });
    return null;
  };

  // 图文详情=>删除详情图片和文字描述
  removeDetailItem = index => {
    const { dispatch } = this.props;
    const { shopDetail } = this.props.shopDetail;
    const { detail } = shopDetail;
    detail.splice(index, 1);
    dispatch({
      type: 'shopDetail/graphicShop',
      payload: { id: this.props.match.params.id, detail },
    }).then(() => {
      dispatch({
        type: 'shopDetail/getShop',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 图文详情=>修改图文详情中的图片内容
  editDetailImage = (file, index) => {
    if (file.file.status === 'uploading') {
      return null;
    }
    if (file.file.status === 'done' && file.file.response) {
      const { dispatch } = this.props;
      const { shopDetail } = this.props.shopDetail;
      const { detail } = shopDetail;
      detail.splice(index, 1, {
        type: 2,
        content: file.file.response.data.imageKey,
      });

      dispatch({
        type: 'shopDetail/graphicShop',
        payload: { id: this.props.match.params.id, detail },
      }).then(() => {
        dispatch({
          type: 'shopDetail/getShop',
          payload: { id: this.props.match.params.id },
        });
      });
      message.success('修改成功');
    } else {
      message.error('修改失败');
    }
    return null;
  };

  // 直购配比=>增加商品
  handleAddBoxProduct = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'shopDetail/updateShopProduct',
      payload: { id: this.props.match.params.id, ...params },
    }).then(() => {
      message.success('添加成功');
      this.setState({ searchProductId: undefined });
      dispatch({
        type: 'shopDetail/getShop',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 直购配比=>删除直购产品配置
  removeBoxProduct = productId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'shopDetail/deleteShopProduct',
      payload: { id: this.props.match.params.id, productId },
    }).then(() => {
      dispatch({
        type: 'shopDetail/getShop',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 订单导出导出
  handleDownloadClick = e => {
    this.setState({ loadingExport: true });
    e.preventDefault();
    const { dispatch } = this.props;
    const fileName = `订单列表_直购${this.props.match.params.id}.csv`;
    dispatch({
      type: 'shopDetail/download',
      payload: { sourceId: this.props.match.params.id, type: 2 },
      callback: blob => {
        saveAs(new Blob([blob], { type: 'text/csv;charset=utf-8' }), fileName);
      },
    });
    this.setState({ loadingExport: false });
  };

  render() {
    const { shopDetail } = this.props.shopDetail;
    const miniUrl = `/pages/directPurchase/detail/detail?id=${this.props.match.params.id}`;
    const {
      tabActiveKey,
      updateModalVisible,
      addProductModalVisible,
      ModifyGraphicModalVisible,
      editPriceModalVisible,
      searchProductId,
      addTextModalVisible,
      editProduct,
      theIndex,
      textType,
      loadingImage,
      loadingExport,
    } = this.state;
    const action = (
      <>
        <Button href={`/api/shop/${this.props.match.params.id}/qrcode`} target="_blank">
          生成二维码
        </Button>
        <Button type="primary" onClick={() => this.setState({ updateModalVisible: true })}>
          编辑
        </Button>
      </>
    );

    // 详情静态显示
    const description = (
      <RouteContext.Consumer>
        {({ isMobile }) => (
          <Descriptions className={styles.headerList} column={isMobile ? 2 : 4} bordered>
            <Descriptions.Item label="状态">
              {shopDetail.status === 0 ? (
                <Tag color="red">已下架</Tag>
              ) : (
                <Tag color="green">上架中</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="类型">
              {shopDetail.reserve ? (
                <Tag color="geekblue">预售</Tag>
              ) : (
                <Tag color="green">现货</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="预计到货时间">
              {shopDetail.reserve ? moment(shopDetail.predictAt).format('YYYY年MM月DD日') : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="价格">{shopDetail.price / 100}元</Descriptions.Item>
            <Descriptions.Item label="限购数量">
              {shopDetail.limitPurchase ? shopDetail.limitPurchase : '不限购'}
            </Descriptions.Item>
            <Descriptions.Item label="权重">{shopDetail.sort}</Descriptions.Item>
            <Descriptions.Item label="用户支付邮费">
              {shopDetail.needPostage ? <Tag color="green">是</Tag> : <Tag>否</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="库存显示">
              {shopDetail.displayStock ? <Tag color="green">显示</Tag> : <Tag>隐藏</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="列表显示">
              {shopDetail.display ? <Tag color="green">显示</Tag> : <Tag>隐藏</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="物流方式">{emsType[shopDetail.shipType]}</Descriptions.Item>
            <Descriptions.Item label="开售时间" span={2}>
              {shopDetail.openAt ? moment(shopDetail.openAt).format('YYYY年MM月DD日 HH:mm:ss') : ''}
            </Descriptions.Item>
            <Descriptions.Item label="停售时间" span={2}>
              {shopDetail.closeAt
                ? moment(shopDetail.closeAt).format('YYYY年MM月DD日 HH:mm:ss')
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="上架时间" span={2}>
              {shopDetail.startAt
                ? moment(shopDetail.startAt).format('YYYY年MM月DD日 HH:mm:ss')
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="下架时间" span={2}>
              {shopDetail.endAt ? moment(shopDetail.endAt).format('YYYY年MM月DD日 HH:mm:ss') : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="小程序路径" span={isMobile ? 2 : 4}>
              <Text copyable>{miniUrl}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="描述" span={isMobile ? 2 : 4}>
              {shopDetail.description ? shopDetail.description : '无'}
            </Descriptions.Item>
            <Descriptions.Item label="重要提示" span={isMobile ? 2 : 4}>
              {shopDetail.important ? <Text type="warning">{shopDetail.important}</Text> : '无'}
            </Descriptions.Item>
            <Descriptions.Item label="封面">
              <img src={shopDetail.coverUrl} height="80" alt="cover" />
            </Descriptions.Item>
          </Descriptions>
        )}
      </RouteContext.Consumer>
    );

    const productColumns = [
      {
        title: '商品ID',
        dataIndex: 'productId',
        align: 'center',
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '商品图片',
        dataIndex: 'image',
        align: 'center',
        render: val => (
          <span>
            <img alt="nothing" width="60" shape="square" size="small" src={val} />
          </span>
        ),
      },
      {
        title: '价格',
        dataIndex: 'price',
        hideInSearch: true,
        align: 'center',
        render: price => `¥${price / 100}`,
      },
      {
        title: '已售',
        align: 'center',
        render: (_, record) => <>{record.total - record.quantity}</>,
      },
      {
        title: '支付中',
        align: 'center',
        dataIndex: 'paying',
      },
      {
        title: '剩余库存',
        dataIndex: 'quantity',
        align: 'center',
      },
      {
        title: '总库存',
        dataIndex: 'total',
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
                  product={record}
                  onSubmit={this.handleUpdateShopProduct}
                >
                  <a>修改库存</a>
                </EditProductForm>
              )}
            </RouteContext.Consumer>
            <Divider type="vertical" />
            <a
              onClick={() => this.setState({ editProduct: record, editPriceModalVisible: true })}
              style={{ marginLeft: 2 }}
            >
              修改价格
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
                    theIndex: index,
                    textType: text.type,
                  })
                }
              >
                编辑
              </a>
            ) : (
              <Upload
                name="image"
                onChange={file => {
                  this.editDetailImage(file, index);
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
          <Card title="直购配比" style={{ marginBottom: 24 }}>
            <SearchProduct
              value={searchProductId}
              className={styles.tableOperations}
              onChange={val => this.setState({ searchProductId: val })}
            />
            <Button
              className={styles.tableOperations}
              disabled={!searchProductId}
              type="primary"
              onClick={() => this.handleAddBoxProduct({ productId: searchProductId, price: 0 })}
            >
              添加产品
            </Button>
            <Table
              rowKey="id"
              columns={productColumns}
              dataSource={shopDetail.products}
              size="small"
              pagination={false}
              bordered
            />
          </Card>
        </>
      ),
      tab2: (
        <Card title="图文详情" style={{ marginBottom: 24 }}>
          <Upload name="image" onChange={this.addDetailImage} {...uploadProps}>
            <Button className={styles.tableOperations}>
              {loadingImage ? <LoadingOutlined /> : <UploadOutlined />}
              添加图片
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
            dataSource={shopDetail.detail}
            size="small"
            pagination={false}
            bordered
          />
        </Card>
      ),
      tab3: (
        <Card title="订单列表" style={{ marginBottom: 24 }}>
          <Button style={{ marginBottom: 10 }} type="primary" onClick={this.handleDownloadClick}>
            {loadingExport ? <LoadingOutlined /> : ''}
            导出订单
          </Button>
          <OrderList sourceId={this.props.match.params.id} type="2" />
          {/* <ProTable
            search={false}
            rowKey="content"
            toolBarRender={false}
            columns={orderColumns}
            dataSource={orderData}
            size="small"
            pagination={{
              showSizeChanger: true,
              defaultPageSize: 20,
              showTotal: total => `总共${total}条记录`,
            }}
            bordered
            request={async () => {
              const response = await fetchOrders({ sourceId: this.props.match.params.id, type: 2 });
              return {
                data: response.list,
                current: response.pagination.current,
                total: response.pagination.total,
                pageSize: response.pagination.pageSize,
              };
            }}
          /> */}
        </Card>
      ),
    };

    return (
      <PageHeaderWrapper
        title={
          <>
            <Title level={3} style={{ marginBottom: 0 }}>
              {`直购：${shopDetail.name}`}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              创建时间: {moment(shopDetail.createAt).format('YYYY-MM-DD HH:mm:ss')}
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
            tab: '订单列表',
          },
        ]}
      >
        <div className={styles.main}>
          <GridContent>{contentList[tabActiveKey]}</GridContent>
        </div>
        {/* 编辑详情 */}
        <UpdateForm
          shop={shopDetail}
          onSubmit={this.handleUpdate}
          onCancel={() => this.setState({ updateModalVisible: false })}
          modalVisible={updateModalVisible}
        />
        {/* 编辑图文详情 */}
        <ModifyGraphicForm
          index={theIndex}
          type={textType}
          shop={ShopDetail}
          onSubmit={this.EditDetailItem}
          onCancel={() => this.setState({ ModifyGraphicModalVisible: false })}
          modalVisible={ModifyGraphicModalVisible}
        />
        {/* 添加产品 */}
        <AddProductForm
          onSubmit={this.handleUpdateShopProduct}
          onCancel={() => this.setState({ addProductModalVisible: false })}
          modalVisible={addProductModalVisible}
        />
        {/* 添加图文详情文字 */}
        <AddTextForm
          onSubmit={this.addDetailText}
          onCancel={() => this.setState({ addTextModalVisible: false })}
          modalVisible={addTextModalVisible}
        />
        {/* 修改价格 */}
        <EditPriceForm
          product={editProduct}
          onSubmit={this.handleUpdateShopPrice}
          onCancel={() => this.setState({ editPriceModalVisible: false })}
          modalVisible={editPriceModalVisible}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ shopDetail, loading }) => ({
  shopDetail,
  loading: loading.effects['shopDetail/getShop'],
}))(ShopDetail);
