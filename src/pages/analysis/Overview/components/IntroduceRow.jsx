import React from 'react';
import { Row, Col } from 'antd';
import numeral from 'numeral';
import ChartCard from './ChartCard';
import Field from './Field';
import MiniBar from './MiniBar';
import MiniArea from './MiniArea';

const colProps = {
  xs: 12,
  sm: 6,
};

const IntroductRow = props => {
  const { data } = props;
  const { ua, order, consumption, registers, pu } = data;
  const loading = !consumption.total;
  const coupon = data.coupon ? data.coupon : {};
  return (
    <Row gutter={16}>
      <Col {...colProps} style={{ marginBottom: 24 }}>
        <ChartCard
          title="本月销售额(不含抽选)"
          loading={loading}
          total={`${numeral(consumption.total).format('0,0')}`}
          footer={<Field label="今日销售额" value={numeral(consumption.today).format('0,0')} />}
          contentHeight={46}
        >
          <MiniBar
            color="#cceafe"
            height={50}
            data={consumption.chartData}
            style={{ marginBottom: 200 }}
          />
        </ChartCard>
      </Col>
      <Col {...colProps} style={{ marginBottom: 24 }}>
        <ChartCard
          title="本月订单"
          loading={loading}
          total={`${numeral(order.total).format('0,0')}`}
          footer={<Field label="待发货订单数" value={numeral(order.waitShipCount).format('0,0')} />}
          contentHeight={46}
        >
          <MiniBar
            color="#cceafe"
            height={50}
            data={order.chartData}
            style={{ marginBottom: 200 }}
          />
        </ChartCard>
      </Col>
      <Col {...colProps} style={{ marginBottom: 24 }}>
        <ChartCard
          title="本月活跃用户"
          loading={loading}
          total={`${numeral(ua.total).format('0,0')}`}
          footer={<Field label="日活跃" value={numeral(ua.today).format('0,0')} />}
          contentHeight={46}
        >
          <MiniArea line height={45} data={ua.chartData} style={{ marginBottom: 200 }} />
        </ChartCard>
      </Col>
      <Col {...colProps} style={{ marginBottom: 24 }}>
        <ChartCard
          title="本月新增用户"
          loading={loading}
          total={`${numeral(registers.total).format('0,0')}`}
          footer={<Field label="日新增" value={numeral(registers.today).format('0,0')} />}
          contentHeight={46}
        >
          <MiniArea
            line
            height={45}
            data={registers.chartData}
            style={{ marginBottom: 200 }}
            color="rgba(18, 194, 195, 0.2)"
            borderColor="#12C2C3"
          />
        </ChartCard>
      </Col>
      <Col {...colProps} style={{ marginBottom: 24 }}>
        <ChartCard
          title="本月ARPU"
          loading={loading}
          total={`${numeral(pu.arpu).format('0,0')}`}
          contentHeight={46}
        >
          <>
            <Field label="付费率" value={`${numeral(pu.rate * 100).format('0.00')}%`} />
            <Field label="二次付费率" value={`${numeral(pu.rate2 * 100).format('0.00')}%`} />
          </>
        </ChartCard>
      </Col>
      <Col {...colProps} style={{ marginBottom: 24 }}>
        <ChartCard
          title="优惠券减免（累计）"
          loading={loading}
          total={`${numeral(coupon.deduct / 100).format('0,0')}`}
          contentHeight={46}
        >
          <>
            <Field label="发送数量" value={numeral(coupon.sendOut).format('0,0')} />
            <Field label="使用数量" value={numeral(coupon.used).format('0,0')} />
          </>
        </ChartCard>
      </Col>
    </Row>
  );
};

export default IntroductRow;
