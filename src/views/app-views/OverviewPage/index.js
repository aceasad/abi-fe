import {
  Select,
  Typography,
  Tabs,
  Card,
  Layout,
  Grid,
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
import utils from 'utils';

const { Option } = Select;
const { useBreakpoint } = Grid;

const OverviewPage = () => {
  const { formatMessage } = useIntl();
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');
  const [activeKey, setActiveKey] = useState("1");

  const tabItems = [
    ...(SHOW_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION ? [{
      key: "1",
      label: formatMessage(
        messages.tableMessagesRequiringImmediateAttentionTitle
      ),
      shortLabel: "Human Intervention",
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
      shortLabel: "Patient Progress",
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
      shortLabel: "Reminders",
      children: (
        <AppointmentsReminders
          startOpen
          title={formatMessage(
            messages.tableAppointmentsRemindersTitle
          )}
        />
      ),
    }] : []),
  ];

  const activeTab = tabItems.find(item => item.key === activeKey);

  return (
    <>
      <div className="mb-4" style={{ paddingTop: isMobile ? 0 : '24px' }}>
        <Typography.Title level={2} style={{ margin: 0, marginBottom: isMobile ? '16px' : 0 }}>
          {formatMessage(messages.title)}
        </Typography.Title>
      </div>
      <Layout>
        <Card>
          {isMobile ? (
            // Mobile: Dropdown Selector
            <>
              <div style={{ marginBottom: '16px' }}>
                <Select
                  value={activeKey}
                  onChange={setActiveKey}
                  style={{ width: '100%' }}
                  size="large"
                  options={tabItems.map(item => ({
                    value: item.key,
                    label: item.shortLabel || item.label
                  }))}
                />
              </div>
              {activeTab?.children}
            </>
          ) : (
            // Desktop: Tabs
            <Tabs
              activeKey={activeKey}
              onChange={setActiveKey}
              items={tabItems}
            />
          )}
        </Card>
      </Layout>
    </>
  );
};

export default OverviewPage;
