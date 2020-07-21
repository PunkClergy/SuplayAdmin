import React from 'react';
import Link from 'umi/link';
import { Popover, Card, Avatar } from 'antd';
import { useRequest } from '@umijs/hooks';
import { getUserInfo } from '@/services/global';

const { Meta } = Card;

const CustomerCard = props => {
  const { userId } = props;
  const { data, loading } = useRequest(() => getUserInfo({ id: userId }), {
    initialData: {},
    refreshDeps: [userId],
  });

  return (
    <Card loading={loading}>
      <Meta
        avatar={<Avatar src={data.avatar} />}
        title={data.nickname}
        description={`累计消费${data.goldTotal / 100}元`}
      />
    </Card>
  );
};

const CustomerLink = props => {
  const { user } = props;
  if (user) {
    return (
      <Popover content={<CustomerCard userId={user.id} />}>
        <Link to={`/customer/${user.id}/detail`}>{user.nickname}</Link>
      </Popover>
    );
  }
  return <></>;
};

export default CustomerLink;
