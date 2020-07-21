import React, { useState } from 'react';
import { Select, Avatar } from 'antd';
import { fetchProducts } from '@/services/global';

const { Option } = Select;
const ProductSearch = props => {
  const { onChange, className, value } = props;
  const [searchProductList, setSearchProductList] = useState([]);

  return (
    <Select
      className={className}
      allowClear
      showSearch
      style={{ width: 300 }}
      placeholder="搜索商品名称"
      value={value}
      onChange={onChange}
      onSearch={val => {
        fetchProducts({ name: val }).then(res => {
          setSearchProductList(res.list);
        });
      }}
      filterOption={false}
      optionLabelProp="label"
    >
      {searchProductList.map(item => (
        <Option key={item.id} label={item.name} value={item.id}>
          <Avatar
            shape="square"
            src={item.imageUrl}
            size={24}
            style={{ verticalAlign: 'middle' }}
          />
          <span style={{ marginLeft: 16, verticalAlign: 'middle' }}>
            {`[ID${item.id}]${item.name}${item.series ? `(${item.series.name})` : ''}`}
          </span>
        </Option>
      ))}
    </Select>
  );
};

export default ProductSearch;
