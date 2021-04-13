import React, { useState } from 'react';
import { Calendar, Card, Row, Col, Typography, Badge } from 'antd';
import moment from 'moment';
import { DATE_FORMAT_DD_MMM_YYYY } from 'constants/DateConstant';
import Flex from 'components/shared-components/Flex';
import CalendarCollapseList from './CalendarCollapseList';

const { Title } = Typography;

const CalendarPage = () => {
  const date = new Date();
  const [selectedDate, setSelectedDate] = useState(
    moment(date, DATE_FORMAT_DD_MMM_YYYY)
  );

  const onPanelChange = (value, mode) => {
    setSelectedDate(value);
  };

  const onSelect = (value) => {
    setSelectedDate(value);
  };

  const dateCellRender = (value) => {
    let appointmentCount;
    // Dummy data.
    if (value.date() === 3) {
      appointmentCount = 8;
    }
    if (value.date() === 19) {
      appointmentCount = 12;
    }
    return (
      <Flex
        justifyContent="end"
        alignItems="end"
        className="height-100 pb-3 pr-1"
      >
        <Badge count={appointmentCount} />
      </Flex>
    );
  };

  const monthCellRender = (value) => {
    let appointmentCount;
    // Dummy data.
    if (value.month() === 0) {
      appointmentCount = 120;
    }
    if (value.month() === 8) {
      appointmentCount = 208;
    }
    return (
      <Flex
        justifyContent="end"
        alignItems="end"
        className="height-100 pb-3 pr-1"
      >
        <Badge count={appointmentCount} overflowCount={1000} />
      </Flex>
    );
  };

  return (
    <Card className="calendar mb-0">
      <Row gutter={32}>
        <Col xs={24} sm={24} md={16}>
          <Calendar
            onPanelChange={onPanelChange}
            onSelect={onSelect}
            value={selectedDate}
            className="abi-calendar"
            dateCellRender={dateCellRender}
            monthCellRender={monthCellRender}
          />
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Title level={3} className="mb-4 mt-5">
            {selectedDate.format('dddd, MMMM Do, YYYY')}
          </Title>
          <CalendarCollapseList />
        </Col>
      </Row>
    </Card>
  );
};

export default CalendarPage;
