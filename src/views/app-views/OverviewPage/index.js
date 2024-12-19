import {
  Col,
  PageHeader,
  Row,
  Select,
  Typography,
  Tabs,
  Card,
  Layout,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import GroupCollapse from './Groups/GroupCollapse';
import Booking from './Groups/Booking';
import Appointments from './Groups/Appointments';
import AbiData from './Groups/AbiData';
import Uptake from './Groups/Uptake';
import ClinicStats from './Groups/ClinicStats';
import { useDispatch } from 'react-redux';
import { getOverviewData, getOverviewClinicStatsData } from 'redux/actions/Overview';
import AppointmentsLikelyToBeMissed from './AppointmentsLikelyToBeMissed';
import MessagesRequiringImmediateAttention from './MessagesRequiringImmediateAttention';
import PassedAppointmentsRequiringImmediateStatusUpdate from './PassedAppointmentsRequiringImmediateStatusUpdate';
import AppointmentsReminders from './AppointmentsReminders';
import PatientProgressTable from './PatientProgressTable';
import {
  SHOW_APPOINTMENTS_LIKELY_TO_BE_MISSED,
  SHOW_PASSED_APPOINTMENTS_REQUIRING_IMMEDIATE_ATTENTION,
  SHOW_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION,
  SHOW_APPOINTMENTS_REMINDERS,
  SHOW_PATIENT_PROGRESS,
  SHOW_KPIS,
} from 'configs/AppConfig';
import { getMessageRequiringImmediateAttentionStatuses } from 'redux/actions/Appointment';

const { Option } = Select;

const OverviewPage = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  // Function to get the last 12 months as an array of objects
  const getLast12Months = () => {
    const months = [];
    const currentDate = new Date();

    for (let i = 0; i < 12; i++) {
      const monthIndex = currentDate.getMonth() - i;
      const date = new Date(currentDate.setMonth(monthIndex));
      const monthName = date.toLocaleString('default', { month: 'long' }); // Get the full month name
      months.push({
        value: monthName, // Month name used as value
        label: monthName // Month name also used as label
      });
    }

    return months; // Reverse to show from the earliest month to the current one
  };

  const convertMonthToDate = (monthName) => {
    // Get the current year
    const currentYear = new Date().getFullYear();

    // Array of month names (index corresponds to month number, e.g., January is 0, February is 1, etc.)
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // Get the month number (e.g., "November" -> 11)
    const monthIndex = monthNames.indexOf(monthName);

    if (monthIndex === -1) {
      throw new Error("Invalid month name");
    }

    // Format the date as YYYY-MM-01
    const month = (monthIndex + 1).toString().padStart(2, '0'); // Ensure month is 2 digits
    const formattedDate = `${currentYear}-${month}-01`;

    return formattedDate;
  };

  const filters = [
    ...getLast12Months(),
    // { value: 'today', label: formatMessage(messages.selectToday) },
    // { value: 'week', label: formatMessage(messages.selectWeek) },
    // { value: 'month', label: formatMessage(messages.selectMonth) },
    // { value: 'year', label: formatMessage(messages.selectYear) },
  ];
  const [filterValue, setFilterValue] = useState(filters[0].value);

  useEffect(() => {
    dispatch(getMessageRequiringImmediateAttentionStatuses());
    if (SHOW_KPIS) {
      // dispatch(getOverviewData({ interval: filterValue }));
      const date = convertMonthToDate(filterValue)
      dispatch(getOverviewClinicStatsData({ month: date }))
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
      />
      <Layout>
        <Card>
          <Tabs defaultActiveKey="1">
            {SHOW_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION && (
              <Tabs.TabPane
                tab={formatMessage(
                  messages.tableMessagesRequiringImmediateAttentionTitle
                )}
                key="1"
              >
                <MessagesRequiringImmediateAttention
                  startOpen
                  title={formatMessage(
                    messages.tableMessagesRequiringImmediateAttentionTitle
                  )}
                />
              </Tabs.TabPane>
            )}

            {SHOW_PATIENT_PROGRESS && (
              <Tabs.TabPane
                tab={formatMessage(
                  messages.tablePatientProgressTitle
                )}
                key="5"
              >
                <PatientProgressTable
                  startOpen
                  title={formatMessage(
                    messages.tablePatientProgressTitle
                  )}
                />
              </Tabs.TabPane>
            )}

            {SHOW_APPOINTMENTS_LIKELY_TO_BE_MISSED && (
              <Tabs.TabPane
                tab={formatMessage(
                  messages.tableAppointmentsLikelyToBeMissedTitle
                )}
                key="2"
              >
                <AppointmentsLikelyToBeMissed
                  startOpen
                  title={formatMessage(
                    messages.tableAppointmentsLikelyToBeMissedTitle
                  )}
                />
              </Tabs.TabPane>
            )}
            {SHOW_PASSED_APPOINTMENTS_REQUIRING_IMMEDIATE_ATTENTION && (
              <Tabs.TabPane
                tab={formatMessage(
                  messages.tablePassedAppointmentsRequiringImmediateStatusUpdateTitle
                )}
                key="3"
              >
                <PassedAppointmentsRequiringImmediateStatusUpdate
                  startOpen
                  title={formatMessage(
                    messages.tablePassedAppointmentsRequiringImmediateStatusUpdateTitle
                  )}
                />
              </Tabs.TabPane>
            )}
            {SHOW_APPOINTMENTS_REMINDERS && (
              <Tabs.TabPane
                tab={formatMessage(messages.tableAppointmentsRemindersTitle)}
                key="4"
              >
                <AppointmentsReminders
                  startOpen
                  title={formatMessage(
                    messages.tableAppointmentsRemindersTitle
                  )}
                />
              </Tabs.TabPane>
            )}
          </Tabs>
        </Card>
      </Layout>
      {SHOW_KPIS && (
        <>        
          <Row gutter={48}>
            <Col span={24} className="mt-4">
              <GroupCollapse
                startOpen
                title={formatMessage(messages.clinicStatsTitle)}
                group={<ClinicStats title={formatMessage(messages.bookingTitle)} />}
              />
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

              {/* <GroupCollapse
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
           */}
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default OverviewPage;
