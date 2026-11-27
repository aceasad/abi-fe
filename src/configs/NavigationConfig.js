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
  CreditCardOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { APP_PAGES_PREFIX_PATH } from 'configs/AppConfig';
import { makeSelectClinic } from 'redux/selectors/Clinic';
import { makeSelectIsOrganizationOwner } from 'redux/selectors/Auth';

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

export const getNavigationConfig = (
  pasProvider,
  isTMSEnabled = false,
  isOrganizationOwner = false,
  billingEnabled = false
) => {
  const isMedbridge = pasProvider?.toLowerCase() === 'medbridge';
  const hiddenKeys = new Set();
  if (isMedbridge) {
    hiddenKeys.add('staff');
  }
  // Transport only exists for clinics running MediDrive TMS.
  if (!isTMSEnabled) {
    hiddenKeys.add('transport');
  }
  const items = pagesNavTree.filter((item) => !hiddenKeys.has(item.key));
  if (!isOrganizationOwner || !billingEnabled) {
    return items;
  }
  const settingsIndex = items.findIndex((item) => item.key === 'settings');
  const billingItem = {
    key: 'billing-and-usage',
    path: `${APP_PAGES_PREFIX_PATH}/overview/billing`,
    title: 'Billing and usage',
    icon: CreditCardOutlined,
    breadcrumb: false,
    submenu: [],
  };
  const insertAt = settingsIndex === -1 ? items.length : settingsIndex;
  return [
    ...items.slice(0, insertAt),
    billingItem,
    ...items.slice(insertAt),
  ];
};

export const useNavigationConfig = () => {
  const {
    PASProvider,
    isTMSEnabled: userIsTMSEnabled,
    billing_enabled: userBillingEnabled,
  } = useSelector(
    (state) => state.auth.user || {}
  );
  const clinic = useSelector(makeSelectClinic());
  const isOrganizationOwner = useSelector(makeSelectIsOrganizationOwner());
  return getNavigationConfig(
    PASProvider,
    Boolean(clinic?.isTMSEnabled ?? userIsTMSEnabled),
    Boolean(isOrganizationOwner),
    Boolean(clinic?.billing_enabled ?? userBillingEnabled)
  );
};

const navigationConfig = [...pagesNavTree];

export default navigationConfig;
