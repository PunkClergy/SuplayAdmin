import React, { useState } from 'react';
import { Select, Avatar } from 'antd';
import { fetchSeries } from '@/services/global';

const { Option } = Select;
const SeriesSearch = props => {
  const { onChange, className } = props;
  const [searchSeriesList, setSearchSeriesList] = useState([]);

  return (
    <Select
      className={className}
      allowClear
      showSearch
      style={{ width: 300 }}
      placeholder="搜索系列名称"
      onChange={onChange}
      onSearch={val => {
        fetchSeries({ name: val }).then(res => {
          setSearchSeriesList(res.list);
        });
      }}
      filterOption={false}
      optionLabelProp="label"
    >
      {searchSeriesList.map(item => (
        <Option key={item.id} label={item.name} value={JSON.stringify(item)}>
          <Avatar
            shape="square"
            src={item.imageUrl}
            size={24}
            style={{ verticalAlign: 'middle' }}
          />
          <span style={{ marginLeft: 16, verticalAlign: 'middle' }}>
            {`${item.name}${item.brand ? `(${item.brand.name})` : ''}`}
          </span>
        </Option>
      ))}
    </Select>
  );
};

export default SeriesSearch;
