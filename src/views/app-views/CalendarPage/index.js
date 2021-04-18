import React, { useEffect, useState } from 'react';
import { Calendar, Card, Row, Col, Typography, Badge } from 'antd';
import moment from 'moment';
import {
  DATE_FORMAT_DD_MMM_YYYY,
  DATE_FORMAT_LONG_DATE,
  DATE_FORMAT_YYYY_MM_DD,
} from 'constants/DateConstant';
import Flex from 'components/shared-components/Flex';
import CalendarCollapseList from './CalendarCollapseList';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDateAppointments,
  getDoctorAppointments,
  setDoctorAppointments,
} from 'redux/actions/Appointment';
import { makeSelectDateAppointments } from 'redux/selectors/Appointment';
import CalendarHeader from './CalendarHeader';

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
      dispatch(getDoctorAppointments(value.format(DATE_FORMAT_YYYY_MM_DD)));
    }
  };

  const yearAndMonth = selectedDate.format(DATE_FORMAT_YYYY_MM_DD).slice(0, 7);

  useEffect(() => {
    dispatch(
      getDoctorAppointments(selectedDate.format(DATE_FORMAT_YYYY_MM_DD))
    );
    return () => dispatch(setDoctorAppointments([]));
  }, []);

  useEffect(() => {
    const [year, month] = yearAndMonth.split('-');
    dispatch(getDateAppointments({ year, month }));
  }, [yearAndMonth]);

  const dateCellRender = (value) => {
    const appointmentCount = dateAppointments.find(
      (item) => item.date === value.format(DATE_FORMAT_YYYY_MM_DD)
    );
    return (
      <Flex
        justifyContent="end"
        alignItems="end"
        className="height-100 pb-3 pr-1"
      >
        <Badge className="badge-color" count={appointmentCount?.total} />
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
            headerRender={CalendarHeader}
          />
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Flex
            justifyContent="between"
            alignItems="center"
            className="pb-3 pr-1"
          >
            <Title level={3} className="mb-4 mt-5">
              {selectedDate.format(DATE_FORMAT_LONG_DATE)}
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
