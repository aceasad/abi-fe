import React, { useEffect, useState } from 'react';
import { Calendar, Card, Row, Col, Typography, Badge } from 'antd';
import moment from 'moment';
import { DATE_FORMAT_DD_MMM_YYYY } from 'constants/DateConstant';
import Flex from 'components/shared-components/Flex';
import CalendarCollapseList from './CalendarCollapseList';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDateAppointments,
  getDoctorAppointments,
} from 'redux/actions/Appointments';
import { makeSelectDateAppointments } from 'redux/selectors/Appointment';

const { Title } = Typography;

const CalendarPage = () => {
  const dispatch = useDispatch();
  const { dateAppointments, appointmentsCount } = useSelector(
    makeSelectDateAppointments()
  );

  const [selectedDate, setSelectedDate] = useState(
    moment(new Date(), DATE_FORMAT_DD_MMM_YYYY)
  );

  const onPanelChange = (value) => {
    setSelectedDate(value);
  };

  const onSelect = (value) => {
    if (!selectedDate.isSame(value)) {
      setSelectedDate(value);
      dispatch(getDoctorAppointments(value.format('YYYY-MM-DD')));
    }
  };

  const yearAndMonth = selectedDate.format('YYYY-MM-DD').slice(0, 7);

  useEffect(() => {
    const [year, month] = yearAndMonth.split('-');
    dispatch(getDateAppointments({ year, month }));
  }, [yearAndMonth]);

  const dateCellRender = (value) => {
    const appointmentCount = dateAppointments.find(
      (item) => item.date === value.format('YYYY-MM-DD')
    );
    return (
      <Flex
        justifyContent="end"
        alignItems="end"
        className="height-100 pb-3 pr-1"
      >
        <Badge count={appointmentCount?.total} />
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
            mode="month"
            dateCellRender={dateCellRender}
            monthCellRender={monthCellRender}
          />
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Flex
            justifyContent="between"
            alignItems="center"
            className="pb-3 pr-1"
          >
            <Title level={3} className="mb-4 mt-5">
              {selectedDate.format('dddd, MMMM Do, YYYY')}
            </Title>
            <Badge count={appointmentsCount} overflowCount={1000} />
          </Flex>
          <CalendarCollapseList />
        </Col>
      </Row>
    </Card>
  );
};

export default CalendarPage;
