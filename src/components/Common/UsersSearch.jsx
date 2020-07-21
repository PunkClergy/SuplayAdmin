import React, { useState } from 'react';
import { Select, Avatar } from 'antd';
import { fetchUsers } from '@/services/global';

const { Option } = Select;
const UserSearch = props => {
  const { onChange, value } = props;
  const [searchProductList, setSearchProductList] = useState([]);

  return (
    <Select
      showSearch
      allowClear
      style={{ width: 300 }}
      placeholder="请输入UUID或用户名"
      value={value}
      onChange={onChange}
      onSearch={val => {
        fetchUsers({ UUID: val }).then(res => {
          setSearchProductList(res.list);
        });
      }}
    >
      {searchProductList.map(item => (
        <Option key={item.id} label={item.nickname} value={item.roomId}>
          <Avatar shape="square" src={item.avatar} size={24} style={{ verticalAlign: 'middle' }} />
          <span style={{ marginLeft: 16, verticalAlign: 'middle' }}>
            {`[ID${item.id}]${item.nickname}`}
          </span>
        </Option>
      ))}
    </Select>
  );
};

export default UserSearch;
