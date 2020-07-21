import React from 'react';
import { Chart, Geom, Axis, Tooltip, Legend, View } from 'bizcharts';
import DataSet from '@antv/data-set';

const MonthlyChart = props => {
  const { title, data, height } = props;

  const ds = new DataSet();
  const dvBar = ds.createView().source(data || []);
  dvBar.transform({
    type: 'filter',
    callback(row) {
      return row.label !== '合计';
    },
  });
  const dvLine = ds.createView().source(data || []);
  dvLine.transform({
    type: 'filter',
    callback(row) {
      return row.label === '合计';
    },
  });

  return (
    <div>
      <h4>{title}</h4>
      <Chart height={height || 300} width={500} forceFit data={dvLine} padding="auto">
        <Legend allowAllCanceled />
        <Axis name="date" />
        <Axis name="value" />
        <Tooltip />
        <View data={dvBar}>
          <Geom
            type="intervalStack"
            position="date*value"
            color={[
              'label',
              ['rgb(240, 72, 100)', 'rgb(24, 144, 255)', 'rgb(47, 194, 91)', 'rgb(130, 40, 200)'],
            ]}
          />
        </View>
        <Geom type="line" position="date*value" color={['label', '#fad24f']} size={3} />
      </Chart>
    </div>
  );
};

export default MonthlyChart;
