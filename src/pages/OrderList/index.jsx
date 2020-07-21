import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs, Pagination, Input, Button, Upload, message, Checkbox, Radio } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import List from './components/List';

const { Search } = Input;
const { TabPane } = Tabs;
const params = { current: 1, status: 1, query: '', officialOnly: true };
class ordersList extends Component {
  // 初始化状态
  state = {
    loadingCover: false,
    size: '',
  };

  // 生命周期函数 第一次渲染后调用
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderList/fetchOrders',
      payload: { ...params },
    });
  }

  // Tabs切换
  callback = key => {
    params.current = 1;
    params.status = key ? Number(key) : '';
    const { dispatch } = this.props;
    dispatch({
      type: 'orderList/fetchOrders',
      payload: { ...params },
    });
  };

  // 页码
  onShowSizeChange = current => {
    params.current = current;
    const { dispatch } = this.props;
    dispatch({
      type: 'orderList/fetchOrders',
      payload: { ...params },
    });
  };

  // 手机号搜索
  mobileSearch = e => {
    params.current = 1;
    params.query = e;
    // params.orderId = null;
    // params.orderNo = null;
    delete params.orderId;
    delete params.orderNo;
    const { dispatch } = this.props;
    dispatch({
      type: 'orderList/fetchOrders',
      payload: { ...params },
    });
  };

  // 订单ID搜索
  orderSearch = e => {
    params.current = 1;
    params.orderId = e;
    // params.orderNo = null;
    // params.query = null;
    delete params.orderNo;
    delete params.query;
    const { dispatch } = this.props;
    dispatch({
      type: 'orderList/fetchOrders',
      payload: { ...params },
    });
  };

  // 订单号搜索
  orderNoSearch = e => {
    params.current = 1;
    params.orderNo = e;
    // params.orderId = null;
    // params.query = null;
    delete params.orderId;
    delete params.query;
    const { dispatch } = this.props;
    dispatch({
      type: 'orderList/fetchOrders',
      payload: { ...params },
    });
  };

  // 批量发货
  uploadDelivery = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loadingCover: true });
      return;
    }
    if (info.file.status === 'done') {
      this.setState({ loadingCover: false });
      message.success('上传成功');
    } else {
      this.setState({ loadingCover: false });
      message.error(info.file.response.message);
    }
  };

  // 是否显示官方订单
  showHidden = e => {
    params.current = 1;
    params.officialOnly = e.target.checked;
    const { dispatch } = this.props;
    dispatch({
      type: 'orderList/fetchOrders',
      payload: { ...params },
    });
  };

  // 按钮处Tabs切换
  onChangeRadio = e => {
    params.current = 1;
    params.type = e.target.value;
    const radioValue = e.target.value;
    this.setState({ size: radioValue });
    const { dispatch } = this.props;
    dispatch({
      type: 'orderList/fetchOrders',
      payload: { ...params },
    });
  };

  render() {
    const uploadFileProps = {
      action: '/api/import/orders',
      multiple: false,
      className: 'avatar-uploader',
      showUploadList: false,
      headers: { 'X-Auth-Token': localStorage.getItem('accessToken') },
    };
    const { loadingCover } = this.state;
    const { size } = this.state;
    const { orderList } = this.props.orderList;
    const detail = orderList.list || [];
    const pagination = orderList.pagination || { total: 0, pageSize: 1, current: 1 };
    return (
      <PageHeaderWrapper>
        <div
          style={{
            background: '#fff',
            margin: '0px 4px 5px -20px',
            padding: '10px',
          }}
        >
          <Search
            placeholder="请输入手机号或收货人"
            onSearch={value => this.mobileSearch(value)}
            style={{ width: 200, marginRight: '10px' }}
          />
          <Search
            placeholder="请输入订单ID"
            onSearch={value => this.orderSearch(value)}
            style={{ width: 200, marginRight: '10px' }}
          />
          <Search
            placeholder="请输入订单号"
            onSearch={value => this.orderNoSearch(value)}
            style={{ width: 200, marginRight: '10px' }}
          />
          <Upload {...uploadFileProps} onChange={this.uploadDelivery}>
            <Button>
              {loadingCover ? <LoadingOutlined /> : <UploadOutlined />}
              批量发货
            </Button>
          </Upload>
          <Checkbox
            style={{ marginLeft: '10px' }}
            defaultChecked={params.officialOnly}
            onChange={this.showHidden}
          >
            只显示官方订单
          </Checkbox>
          <Radio.Group
            value={size}
            onChange={this.onChangeRadio}
            style={{
              marginBottom: 16,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Radio.Button value="">全部</Radio.Button>
            <Radio.Button value="3">抽选</Radio.Button>
            <Radio.Button value="1">盒柜</Radio.Button>
            <Radio.Button value="2">直购</Radio.Button>
          </Radio.Group>
        </div>
        <Tabs
          defaultActiveKey="1"
          onChange={this.callback}
          style={{
            background: '#fff',
            margin: '0px 4px 0px -20px',
            padding: '10px',
          }}
        >
          <TabPane tab="全部" key="">
            <List list={detail} />
          </TabPane>
          <TabPane tab="需要确认/支付" key="0">
            <List list={detail} />
          </TabPane>
          <TabPane tab="等待发货" key="1">
            <List list={detail} />
          </TabPane>
          <TabPane tab="已发货" key="2">
            <List list={detail} />
          </TabPane>
          <TabPane tab="已完成" key="3">
            <List list={detail} />
          </TabPane>
          <TabPane tab="订单关闭/取消" key="-1">
            <List list={detail} />
          </TabPane>
          <TabPane tab="订单过期" key="-2">
            <List list={detail} />
          </TabPane>
        </Tabs>
        <br />
        <Pagination
          showSizeChanger
          onChange={this.onShowSizeChange}
          defaultCurrent={pagination.current}
          current={pagination.current}
          total={pagination.total}
          pageSize={pagination.pageSize}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ orderList, loading }) => ({
  orderList,
  loading: loading.effects['orderDetail/getBox'],
}))(ordersList);
