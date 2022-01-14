import { Col, PageHeader, Row, Select, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import OverviewList from './OverviewList';
import GroupCollapse from './Groups/GroupCollapse';
import Booking from './Groups/Booking';
import Appointments from './Groups/Appointments';
import AbiData from './Groups/AbiData';
import Uptake from './Groups/Uptake';
import { useDispatch } from 'react-redux';
import { getOverviewData } from 'redux/actions/Overview';
import AppointmentsLikelyToBeMissed from './AppointmentsLikelyToBeMissed';
import MessagesRequiringImmediateAttention from './MessagesRequiringImmediateAttention';
import PassedAppointmentsRequiringImmediateStatusUpdate from './PassedAppointmentsRequiringImmediateStatusUpdate';
import AppointmentsReminders from './AppointmentsReminders';
import {
  SHOW_APPOINTMENTS_LIKELY_TO_BE_MISSED,
  SHOW_PASSED_APPOINTMENTS_REQUIRING_IMMEDIATE_ATTENTION,
  SHOW_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION,
  SHOW_APPOINTMENTS_REMINDERS,
  SHOW_KPIS,
} from 'configs/AppConfig';

const { Option } = Select;

const OverviewPage = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const filters = [
    { value: 'today', label: formatMessage(messages.selectToday) },
    { value: 'week', label: formatMessage(messages.selectWeek) },
    { value: 'month', label: formatMessage(messages.selectMonth) },
    { value: 'year', label: formatMessage(messages.selectYear) },
  ];
  const [filterValue, setFilterValue] = useState(filters[0].value);

  useEffect(() => {
    if (SHOW_KPIS) {
      dispatch(getOverviewData({ interval: filterValue }));
    }
  }, [dispatch, filterValue]);

  return (
    <>
      <PageHeader
        className="p-0 mb-4"
        title={
          <Typography.Title level={2} className="mb-0">
            {formatMessage(messages.title)}
          </Typography.Title>
        }
        extra={
          SHOW_KPIS
            ? [
                <Select
                  key="0"
                  style={{ width: 120 }}
                  onChange={setFilterValue}
                  value={filterValue}
                >
                  {filters.map((item, index) => (
                    <Option key={index} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>,
              ]
            : null
        }
      />
      <Row gutter={48}>
        <Col span={24} className="mt-4">
          {SHOW_APPOINTMENTS_LIKELY_TO_BE_MISSED && (
            <AppointmentsLikelyToBeMissed
              startOpen
              title={formatMessage(
                messages.tableAppointmentsLikelyToBeMissedTitle
              )}
            />
          )}
          {SHOW_PASSED_APPOINTMENTS_REQUIRING_IMMEDIATE_ATTENTION && (
            <PassedAppointmentsRequiringImmediateStatusUpdate
              startOpen
              title={formatMessage(
                messages.tablePassedAppointmentsRequiringImmediateStatusUpdateTitle
              )}
            />
          )}
          {SHOW_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION && (
            <MessagesRequiringImmediateAttention
              startOpen
              title={formatMessage(
                messages.tableMessagesRequiringImmediateAttentionTitle
              )}
            />
          )}
          {SHOW_APPOINTMENTS_REMINDERS && (
            <AppointmentsReminders
              startOpen
              title={formatMessage(messages.tableAppointmentsRemindersTitle)}
            />
          )}
        </Col>
      </Row>
      {SHOW_KPIS && (
        <Row gutter={48}>
          <Col span={24} className="mt-4">
            <GroupCollapse
              startOpen
              title={formatMessage(messages.bookingTitle)}
              group={<Booking title={formatMessage(messages.bookingTitle)} />}
            />
            <GroupCollapse
              startOpen
              title={formatMessage(messages.asaDataTitle)}
              group={<AbiData title={formatMessage(messages.asaDataTitle)} />}
            />
            <GroupCollapse
              title={formatMessage(messages.uptakeTitle)}
              group={<Uptake title={formatMessage(messages.uptakeTitle)} />}
            />
            <GroupCollapse
              startOpen
              title={formatMessage(messages.appointmentsTitle)}
              group={
                <Appointments
                  title={formatMessage(messages.appointmentsTitle)}
                />
              }
            />
          </Col>
        </Row>
      )}
    </>
  );
};

export default OverviewPage;
