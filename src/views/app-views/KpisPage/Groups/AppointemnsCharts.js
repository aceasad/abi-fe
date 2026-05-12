import { Card, Col, Row, Typography } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import messages from '../messages';
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
  const { formatMessage } = useIntl();

  const { preferences } = useSelector(makeSelectPreferencesData);

  const dataTimeOfDay = {
    labels: [
      formatMessage(messages.appointmentsChartMorning, {
        value: preferences.byPeriod.morning,
      }),
      formatMessage(messages.appointmentsChartAfternoon, {
        value: preferences.byPeriod.afternoon,
      }),
      formatMessage(messages.appointmentsChartEvening, {
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
      formatMessage(messages.appointmentsChartMon, {
        value: preferences.byDay.monday,
      }),
      formatMessage(messages.appointmentsChartTue, {
        value: preferences.byDay.tuesday,
      }),
      formatMessage(messages.appointmentsChartWed, {
        value: preferences.byDay.wednesday,
      }),
      formatMessage(messages.appointmentsChartThur, {
        value: preferences.byDay.thursday,
      }),
      formatMessage(messages.appointmentsChartFri, {
        value: preferences.byDay.friday,
      }),
      formatMessage(messages.appointmentsChartSat, {
        value: preferences.byDay.saturday,
      }),
      formatMessage(messages.appointmentsChartSun, {
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
            <Typography.Title level={3} className="text-wrap">
              {formatMessage(messages.appointmentsPreferences)}
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
