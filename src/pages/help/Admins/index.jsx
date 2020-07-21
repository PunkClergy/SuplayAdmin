import React, {
  useRef,
  //  useState
} from 'react';
import {
  Tag,
  message,
  Popconfirm,
  // Divider
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
// import Link from 'umi/link';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
// import ChangePasswordForm from './components/ChangePasswordForm';
import {
  getAdmins,
  // changePassword,
  deleteUser,
} from './service';

// <!--0普通管理员  2超级管理元 1 是中级管理员-->
const rareTags = [
  <Tag>普通管理员</Tag>,
  <Tag color="blue">中极管理员</Tag>,
  <Tag color="purple">超级管理员</Tag>,
];
// const flagId = localStorage.getItem('id');
// const handleChangePassword = fields => {
//   const hide = message.loading('正在修改');
//   try {
//     changePassword({
//       ...fields,
//     });
//     hide();
//     message.success('修改成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('修改失败请重试！');
//     return false;
//   }
// };
const removeUser = async (fields, action) => {
  const hide = message.loading('正在删除');
  try {
    await deleteUser({
      id: fields,
    });
    hide();
    action.current.reload();
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    action.current.reload();
    return false;
  }
};
const AdminsList = () => {
  const actionRef = useRef();
  // const [passwordModalVisible, handlePasswordModalVisible] = useState(false);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: 'uuid',
      dataIndex: 'uuid',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      hideInSearch: true,
      width: 90,
      align: 'center',
      render: avatar => <img alt="nothing" shape="square" height={70} src={avatar} />,
    },
    {
      title: '电话',
      dataIndex: 'mobile',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '权限类别',
      dataIndex: 'role',
      hideInSearch: true,
      align: 'center',
      render: rare => rareTags[rare],
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      hideInSearch: true,
      align: 'center',
      render: val => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '操作',
      width: 150,
      align: 'center',
      render: _ => (
        <>
          <Popconfirm
            title="确认删除该商品?"
            icon={<ExclamationCircleOutlined />}
            onConfirm={() => removeUser(_.id, actionRef)}
          >
            <a>删除</a>
          </Popconfirm>
          {/* <Divider type="vertical" /> */}
          {/* {Number(flagId) === _.id ? (
            // <a
            //   onClick={() => {
            //     handlePasswordModalVisible(true);
            //   }}
            // >
            //   个人中心
            // </a>
            <Link to={`/help/center`}>个人中心</Link>
          ) : (
            '-'
          )} */}
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable
        scroll={{ y: window.innerHeight - window.innerHeight / 3 }}
        bordered
        rowKey="id"
        actionRef={actionRef}
        search={false}
        request={async params => {
          const response = await getAdmins({ ...params });
          return {
            data: response.list,
          };
        }}
        columns={columns}
      />
      {/* <ChangePasswordForm
        onSubmit={async value => {
          handlePasswordModalVisible(false);
          const success = await handleChangePassword(value);
          if (success) {
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handlePasswordModalVisible(false)}
        modalVisible={passwordModalVisible}
      /> */}
    </PageHeaderWrapper>
  );
};

export default AdminsList;
