import React, { Component } from 'react';
import { connect } from 'dva';
import { Typography, Descriptions, Button, Tag, Card, Popconfirm } from 'antd';
import { GridContent, PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import Link from 'umi/link';
import moment from 'moment';
import UpdateForm from './components/UpdateForm';
import OrderList from './components/OrderList';
import styles from './style.less';

const { Title } = Typography;

const rareTags = [<Tag>普通</Tag>, <Tag color="blue">稀有</Tag>, <Tag color="purple">隐藏</Tag>];
const purchaseTypes = [
  <Tag color="orange">采销</Tag>,
  <Tag color="pink">代销</Tag>,
  <Tag>其他</Tag>,
];

class ProductDetail extends Component {
  // 初始化状态
  state = {
    updateModalVisible: false,
    tabActiveKey: 'tab1',
  };

  // 生命周期函数 第一次渲染后调用
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'productDetail/fetchProduct',
      payload: { id: this.props.match.params.id },
    });
  }

  // 编辑=>保存详情
  handleUpdate = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'productDetail/updateBox',
      payload: params,
    }).then(() => {
      this.setState({ updateModalVisible: false });
      dispatch({
        type: 'productDetail/fetchProduct',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  // 产品到货函数
  goodsArrival = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'productDetail/goodsArrival',
      payload: { id: this.props.match.params.id },
    }).then(() => {
      dispatch({
        type: 'productDetail/fetchProduct',
        payload: { id: this.props.match.params.id },
      });
    });
    return null;
  };

  render() {
    const { productDetail } = this.props.productDetail;
    const { tabActiveKey, updateModalVisible } = this.state;

    const action = (
      <div>
        <Popconfirm
          disabled={productDetail.status !== 1}
          title="确认该盲盒到货吗？"
          onConfirm={() => this.goodsArrival()}
        >
          <Button disabled={productDetail.status !== 1}>到货</Button>
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
            <Descriptions.Item label="ID">{productDetail.id}</Descriptions.Item>
            <Descriptions.Item label="属性">{rareTags[productDetail.rare]}</Descriptions.Item>
            <Descriptions.Item label="类型">
              {productDetail.status === 1 ? (
                <Tag color="geekblue">预售</Tag>
              ) : (
                <Tag color="green">现货</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="预计到货时间">
              {productDetail.predictAt
                ? moment(productDetail.predictAt).format('YYYY年MM月DD日 HH:mm:ss')
                : '无'}
            </Descriptions.Item>
            <Descriptions.Item label="系列">
              {productDetail.series ? (
                <Link to={`/product/series/detail/${productDetail.series.id}`}>
                  {productDetail.series.name}
                </Link>
              ) : (
                '无'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="品牌">
              {productDetail.brand ? productDetail.brand.name : '无'}
            </Descriptions.Item>
            <Descriptions.Item label="采购类型">
              {purchaseTypes[productDetail.purchaseType]}
            </Descriptions.Item>
            <Descriptions.Item label="零售价">{productDetail.price / 100}元</Descriptions.Item>
            <Descriptions.Item label="税率">{productDetail.taxRate}</Descriptions.Item>
            <Descriptions.Item label="批发价">
              {productDetail.wholesalePrice / 100}元
            </Descriptions.Item>
            <Descriptions.Item label="图片">
              <img src={productDetail.imageUrl} width="100" alt="cover" />
            </Descriptions.Item>
            <Descriptions.Item label="卡片">
              {productDetail.cardImageUrl ? (
                <img src={productDetail.cardImageUrl} width="100" alt="cover" />
              ) : (
                '无'
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </RouteContext.Consumer>
    );
    const contentList = {
      tab1: (
        <Card title="订单列表" style={{ marginBottom: 24 }}>
          <OrderList Id={this.props.match.params.id} />
        </Card>
      ),
    };
    return (
      <PageHeaderWrapper
        title={
          <>
            <Title level={3} style={{ marginBottom: 0 }}>
              {`产品：${productDetail.name}`}
            </Title>
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
            tab: '订单列表',
          },
        ]}
      >
        <div className={styles.main}>
          <GridContent>{contentList[tabActiveKey]}</GridContent>
        </div>
        {/* 编辑详情 */}
        <UpdateForm
          product={productDetail}
          onSubmit={this.handleUpdate}
          onCancel={() => this.setState({ updateModalVisible: false })}
          modalVisible={updateModalVisible}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ productDetail, loading }) => ({
  productDetail,
  loading: loading.effects['productDetail/getBox'],
}))(ProductDetail);
