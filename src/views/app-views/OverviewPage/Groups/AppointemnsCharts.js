import { Card, Col, Row, Typography } from 'antd';
import { interpolate } from 'utils/interpolate';
import React from 'react';
import {
  COLOR_1,
  COLOR_2,
  COLOR_3,
  COLOR_4,
  COLOR_5,
  COLOR_6,
  COLOR_7,
} from 'constants/ChartConstant';
import DonutChartWidget from 'components/shared-components/DonutChartWidget';
import { useSelector } from 'react-redux';
import { makeSelectPreferencesData } from 'redux/selectors/Overview';

const AppointmentsCharts = () => {

  const { preferences } = useSelector(makeSelectPreferencesData);

  const dataTimeOfDay = {
    labels: [
      interpolate("Morning", {
        value: preferences.byPeriod.morning,
      }),
      interpolate("Afternoon", {
        value: preferences.byPeriod.afternoon,
      }),
      interpolate("Evening", {
        value: preferences.byPeriod.evening,
      }),
    ],
    datasets: {
      data: [
        preferences.byPeriod.morning,
        preferences.byPeriod.afternoon,
        preferences.byPeriod.evening,
      ],
      backgroundColor: [COLOR_1, COLOR_2, COLOR_3],
    },
  };

  const dataDayOfWeek = {
    labels: [
      interpolate("Mon", {
        value: preferences.byDay.monday,
      }),
      interpolate("Tue", {
        value: preferences.byDay.tuesday,
      }),
      interpolate("Wed", {
        value: preferences.byDay.wednesday,
      }),
      interpolate("Thur", {
        value: preferences.byDay.thursday,
      }),
      interpolate("Fri", {
        value: preferences.byDay.friday,
      }),
      interpolate("Sat", {
        value: preferences.byDay.saturday,
      }),
      interpolate("Sun", {
        value: preferences.byDay.sunday,
      }),
    ],
    datasets: {
      data: [
        preferences.byDay.monday,
        preferences.byDay.tuesday,
        preferences.byDay.wednesday,
        preferences.byDay.thursday,
        preferences.byDay.friday,
        preferences.byDay.saturday,
        preferences.byDay.sunday,
      ],
      backgroundColor: [
        COLOR_1,
        COLOR_2,
        COLOR_3,
        COLOR_4,
        COLOR_5,
        COLOR_6,
        COLOR_7,
      ],
    },
  };

  return (
    <Row>
      <Col span={24} className="mb-3">
        <Card
          className="height-100 d-flex flex-column justify-content-between"
          title={
            <Typography.Title level={4} className="text-wrap">
              {"Patient appointment preferences"}
            </Typography.Title>
          }
        >
          <div className="mb-4">
            <DonutChartWidget
              series={dataTimeOfDay.datasets.data}
              labels={dataTimeOfDay.labels}
              customOptions={{
                colors: dataTimeOfDay.datasets.backgroundColor,
                legend: {
                  position: 'right',
                },
                dataLabels: {
                  enabled: true,
                  formatter: function (val) {
                    return +val.toFixed(2) + '%';
                  },
                },
              }}
              type="donut"
            />
          </div>
          <div className="mb-4">
            <DonutChartWidget
              series={dataDayOfWeek.datasets.data}
              labels={dataDayOfWeek.labels}
              customOptions={{
                colors: dataDayOfWeek.datasets.backgroundColor,
                legend: {
                  position: 'left',
                },
              }}
              type="pie"
            />
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default AppointmentsCharts;
