import React, { Component } from 'react';
import { DatePicker, Card, Row, Col, Button } from 'antd';
import { SyncOutlined, LoadingOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getTimeDistance } from '@/utils/utils';
import IntroductRow from './components/IntroduceRow';
import Pie from './components/Pie';
import MonthlyChart from './components/MonthlyChart';
import Yuan from './components/Yuan';

const { RangePicker } = DatePicker;
class DataTable extends Component {
  state = {
    rangePickerValue: getTimeDistance('month'),
    refreshLoading: true,
  };

  // 生命周期函数 第一次渲染后调用
  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    this.setState({ refreshLoading: false });
    const { dispatch } = this.props;
    const { rangePickerValue } = this.state;
    dispatch({
      type: 'analysis/getSummary',
      payload: {},
    });
    dispatch({
      type: 'analysis/getPayDataChart',
      payload: {
        start: rangePickerValue ? rangePickerValue[0].format('YYYYMMDD') : '',
        end: rangePickerValue ? rangePickerValue[1].format('YYYYMMDD') : '',
      },
    });
    setTimeout(() => {
      this.setState({ refreshLoading: true });
    }, 1000);
  };

  render() {
    const { data, summary, loading } = this.props.analysis;
    const { rangePickerValue, refreshLoading } = this.state;

    const rangeAction = (
      <RangePicker
        value={rangePickerValue}
        onChange={value => {
          this.setState({ rangePickerValue: value }, () => this.refresh());
        }}
        allowEmpty={[false, false]}
      />
    );

    const refreshAction = (
      <div>
        <Button onClick={() => this.refresh()} style={{ marginLeft: 10 }}>
          {refreshLoading ? <SyncOutlined /> : <LoadingOutlined />}
          刷新
        </Button>
      </div>
    );

    return (
      <PageHeaderWrapper title="数据总览" extra={refreshAction}>
        <IntroductRow data={summary} style={{ marginBottom: 24 }} />
        <Card loading={loading} title="详细数据" extra={rangeAction}>
          <Row gutter={16}>
            <Col xs={24} sm={24} style={{ marginBottom: 24 }}>
              <MonthlyChart title="每日消费统计" data={data.dailyConsumption} height={300} />
            </Col>
            <Col xs={24} sm={24} style={{ marginBottom: 24 }}>
              <Pie
                hasLegend
                title="总额"
                subTitle="总额"
                total={() => (
                  <Yuan>
                    {data.monthlyConsumption
                      ? data.monthlyConsumption.reduce((n, m) => n + m.y, 0)
                      : 0}
                  </Yuan>
                )}
                data={data.monthlyConsumption}
                lineWidth={4}
                colors={[
                  'rgb(24, 144, 255)',
                  'rgb(130, 40, 200)',
                  'rgb(230, 90, 00)',
                  'rgb(47, 194, 91)',
                  'rgb(40, 14, 102)',
                  'rgb(240, 72, 100)',
                ]}
                valueFormat={value => <Yuan>{value}</Yuan>}
                height={300}
              />
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ analysis, loading }) => ({
  analysis,
  loading: loading.effects['analysis/getPayDataChart'],
}))(DataTable);
