import React, { useState } from 'react';
import { Select, Avatar } from 'antd';
import { fetchlotteries } from '@/services/global';

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
      placeholder="搜索抽选名称"
      value={value}
      onChange={onChange}
      onSearch={val => {
        fetchlotteries({ title: val }).then(res => {
          setSearchProductList(res.list);
        });
      }}
      filterOption={false}
      optionLabelProp="label"
    >
      {searchProductList.map(item => (
        <Option key={item.id} label={item.title} value={item.id}>
          <Avatar shape="square" src={item.cover} size={24} style={{ verticalAlign: 'middle' }} />
          <span style={{ marginLeft: 16, verticalAlign: 'middle' }}>
            {`[ID${item.id}]${item.title}${item.series ? `(${item.series.name})` : ''}`}
          </span>
        </Option>
      ))}
    </Select>
  );
};

export default ProductCrad;
