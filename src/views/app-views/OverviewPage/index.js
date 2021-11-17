import { Col, PageHeader, Row, Select, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import OverviewList from './OverviewList';
// import OverviewTable from './OverviewTable';
import GroupCollapse from './Groups/GroupCollapse';
import Booking from './Groups/Booking';
import Appointments from './Groups/Appointments';
import AbiData from './Groups/AbiData';
import Uptake from './Groups/Uptake';
import { useDispatch } from 'react-redux';
import { getOverviewData } from 'redux/actions/Overview';
import { getAppointmentsRemindersPage } from 'redux/actions/Appointment';
import AppointmentsRemindersList from './AppointmentsRemindersList';
import { makeSelectAppointmentsReminders } from 'redux/selectors/Appointment';
import { useSelector } from 'react-redux';

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
    dispatch(getOverviewData({ interval: filterValue }));
  }, [dispatch, filterValue]);

  const filtersUpcomingAppointmentReminders = [
    {
      value: 'Scheduled',
      label: formatMessage(messages.appointmentsRemindersSelectScheduled),
    },
    {
      value: 'Cancelled',
      label: formatMessage(messages.appointmentsRemindersSelectCancelled),
    },
  ];

  const [
    filterUpcomingAppointmentReminderValue,
    setFilterUpcomingAppointmentReminderValue,
  ] = useState(filtersUpcomingAppointmentReminders[0].value);

  useEffect(() => {
    dispatch(
      getAppointmentsRemindersPage({
        status: filterUpcomingAppointmentReminderValue,
      })
    );
  }, [dispatch, filterUpcomingAppointmentReminderValue]);

  const { count, appointmentsReminders, loading, page } = useSelector(
    makeSelectAppointmentsReminders()
  );

  return (
    <>
      <PageHeader
        className="p-0 mb-4"
        title={
          <Typography.Title level={2} className="mb-0">
            {formatMessage(messages.title)}
          </Typography.Title>
        }
        extra={[
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
        ]}
      />
      {/* <OverviewTable /> */}
      <Row gutter={48}>
        <Col span={13} className="mt-4">
          <GroupCollapse
            startOpen
            title={formatMessage(messages.bookingTitle)}
            group={<Booking title={formatMessage(messages.bookingTitle)} />}
          />
          <OverviewList
            startOpen
            title={formatMessage(messages.listAttention)}
          />
          <OverviewList
            startOpen
            title={formatMessage(messages.listScreeningInvitesSent)}
          />
          <AppointmentsRemindersList
            count={count}
            appointmentsReminders={appointmentsReminders}
            loading={loading}
            page={page}
            startOpen
            title={
              <span>
                <span>
                  {formatMessage(messages.listScreeningRemindersPending)}
                </span>
                <span className="pending-appointments-reminders-title">
                  <Select
                    key="0"
                    style={{ width: 120 }}
                    onChange={setFilterUpcomingAppointmentReminderValue}
                    value={filterUpcomingAppointmentReminderValue}
                  >
                    {filtersUpcomingAppointmentReminders.map((item, index) => (
                      <Option key={index} value={item.value}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                </span>
              </span>
            }
          />
        </Col>
        <Col span={11} className="mt-4">
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
              <Appointments title={formatMessage(messages.appointmentsTitle)} />
            }
          />
        </Col>
      </Row>
    </>
  );
};

export default OverviewPage;
