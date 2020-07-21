import React, { useState } from 'react';
import { Select, Avatar } from 'antd';
import { fetchLives } from '@/services/global';

const { Option } = Select;
const ProductCrad = props => {
  const { onChange, className, value } = props;
  const [searchProductList, setSearchProductList] = useState([]);

  return (
    <Select
      mode="multiple"
      className={className}
      allowClear
      labelInValue
      style={{ width: 300 }}
      placeholder="搜索直播房间"
      value={value}
      onChange={onChange}
      onSearch={val => {
        fetchLives({ name: val }).then(res => {
          setSearchProductList(res.list);
        });
      }}
      filterOption={false}
      optionLabelProp="label"
    >
      {searchProductList.map(item => (
        <Option key={item.roomId} label={item.name} value={item.roomId}>
          <Avatar shape="square" src={item.cover} size={24} style={{ verticalAlign: 'middle' }} />
          <span style={{ marginLeft: 16, verticalAlign: 'middle' }}>
            {`[ID${item.roomId}]${item.name}${item.series ? `(${item.series.name})` : ''}`}
          </span>
        </Option>
      ))}
    </Select>
  );
};

export default ProductCrad;
