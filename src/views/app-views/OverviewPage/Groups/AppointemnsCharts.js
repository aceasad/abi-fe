import { Card, Col, Row } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import messages from '../messages';
import { Doughnut } from 'react-chartjs-2';
import {
  COLOR_1,
  COLOR_2,
  COLOR_3,
  COLOR_4,
  COLOR_5,
  COLOR_6,
} from 'constants/ChartConstant';

const dummyData = {
  morning: 40,
  afternoon: 35,
  evening: 25,
  mon: 20,
  tue: 30,
  wed: 15,
  thur: 15,
  fri: 12,
  sat: 8,
};

const AppointmentsCharts = () => {
  const { formatMessage } = useIntl();

  const dataTimeOfDay = {
    labels: [
      formatMessage(messages.appointmentsChartMorning, {
        value: dummyData.morning,
      }),
      formatMessage(messages.appointmentsChartAfternoon, {
        value: dummyData.afternoon,
      }),
      formatMessage(messages.appointmentsChartEvening, {
        value: dummyData.evening,
      }),
    ],
    datasets: [
      {
        data: [dummyData.morning, dummyData.afternoon, dummyData.evening],
        backgroundColor: [COLOR_1, COLOR_2, COLOR_3],
      },
    ],
  };

  const dataDayOfWeek = {
    labels: [
      formatMessage(messages.appointmentsChartMon, {
        value: dummyData.mon,
      }),
      formatMessage(messages.appointmentsChartTue, {
        value: dummyData.tue,
      }),
      formatMessage(messages.appointmentsChartWed, {
        value: dummyData.wed,
      }),
      formatMessage(messages.appointmentsChartThur, {
        value: dummyData.thur,
      }),
      formatMessage(messages.appointmentsChartFri, {
        value: dummyData.fri,
      }),
      formatMessage(messages.appointmentsChartSat, {
        value: dummyData.sat,
      }),
    ],
    datasets: [
      {
        data: [
          dummyData.mon,
          dummyData.tue,
          dummyData.wed,
          dummyData.thur,
          dummyData.fri,
          dummyData.sat,
        ],
        backgroundColor: [COLOR_1, COLOR_2, COLOR_3, COLOR_4, COLOR_5, COLOR_6],
      },
    ],
  };

  return (
    <Row>
      <Col span={24} className="mb-3">
        <Card
          className="height-100 d-flex flex-column justify-content-between"
          title={
            <span className="text-wrap font-size-base">
              {formatMessage(messages.appointmentsPreferences)}
            </span>
          }
        >
          <div className="mb-4">
            <Doughnut
              data={dataTimeOfDay}
              options={{
                legend: {
                  position: 'right',
                  labels: { fontSize: 12, padding: 5 },
                },
              }}
            />
          </div>
          <div className="mb-4">
            <Doughnut
              data={dataDayOfWeek}
              options={{
                legend: {
                  position: 'left',
                  labels: { fontSize: 12, padding: 5 },
                },
              }}
            />
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default AppointmentsCharts;
