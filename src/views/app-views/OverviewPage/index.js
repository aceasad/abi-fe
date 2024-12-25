import {
  PageHeader,
  Select,
  Typography,
  Tabs,
  Card,
  Layout,
} from 'antd';
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
import { getMessageRequiringImmediateAttentionStatuses } from 'redux/actions/Appointment';

const { Option } = Select;

const OverviewPage = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMessageRequiringImmediateAttentionStatuses());
  }, []);

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
            {/* {SHOW_PASSED_APPOINTMENTS_REQUIRING_IMMEDIATE_ATTENTION && (
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
            )} */}
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
    </>
  );
};

export default OverviewPage;
