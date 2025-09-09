import {
  Select,
  Typography,
  Tabs,
  Card,
  Layout,
} from 'antd';
import { PageHeader } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import { useDispatch } from 'react-redux';
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
} from 'configs/AppConfig';

const { Option } = Select;

const OverviewPage = () => {
  const { formatMessage } = useIntl();

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
          <Tabs
            defaultActiveKey="1"
            items={[
              ...(SHOW_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION ? [{
                key: "1",
                label: formatMessage(
                  messages.tableMessagesRequiringImmediateAttentionTitle
                ),
                children: (
                  <MessagesRequiringImmediateAttention
                    startOpen
                    title={formatMessage(
                      messages.tableMessagesRequiringImmediateAttentionTitle
                    )}
                  />
                ),
              }] : []),
              ...(SHOW_PATIENT_PROGRESS ? [{
                key: "5",
                label: formatMessage(
                  messages.tablePatientProgressTitle
                ),
                children: (
                  <PatientProgressTable
                    startOpen
                    title={formatMessage(
                      messages.tablePatientProgressTitle
                    )}
                  />
                ),
              }] : []),
              ...(SHOW_APPOINTMENTS_REMINDERS ? [{
                key: "4",
                label: formatMessage(messages.tableAppointmentsRemindersTitle),
                children: (
                  <AppointmentsReminders
                    startOpen
                    title={formatMessage(
                      messages.tableAppointmentsRemindersTitle
                    )}
                  />
                ),
              }] : []),
            ]}
          />
        </Card>
      </Layout>
    </>
  );
};

export default OverviewPage;
