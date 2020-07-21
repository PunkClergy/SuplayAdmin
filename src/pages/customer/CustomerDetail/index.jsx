import React, { Component } from 'react';
import { connect } from 'dva';
import { Descriptions, Card } from 'antd';
import { GridContent, PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import { FormOutlined } from '@ant-design/icons';
import EditMobileForm from './components/EditMobileForm';
import CabinetList from './components/CabinetList';
import OrderList from './components/OrderList';
import PaymentList from './components/PaymentList';
import WalletLogList from './components/WalletLogList';
import CouponsList from './components/CouponsList';

import styles from './style.less';

const genderTags = ['其他', '男', '女'];

class BoxDetail extends Component {
  // 初始化状态
  state = {
    tabActiveKey: 'tab1',
    mobileModalVisible: false,
  };

  // 生命周期函数 第一次渲染后调用
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userDetail/getUserDetail',
      payload: { id: this.props.match.params.id },
    });
    dispatch({
      type: 'userDetail/getBuy',
      payload: { userId: this.props.match.params.id, page: 1 },
    });
  }

  updateMobile = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userDetail/updateMobile',
      payload: params,
    }).then(() => {
      this.setState({ mobileModalVisible: false });
      dispatch({
        type: 'userDetail/getUserDetail',
        payload: { id: this.props.match.params.id },
      });
    });
  };

  render() {
    const { userDetail } = this.props.userDetail;

    const { tabActiveKey, mobileModalVisible } = this.state;

    // 详情静态显示
    const description = (
      <RouteContext.Consumer>
        {({ isMobile }) => (
          <Descriptions
            className={styles.headerList}
            size="small"
            column={isMobile ? 2 : 4}
            bordered
          >
            <Descriptions.Item label="ID">{userDetail.id}</Descriptions.Item>
            <Descriptions.Item label="UUID">{userDetail.uuid}</Descriptions.Item>
            <Descriptions.Item label="昵称">{userDetail.nickname}</Descriptions.Item>
            <Descriptions.Item label="头像">
              <img src={userDetail.avatar} width="50" alt="cover" />
            </Descriptions.Item>
            <Descriptions.Item label="性别">{genderTags[userDetail.gender]}</Descriptions.Item>
            <Descriptions.Item label="联系电话">
              {userDetail.mobile}
              {` `}
              <a onClick={() => this.setState({ mobileModalVisible: true })}>
                <FormOutlined />
              </a>
            </Descriptions.Item>
            <Descriptions.Item label="幸运值">{userDetail.points}</Descriptions.Item>
            <Descriptions.Item label="总消费金额">{userDetail.goldTotal / 100}元</Descriptions.Item>
            <Descriptions.Item label="钱包余额">
              {userDetail.wallet ? `${userDetail.wallet.gold / 100}元` : ''}
            </Descriptions.Item>
            <Descriptions.Item label="钱包待入账金额">
              {userDetail.wallet ? `${userDetail.wallet.waitGold / 100}元` : ''}
            </Descriptions.Item>
            <Descriptions.Item label="提现中">
              {userDetail.wallet ? `${userDetail.wallet.pending / 100}元` : ''}
            </Descriptions.Item>
          </Descriptions>
        )}
      </RouteContext.Consumer>
    );

    const contentList = {
      tab1: (
        <Card title="盒柜列表" style={{ marginBottom: 24 }}>
          <CabinetList userId={this.props.match.params.id} />
        </Card>
      ),
      tab2: (
        <Card title="订单列表" style={{ marginBottom: 24 }}>
          <OrderList userId={userDetail.id} />
        </Card>
      ),
      tab3: (
        <Card title="付款明细" style={{ marginBottom: 24 }}>
          <PaymentList userId={userDetail.id} />
        </Card>
      ),
      tab4: (
        <Card title="钱包明细" style={{ marginBottom: 24 }}>
          <WalletLogList userId={userDetail.id} />
        </Card>
      ),
      tab5: (
        <Card title="代金券列表" style={{ marginBottom: 24 }}>
          <CouponsList userId={userDetail.id} />
        </Card>
      ),
    };

    return (
      <PageHeaderWrapper
        title="用户详情"
        className={styles.pageHeader}
        content={description}
        tabActiveKey={tabActiveKey}
        onTabChange={key => this.setState({ tabActiveKey: key })}
        tabList={[
          {
            key: 'tab1',
            tab: '盒柜列表',
          },
          {
            key: 'tab2',
            tab: '订单列表',
          },
          {
            key: 'tab3',
            tab: '支付明细',
          },
          {
            key: 'tab4',
            tab: '钱包明细',
          },
          {
            key: 'tab5',
            tab: '代金券列表',
          },
        ]}
      >
        <div className={styles.main}>
          <GridContent>{contentList[tabActiveKey]}</GridContent>
        </div>
        <EditMobileForm
          customer={userDetail}
          onSubmit={this.updateMobile}
          onCancel={() => this.setState({ mobileModalVisible: false })}
          modalVisible={mobileModalVisible}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ userDetail, loading }) => ({
  userDetail,
  loading: loading.effects['userDetail/getBox'],
}))(BoxDetail);
