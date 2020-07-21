import React, { Component } from 'react';
import { connect } from 'dva';
import { saveAs } from 'file-saver';
import SoldHistory from './components/SoldHistory';

class BillDetail extends Component {
  // 导出数据
  createSession = (e, times, orderShipAts) => {
    e.preventDefault();
    const { dispatch } = this.props;
    const fileName = `财务对账.csv`;
    dispatch({
      type: 'billDetail/download',
      payload: { time: times, orderShipAt: orderShipAts },
      callback: blob => {
        saveAs(new Blob([blob], { type: 'text/csv;charset=utf-8' }), fileName);
      },
    });
  };

  render() {
    return <SoldHistory onSubmit={this.createSession} />;
  }
}
export default connect(({ billDetail, loading }) => ({
  billDetail,
  loading: loading.effects['billDetail/getBox'],
}))(BillDetail);
