import React from 'react';
import { Card } from 'antd';
import Chart from 'react-apexcharts';
import { apexPieChartDefaultOption } from 'constants/ChartConstant';
import PropTypes from 'prop-types';

const defaultOption = apexPieChartDefaultOption;

const DonutChartWidget = (props) => {
  const {
    series,
    customOptions,
    labels,
    width,
    height,
    title,
    extra,
    type,
  } = props;
  let options = defaultOption;
  options.labels = labels;
  options.plotOptions.pie.donut.labels.total.label = title;
  if (!title) {
    options.plotOptions.pie.donut.labels.show = false;
  }
  if (customOptions) {
    options = { ...options, ...customOptions };
  }
  return (
    <Card>
      <div className="text-left">
        <Chart
          type={type}
          options={options}
          series={series}
          width={width}
          height={height}
        />
        {extra}
      </div>
    </Card>
  );
};

DonutChartWidget.propTypes = {
  series: PropTypes.array.isRequired,
  labels: PropTypes.array,
  title: PropTypes.string,
  extra: PropTypes.element,
};

DonutChartWidget.defaultProps = {
  series: [],
  labels: [],
  title: '',
  height: 250,
  width: '100%',
};

export default DonutChartWidget;
