import { Form, Input, Button, Alert, Checkbox } from 'antd';
import React, { useState } from 'react';
import { connect } from 'dva';
import styles from './style.less';

const LoginMessage = ({ content }) => (
  <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
);

const Login = props => {
  const { userLogin = {}, submitting } = props;
  const { status } = userLogin;
  const [autoLogin, setAutoLogin] = useState(true);

  const handleSubmit = values => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values },
    });
  };

  return (
    <div className={styles.main}>
      <Form onFinish={handleSubmit}>
        {status === 'error' && !submitting && <LoginMessage content="账户或密码错误" />}
        <Form.Item
          name="mobile"
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        >
          <Input placeholder="用户名/手机号" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        >
          <Input.Password placeholder="密码" />
        </Form.Item>
        <Checkbox checked={autoLogin} onChange={e => setAutoLogin(e.target.checked)}>
          自动登录
        </Checkbox>
        <Form.Item>
          <Button
            style={{
              width: '100%',
              marginTop: 24,
            }}
            loading={submitting}
            type="primary"
            htmlType="submit"
          >
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
