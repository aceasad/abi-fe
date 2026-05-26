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
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');
  const [activeKey, setActiveKey] = useState("1");

  const tabItems = [
    ...(SHOW_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION ? [{
      key: "1",
      label: "Human intervention needed",
      shortLabel: "Human Intervention",
      children: (
        <MessagesRequiringImmediateAttention
          startOpen
          title={"Human intervention needed"}
        />
      ),
    }] : []),
    ...(SHOW_PATIENT_PROGRESS ? [{
      key: "5",
      label: "Booking progress",
      shortLabel: "Patient Progress",
      children: (
        <PatientProgressTable
          startOpen
          title={"Booking progress"}
        />
      ),
    }] : []),
    ...(SHOW_APPOINTMENTS_REMINDERS ? [{
      key: "4",
      label: "Appointment reminders",
      shortLabel: "Reminders",
      children: (
        <AppointmentsReminders
          startOpen
          title={"Appointment reminders"}
        />
      ),
    }] : []),
  ];

  const activeTab = tabItems.find(item => item.key === activeKey);

  return (
    <>
      <div className="mb-4" style={{ paddingTop: isMobile ? 0 : '24px' }}>
        <Typography.Title level={3} style={{ marginTop: "8px", marginBottom: isMobile ? '16px' : 0 }}>
          {"Overview"}
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
