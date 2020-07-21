import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs, Card, List, Tag } from 'antd';
import { SettingOutlined, AlertOutlined } from '@ant-design/icons';
import ChangePasswordForm from './components/ChangePasswordForm';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './style.less';

const { TabPane } = Tabs;
const rareTags = [
  <Tag>普通管理员</Tag>,
  <Tag color="blue">中极管理员</Tag>,
  <Tag color="purple">超级管理员</Tag>,
];
class BoxDetail extends Component {
  // 初始化状态
  state = {
    tabActiveKey: 'tab1',
    mode: 'left',
    passwordModalVisible: false,
  };

  componentDidMount() {
    console.log('1234');
    const { dispatch } = this.props;
    dispatch({
      type: 'userDetail/getUser',
      payload: {},
    });
  }

  handleChangePassword = async fields => {
    this.setState({ passwordModalVisible: false });
    const { dispatch } = this.props;
    dispatch({
      type: 'userDetail/changePassword',
      payload: { ...fields },
    });
  };

  render() {
    const { userDetail } = this.props.userDetail;
    const { tabActiveKey, mode, passwordModalVisible } = this.state;
    return (
      <PageHeaderWrapper
        title="个人中心"
        className={styles.pageHeader}
        tabActiveKey={tabActiveKey}
        onTabChange={key => this.setState({ tabActiveKey: key })}
      >
        <Tabs defaultActiveKey="1" tabPosition={mode}>
          <TabPane
            tab={
              <span>
                <SettingOutlined />
                基本设置
              </span>
            }
            key="1"
          >
            <Card title="基本设置">
              <List>
                <List.Item key="1">
                  <List.Item.Meta title="账号ID" description={userDetail.id} />
                </List.Item>
                <List.Item key="2">
                  <List.Item.Meta title="UUID" description={userDetail.uuid} />
                </List.Item>
                <List.Item key="3">
                  <List.Item.Meta title="昵称" description={userDetail.name} />
                </List.Item>
                <List.Item key="4">
                  <List.Item.Meta title="手机号" description={userDetail.mobile} />
                </List.Item>
                <List.Item key="5">
                  <List.Item.Meta title="权限等级" description={rareTags[userDetail.role]} />
                </List.Item>
              </List>
            </Card>
          </TabPane>
          <TabPane
            tab={
              <span>
                <AlertOutlined />
                安全设置
              </span>
            }
            key="2"
          >
            <Card title="安全设置">
              <List>
                <List.Item key="1">
                  <List.Item.Meta title="账户密码" description="当前密码：******" />
                  <div>
                    {' '}
                    <a
                      onClick={() => {
                        this.setState({ passwordModalVisible: true });
                      }}
                    >
                      修改密码
                    </a>
                  </div>
                </List.Item>
              </List>
            </Card>
          </TabPane>
        </Tabs>
        <ChangePasswordForm
          onSubmit={value => this.handleChangePassword(value)}
          onCancel={() => this.setState({ passwordModalVisible: false })}
          modalVisible={passwordModalVisible}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ userDetail, loading }) => ({
  userDetail,
  loading: loading.effects['userDetail/getBox'],
}))(BoxDetail);
