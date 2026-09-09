import React from 'react';
import {
  PieChartOutlined,
  CalendarOutlined,
  CarOutlined,
  TeamOutlined,
  UserOutlined,
  WhatsAppOutlined,
  SettingOutlined,
  PaperClipOutlined,
  LineChartOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { APP_PAGES_PREFIX_PATH } from 'configs/AppConfig';
import { makeSelectClinic } from 'redux/selectors/Clinic';

const pagesNavTree = [
  {
    key: 'overview',
    path: `${APP_PAGES_PREFIX_PATH}/overview`,
    title: 'Overview',
    icon: PieChartOutlined,
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'kpis',
    path: `${APP_PAGES_PREFIX_PATH}/kpis`,
    title: 'KPIs',
    icon: LineChartOutlined,
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'conversation',
    path: `${APP_PAGES_PREFIX_PATH}/conversation`,
    title: 'Conversations',
    icon: WhatsAppOutlined,
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'notifications',
    path: `${APP_PAGES_PREFIX_PATH}/notifications`,
    title: 'Notifications',
    icon: NotificationOutlined,
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'appointments',
    path: `${APP_PAGES_PREFIX_PATH}/appointments`,
    title: 'Appointments',
    icon: CalendarOutlined,
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'transport',
    path: `${APP_PAGES_PREFIX_PATH}/transport`,
    title: 'Transport',
    icon: CarOutlined,
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'patients',
    path: `${APP_PAGES_PREFIX_PATH}/patients`,
    title: 'Patients',
    icon: TeamOutlined,
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'staff',
    path: `${APP_PAGES_PREFIX_PATH}/staff`,
    title: 'Staff',
    icon: UserOutlined,
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'documents',
    path: `${APP_PAGES_PREFIX_PATH}/documents`,
    title: 'Documents',
    icon: PaperClipOutlined,
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'settings',
    path: `${APP_PAGES_PREFIX_PATH}/settings`,
    title: 'Settings',
    icon: SettingOutlined,
    breadcrumb: false,
    submenu: [],
  },
];

export const getNavigationConfig = (pasProvider, isTMSEnabled = false) => {
  const isMedbridge = pasProvider?.toLowerCase() === 'medbridge';
  const hiddenKeys = new Set();
  if (isMedbridge) {
    hiddenKeys.add('staff');
  }
  // Transport only exists for clinics running MediDrive TMS.
  if (!isTMSEnabled) {
    hiddenKeys.add('transport');
  }
  return pagesNavTree.filter((item) => !hiddenKeys.has(item.key));
};

export const useNavigationConfig = () => {
  const { PASProvider, isTMSEnabled: userIsTMSEnabled } = useSelector(
    (state) => state.auth.user || {}
  );
  const clinic = useSelector(makeSelectClinic());
  return getNavigationConfig(
    PASProvider,
    Boolean(clinic?.isTMSEnabled ?? userIsTMSEnabled)
  );
};

const navigationConfig = [...pagesNavTree];

export default navigationConfig;
